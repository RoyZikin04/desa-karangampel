"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import { ArrowLeft, MapPin, Phone, Mail, Globe, Clock, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { supabase } from "@/lib/supabaseClient"
import { GoogleMaps } from "@/components/google-maps"
import { ReviewSystem } from "@/components/review-system"


export default function DetailUMKMPage() {
  const params = useParams()
  const router = useRouter()
  const [umkm, setUmkm] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)
  const [related, setRelated] = useState<any[]>([])

  useEffect(() => {
    const fetchUMKM = async () => {
      const { data, error } = await supabase
        .from("umkm")
        .select("*")
        .eq("id", params.id)
        .maybeSingle()

      if (error) {
        console.error("Gagal ambil detail UMKM:", error)
        return
      }

      if (data) {
        setUmkm(data)

        // ambil UMKM sejenis
        const { data: relatedData } = await supabase
          .from("umkm")
          .select("*")
          .eq("kategori", data.kategori)
          .eq("status", "approved")
          .neq("id", data.id)
          .limit(3)

        setRelated(relatedData || [])
      }

      setLoading(false)
    }

    fetchUMKM()
  }, [params.id])

  const getCategoryLabel = (category: string) => {
    const labels: { [key: string]: string } = {
      makanan: "Makanan & Minuman",
      kerajinan: "Kerajinan Tangan",
      pertanian: "Produk Pertanian",
      fashion: "Fashion & Tekstil",
      jasa: "Jasa",
      teknologi: "Teknologi",
    }
    return labels[category] || category
  }

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      makanan: "bg-orange-600",
      kerajinan: "bg-green-600",
      pertanian: "bg-green-600",
      fashion: "bg-purple-600",
      jasa: "bg-blue-600",
      teknologi: "bg-indigo-600",
    }
    return colors[category] || "bg-gray-600"
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Memuat detail UMKM...</p>
        </div>
      </div>
    )
  }

  if (!umkm || umkm.status !== "approved") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardContent className="text-center py-12">
            <h2 className="text-xl font-semibold mb-2">UMKM Tidak Ditemukan</h2>
            <p className="text-gray-600 mb-4">UMKM yang Anda cari tidak tersedia atau belum disetujui.</p>
            <Button onClick={() => router.push("/umkm")}>Kembali ke Halaman UMKM</Button>
          </CardContent>
        </Card>
      </div>
    )
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
            <h1 className="text-lg font-semibold text-gray-900 line-clamp-1">{umkm.nama_usaha}</h1>
          </div>
        </div>
      </div>

      {/* UMKM Detail Content */}
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Hero Section */}
            <Card className="overflow-hidden">
              <div className="relative h-64 md:h-96">
                <Image
                  src={umkm.foto_url || "/placeholder.svg?height=400&width=800"}
                  alt={umkm.nama_usaha}
                  fill
                  className="object-cover"
                />
                <div className="absolute top-4 left-4">
                  <Badge className={getCategoryColor(umkm.kategori)}>{getCategoryLabel(umkm.kategori)}</Badge>
                </div>
                <div className="absolute top-4 right-4">
                  <Button variant="outline" size="sm" className="bg-white/90">
                    <Share2 className="h-4 w-4 mr-1" />
                    Bagikan
                  </Button>
                </div>
              </div>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{umkm.nama_usaha}</h1>
                    <p className="text-gray-600 flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      {umkm.alamat}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-blue-600">
                      Rp {umkm.harga_min?.toLocaleString()} - {umkm.harga_max?.toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-500">Range harga</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle>Tentang Usaha</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed mb-4">{umkm.deskripsi}</p>
                <div className="bg-blue-50 border-l-4 border-blue-600 p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Produk/Jasa Utama:</h4>
                  <p className="text-gray-700">{umkm.produk_utama}</p>
                </div>
              </CardContent>
            </Card>

            {/* Gallery */}
            {(umkm.foto_tempat_url || umkm.foto_url) && (
              <Card>
                <CardHeader>
                  <CardTitle>Galeri</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="relative h-48 rounded-lg overflow-hidden">
                      <Image
                        src={umkm.foto_url || "/placeholder.svg?height=200&width=300"}
                        alt="Produk"
                        fill
                        className="object-cover"
                      />
                      <div className="absolute bottom-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
                        Produk
                      </div>
                    </div>
                    {umkm.foto_tempat_url && (
                      <div className="relative h-48 rounded-lg overflow-hidden">
                        <Image
                          src={umkm.foto_tempat_url || "/placeholder.svg?height=200&width=300"}
                          alt="Tempat Usaha"
                          fill
                          className="object-cover"
                        />
                        <div className="absolute bottom-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
                          Tempat Usaha
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            <ReviewSystem umkmId={umkm.id} umkmName={umkm.nama_usaha} />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Info */}
            <Card>
              <CardHeader>
                <CardTitle>Informasi Kontak</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-medium">Telepon/WhatsApp</p>
                    <a href={`tel:${umkm.telepon}`} className="text-blue-600 hover:underline">
                      {umkm.telepon}
                    </a>
                  </div>
                </div>
                {umkm.email && (
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-medium">Email</p>
                      <a href={`mailto:${umkm.email}`} className="text-blue-600 hover:underline">
                        {umkm.email}
                      </a>
                    </div>
                  </div>
                )}
                {umkm.website && (
                  <div className="flex items-center gap-3">
                    <Globe className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-medium">Website/Media Sosial</p>
                      <a
                        href={umkm.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        Kunjungi Website
                      </a>
                    </div>
                  </div>
                )}
                {umkm.jam_operasional && (
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-medium">Jam Operasional</p>
                      <p className="text-gray-600">{umkm.jam_operasional}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Owner Info */}
            <Card>
              <CardHeader>
                <CardTitle>Informasi Pemilik</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-xl font-semibold text-gray-600">
                      {umkm.nama_owner?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <h3 className="font-semibold text-gray-900">{umkm.nama_owner}</h3>
                  <p className="text-sm text-gray-600">Pemilik Usaha</p>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <Card>
              <CardContent className="p-4 space-y-3">
                <Button className="w-full" size="lg" asChild>
                  <a
                    href={`https://wa.me/${umkm.telepon?.replace(/^0/, "62")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Phone className="h-4 w-4 mr-2" />
                    Hubungi via WhatsApp
                  </a>
                </Button>
                <Button variant="outline" className="w-full bg-transparent" size="lg">
                  <Share2 className="h-4 w-4 mr-2" />
                  Bagikan UMKM
                </Button>
              </CardContent>
            </Card>

            <GoogleMaps address={umkm.alamat} businessName={umkm.nama_usaha} />
          </div>
        </div>

        {/* Related UMKM */}
        {related.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">UMKM Sejenis</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {related.map((relatedUmkm) => (
                <Card key={relatedUmkm.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="relative h-32">
                    <Image
                      src={relatedUmkm.foto_url || "/placeholder.svg?height=128&width=300"}
                      alt={relatedUmkm.nama_usaha}
                      fill
                      className="object-cover rounded-t-lg"
                    />
                  </div>
                  <CardContent className="p-4">
                    <Badge className={`${getCategoryColor(relatedUmkm.kategori)} mb-2`}>
                      {getCategoryLabel(relatedUmkm.kategori)}
                    </Badge>
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-1">{relatedUmkm.nama_usaha}</h3>
                    <p className="text-sm text-gray-600 line-clamp-2 mb-3">{relatedUmkm.deskripsi}</p>
                    <Button variant="outline" size="sm" asChild>
                      <a href={`/umkm/${relatedUmkm.id}`}>Lihat Detail</a>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
