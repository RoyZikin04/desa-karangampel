"use client"

import React, { useState } from "react"
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
import { createClient } from "@supabase/supabase-js"

// =============================
// SUPABASE SETUP (client-side)
// =============================
// Pastikan env berikut di-define di .env.local:
// NEXT_PUBLIC_SUPABASE_URL="https://xxxx.supabase.co"
// NEXT_PUBLIC_SUPABASE_ANON_KEY="ey..."
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string

if (!supabaseUrl || !supabaseAnonKey) {
  // Jangan crash; tapi beri peringatan jelas di console
  console.warn("[UMKM] Supabase creds missing. Set NEXT_PUBLIC_SUPABASE_URL & NEXT_PUBLIC_SUPABASE_ANON_KEY")
}

const supabase = createClient(supabaseUrl ?? "", supabaseAnonKey ?? "")

// Storage bucket untuk gambar
const BUCKET = "uploads" // ganti sesuai bucket Anda

// =============================
// Tipe data form (UI state)
// =============================
interface FormState {
  namaUsaha: string
  kategori: string
  deskripsi: string
  alamat: string
  telepon: string
  email: string
  website: string
  jamOperasional: string
  hargaMin: string
  hargaMax: string
  produkUtama: string
  namaOwner: string
  nikOwner: string
  setujuSyarat: boolean
  fotoUrl: string
  fotoTempatUrl: string
}

// =============================
// Util: upload file ke Supabase Storage
// =============================
async function uploadToSupabase(file: File): Promise<string> {
  const ext = file.name.split(".").pop() || "bin"
  const filename = `${crypto.randomUUID()}.${ext}`
  const filepath = `images/${filename}`

  const { error: uploadError } = await supabase.storage.from(BUCKET).upload(filepath, file, {
    cacheControl: "3600",
    upsert: false,
  })
  if (uploadError) throw uploadError

  const { data: publicUrlData } = supabase.storage.from(BUCKET).getPublicUrl(filepath)
  return publicUrlData.publicUrl
}

// =============================
// Komponen Upload minimal (inlined)
// =============================
function FileUpload({
  label,
  required,
  currentUrl,
  onUploaded,
}: {
  label: string
  required?: boolean
  currentUrl?: string
  onUploaded: (url: string) => void
}) {
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setError(null)
    setIsUploading(true)
    try {
      const url = await uploadToSupabase(file)
      onUploaded(url)
    } catch (err: any) {
      console.error(err)
      setError(err?.message ?? "Gagal upload")
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="space-y-2">
      <Label>{label}{required ? " *" : ""}</Label>
      {currentUrl ? (
        <div className="relative w-full h-48 rounded-lg overflow-hidden border">
          {/* preview */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={currentUrl} alt={label} className="w-full h-full object-cover" />
        </div>
      ) : null}
      <Input type="file" accept="image/*" onChange={handleChange} disabled={isUploading} />
      {isUploading && (
        <p className="text-xs text-gray-500">Mengunggah...</p>
      )}
      {error && (
        <Alert className="border-red-200 bg-red-50">
          <AlertDescription className="text-red-700 text-sm">{error}</AlertDescription>
        </Alert>
      )}
    </div>
  )
}

export default function DaftarUMKMPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [formData, setFormData] = useState<FormState>({
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

  const handleInputChange = (field: keyof FormState, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value as any }))
  }

  // =============================
  // Submit -> insert ke tabel "umkm"
  // =============================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.setujuSyarat) return

    setIsSubmitting(true)
    try {
      // Map UI -> kolom database (snake_case)
      const payload = {
        nama_usaha: formData.namaUsaha,
        kategori: formData.kategori,
        deskripsi: formData.deskripsi,
        alamat: formData.alamat,
        telepon: formData.telepon,
        email: formData.email || null,
        website: formData.website || null,
        jam_operasional: formData.jamOperasional || null,
        harga_min: formData.hargaMin ? parseInt(formData.hargaMin, 10) : null,
        harga_max: formData.hargaMax ? parseInt(formData.hargaMax, 10) : null,
        produk_utama: formData.produkUtama,
        nama_owner: formData.namaOwner,
        nik_owner: formData.nikOwner,
        foto_url: formData.fotoUrl || null,
        foto_tempat_url: formData.fotoTempatUrl || null,
      }

      const { error } = await supabase.from("umkm").insert(payload)
      if (error) throw error

      setSubmitSuccess(true)
      // Reset form setelah sukses
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
    } catch (err: any) {
      console.error("Gagal menyimpan UMKM:", err)
      alert(`Gagal menyimpan: ${err?.message ?? "Unknown error"}`)
    } finally {
      setIsSubmitting(false)
      // auto-hide success after a bit
      setTimeout(() => setSubmitSuccess(false), 3000)
    }
  }

  return (
    <div className="min-h-screen">
      {/* Header Section */}
      <section className="relative h-[600px] flex items-center justify-center bg-gradient-to-r from-green-600 to-blue-600">
        <div className="absolute inset-0 bg-black/40" />
        <Image src="/daftarumkm.jpg?height=300&width=1200" alt="Daftar UMKM" fill className="object-cover" />
        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Daftarkan UMKM Anda</h1>
          <p className="text-xl">Bergabunglah dengan komunitas UMKM Desa Karangampel dan kembangkan bisnis Anda</p>
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
                    <FileUpload
                      label="Foto Produk Utama"
                      required
                      currentUrl={formData.fotoUrl}
                      onUploaded={(url) => handleInputChange("fotoUrl", url)}
                    />

                    <FileUpload
                      label="Foto Tempat Usaha"
                      currentUrl={formData.fotoTempatUrl}
                      onUploaded={(url) => handleInputChange("fotoTempatUrl", url)}
                    />
                  </div>

                  <Alert>
                    <AlertDescription>
                      💡 <strong>Tips:</strong> Upload foto produk yang menarik dan berkualitas baik untuk meningkatkan daya tarik UMKM Anda.
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
                      onCheckedChange={(checked) => handleInputChange("setujuSyarat", !!checked)}
                    />
                    <Label htmlFor="setujuSyarat" className="text-sm">
                      Saya menyetujui syarat dan ketentuan di atas *
                    </Label>
                  </div>
                </div>

                {/* Submit/Reset */}
                <div className="flex flex-col sm:flex-row gap-4 pt-6">
                  <Button type="submit" size="lg" className="flex-1" disabled={isSubmitting || !formData.setujuSyarat}>
                    {isSubmitting ? "Mengirim..." : "Daftarkan UMKM"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="lg"
                    className="flex-1 bg-transparent"
                    onClick={() =>
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
                    }
                  >
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
                    <span className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-xs font-semibold">1</span>
                    <span>Verifikasi data (2-3 hari kerja)</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-xs font-semibold">2</span>
                    <span>Kunjungan lokasi usaha</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-xs font-semibold">3</span>
                    <span>Publikasi di website desa</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-xs font-semibold">4</span>
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
