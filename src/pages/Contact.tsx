import { useState, useRef, useCallback } from "react";
import { Upload, X, FileText, Phone } from "lucide-react";
import { trpc } from "../lib/trpc";
import SEO from "../components/SEO";

interface UploadedFile {
  id: string;
  name: string;
  size: string;
  type: string;
  file: File; // Guardamos el File original para convertir a base64
}

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [files, setFiles] = useState<<UploadedFile[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [submitMsg, setSubmitMsg] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<<HTMLInputElement>(null);

  const sendContact = trpc.email.sendContact.useMutation({
    onSuccess: (data) => {
      setSubmitted(true);
      setSubmitMsg(data.message);
      setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
      setFiles([]);
    },
    onError: (error) => {
      setSubmitMsg(error.message || "Failed to send. Please try again.");
    },
  });

  // Convertir File a base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        // Removemos el prefijo "data:image/png;base64," y nos quedamos solo con el base64
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

    // Convertir archivos a base64
    const filesBase64 = await Promise.all(
      files.map(async (f) => ({
        name: f.name,
        type: f.file.type,
        content: await fileToBase64(f.file),
      }))
    );

    sendContact.mutate({
      name: formData.name,
      email: formData.email,
      phone: formData.phone || undefined,
      subject: formData.subject,
      message: formData.message,
      files: filesBase64.length > 0 ? filesBase64 : undefined,
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
            Have a question or project in mind? We'd love to hear from you.
          </p>
        </div>

        {submitted ? (
          <div className="bg-green-900/20 border border-green-500/30 rounded-xl p-8 text-center">
            <h3 className="text-xl font-semibold text-green-400 mb-2">
              Message Sent!
            </h3>
            <p className="text-gray-300">{submitMsg}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
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

            {/* Email */}
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

            {/* Phone */}
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

            {/* Subject */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Subject *
              </label>
              <input
                type="text"
                required
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                placeholder="How can we help?"
                className="w-full border border-gray-
