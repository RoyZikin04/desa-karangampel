"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Search, MapPin, Phone, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { supabase } from "@/lib/supabaseClient"

export default function UMKMPage() {
  const [umkmList, setUmkmList] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [ratings, setRatings] = useState<{ [key: string]: { average: number; count: number } }>({})

  // Load data UMKM yang sudah disetujui
  useEffect(() => {
    const fetchUMKM = async () => {
      const { data, error } = await supabase
        .from("umkm")
        .select("*")
        .eq("status", "approved")   // hanya tampil yg disetujui admin
        .order("created_at", { ascending: false })

      if (error) {
        console.error("Gagal mengambil UMKM:", error)
        return
      }

      setUmkmList(data || [])
    }

    fetchUMKM()
  }, [])

  // Filter UMKM berdasarkan pencarian dan kategori
  const filteredUMKM = umkmList.filter((umkm) => {
    const matchesSearch =
      umkm.nama_usaha?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      umkm.deskripsi?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      umkm.produk_utama?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesCategory = categoryFilter === "all" || umkm.kategori === categoryFilter
    return matchesSearch && matchesCategory
  })

  // Dapatkan kategori unik untuk filter
  const categories = Array.from(new Set(umkmList.map((umkm) => umkm.kategori)))

  const getCategoryLabel = (category: string) => {
    const labels: { [key: string]: string } = {
      makanan: "Makanan",
      kerajinan: "Kerajinan",
      pertanian: "Pertanian",
      fashion: "Fashion",
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

  return (
    <div className="min-h-screen">
      {/* Header Section */}
      <section className="relative h-[300px] flex items-center justify-center bg-gradient-to-r from-green-600 to-blue-600">
        <div className="absolute inset-0 bg-black/40" />
        <Image src="/placeholder.svg?height=300&width=1200" alt="UMKM Desa" fill className="object-cover" />
        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">UMKM Desa Karangampel</h1>
          <p className="text-xl">Temukan produk berkualitas dari usaha mikro, kecil, dan menengah lokal</p>
          <p className="text-sm mt-2 opacity-90">{umkmList.length} UMKM terdaftar dan aktif</p>
        </div>
      </section>

      {/* Search and Filter */}
      <section className="py-8 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Cari UMKM atau produk..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              <Badge
                variant={categoryFilter === "all" ? "default" : "outline"}
                className="cursor-pointer hover:bg-blue-50"
                onClick={() => setCategoryFilter("all")}
              >
                Semua ({umkmList.length})
              </Badge>
              {categories.map((category) => (
                <Badge
                  key={category}
                  variant={categoryFilter === category ? "default" : "outline"}
                  className="cursor-pointer hover:bg-blue-50"
                  onClick={() => setCategoryFilter(category)}
                >
                  {getCategoryLabel(category)} ({umkmList.filter((u) => u.kategori === category).length})
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* UMKM Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {filteredUMKM.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <div className="text-gray-500">
                  {searchTerm || categoryFilter !== "all" ? (
                    <>
                      <p className="text-lg mb-2">Tidak ada UMKM yang ditemukan</p>
                      <p className="text-sm">Coba ubah kata kunci pencarian atau filter kategori</p>
                    </>
                  ) : (
                    <>
                      <p className="text-lg mb-2">Belum ada UMKM yang terdaftar</p>
                      <p className="text-sm mb-4">Jadilah yang pertama mendaftarkan UMKM Anda!</p>
                      <Button asChild>
                        <a href="/daftar-umkm">Daftar UMKM Sekarang</a>
                      </Button>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredUMKM.map((umkm) => {
                const rating = ratings[umkm.id] || { average: 0, count: 0 }

                return (
                  <Card key={umkm.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="relative h-48">
                      <Image
                        src={umkm.foto_url || "/placeholder.svg?height=200&width=300"}
                        alt={umkm.nama_usaha}
                        fill
                        className="object-cover"
                      />
                      <Badge className={`absolute top-2 left-2 ${getCategoryColor(umkm.kategori)}`}>
                        {getCategoryLabel(umkm.kategori)}
                      </Badge>
                    </div>
                    <CardHeader>
                      <CardTitle>{umkm.nama_usaha}</CardTitle>
                      <CardDescription className="flex items-center text-sm">
                        <MapPin className="h-4 w-4 mr-1" />
                        {umkm.alamat}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600 mb-4 line-clamp-3">{umkm.deskripsi}</p>
                      <div className="mb-4">
                        <p className="text-xs text-gray-500 mb-1">Produk Utama:</p>
                        <p className="text-sm font-medium">{umkm.produk_utama}</p>
                      </div>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                          <Star
                            className={`h-4 w-4 ${rating.average > 0 ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                          />
                          <span className="text-sm ml-1">
                            {rating.average > 0 ? `${rating.average} (${rating.count} ulasan)` : "Belum ada ulasan"}
                          </span>
                        </div>
                        <span className="text-sm text-gray-500">
                          Rp {umkm.harga_min?.toLocaleString()} - {umkm.harga_max?.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" className="flex-1" asChild>
                          <Link href={`/umkm/${umkm.id}`}>Lihat Detail</Link>
                        </Button>
                        <Button size="sm" variant="outline" asChild>
                          <a href={`tel:${umkm.telepon}`}>
                            <Phone className="h-4 w-4" />
                          </a>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
