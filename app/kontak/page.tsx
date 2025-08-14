"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { MapPin, Phone, Mail, Clock, Facebook, Instagram, Youtube, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function KontakPage() {
  const [formData, setFormData] = useState({
    nama: "",
    email: "",
    telepon: "",
    subjek: "",
    pesan: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const emailBody = `
PESAN DARI WEBSITE Desa Karangampel
================================

Nama Pengirim: ${formData.nama}
Email: ${formData.email}
Telepon: ${formData.telepon || "Tidak disertakan"}
Subjek: ${formData.subjek}

PESAN:
${formData.pesan}

================================
Dikirim melalui website resmi Desa Karangampel
Tanggal: ${new Date().toLocaleDateString("id-ID", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })}
      `.trim()

      const adminEmail = "admin@desamakmur.id" // Admin can redirect this to their preferred email
      const mailtoLink = `mailto:${adminEmail}?subject=${encodeURIComponent(`[Website Desa] ${formData.subjek}`)}&body=${encodeURIComponent(emailBody)}`

      // Open email client
      window.location.href = mailtoLink

      // Show success message
      setSubmitSuccess(true)

      // Reset form
      setFormData({
        nama: "",
        email: "",
        telepon: "",
        subjek: "",
        pesan: "",
      })

      console.log("✅ Email berhasil disiapkan untuk dikirim ke:", adminEmail)
    } catch (error) {
      console.error("❌ Gagal mengirim email:", error)
    } finally {
      setIsSubmitting(false)
      // Hide success message after 5 seconds
      setTimeout(() => setSubmitSuccess(false), 5000)
    }
  }

  const handleInputChange = (field: string, value: string) => {
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
        {/* CATATAN: Ganti dengan foto kantor desa atau balai desa */}
        <Image src="/placeholder.svg?height=300&width=1200" alt="Kantor Desa" fill className="object-cover" />
        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Hubungi Kami</h1>
          <p className="text-xl">Kami siap membantu dan mendengar masukan dari masyarakat</p>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Kirim Pesan</h2>

              {submitSuccess && (
                <Alert className="mb-6 border-green-200 bg-green-50">
                  <AlertDescription className="text-green-800">
                    ✅ Pesan berhasil disiapkan! Email client Anda akan terbuka untuk mengirim pesan ke admin desa.
                  </AlertDescription>
                </Alert>
              )}

              <Card>
                <CardHeader>
                  <CardTitle>Formulir Kontak</CardTitle>
                  <CardDescription>
                    Silakan isi formulir di bawah ini untuk menghubungi kami. Email akan dikirim ke admin@desamakmur.id
                    dan dapat dialihkan ke email admin yang aktif.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="nama">Nama Lengkap *</Label>
                        <Input
                          id="nama"
                          placeholder="Masukkan nama lengkap"
                          value={formData.nama}
                          onChange={(e) => handleInputChange("nama", e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="nama@email.com"
                          value={formData.email}
                          onChange={(e) => handleInputChange("email", e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="telepon">Nomor Telepon</Label>
                      <Input
                        id="telepon"
                        placeholder="08xxxxxxxxxx"
                        value={formData.telepon}
                        onChange={(e) => handleInputChange("telepon", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="subjek">Subjek *</Label>
                      <Input
                        id="subjek"
                        placeholder="Subjek pesan"
                        value={formData.subjek}
                        onChange={(e) => handleInputChange("subjek", e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="pesan">Pesan *</Label>
                      <Textarea
                        id="pesan"
                        placeholder="Tulis pesan Anda di sini..."
                        rows={5}
                        value={formData.pesan}
                        onChange={(e) => handleInputChange("pesan", e.target.value)}
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                      <Send className="h-4 w-4 mr-2" />
                      {isSubmitting ? "Menyiapkan Email..." : "Kirim Pesan"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Contact Details */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Informasi Kontak</h2>

              <div className="space-y-6">
                {/* Alamat */}
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="bg-blue-100 p-3 rounded-full">
                        <MapPin className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg mb-2">Alamat</h3>
                        {/* CATATAN: Ganti dengan alamat lengkap desa Anda */}
                        <p className="text-gray-600">
                          Jl. Raya Desa
                          <br />
                          Desa Karangampel, Kecamatan Karangampel
                          <br />
                          Kabupaten Indramayu
                          <br />
                          Provinsi Jawa Barat
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Telepon */}
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="bg-green-100 p-3 rounded-full">
                        <Phone className="h-6 w-6 text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg mb-2">Telepon</h3>
                        {/* CATATAN: Ganti dengan nomor telepon desa Anda */}
                        <p className="text-gray-600">
                          Kantor Desa: (0274) 1234-5678
                          <br />
                          Kepala Desa: 0812-3456-7890
                          <br />
                          Sekretaris: 0813-4567-8901
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Email */}
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="bg-purple-100 p-3 rounded-full">
                        <Mail className="h-6 w-6 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg mb-2">Email</h3>
                        <p className="text-gray-600">
                          admin@desamakmur.id (Email utama untuk formulir)
                          <br />
                          info@desamakmur.id
                          <br />
                          kepaladesa@desamakmur.id
                          <br />
                          umkm@desamakmur.id
                        </p>
                        <p className="text-xs text-blue-600 mt-2">
                          * Email admin@desamakmur.id dapat dialihkan ke email aktif admin
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Jam Operasional */}
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="bg-orange-100 p-3 rounded-full">
                        <Clock className="h-6 w-6 text-orange-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg mb-2">Jam Operasional</h3>
                        {/* CATATAN: Sesuaikan dengan jam operasional kantor desa Anda */}
                        <div className="text-gray-600 space-y-1">
                          <p>Senin - Jumat: 08:00 - 16:00 WIB</p>
                          <p>Sabtu: 08:00 - 12:00 WIB</p>
                          <p>Minggu: Tutup</p>
                          <p className="text-sm text-red-600 mt-2">*Kecuali hari libur nasional</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Media Sosial */}
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-lg mb-4">Ikuti Kami</h3>
                    <div className="flex space-x-4">
                      {/* CATATAN: Ganti dengan link media sosial desa Anda */}
                      <a
                        href="#"
                        className="bg-blue-600 text-white p-3 rounded-full hover:bg-blue-700 transition-colors"
                      >
                        <Facebook className="h-5 w-5" />
                      </a>
                      <a
                        href="#"
                        className="bg-pink-600 text-white p-3 rounded-full hover:bg-pink-700 transition-colors"
                      >
                        <Instagram className="h-5 w-5" />
                      </a>
                      <a href="#" className="bg-red-600 text-white p-3 rounded-full hover:bg-red-700 transition-colors">
                        <Youtube className="h-5 w-5" />
                      </a>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Lokasi Kami</h2>
            <p className="text-xl text-gray-600">Temukan lokasi kantor desa dan fasilitas umum lainnya</p>
          </div>

          <Card className="overflow-hidden">
            <CardContent className="p-0">
              {/* CATATAN: Ganti dengan embed Google Maps lokasi desa Anda */}
              <div className="relative h-96 bg-gray-200 flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <MapPin className="h-12 w-12 mx-auto mb-4" />
                  <p className="text-lg font-semibold">Peta Lokasi Desa</p>
                  <p className="text-sm">
                    Ganti bagian ini dengan embed Google Maps
                    <br />
                    atau peta interaktif lokasi desa Anda
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Pertanyaan yang Sering Diajukan</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* CATATAN: Sesuaikan FAQ dengan pertanyaan umum tentang desa Anda */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Bagaimana cara mendaftarkan UMKM di desa?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Anda dapat mendaftarkan UMKM dengan datang langsung ke kantor desa membawa KTP, KK, dan dokumen usaha.
                  Pendaftaran gratis dan akan diproses dalam 3 hari kerja.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Apakah ada bantuan modal untuk UMKM?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Ya, desa menyediakan program bantuan modal bergulir dan akses ke lembaga keuangan mikro. Informasi
                  lengkap dapat diperoleh di kantor desa.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Bagaimana cara mengurus surat keterangan usaha?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Bawa KTP, KK, dan foto usaha ke kantor desa. Surat akan selesai dalam 1 hari kerja dengan biaya
                  administrasi sesuai peraturan desa.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Kapan jadwal pasar desa?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Pasar desa buka setiap hari Selasa, Kamis, dan Minggu mulai pukul 06:00 - 12:00 WIB di area lapangan
                  desa.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}
