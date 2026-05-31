import { useState, useRef, useCallback } from "react";
import { Upload, X, FileText, PenTool, Lightbulb, RotateCcw, Layers } from "lucide-react";
import { trpc } from "../lib/trpc";
import SEO from "../components/SEO";
import { generateBreadcrumbSchema } from "../lib/seo";
import EstimateTool from "../components/EstimateTool";

interface UploadedFile {
  id: string;
  name: string;
  size: string;
  type: string;
  file: File;
}

export default function Quote() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    description: "",
    quantity: "1",
    material: "No preference",
  });
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [agreed, setAgreed] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitMsg, setSubmitMsg] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const [modelInfo, setModelInfo] = useState<{ volume: number; dimensions: { x: number; y: number; z: number } } | undefined>(undefined);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToContactForm = () => {
    const el = document.getElementById("contact-form-section");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const sendQuote = trpc.email.sendQuote.useMutation({
    onSuccess: (data) => {
      setSubmitted(true);
      setSubmitMsg(data.message);
      setFormData({ name: "", email: "", phone: "", description: "", quantity: "1", material: "No preference" });
      setFiles([]);
      setAgreed(false);
      setModelInfo(undefined);
    },
    onError: (error) => {
      setSubmitMsg(error.message || "Failed to send. Please try again or email us directly.");
    },
  });

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        const base64 = result.split(",")[1];
        resolve(base64);
      };
      reader.onerror = reject;
    });
  };

  const handleFileSelect = useCallback((selectedFiles: FileList | null) => {
    if (!selectedFiles) return;
    const newFiles: UploadedFile[] = Array.from(selectedFiles).map((file) => ({
      id: Math.random().toString(36).substring(7),
      name: file.name,
      size: file.size > 1024 * 1024
        ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
        : `${(file.size / 1024).toFixed(0)} KB`,
      type: file.name.split(".").pop()?.toUpperCase() || "",
      file: file,
    }));
    setFiles((prev) => [...prev, ...newFiles]);
  }, []);

  const removeFile = (id: string) => setFiles((prev) => prev.filter((f) => f.id !== id));

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleFileSelect(e.dataTransfer.files);
  }, [handleFileSelect]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed) return;

    const filesBase64 = await Promise.all(
      files.map(async (f) => ({
        name: f.name,
        type: f.file.type || "application/octet-stream",
        content: await fileToBase64(f.file),
      }))
    );

    sendQuote.mutate({
      name: formData.name,
      email: formData.email,
      phone: formData.phone || undefined,
      description: formData.description,
      quantity: formData.quantity,
      material: formData.material,
      files: filesBase64.length > 0 ? filesBase64 : undefined,
    });
  };

  const schema = generateBreadcrumbSchema([
    { name: "Home", url: "https://kiwikoru3d.com/" },
    { name: "Get a Quote", url: "https://kiwikoru3d.com/quote" },
  ]);

  return (
    <>
      <SEO
        title="Get a Quote | KiwiKoru 3D"
        description="Upload your 3D files and get a free quote for 3D printing, CAD design, and product development services in New Zealand."
        url="https://kiwikoru3d.com/quote"
        schema={schema}
      />

      <section className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Get a Free Estimate
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Upload your 3D files, preview your model, and get an estimated price.
            We&apos;ll get back to you with a detailed quote within 24 hours.
          </p>
        </div>
      </section>

      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 sm:p-8">
            <h2 className="text-xl font-semibold text-white mb-4">
              Preview Your Model
            </h2>
            <p className="text-gray-400 text-sm mb-6">
              Upload an STL or OBJ file to view it in 3D and get an instant price estimate.
            </p>
            <EstimateTool onModelInfo={(vol, dims) => setModelInfo({ volume: vol, dimensions: dims })} />
          </div>
        </div>
      </section>

      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-white mb-4">
            No STL? No problem.
          </h2>
          <p className="text-gray-400 mb-8">
            We can design your idea from a sketch, photo, drawing, or simple description.
            Our team handles CAD design, product development, reverse engineering, and concept development.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { icon: PenTool, label: "CAD Design" },
              { icon: Lightbulb, label: "Product Development" },
              { icon: RotateCcw, label: "Reverse Engineering" },
              { icon: Layers, label: "Concept Development" },
            ].map((s) => (
              <div key={s.label} className="bg-gray-900/50 border border-gray-800 rounded-xl p-4">
                <s.icon className="w-6 h-6 text-yellow-500 mx-auto mb-2" />
                <p className="text-sm text-gray-300">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="contact-form-section" className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-8 text-center">
            Submit Your Project
          </h2>
          <p className="text-gray-400 text-center mb-8">
            Tell us about your project and upload your files. We accept STL, STEP, OBJ, PDF, JPG, PNG, and sketches.
          </p>

          {submitted ? (
            <div className="bg-green-900/20 border border-green-500/30 rounded-xl p-8 text-center">
              <h3 className="text-xl font-semibold text-green-400 mb-2">
                Quote Request Sent!
              </h3>
              <p className="text-gray-300">{submitMsg}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Your Details</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Your name"
                      className="w-full border border-gray-700 bg-gray-900 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="your@email.com"
                      className="w-full border border-gray-700 bg-gray-900 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 transition-all"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Phone (optional)
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+64 21 123 4567"
                      className="w-full border border-gray-700 bg-gray-900 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 transition-all"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Project Information</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Project Description *
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Describe your project, requirements, and any specific details..."
                      className="w-full border border-gray-700 bg-gray-900 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 transition-all resize-none"
                    />
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Quantity
                      </label>
                      <select
                        value={formData.quantity}
                        onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                        className="w-full border border-gray-700 bg-gray-900 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 transition-all"
                      >
                        <option value="1">1</option>
                        <option value="2-5">2-5</option>
                        <option value="6-10">6-10</option>
                        <option value="11-50">11-50</option>
                        <option value="50+">50+</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Material Preference
                      </label>
                      <select
                        value={formData.material}
                        onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                        className="w-full border border-gray-700 bg-gray-900 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 transition-all"
                      >
                        <option value="No preference">No preference</option>
                        <option value="PLA">PLA</option>
                        <option value="ABS">ABS</option>
                        <option value="PETG">PETG</option>
                        <option value="TPU">TPU</option>
                        <option value="Resin">Resin</option>
                        <option value="Nylon">Nylon</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Upload Files</h3>
                <div
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all ${
                    dragOver
                      ? "border-yellow-500 bg-yellow-500/5"
                      : "border-gray-700 hover:border-gray-500"
                  }`}
                >
                  <Upload className="w-10 h-10 mx-auto mb-3 text-gray-500" />
                  <p className="text-sm text-gray-400">
                    Drag & drop files here, or click to browse
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    STL, STEP, OBJ, PDF, JPG, PNG up to 10MB each
                  </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    onChange={(e) => handleFileSelect(e.target.files)}
                    className="hidden"
                  />
                </div>

                {files.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {files.map((file) => (
                      <div
                        key={file.id}
                        className="flex items-center justify-between bg-gray-800 rounded-lg px-3 py-2"
                      >
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-yellow-500" />
                          <span className="text-sm text-gray-300">{file.name}</span>
                          <span className="text-xs text-gray-500">({file.size})</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFile(file.id)}
                          className="text-gray-500 hover:text-red-400 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="agree"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="mt-1 w-4 h-4 rounded border-gray-700 bg-gray-900 text-yellow-500 focus:ring-yellow-500/20"
                />
                <label htmlFor="agree" className="text-sm text-gray-400">
                  I agree to be contacted about my project and understand that my files will be used for quotation purposes only.
                </label>
              </div>

              <button
                type="submit"
                disabled={!agreed || sendQuote.isPending}
                className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-semibold py-3 px
