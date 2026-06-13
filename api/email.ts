import { z } from "zod";
import { createRouter, publicQuery } from "../middleware.js";
import { env } from "../lib/env.js";
import { Resend } from "resend";

function getResendClient() {
const apiKey = env.resendApiKey || process.env.RESEND_API_KEY || "";

if (!apiKey) {
console.error("[EMAIL] Missing RESEND_API_KEY");
return null;
}

return new Resend(apiKey);
}

const FROM_EMAIL =
env.emailFrom || process.env.RESEND_FROM || "Kiwi Koru 3D [no-reply@kiwikoru.co.nz](mailto:no-reply@kiwikoru.co.nz)";

const TO_EMAIL =
env.emailTo || process.env.RESEND_TO || "[kiwikoru3d@gmail.com](mailto:kiwikoru3d@gmail.com)";

function safeHtml(text: string) {
return text
.replaceAll("&", "&")
.replaceAll("<", "<")
.replaceAll(">", ">")
.replaceAll('"', """)
.replaceAll("'", "'")
.replace(/\n/g, "<br/>");
}

function createAttachments(
files?: { name: string; type?: string; content: string }[]
) {
if (!files || files.length === 0) return undefined;

return files.map((file) => ({
filename: file.name,
content: file.content,
}));
}

const contactInput = z.object({
name: z.string().min(1),
company: z.string().optional(),
email: z.string().email(),
phone: z.string().optional(),
subject: z.string().min(1),
projectType: z.string().optional(),
message: z.string().min(1),
quoteRef: z.string().optional(),
files: z
.array(
z.object({
name: z.string(),
type: z.string().optional(),
content: z.string(),
})
)
.optional(),
});

const quoteInput = z.object({
name: z.string().min(1),
email: z.string().email(),
phone: z.string().optional(),
description: z.string().min(1),
quantity: z.string().optional(),
material: z.string().optional(),
files: z
.array(
z.object({
name: z.string(),
type: z.string().optional(),
content: z.string(),
})
)
.optional(),
});

async function sendContactEmails(input: z.infer<typeof contactInput>) {
const resend = getResendClient();

if (!resend) {
return {
success: false,
emailSent: false,
note: "Email not sent. RESEND_API_KEY is missing in Vercel.",
};
}

const attachments = createAttachments(input.files);

await resend.emails.send({
from: FROM_EMAIL,
to: TO_EMAIL,
replyTo: input.email,
subject: `[KiwiKoru] ${input.subject} — ${input.name}`,
html: ` <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111;"> <h2>New enquiry from Kiwi Koru 3D website</h2>

```
    <p><strong>Name:</strong> ${safeHtml(input.name)}</p>
    <p><strong>Company:</strong> ${safeHtml(input.company || "-")}</p>
    <p><strong>Email:</strong> ${safeHtml(input.email)}</p>
    <p><strong>Phone:</strong> ${safeHtml(input.phone || "-")}</p>
    <p><strong>Subject:</strong> ${safeHtml(input.subject)}</p>
    <p><strong>Project type:</strong> ${safeHtml(input.projectType || "-")}</p>
    <p><strong>Quote reference:</strong> ${safeHtml(input.quoteRef || "-")}</p>

    <hr />

    <p><strong>Message:</strong></p>
    <p>${safeHtml(input.message)}</p>
  </div>
`,
attachments,
```

});

await resend.emails.send({
from: FROM_EMAIL,
to: input.email,
subject: "We received your enquiry — Kiwi Koru 3D",
html: ` <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111;"> <h2>Thank you for contacting Kiwi Koru 3D</h2>

```
    <p>Hi ${safeHtml(input.name)},</p>

    <p>We have received your enquiry and will get back to you as soon as possible.</p>

    <p>
      If you need immediate assistance, please contact us at
      <strong>kiwikoru3d@gmail.com</strong>
      or through our WhatsApp chat available on our website.
    </p>

    <br />

    <p>Kind regards,</p>
    <p><strong>Kiwi Koru 3D</strong></p>
    <p>3D Printing, Design & Prototyping</p>
  </div>
`,
```

});

return {
success: true,
emailSent: true,
message: "Emails sent successfully",
};
}

async function sendQuoteEmails(input: z.infer<typeof quoteInput>) {
const resend = getResendClient();

if (!resend) {
return {
success: false,
emailSent: false,
note: "Email not sent. RESEND_API_KEY is missing in Vercel.",
};
}

const attachments = createAttachments(input.files);

await resend.emails.send({
from: FROM_EMAIL,
to: TO_EMAIL,
replyTo: input.email,
subject: `New quote request from ${input.name}`,
html: ` <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111;"> <h2>New quote request from Kiwi Koru 3D website</h2>

```
    <p><strong>Name:</strong> ${safeHtml(input.name)}</p>
    <p><strong>Email:</strong> ${safeHtml(input.email)}</p>
    <p><strong>Phone:</strong> ${safeHtml(input.phone || "-")}</p>
    <p><strong>Quantity:</strong> ${safeHtml(input.quantity || "-")}</p>
    <p><strong>Material:</strong> ${safeHtml(input.material || "-")}</p>

    <hr />

    <p><strong>Description:</strong></p>
    <p>${safeHtml(input.description)}</p>
  </div>
`,
attachments,
```

});

await resend.emails.send({
from: FROM_EMAIL,
to: input.email,
subject: "We received your quote request — Kiwi Koru 3D",
html: ` <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111;"> <h2>Thank you for your quote request</h2>

```
    <p>Hi ${safeHtml(input.name)},</p>

    <p>We have received your quote request and will get back to you as soon as possible.</p>

    <p>
      If you need immediate assistance, please contact us at
      <strong>kiwikoru3d@gmail.com</strong>
      or through our WhatsApp chat available on our website.
    </p>

    <br />

    <p>Kind regards,</p>
    <p><strong>Kiwi Koru 3D</strong></p>
    <p>3D Printing, Design & Prototyping</p>
  </div>
`,
```

});

return {
success: true,
emailSent: true,
message: "Quote emails sent successfully",
};
}

export const emailRouter = createRouter({
send: publicQuery
.input(contactInput)
.mutation(async ({ input }) => {
return sendContactEmails(input);
}),

sendContact: publicQuery
.input(contactInput)
.mutation(async ({ input }) => {
return sendContactEmails(input);
}),

sendQuote: publicQuery
.input(quoteInput)
.mutation(async ({ input }) => {
return sendQuoteEmails(input);
}),
});
