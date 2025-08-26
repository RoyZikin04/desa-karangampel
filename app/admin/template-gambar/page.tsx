"use client"

import { ImageTemplateGuide } from "@/components/image-template-guide"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function TemplateGambarPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header dengan tombol kembali */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Template Gambar & Logo</h1>
            <p className="text-gray-600">Panduan lengkap untuk mengelola gambar di website desa</p>
          </div>
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Kembali
          </Button>
        </div>

        <ImageTemplateGuide />
      </div>
    </div>
  )
}
