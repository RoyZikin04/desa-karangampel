"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Calendar, User, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { beritaStorage, initializeDemoData, type Berita } from "@/lib/local-storage"

export default function BeritaPage() {
  const [beritaList, setBeritaList] = useState<Berita[]>([])
  const [featuredBerita, setFeaturedBerita] = useState<Berita | null>(null)

  // Load data berita yang sudah dipublikasi
  useEffect(() => {
    // Inisialisasi data demo jika belum ada
    initializeDemoData()

    const loadData = () => {
      const publishedBerita = beritaStorage.getPublished()
      setBeritaList(publishedBerita)

      // Set berita terbaru sebagai featured
      if (publishedBerita.length > 0) {
        setFeaturedBerita(publishedBerita[0])
      }
    }

    loadData()

    // Update data setiap 2 detik untuk menampilkan berita baru
    const interval = setInterval(loadData, 2000)
    return () => clearInterval(interval)
  }, [])

  const getCategoryLabel = (category: string) => {
    const labels: { [key: string]: string } = {
      acara: "Acara",
      pembangunan: "Pembangunan",
      umkm: "UMKM",
      kesehatan: "Kesehatan",
      pendidikan: "Pendidikan",
      pertanian: "Pertanian",
      pengumuman: "Pengumuman",
      pelatihan: "Pelatihan",
    }
    return labels[category] || category
  }

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      acara: "bg-blue-600",
      pembangunan: "bg-green-600",
      umkm: "bg-purple-600",
      kesehatan: "bg-red-600",
      pendidikan: "bg-indigo-600",
      pertanian: "bg-yellow-600",
      pengumuman: "bg-orange-600",
      pelatihan: "bg-teal-600",
    }
    return colors[category] || "bg-gray-600"
  }

  // Berita selain featured
  const otherBerita = beritaList.slice(1)

  return (
    <div className="min-h-screen">
      {/* Header Section */}
      <section className="relative h-[300px] flex items-center justify-center bg-gradient-to-r from-green-600 to-blue-600">
        <div className="absolute inset-0 bg-black/40" />
        {/* CATATAN: Ganti dengan foto kegiatan desa */}
        <Image src="/beritaacara.jpg?height=300&width=1200" alt="Kegiatan Desa" fill className="object-cover" />
        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Berita & Acara</h1>
          <p className="text-xl">Informasi terkini seputar kegiatan dan perkembangan Desa Karangampel</p>
          <p className="text-sm mt-2 opacity-90">{beritaList.length} berita telah dipublikasi</p>
        </div>
      </section>

      {beritaList.length === 0 ? (
        <section className="py-16">
          <div className="container mx-auto px-4">
            <Card className="text-center py-12">
              <CardContent>
                <div className="text-gray-500">
                  <p className="text-lg mb-2">Belum ada berita yang dipublikasi</p>
                  <p className="text-sm">Berita terbaru akan muncul di sini</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      ) : (
        <>
          {/* Featured News */}
          {featuredBerita && (
            <section className="py-16">
              <div className="container mx-auto px-4">
                <div className="mb-12">
                  <h2 className="text-3xl font-bold text-gray-900 mb-8">Berita Utama</h2>

                  <Card className="overflow-hidden">
                    <div className="grid grid-cols-1 lg:grid-cols-2">
                      <div className="relative h-64 lg:h-auto">
                        <Image
                          src={
                            featuredBerita.gambarUrl ||
                            "/placeholder.svg?height=400&width=600&query=news featured image"
                          }
                          alt={featuredBerita.judul}
                          fill
                          className="object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement
                            target.src = "/placeholder.svg?height=400&width=600"
                          }}
                        />
                      </div>
                      <div className="p-8">
                        <div className="flex items-center gap-4 mb-4">
                          <Badge className={getCategoryColor(featuredBerita.kategori)}>
                            {getCategoryLabel(featuredBerita.kategori)}
                          </Badge>
                          <div className="flex items-center text-sm text-gray-500">
                            <Calendar className="h-4 w-4 mr-1" />
                            {new Date(featuredBerita.tanggal).toLocaleDateString("id-ID", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </div>
                          <div className="flex items-center text-sm text-gray-500">
                            <User className="h-4 w-4 mr-1" />
                            {featuredBerita.penulis}
                          </div>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">{featuredBerita.judul}</h3>
                        <p className="text-gray-600 mb-6 line-clamp-4">{featuredBerita.ringkasan}</p>
                        <Button asChild>
                          <Link href={`/berita/${featuredBerita.slug}`}>
                            Baca Selengkapnya <ArrowRight className="ml-2 h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            </section>
          )}

          {/* Latest News Grid */}
          {otherBerita.length > 0 && (
            <section className="py-16 bg-gray-50">
              <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold text-gray-900 mb-8">Berita Terbaru</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {otherBerita.map((berita) => (
                    <Card key={berita.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                      <div className="relative h-48">
                        <Image
                          src={berita.gambarUrl || "/placeholder.svg?height=200&width=300&query=news image"}
                          alt={berita.judul}
                          fill
                          className="object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement
                            target.src = "/placeholder.svg?height=200&width=300"
                          }}
                        />
                        <Badge className={`absolute top-2 left-2 ${getCategoryColor(berita.kategori)}`}>
                          {getCategoryLabel(berita.kategori)}
                        </Badge>
                      </div>
                      <CardHeader>
                        <div className="flex items-center gap-4 mb-2">
                          <div className="flex items-center text-sm text-gray-500">
                            <Calendar className="h-4 w-4 mr-1" />
                            {new Date(berita.tanggal).toLocaleDateString("id-ID")}
                          </div>
                        </div>
                        <CardTitle className="line-clamp-2">{berita.judul}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-600 line-clamp-3 mb-4">{berita.ringkasan}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">Oleh: {berita.penulis}</span>
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/berita/${berita.slug}`}>Baca Selengkapnya</Link>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Load More Button - hanya tampil jika ada banyak berita */}
                {otherBerita.length > 9 && (
                  <div className="text-center mt-12">
                    <Button size="lg" variant="outline">
                      Muat Berita Lainnya
                    </Button>
                  </div>
                )}
              </div>
            </section>
          )}
        </>
      )}

      {/* Upcoming News - managed from admin */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Berita Mendatang</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {beritaStorage
              .getAll()
              .filter((berita) => new Date(berita.tanggal) > new Date() && berita.status === "published")
              .slice(0, 4)
              .map((upcomingBerita) => (
                <Card
                  key={`upcoming-${upcomingBerita.id}`}
                  className={`border-l-4 ${getCategoryColor(upcomingBerita.kategori) === "bg-blue-600" ? "border-l-blue-600" : getCategoryColor(upcomingBerita.kategori) === "bg-green-600" ? "border-l-green-600" : "border-l-purple-600"}`}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <Badge variant="outline">Berita Mendatang</Badge>
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="h-4 w-4 mr-1" />
                        {new Date(upcomingBerita.tanggal).toLocaleDateString("id-ID")}
                      </div>
                    </div>
                    <CardTitle>{upcomingBerita.judul}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">{upcomingBerita.ringkasan}</p>
                    <div className="text-sm text-gray-500">
                      <p>📝 Kategori: {getCategoryLabel(upcomingBerita.kategori)}</p>
                      <p>✍️ Penulis: {upcomingBerita.penulis}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}

            {/* Show default message if no upcoming news */}
            {beritaStorage
              .getAll()
              .filter((berita) => new Date(berita.tanggal) > new Date() && berita.status === "published").length ===
              0 && (
              <Card className="border-l-4 border-l-gray-400 md:col-span-2">
                <CardContent className="p-8 text-center">
                  <div className="text-gray-500">
                    <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                    <p className="text-lg mb-2">Belum ada berita mendatang</p>
                    <p className="text-sm">Berita dengan tanggal publikasi di masa depan akan muncul di sini</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </section>

      {/* Upcoming Events - bisa ditambahkan jika ada data acara */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Acara Mendatang</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Data acara bisa diambil dari berita dengan kategori 'acara' yang tanggalnya di masa depan */}
            {beritaStorage
              .getAll()
              .filter(
                (berita) =>
                  berita.kategori === "acara" && new Date(berita.tanggal) > new Date() && berita.status === "published",
              )
              .slice(0, 4)
              .map((upcomingEvent) => (
                <Card
                  key={`event-${upcomingEvent.id}`}
                  className={`border-l-4 ${getCategoryColor(upcomingEvent.kategori)}`}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <Badge variant="outline">Acara Mendatang</Badge>
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="h-4 w-4 mr-1" />
                        {new Date(upcomingEvent.tanggal).toLocaleDateString("id-ID")}
                      </div>
                    </div>
                    <CardTitle>{upcomingEvent.judul}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">{upcomingEvent.ringkasan}</p>
                    <div className="text-sm text-gray-500">
                      {/* Lokasi dan Waktu hanya ditampilkan jika properti tersedia */}
                      {"lokasi" in upcomingEvent && (
                        <p>📍 Lokasi: {(upcomingEvent as any).lokasi}</p>
                      )}
                      {"waktu" in upcomingEvent && (
                        <p>🕐 Waktu: {(upcomingEvent as any).waktu}</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}

            {/* Show default message if no upcoming events */}
            {beritaStorage
              .getAll()
              .filter(
                (berita) =>
                  berita.kategori === "acara" && new Date(berita.tanggal) > new Date() && berita.status === "published",
              ).length === 0 && (
              <Card className="border-l-4 border-l-gray-400 md:col-span-2">
                <CardContent className="p-8 text-center">
                  <div className="text-gray-500">
                    <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                    <p className="text-lg mb-2">Belum ada acara mendatang</p>
                    <p className="text-sm">Acara dengan tanggal publikasi di masa depan akan muncul di sini</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
