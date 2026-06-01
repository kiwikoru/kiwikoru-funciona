import { useState, useRef, useCallback } from "react";
import { Upload, X, FileText, Phone, Mail, MapPin, MessageCircle, Send } from "lucide-react";
import { trpc } from "@/providers/trpc";
import SEO from "@/components/SEO";

interface UploadedFile {
  id: string;
  name: string;
  size: string;
  type: string;
  file: File;
}

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "General Inquiry",
    message: "",
  });
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [submitMsg, setSubmitMsg] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sendContact = trpc.email.sendContact.useMutation({
    onSuccess: (data) => {
      setSubmitted(true);
      setSubmitMsg(data.message);
      setFormData({ name: "", email: "", phone: "", subject: "General Inquiry", message: "" });
      setFiles([]);
      setTimeout(() => setSubmitted(false), 5000);
    },
    onError: (error) => {
      setSubmitMsg(error.message || "Failed to send. Please try again.");
    },
  });

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendContact.mutate({
      name: formData.name,
      email: formData.email,
      phone: formData.phone || undefined,
      subject: formData.subject,
      message: formData.message,
    });
  };

  return (
    <>
      <SEO
        title="Contact Us | KiwiKoru 3D"
        description="Get in touch with KiwiKoru 3D for 3D printing, CAD design, and product development services in New Zealand."
        url="https://kiwikoru3d.com/contact"
      />

      <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Contact Us
          </h1>
          <p className="text-gray-400">
            Have a question or project in mind? We&apos;d love to hear from you.
          </p>
        </div>

        {submitted ? (
          <div className="bg-green-900/20 border border-green-500/30 rounded-xl p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-yellow-500/15 flex items-center justify-center mx-auto mb-4">
              <Send size={28} className="text-yellow-500" />
            </div>
            <h3 className="text-xl font-semibold text-green-400 mb-2">
              Message Sent!
            </h3>
            <p className="text-gray-300">{submitMsg}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Your Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="John Smith"
                className="w-full border border-gray-700 bg-gray-900 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email Address *
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="john@example.com"
                className="w-full border border-gray-700 bg-gray-900 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Phone (optional)
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+64 21 123 4567"
                  className="w-full border border-gray-700 bg-gray-900 rounded-lg pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Subject
              </label>
              <select
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="w-full border border-gray-700 bg-gray-900 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 transition-all"
              >
                <option>General Inquiry</option>
                <option>Quote Request</option>
                <option>File Upload Question</option>
                <option>Material Advice</option>
                <option>Order Status</option>
                <option>Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Your Message *
              </label>
              <textarea
                required
                rows={5}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Tell us about your project..."
                className="w-full border border-gray-700 bg-gray-900 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 transition-all resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Attach Files (optional)
              </label>
              <div
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all ${
                  dragOver
                    ? "border-yellow-500 bg-yellow-500/5"
                    : "border-gray-700 hover:border-gray-500"
                }`}
              >
                <Upload className="w-8 h-8 mx-auto mb-2 text-gray-500" />
                <p className="text-sm text-gray-400">
                  Drag & drop files here, or click to browse
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  PDF, JPG, PNG, STL up to 10MB
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
                <div className="mt-3 space-y-2">
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

            <button
              type="submit"
              disabled={sendContact.isPending}
              className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-semibold py-3 px-6 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {sendContact.isPending ? "Sending..." : "Send Message"}
            </button>

            {submitMsg && !submitted && (
              <p className="text-red-400 text-sm text-center">{submitMsg}</p>
            )}
          </form>
        )}
      </div>
    </>
  );
}
