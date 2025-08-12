"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Save, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"

// Import komponen upload gambar dan fungsi penyimpanan lokal
import { ImageUpload } from "@/components/image-upload"
import { beritaStorage } from "@/lib/local-storage"

export default function BuatBeritaPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [formData, setFormData] = useState({
    judul: "",
    kategori: "",
    ringkasan: "",
    konten: "",
    penulis: "",
    tanggal: new Date().toISOString().split("T")[0],
    status: "draft",
    gambarUrl: "",
  })

  // Update fungsi handleSubmit untuk menyimpan berita ke localStorage
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // CATATAN: Simulasi penyimpanan berita - data akan disimpan ke localStorage
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Simpan berita ke localStorage
    const beritaData = {
      judul: formData.judul,
      kategori: formData.kategori,
      ringkasan: formData.ringkasan,
      konten: formData.konten,
      penulis: formData.penulis || "Admin Desa",
      tanggal: formData.tanggal,
      status: formData.status as "draft" | "published" | "scheduled",
      gambarUrl: formData.gambarUrl,
    }

    // Simpan ke localStorage
    beritaStorage.add(beritaData)

    setSubmitSuccess(true)
    setIsSubmitting(false)

    // Redirect ke halaman admin setelah berhasil
    setTimeout(() => {
      router.push("/admin")
    }, 2000)
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="container mx-auto px-4">
          <div className="flex items-center h-16">
            <Button variant="ghost" onClick={() => router.back()} className="mr-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Kembali
            </Button>
            <h1 className="text-xl font-semibold text-gray-900">Buat Berita Baru</h1>
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {submitSuccess && (
          <Alert className="mb-8 border-green-200 bg-green-50">
            <AlertDescription className="text-green-800">
              🎉 Berita berhasil disimpan! Anda akan diarahkan ke panel admin...
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Informasi Berita</CardTitle>
                <CardDescription>
                  {/* CATATAN: Hanya admin yang dapat mengakses fitur ini */}
                  Isi formulir di bawah ini untuk membuat berita baru
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <Label htmlFor="judul">Judul Berita *</Label>
                    <Input
                      id="judul"
                      value={formData.judul}
                      onChange={(e) => handleInputChange("judul", e.target.value)}
                      placeholder="Masukkan judul berita yang menarik"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="kategori">Kategori *</Label>
                      <Select value={formData.kategori} onValueChange={(value) => handleInputChange("kategori", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih kategori berita" />
                        </SelectTrigger>
                        <SelectContent>
                          {/* CATATAN: Sesuaikan kategori dengan jenis berita di desa Anda */}
                          <SelectItem value="acara">Acara</SelectItem>
                          <SelectItem value="pembangunan">Pembangunan</SelectItem>
                          <SelectItem value="umkm">UMKM</SelectItem>
                          <SelectItem value="kesehatan">Kesehatan</SelectItem>
                          <SelectItem value="pendidikan">Pendidikan</SelectItem>
                          <SelectItem value="pertanian">Pertanian</SelectItem>
                          <SelectItem value="pengumuman">Pengumuman</SelectItem>
                          <SelectItem value="lainnya">Lainnya</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="tanggal">Tanggal Publikasi</Label>
                      <Input
                        id="tanggal"
                        type="date"
                        value={formData.tanggal}
                        onChange={(e) => handleInputChange("tanggal", e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="ringkasan">Ringkasan Berita *</Label>
                    <Textarea
                      id="ringkasan"
                      value={formData.ringkasan}
                      onChange={(e) => handleInputChange("ringkasan", e.target.value)}
                      placeholder="Tulis ringkasan singkat berita (akan ditampilkan di halaman utama)"
                      rows={3}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="konten">Konten Berita *</Label>
                    <Textarea
                      id="konten"
                      value={formData.konten}
                      onChange={(e) => handleInputChange("konten", e.target.value)}
                      placeholder="Tulis konten lengkap berita di sini..."
                      rows={12}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="penulis">Penulis</Label>
                    <Input
                      id="penulis"
                      value={formData.penulis}
                      onChange={(e) => handleInputChange("penulis", e.target.value)}
                      placeholder="Nama penulis berita"
                    />
                  </div>

                  {/* Upload Gambar */}
                  <ImageUpload
                    label="Gambar Berita"
                    currentImage={formData.gambarUrl}
                    onImageUpload={(url) => handleInputChange("gambarUrl", url)}
                  />

                  <Alert>
                    <AlertDescription>
                      💡 <strong>Tips:</strong> Gunakan gambar berkualitas tinggi dan relevan dengan konten berita untuk
                      menarik perhatian pembaca.
                    </AlertDescription>
                  </Alert>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Publish Options */}
            <Card>
              <CardHeader>
                <CardTitle>Opsi Publikasi</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select value={formData.status} onValueChange={(value) => handleInputChange("status", value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="published">Publikasi</SelectItem>
                      <SelectItem value="scheduled">Terjadwal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex flex-col gap-2">
                  <Button type="button" variant="outline" className="w-full bg-transparent">
                    <Eye className="h-4 w-4 mr-2" />
                    Preview
                  </Button>
                  <Button onClick={handleSubmit} disabled={isSubmitting} className="w-full">
                    <Save className="h-4 w-4 mr-2" />
                    {isSubmitting ? "Menyimpan..." : "Simpan Berita"}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Guidelines */}
            <Card>
              <CardHeader>
                <CardTitle>Panduan Menulis Berita</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div>
                    <h4 className="font-semibold text-gray-900">Judul yang Baik:</h4>
                    <ul className="text-gray-600 list-disc list-inside space-y-1">
                      <li>Singkat dan jelas (maksimal 60 karakter)</li>
                      <li>Menarik perhatian pembaca</li>
                      <li>Menggambarkan isi berita</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900">Konten Berkualitas:</h4>
                    <ul className="text-gray-600 list-disc list-inside space-y-1">
                      <li>Gunakan bahasa yang mudah dipahami</li>
                      <li>Sertakan informasi 5W+1H</li>
                      <li>Periksa ejaan dan tata bahasa</li>
                      <li>Tambahkan gambar yang relevan</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent News */}
            <Card>
              <CardHeader>
                <CardTitle>Berita Terbaru</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {/* CATATAN: Data ini bisa diambil dari database */}
                  <div className="text-sm">
                    <p className="font-medium line-clamp-2">Festival Budaya Desa Makmur 2024</p>
                    <p className="text-gray-500 text-xs">15 Des 2024</p>
                  </div>
                  <div className="text-sm">
                    <p className="font-medium line-clamp-2">Pelatihan Digital Marketing UMKM</p>
                    <p className="text-gray-500 text-xs">10 Des 2024</p>
                  </div>
                  <div className="text-sm">
                    <p className="font-medium line-clamp-2">Pembangunan Jalan Desa Tahap 2</p>
                    <p className="text-gray-500 text-xs">5 Des 2024</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
