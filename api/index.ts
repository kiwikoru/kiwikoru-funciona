import { Hono } from 'hono'
import { bodyLimit } from 'hono/body-limit'
import { fetchRequestHandler } from '@trpc/server/adapters/fetch'
import {
  issueSignedToken,
  presignUrl,
} from '@vercel/blob'
import {
  handleUpload,
  type HandleUploadBody,
} from '@vercel/blob/client'
import { appRouter } from './router.js'
import { createContext } from './context.js'

const app = new Hono()

const MAX_BLOB_FILE_SIZE = 100 * 1024 * 1024
const DOWNLOAD_LINK_DURATION_MS =
  7 * 24 * 60 * 60 * 1000

const ALLOWED_FILE_EXTENSIONS = [
  '.stl',
  '.obj',
  '.3mf',
  '.step',
  '.stp',
  '.pdf',
  '.png',
  '.jpg',
  '.jpeg',
]

const ALLOWED_CONTENT_TYPES = [
  'application/octet-stream',
  'application/sla',
  'application/vnd.ms-package.3dmanufacturing-3dmodel+xml',
  'application/step',
  'application/pdf',
  'model/stl',
  'model/obj',
  'text/plain',
  'image/png',
  'image/jpeg',
]

function hasAllowedExtension(pathname: string): boolean {
  const cleanPathname = pathname
    .toLowerCase()
    .split('?')[0]

  return ALLOWED_FILE_EXTENSIONS.some((extension) =>
    cleanPathname.endsWith(extension)
  )
}

function isValidCustomerUploadPath(
  pathname: string
): boolean {
  return (
    pathname.startsWith('customer-uploads/') &&
    hasAllowedExtension(pathname)
  )
}

app.use(
  '/api/*',
  bodyLimit({
    maxSize: 50 * 1024 * 1024,
  })
)

app.get('/api/health', (c) => {
  return c.json({
    ok: true,
    env: 'vercel',
    blobUpload: true,
    signedDownloads: true,
  })
})

app.post('/api/blob/upload', async (c) => {
  try {
    const body =
      (await c.req.json()) as HandleUploadBody

    const response = await handleUpload({
      body,
      request: c.req.raw,

      onBeforeGenerateToken: async (
        pathname,
        clientPayload
      ) => {
        if (!hasAllowedExtension(pathname)) {
          throw new Error(
            'This file type is not allowed.'
          )
        }

        if (
          !pathname.startsWith(
            'customer-uploads/'
          )
        ) {
          throw new Error(
            'Invalid upload destination.'
          )
        }

        return {
          allowedContentTypes:
            ALLOWED_CONTENT_TYPES,
          maximumSizeInBytes:
            MAX_BLOB_FILE_SIZE,
          addRandomSuffix: true,
          tokenPayload: JSON.stringify({
            pathname,
            clientPayload:
              typeof clientPayload === 'string'
                ? clientPayload.slice(0, 1000)
                : '',
            uploadedAt:
              new Date().toISOString(),
          }),
        }
      },

      onUploadCompleted: async ({
        blob,
        tokenPayload,
      }) => {
        console.log(
          '[BLOB] Upload completed',
          {
            pathname: blob.pathname,
            url: blob.url,
            contentType: blob.contentType,
            tokenPayload,
          }
        )
      },
    })

    return c.json(response)
  } catch (error) {
    console.error(
      '[BLOB] Upload error',
      error
    )

    const message =
      error instanceof Error
        ? error.message
        : 'File upload failed.'

    return c.json(
      {
        error: message,
      },
      400
    )
  }
})

app.post(
  '/api/blob/download-url',
  async (c) => {
    try {
      const body = (await c.req.json()) as {
        pathname?: string
      }

      const pathname =
        body.pathname?.trim()

      if (!pathname) {
        return c.json(
          {
            error: 'Missing blob pathname.',
          },
          400
        )
      }

      if (
        !isValidCustomerUploadPath(
          pathname
        )
      ) {
        return c.json(
          {
            error:
              'Invalid blob pathname.',
          },
          400
        )
      }

      const validUntil =
        Date.now() +
        DOWNLOAD_LINK_DURATION_MS

      const signedToken =
        await issueSignedToken({
          pathname,
          operations: ['get'],
          validUntil,
        })

      const { presignedUrl } =
        await presignUrl(
          signedToken,
          {
            operation: 'get',
            pathname,
            access: 'private',
            validUntil,
          }
        )

      return c.json({
        pathname,
        downloadUrl: presignedUrl,
        validUntil,
        expiresInDays: 7,
      })
    } catch (error) {
      console.error(
        '[BLOB] Signed URL error',
        error
      )

      const message =
        error instanceof Error
          ? error.message
          : 'Could not create the download link.'

      return c.json(
        {
          error: message,
        },
        500
      )
    }
  }
)

app.use('/api/trpc/*', async (c) => {
  return fetchRequestHandler({
    endpoint: '/api/trpc',
    req: c.req.raw,
    router: appRouter,
    createContext,
  })
})

app.all('/api/*', (c) => {
  return c.json(
    {
      error: 'Not Found',
    },
    404
  )
})

export default app