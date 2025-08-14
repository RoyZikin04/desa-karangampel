"use client"

import { supabase } from "@/lib/supabaseClient"; // pastikan ini ada di atas
import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import { ArrowLeft, Calendar, User, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { beritaStorage, type Berita } from "@/lib/local-storage"

export default function DetailBeritaPage() {
  const params = useParams()
  const router = useRouter()
  const [berita, setBerita] = useState<Berita | null>(null)
  const [loading, setLoading] = useState(true)

useEffect(() => {
  const fetchBerita = async () => {
    const slugParam = String(params.slug);

    // 1) Cek local-storage (kode lama)
    let found: Berita | null = beritaStorage.getBySlug(slugParam);

    // 2) Kalau tidak ada di local, coba ke Supabase
    if (!found) {
      // a) coba by slug persis
      const { data: bySlug, error: errSlug } = await supabase
        .from("berita")
        .select("*")
        .eq("slug", slugParam)
        .maybeSingle(); // biar gak error kalau 0 row

      let row: any = bySlug;

      // b) kalau belum ketemu, coba ekstrak id di akhir slug: ...-12345
      if (!row) {
        const tail = slugParam.split("-").pop();
        if (tail && /^\d+$/.test(tail)) {
          const { data: byId } = await supabase
            .from("berita")
            .select("*")
            .eq("id", Number(tail))
            .maybeSingle();
          row = byId ?? null;
        }
      }

      if (row) {
        // 3) Normalisasi kolom dari Supabase -> shape Berita (camelCase)
        const normalized: Berita = {
          id: row.id,
          judul: row.judul,
          kategori: row.kategori,
          ringkasan: row.ringkasan ?? "",
          gambarUrl: row.gambar_url ?? row.gambarUrl ?? "",
          slug: row.slug ?? slugParam,
          tanggal: row.tanggal ?? new Date().toISOString(),
          penulis: row.penulis ?? "Admin Desa",
          konten: row.konten ?? row.isi ?? row.content ?? "",
          status: row.status ?? "published",
        };
        found = normalized;
      } else if (errSlug) {
        // Kalau Supabase balikin error beneran (bukan sekadar 0 row)
        console.error("Supabase error:", errSlug);
      }
    }

    setBerita(found || null);
    setLoading(false);
  };

  fetchBerita();
}, [params.slug]);


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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Memuat berita...</p>
        </div>
      </div>
    )
  }

  if (!berita) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardContent className="text-center py-12">
            <h2 className="text-xl font-semibold mb-2">Berita Tidak Ditemukan</h2>
            <p className="text-gray-600 mb-4">Berita yang Anda cari tidak tersedia.</p>
            <Button onClick={() => router.push("/berita")}>Kembali ke Halaman Berita</Button>
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
            <h1 className="text-lg font-semibold text-gray-900 line-clamp-1">{berita.judul}</h1>
          </div>
        </div>
      </div>

      {/* Article Content */}
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <article className="bg-white rounded-lg shadow-sm overflow-hidden">
          {/* Featured Image */}
          <div className="relative h-64 md:h-96">
            <Image
              src={berita.gambarUrl || "/placeholder.svg?height=400&width=800&query=news detail image"}
              alt={berita.judul}
              fill
              className="object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement
                target.src = "/placeholder.svg?height=400&width=800"
              }}
            />
          </div>

          <div className="p-6 md:p-8">
            {/* Article Meta */}
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <Badge className={getCategoryColor(berita.kategori)}>{getCategoryLabel(berita.kategori)}</Badge>
              <div className="flex items-center text-sm text-gray-500">
                <Calendar className="h-4 w-4 mr-1" />
                {new Date(berita.tanggal).toLocaleDateString("id-ID", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <User className="h-4 w-4 mr-1" />
                {berita.penulis}
              </div>
              <Button variant="outline" size="sm" className="ml-auto bg-transparent">
                <Share2 className="h-4 w-4 mr-1" />
                Bagikan
              </Button>
            </div>

            {/* Article Title */}
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">{berita.judul}</h1>

            {/* Article Summary */}
            <div className="bg-blue-50 border-l-4 border-blue-600 p-4 mb-8">
              <p className="text-lg text-gray-700 leading-relaxed">{berita.ringkasan}</p>
            </div>

            {/* Article Content */}
            <div className="prose prose-lg max-w-none">
              {berita.konten.split("\n").map((paragraph, index) => (
                <p
                  key={`${berita.id}-content-${index}-${paragraph.slice(0, 10).replace(/\s/g, "")}`}
                  className="mb-4 text-gray-700 leading-relaxed"
                >
                  {paragraph}
                </p>
              ))}
            </div>

            {/* Article Footer */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  Diterbitkan oleh <strong>{berita.penulis}</strong> pada{" "}
                  {new Date(berita.tanggal).toLocaleDateString("id-ID", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </div>
                <Button variant="outline" size="sm">
                  <Share2 className="h-4 w-4 mr-1" />
                  Bagikan Berita
                </Button>
              </div>
            </div>
          </div>
        </article>

        {/* Related Articles */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Berita Terkait</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {beritaStorage
              .getPublished()
              .filter((b) => b.id !== berita.id && b.kategori === berita.kategori)
              .slice(0, 2)
              .map((relatedBerita) => (
                <Card key={relatedBerita.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="relative h-32">
                    <Image
                      src={relatedBerita.gambarUrl || "/placeholder.svg?height=128&width=300&query=related news"}
                      alt={relatedBerita.judul}
                      fill
                      className="object-cover rounded-t-lg"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.src = "/placeholder.svg?height=128&width=300"
                      }}
                    />
                  </div>
                  <CardContent className="p-4">
                    <Badge className={`${getCategoryColor(relatedBerita.kategori)} mb-2`}>
                      {getCategoryLabel(relatedBerita.kategori)}
                    </Badge>
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{relatedBerita.judul}</h3>
                    <p className="text-sm text-gray-600 line-clamp-2 mb-3">{relatedBerita.ringkasan}</p>
                    <Button variant="outline" size="sm" asChild>
                      <a href={`/berita/${relatedBerita.slug}`}>Baca Selengkapnya</a>
                    </Button>
                  </CardContent>
                </Card>
              ))}
          </div>
        </div>
      </div>
    </div>
  )
}
