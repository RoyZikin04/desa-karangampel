"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { MapPin, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"

// Import komponen upload gambar dan fungsi penyimpanan lokal
import { ImageUpload } from "@/components/image-upload"
import { umkmStorage } from "@/lib/local-storage"

export default function DaftarUMKMPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [formData, setFormData] = useState({
    namaUsaha: "",
    kategori: "",
    deskripsi: "",
    alamat: "",
    telepon: "",
    email: "",
    website: "",
    jamOperasional: "",
    hargaMin: "",
    hargaMax: "",
    produkUtama: "",
    namaOwner: "",
    nikOwner: "",
    setujuSyarat: false,
    fotoUrl: "",
    fotoTempatUrl: "",
  })

  // Update fungsi handleSubmit untuk menyimpan data ke localStorage
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // CATATAN: Simulasi pengiriman data - data akan disimpan ke localStorage
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Simpan data UMKM ke localStorage
    const umkmData = {
      namaUsaha: formData.namaUsaha,
      kategori: formData.kategori,
      deskripsi: formData.deskripsi,
      alamat: formData.alamat,
      telepon: formData.telepon,
      email: formData.email,
      website: formData.website,
      jamOperasional: formData.jamOperasional,
      hargaMin: Number.parseInt(formData.hargaMin) || 0,
      hargaMax: Number.parseInt(formData.hargaMax) || 0,
      produkUtama: formData.produkUtama,
      namaOwner: formData.namaOwner,
      nikOwner: formData.nikOwner,
      fotoUrl: formData.fotoUrl,
      fotoTempatUrl: formData.fotoTempatUrl,
    }

    // Simpan ke localStorage
    umkmStorage.add(umkmData)

    setSubmitSuccess(true)
    setIsSubmitting(false)

    // Reset form setelah berhasil
    setTimeout(() => {
      setSubmitSuccess(false)
      setFormData({
        namaUsaha: "",
        kategori: "",
        deskripsi: "",
        alamat: "",
        telepon: "",
        email: "",
        website: "",
        jamOperasional: "",
        hargaMin: "",
        hargaMax: "",
        produkUtama: "",
        namaOwner: "",
        nikOwner: "",
        setujuSyarat: false,
        fotoUrl: "",
        fotoTempatUrl: "",
      })
    }, 3000)
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  return (
    <div className="min-h-screen">
      {/* Header Section */}
      <section className="relative h-[300px] flex items-center justify-center bg-gradient-to-r from-green-600 to-blue-600">
        <div className="absolute inset-0 bg-black/40" />
        {/* CATATAN: Ganti dengan foto UMKM atau kegiatan ekonomi desa */}
        <Image src="/placeholder.svg?height=300&width=1200" alt="Daftar UMKM" fill className="object-cover" />
        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Daftarkan UMKM Anda</h1>
          <p className="text-xl">Bergabunglah dengan komunitas UMKM Desa Makmur dan kembangkan bisnis Anda</p>
        </div>
      </section>

      {/* Registration Form */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          {submitSuccess && (
            <Alert className="mb-8 border-green-200 bg-green-50">
              <AlertDescription className="text-green-800">
                🎉 Pendaftaran UMKM berhasil! Tim kami akan menghubungi Anda dalam 2-3 hari kerja untuk verifikasi.
              </AlertDescription>
            </Alert>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Formulir Pendaftaran UMKM</CardTitle>
              <CardDescription>
                Isi formulir di bawah ini dengan lengkap dan benar. Semua informasi akan diverifikasi oleh tim kami.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Informasi Usaha */}
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-gray-900 border-b pb-2">Informasi Usaha</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="namaUsaha">Nama Usaha *</Label>
                      <Input
                        id="namaUsaha"
                        value={formData.namaUsaha}
                        onChange={(e) => handleInputChange("namaUsaha", e.target.value)}
                        placeholder="Contoh: Kerajinan Bambu Berkah"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="kategori">Kategori Usaha *</Label>
                      <Select value={formData.kategori} onValueChange={(value) => handleInputChange("kategori", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih kategori usaha" />
                        </SelectTrigger>
                        <SelectContent>
                          {/* CATATAN: Sesuaikan kategori dengan jenis UMKM di desa Anda */}
                          <SelectItem value="makanan">Makanan & Minuman</SelectItem>
                          <SelectItem value="kerajinan">Kerajinan Tangan</SelectItem>
                          <SelectItem value="pertanian">Produk Pertanian</SelectItem>
                          <SelectItem value="fashion">Fashion & Tekstil</SelectItem>
                          <SelectItem value="jasa">Jasa</SelectItem>
                          <SelectItem value="teknologi">Teknologi</SelectItem>
                          <SelectItem value="lainnya">Lainnya</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="deskripsi">Deskripsi Usaha *</Label>
                    <Textarea
                      id="deskripsi"
                      value={formData.deskripsi}
                      onChange={(e) => handleInputChange("deskripsi", e.target.value)}
                      placeholder="Jelaskan produk/jasa yang Anda tawarkan, keunggulan, dan target pasar..."
                      rows={4}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="produkUtama">Produk/Jasa Utama *</Label>
                    <Input
                      id="produkUtama"
                      value={formData.produkUtama}
                      onChange={(e) => handleInputChange("produkUtama", e.target.value)}
                      placeholder="Contoh: Tas bambu, tempat pensil, hiasan dinding"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="hargaMin">Harga Minimum (Rp)</Label>
                      <Input
                        id="hargaMin"
                        type="number"
                        value={formData.hargaMin}
                        onChange={(e) => handleInputChange("hargaMin", e.target.value)}
                        placeholder="15000"
                      />
                    </div>
                    <div>
                      <Label htmlFor="hargaMax">Harga Maksimum (Rp)</Label>
                      <Input
                        id="hargaMax"
                        type="number"
                        value={formData.hargaMax}
                        onChange={(e) => handleInputChange("hargaMax", e.target.value)}
                        placeholder="150000"
                      />
                    </div>
                  </div>
                </div>

                {/* Informasi Kontak & Lokasi */}
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-gray-900 border-b pb-2">Informasi Kontak & Lokasi</h3>

                  <div>
                    <Label htmlFor="alamat">Alamat Usaha *</Label>
                    <Textarea
                      id="alamat"
                      value={formData.alamat}
                      onChange={(e) => handleInputChange("alamat", e.target.value)}
                      placeholder="Alamat lengkap termasuk RT/RW, Dusun, dan patokan"
                      rows={3}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="telepon">Nomor Telepon/WhatsApp *</Label>
                      <Input
                        id="telepon"
                        value={formData.telepon}
                        onChange={(e) => handleInputChange("telepon", e.target.value)}
                        placeholder="08xxxxxxxxxx"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        placeholder="nama@email.com"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="website">Website/Media Sosial</Label>
                      <Input
                        id="website"
                        value={formData.website}
                        onChange={(e) => handleInputChange("website", e.target.value)}
                        placeholder="https://instagram.com/usaha_anda"
                      />
                    </div>
                    <div>
                      <Label htmlFor="jamOperasional">Jam Operasional</Label>
                      <Input
                        id="jamOperasional"
                        value={formData.jamOperasional}
                        onChange={(e) => handleInputChange("jamOperasional", e.target.value)}
                        placeholder="Senin-Sabtu 08:00-17:00"
                      />
                    </div>
                  </div>
                </div>

                {/* Informasi Pemilik */}
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-gray-900 border-b pb-2">Informasi Pemilik</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="namaOwner">Nama Pemilik *</Label>
                      <Input
                        id="namaOwner"
                        value={formData.namaOwner}
                        onChange={(e) => handleInputChange("namaOwner", e.target.value)}
                        placeholder="Nama lengkap sesuai KTP"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="nikOwner">NIK Pemilik *</Label>
                      <Input
                        id="nikOwner"
                        value={formData.nikOwner}
                        onChange={(e) => handleInputChange("nikOwner", e.target.value)}
                        placeholder="16 digit NIK"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Upload Foto */}
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-gray-900 border-b pb-2">Foto Produk/Usaha</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <ImageUpload
                      label="Foto Produk Utama"
                      required
                      currentImage={formData.fotoUrl}
                      onImageUpload={(url) => handleInputChange("fotoUrl", url)}
                    />

                    <ImageUpload
                      label="Foto Tempat Usaha"
                      currentImage={formData.fotoTempatUrl}
                      onImageUpload={(url) => handleInputChange("fotoTempatUrl", url)}
                    />
                  </div>

                  <Alert>
                    <AlertDescription>
                      💡 <strong>Tips:</strong> Upload foto produk yang menarik dan berkualitas baik untuk meningkatkan
                      daya tarik UMKM Anda.
                    </AlertDescription>
                  </Alert>
                </div>

                {/* Syarat dan Ketentuan */}
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-gray-900 border-b pb-2">Syarat dan Ketentuan</h3>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Dengan mendaftar, Anda menyetujui:</h4>
                    <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
                      <li>Data yang diberikan adalah benar dan dapat dipertanggungjawabkan</li>
                      <li>Bersedia diverifikasi oleh tim desa</li>
                      <li>Mengikuti aturan dan etika bisnis yang berlaku</li>
                      <li>Memberikan pelayanan terbaik kepada pelanggan</li>
                      <li>Informasi UMKM dapat dipublikasikan di website desa</li>
                    </ul>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="setujuSyarat"
                      checked={formData.setujuSyarat}
                      onCheckedChange={(checked) => handleInputChange("setujuSyarat", checked as boolean)}
                    />
                    <Label htmlFor="setujuSyarat" className="text-sm">
                      Saya menyetujui syarat dan ketentuan di atas *
                    </Label>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex flex-col sm:flex-row gap-4 pt-6">
                  <Button type="submit" size="lg" className="flex-1" disabled={isSubmitting || !formData.setujuSyarat}>
                    {isSubmitting ? "Mengirim..." : "Daftarkan UMKM"}
                  </Button>
                  <Button type="button" variant="outline" size="lg" className="flex-1 bg-transparent">
                    Reset Form
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Informasi Tambahan */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Phone className="h-5 w-5 mr-2 text-blue-600" />
                  Butuh Bantuan?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">Tim kami siap membantu Anda dalam proses pendaftaran UMKM.</p>
                {/* CATATAN: Ganti dengan kontak admin desa Anda */}
                <div className="space-y-2 text-sm">
                  <p>📞 WhatsApp: 0812-3456-7890</p>
                  <p>📧 Email: umkm@desamakmur.id</p>
                  <p>🕐 Senin-Jumat: 08:00-16:00 WIB</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="h-5 w-5 mr-2 text-green-600" />
                  Proses Selanjutnya
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start space-x-2">
                    <span className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-xs font-semibold">
                      1
                    </span>
                    <span>Verifikasi data (2-3 hari kerja)</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-xs font-semibold">
                      2
                    </span>
                    <span>Kunjungan lokasi usaha</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-xs font-semibold">
                      3
                    </span>
                    <span>Publikasi di website desa</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-xs font-semibold">
                      4
                    </span>
                    <span>Bergabung dengan komunitas UMKM</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}
