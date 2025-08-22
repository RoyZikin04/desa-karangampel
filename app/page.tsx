"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowRight, MapPin, Users, Building2, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

// Import fungsi untuk inisialisasi data demo
import { initializeDemoData, umkmStorage, beritaStorage } from "@/lib/local-storage"
import { useEffect, useState } from "react"

export default function HomePage() {
  // Tambahkan state untuk data dinamis
  const [umkmCount, setUmkmCount] = useState(45)
  const [beritaCount, setBeritaCount] = useState(12)
  const [featuredUMKM, setFeaturedUMKM] = useState<any[]>([])
  const [latestBerita, setLatestBerita] = useState<any[]>([])

  // Load data real dari localStorage
  useEffect(() => {
    // Inisialisasi data demo
    initializeDemoData()

    const loadData = () => {
      const approvedUMKM = umkmStorage.getApproved()
      const publishedBerita = beritaStorage.getPublished()

      setUmkmCount(approvedUMKM.length)
      setBeritaCount(publishedBerita.length)

      setFeaturedUMKM(approvedUMKM.slice(0, 3))
      setLatestBerita(publishedBerita.slice(0, 3))
    }

    loadData()

    // Update counts setiap 2 detik
    const interval = setInterval(loadData, 2000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen">
      {/* Hero Section - Ganti gambar sesuai foto desa Anda */}
      <section className="relative h-[600px] flex items-center justify-center bg-gradient-to-r from-green-600 to-blue-600">
        {/* CATATAN: Ganti placeholder dengan foto panorama desa Anda */}
        <div className="absolute inset-0 bg-black/40" />
        <Image
          src="/KarangampelDesa.jpg?height=600&width=1200"
          alt="Pemandangan Desa"
          fill
          className="object-cover"
          priority
        />
        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
          {/* CATATAN: Ganti nama desa sesuai dengan desa Anda */}
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Selamat Datang di Desa Karangampel</h1>
          {/* CATATAN: Ganti deskripsi sesuai dengan karakteristik desa Anda */}
          <p className="text-xl md:text-2xl mb-8">
            Desa yang kaya akan budaya, alam yang asri, dan UMKM yang berkembang pesat
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/tentang-desa">
                Tentang Desa <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="bg-white/10 border-white text-white hover:bg-white hover:text-black"
              asChild
            >
              <Link href="/umkm">Lihat UMKM</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Statistik Desa */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* CATATAN: Sesuaikan angka-angka statistik dengan data desa Anda */}
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900">2,500</h3>
              <p className="text-gray-600">Jumlah Penduduk</p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Building2 className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900">{umkmCount}</h3>
              <p className="text-gray-600">UMKM Aktif</p>
            </div>
            <div className="text-center">
              <div className="bg-yellow-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-8 w-8 text-yellow-600" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900">15</h3>
              <p className="text-gray-600">Dusun</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900">{beritaCount}</h3>
              <p className="text-gray-600">Berita Terbaru</p>
            </div>
          </div>
        </div>
      </section>

      {/* UMKM Unggulan */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">UMKM Unggulan Desa</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Produk-produk berkualitas dari masyarakat desa yang siap bersaing di pasar
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {featuredUMKM.length > 0 ? (
              featuredUMKM.map((umkm) => (
                <Card key={umkm.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative h-48">
                    <Image
                      src={umkm.fotoProduk || "/placeholder.svg?height=200&width=300&query=UMKM product"}
                      alt={umkm.namaUsaha}
                      fill
                      className="object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.src = "/placeholder.svg?height=200&width=300"
                      }}
                    />
                  </div>
                  <CardHeader>
                    <CardTitle>{umkm.namaUsaha}</CardTitle>
                    <CardDescription>{umkm.jenisUsaha}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-3">{umkm.deskripsi}</p>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/umkm/${umkm.id}`}>Lihat Detail</Link>
                    </Button>
                  </CardContent>
                </Card>
              ))
            ) : (
              // Fallback to static content if no UMKM data
              <>
                <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative h-48">
                    <Image
                      src="/placeholder.svg?height=200&width=300"
                      alt="Kerajinan Tangan"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <CardHeader>
                    <CardTitle>Kerajinan Bambu Berkah</CardTitle>
                    <CardDescription>Kerajinan tangan dari bambu berkualitas tinggi</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-4">
                      Memproduksi berbagai kerajinan bambu seperti tas, tempat pensil, dan dekorasi rumah.
                    </p>
                    <Button variant="outline" size="sm">
                      Lihat Detail
                    </Button>
                  </CardContent>
                </Card>

                <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative h-48">
                    <Image
                      src="/placeholder.svg?height=200&width=300"
                      alt="Makanan Tradisional"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <CardHeader>
                    <CardTitle>Camilan Nusantara</CardTitle>
                    <CardDescription>Makanan ringan tradisional yang lezat</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-4">
                      Memproduksi keripik singkong, emping, dan berbagai camilan tradisional lainnya.
                    </p>
                    <Button variant="outline" size="sm">
                      Lihat Detail
                    </Button>
                  </CardContent>
                </Card>

                <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative h-48">
                    <Image
                      src="/placeholder.svg?height=200&width=300"
                      alt="Produk Organik"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <CardHeader>
                    <CardTitle>Sayur Organik Segar</CardTitle>
                    <CardDescription>Sayuran organik segar dari kebun sendiri</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-4">
                      Menyediakan sayuran organik segar tanpa pestisid untuk kesehatan keluarga.
                    </p>
                    <Button variant="outline" size="sm">
                      Lihat Detail
                    </Button>
                  </CardContent>
                </Card>
              </>
            )}
          </div>

          <div className="text-center">
            <Button size="lg" asChild>
              <Link href="/umkm">
                Lihat Semua UMKM <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Berita Terkini */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Berita & Acara Terkini</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Informasi terbaru seputar kegiatan dan perkembangan desa
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
            {latestBerita.length > 0 ? (
              latestBerita.map((berita) => (
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
                  </div>
                  <CardHeader>
                    <CardTitle className="line-clamp-2">{berita.judul}</CardTitle>
                    <CardDescription>
                      {new Date(berita.tanggal).toLocaleDateString("id-ID", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 line-clamp-3">{berita.ringkasan}</p>
                  </CardContent>
                </Card>
              ))
            ) : (
              // Fallback to static content if no news data
              <>
                <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative h-48">
                    <Image
                      src="/placeholder.svg?height=200&width=300"
                      alt="Festival Desa"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <CardHeader>
                    <CardTitle className="line-clamp-2">Festival Budaya Desa Karangampel 2025</CardTitle>
                    <CardDescription>15 Desember 2024</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 line-clamp-3">
                      Festival tahunan yang menampilkan berbagai kesenian tradisional dan pameran produk UMKM lokal.
                    </p>
                  </CardContent>
                </Card>

                <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative h-48">
                    <Image
                      src="/placeholder.svg?height=200&width=300"
                      alt="Pelatihan UMKM"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <CardHeader>
                    <CardTitle className="line-clamp-2">Pelatihan Digital Marketing untuk UMKM</CardTitle>
                    <CardDescription>10 Desember 2024</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 line-clamp-3">
                      Pelatihan gratis untuk meningkatkan kemampuan pemasaran digital bagi pelaku UMKM desa.
                    </p>
                  </CardContent>
                </Card>

                <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative h-48">
                    <Image
                      src="/placeholder.svg?height=200&width=300"
                      alt="Pembangunan Infrastruktur"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <CardHeader>
                    <CardTitle className="line-clamp-2">Pembangunan Jalan Desa Tahap 2</CardTitle>
                    <CardDescription>5 Desember 2024</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 line-clamp-3">
                      Pembangunan jalan desa tahap kedua untuk meningkatkan akses transportasi dan ekonomi.
                    </p>
                  </CardContent>
                </Card>
              </>
            )}
          </div>

          <div className="text-center">
            <Button size="lg" variant="outline" asChild>
              <Link href="/berita">
                Lihat Semua Berita <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Bergabunglah dengan Komunitas UMKM Desa</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Daftarkan usaha Anda dan jadilah bagian dari ekosistem ekonomi desa yang berkembang
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild>
              <Link href="/daftar-umkm">Daftar UMKM</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-blue-600 bg-transparent"
              asChild
            >
              <Link href="/kontak">Hubungi Kami</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
