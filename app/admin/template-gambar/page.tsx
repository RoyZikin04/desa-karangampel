import { ImageTemplateGuide } from "@/components/image-template-guide"

export default function TemplateGambarPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Template Gambar & Logo</h1>
          <p className="text-gray-600">Panduan lengkap untuk mengelola gambar di website desa</p>
        </div>

        <ImageTemplateGuide />
      </div>
    </div>
  )
}
