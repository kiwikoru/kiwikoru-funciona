import { useRef, useState } from 'react'
import { Camera, Download, Facebook, Loader2, Printer, Sparkles, Upload, Wand2 } from 'lucide-react'

const themeOptions = [
  'Space Hero',
  'Galaxy Princess',
  'Little Monster',
  'Green Monster',
  'Magic Wizard',
  'Superhero',
  'Princess Dress',
  'Football Player',
  'Robot',
  'Custom Idea',
]

export default function Youshies() {
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [selectedTheme, setSelectedTheme] = useState('Space Hero')
  const [customIdea, setCustomIdea] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedImage, setGeneratedImage] = useState<string | null>(null)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]

    if (!file) return

    setSelectedFile(file)
    setPreviewUrl(URL.createObjectURL(file))
    setGeneratedImage(null)
  }

  const handleGenerate = () => {
    if (!selectedFile) {
      fileInputRef.current?.click()
      return
    }

    setIsGenerating(true)
    setGeneratedImage(null)

    window.setTimeout(() => {
      setGeneratedImage(previewUrl)
      setIsGenerating(false)
    }, 2200)
  }

  const handleDownload = () => {
    if (!generatedImage) return

    const link = document.createElement('a')
    link.href = generatedImage
    link.download = 'my-youshie-preview.png'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleShare = () => {
    window.open('https://www.facebook.com/', '_blank', 'noopener,noreferrer')
  }

  const handlePrint = () => {
    window.location.href = '/quote'
  }

  return (
    <section className="relative min-h-screen overflow-hidden bg-[#2E1065] text-white">
      {/* Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.35),_transparent_30%),radial-gradient(circle_at_top_right,_rgba(250,204,21,0.25),_transparent_25%),linear-gradient(180deg,_#5B21B6_0%,_#4C1D95_45%,_#2E1065_100%)]" />
      <div className="absolute inset-0 opacity-30">
        <div className="absolute left-8 top-24 h-24 w-24 rounded-full bg-white blur-3xl" />
        <div className="absolute right-12 top-40 h-32 w-32 rounded-full bg-sky-300 blur-3xl" />
        <div className="absolute bottom-24 left-1/3 h-40 w-40 rounded-full bg-fuchsia-300 blur-3xl" />
      </div>

      {/* Stars */}
      <div className="pointer-events-none absolute inset-0">
        <span className="absolute left-[8%] top-[10%] text-3xl">✦</span>
        <span className="absolute right-[12%] top-[14%] text-xl">✦</span>
        <span className="absolute left-[18%] top-[52%] text-lg">✧</span>
        <span className="absolute right-[18%] bottom-[18%] text-2xl">✦</span>
        <span className="absolute left-[42%] bottom-[12%] text-lg">✧</span>
      </div>

      <div className="relative mx-auto max-w-7xl px-6 py-16 md:py-20">
        {/* Hero */}
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white shadow-lg backdrop-blur">
            <Sparkles size={16} className="text-yellow-300" />
            Powered by Gemini
          </div>

          <div className="mx-auto mb-5 flex justify-center">
            <img
              src="/images/youshies-logo.png"
              alt="Youshies"
              className="max-h-28 w-auto drop-shadow-[0_8px_0_rgba(46,16,101,0.65)]"
              onError={(event) => {
                event.currentTarget.style.display = 'none'
              }}
            />
          </div>

          <h1 className="text-4xl font-black leading-tight tracking-tight text-white drop-shadow-md md:text-6xl">
            Turn Your Photo Into a Youshie
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-base font-medium leading-relaxed text-purple-50 md:text-lg">
            Upload a photo, choose a fun theme, generate your custom collectible-style character,
            download it, share it, and order a real 3D printed version.
          </p>
        </div>

        {/* Main content */}
        <div className="mt-12 grid gap-8 lg:grid-cols-[1fr_420px]">
          {/* Generator card */}
          <div className="rounded-[2rem] border border-white/20 bg-white/95 p-5 text-charcoal shadow-2xl md:p-8">
            <div className="grid gap-8 lg:grid-cols-2">
              {/* Upload */}
              <div>
                <div className="mb-4 flex items-center gap-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-purple-100 text-purple-700">
                    <Camera size={20} />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-charcoal">Upload your photo</h2>
                    <p className="text-sm text-gray-500">Start with a clear front-facing photo.</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="group flex aspect-[7/10] w-full flex-col items-center justify-center rounded-[2rem] border-4 border-dashed border-purple-200 bg-gradient-to-br from-purple-50 to-sky-50 p-6 text-center transition hover:border-purple-400 hover:from-purple-100 hover:to-sky-100"
                >
                  {previewUrl ? (
                    <img
                      src={previewUrl}
                      alt="Uploaded preview"
                      className="h-full w-full rounded-[1.4rem] object-cover shadow-lg"
                    />
                  ) : (
                    <>
                      <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-purple-600 text-white shadow-lg transition group-hover:scale-105">
                        <Upload size={34} />
                      </div>
                      <p className="text-2xl font-black text-purple-800">Upload Photo</p>
                      <p className="mt-2 text-sm font-medium text-gray-500">
                        JPG, PNG or WEBP
                      </p>
                    </>
                  )}
                </button>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </div>

              {/* Options */}
              <div>
                <div className="mb-4 flex items-center gap-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-yellow-100 text-yellow-700">
                    <Wand2 size={20} />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-charcoal">Choose your theme</h2>
                    <p className="text-sm text-gray-500">Pick a costume or add your own idea.</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {themeOptions.map((theme) => (
                    <button
                      key={theme}
                      type="button"
                      onClick={() => setSelectedTheme(theme)}
                      className={`rounded-2xl border px-3 py-3 text-sm font-bold transition ${
                        selectedTheme === theme
                          ? 'border-purple-600 bg-purple-600 text-white shadow-lg shadow-purple-200'
                          : 'border-purple-100 bg-purple-50 text-purple-800 hover:border-purple-300 hover:bg-purple-100'
                      }`}
                    >
                      {theme}
                    </button>
                  ))}
                </div>

                <label className="mt-5 block">
                  <span className="mb-2 block text-sm font-bold text-charcoal">
                    Add your own idea
                  </span>
                  <textarea
                    value={customIdea}
                    onChange={(event) => setCustomIdea(event.target.value)}
                    placeholder="Example: make it look like a brave little explorer with a blue jacket..."
                    className="min-h-28 w-full resize-none rounded-2xl border border-purple-100 bg-white px-4 py-3 text-sm text-charcoal outline-none ring-purple-200 transition placeholder:text-gray-400 focus:border-purple-400 focus:ring-4"
                  />
                </label>

                <button
                  type="button"
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  className="mt-5 flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-yellow-300 via-orange-300 to-pink-400 px-6 py-4 text-lg font-black text-purple-950 shadow-xl shadow-purple-200 transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-80"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 size={22} className="animate-spin" />
                      Creating your Youshie...
                    </>
                  ) : (
                    <>
                      <Sparkles size={22} />
                      Youshify Me
                    </>
                  )}
                </button>

                {isGenerating && (
                  <div className="mt-5 rounded-3xl bg-purple-50 p-5 text-center">
                    <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-purple-600 text-3xl shadow-lg">
                      ✨
                    </div>
                    <p className="font-black text-purple-900">A little magic is happening...</p>
                    <p className="mt-1 text-sm text-purple-500">
                      Your custom character is being prepared.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Result card */}
          <aside className="rounded-[2rem] border border-white/20 bg-white/15 p-5 shadow-2xl backdrop-blur md:p-6">
            <div className="rounded-[1.5rem] bg-white p-4 text-charcoal shadow-xl">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-purple-500">
                    Your result
                  </p>
                  <h2 className="text-xl font-black">Preview Card</h2>
                </div>
                <div className="rounded-full bg-yellow-300 px-3 py-1 text-xs font-black text-purple-950">
                  7:10
                </div>
              </div>

              <div className="relative flex aspect-[7/10] items-center justify-center overflow-hidden rounded-[1.5rem] bg-gradient-to-b from-purple-200 via-purple-100 to-sky-100">
                {generatedImage ? (
                  <img
                    src={generatedImage}
                    alt="Generated Youshie preview"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="px-6 text-center">
                    <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-purple-600 text-white shadow-lg">
                      <Sparkles size={34} />
                    </div>
                    <p className="text-2xl font-black text-purple-900">
                      Your Youshie will appear here
                    </p>
                    <p className="mt-2 text-sm font-medium text-purple-500">
                      Upload a photo and press Youshify Me.
                    </p>
                  </div>
                )}

                <div className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-black text-purple-800 shadow">
                  YOUSHIES
                </div>

                <div className="absolute bottom-3 left-3 right-3 rounded-2xl bg-white/90 p-3 text-center shadow">
                  <p className="text-xs font-black text-purple-900">
                    Made with KiwiKoru 3D
                  </p>
                  <p className="text-[11px] font-semibold text-gray-500">
                    3D solutions for people and industry
                  </p>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={handleDownload}
                  disabled={!generatedImage}
                  className="flex items-center justify-center gap-2 rounded-2xl bg-purple-700 px-4 py-3 text-sm font-black text-white transition hover:bg-purple-800 disabled:cursor-not-allowed disabled:bg-gray-300"
                >
                  <Download size={16} />
                  Download
                </button>

                <button
                  type="button"
                  onClick={handleShare}
                  className="flex items-center justify-center gap-2 rounded-2xl bg-sky-500 px-4 py-3 text-sm font-black text-white transition hover:bg-sky-600"
                >
                  <Facebook size={16} />
                  Share
                </button>
              </div>

              <button
                type="button"
                onClick={handlePrint}
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl bg-yellow-300 px-4 py-4 text-base font-black text-purple-950 transition hover:bg-yellow-200"
              >
                <Printer size={18} />
                Print My Youshie
              </button>
            </div>
          </aside>
        </div>

        {/* Promo */}
        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <div className="rounded-[2rem] border border-white/20 bg-white/10 p-6 shadow-xl backdrop-blur">
            <p className="text-sm font-black uppercase tracking-[0.2em] text-yellow-300">
              Facebook Challenge
            </p>
            <h2 className="mt-2 text-2xl font-black text-white">
              Share it. Get likes. Win prizes.
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-purple-50">
              Share your Youshie in our Facebook group. The post with the most likes after one
              week wins a Youshies display stand. Two extra winners receive their own printed
              Youshie figure.
            </p>
          </div>

          <div className="rounded-[2rem] border border-white/20 bg-white/10 p-6 shadow-xl backdrop-blur">
            <p className="text-sm font-black uppercase tracking-[0.2em] text-yellow-300">
              KiwiKoru 3D
            </p>
            <h2 className="mt-2 text-2xl font-black text-white">
              3D solutions for people and industry
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-purple-50">
              Custom design, 3D printing, prototyping and small production runs from Whangārei,
              Northland. Promotion valid for New Zealand and Australia. Shipping costs are not
              included.
            </p>
            <div className="mt-4 rounded-2xl bg-white/10 p-4 text-sm font-bold text-white">
              <p>Email: hello@kiwikoru.co.nz</p>
              <p>Phone / WhatsApp: add your number here</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}