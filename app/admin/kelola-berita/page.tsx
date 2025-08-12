"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Search, Eye, Edit, Trash2, Calendar, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

// Import fungsi penyimpanan lokal
import { beritaStorage, type Berita } from "@/lib/local-storage"

export default function KelolaBeritaPage() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [beritaList, setBeritaList] = useState<Berita[]>([])
  const [deleteAlert, setDeleteAlert] = useState<string | null>(null)
  const [previewBerita, setPreviewBerita] = useState<Berita | null>(null)
  const [showUpcoming, setShowUpcoming] = useState(false)

  // Load data dari localStorage
  useEffect(() => {
    const loadData = () => {
      const data = beritaStorage.getAll()
      setBeritaList(data.sort((a, b) => new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime()))
    }

    loadData()
    const interval = setInterval(loadData, 1000)
    return () => clearInterval(interval)
  }, [])

  // Fungsi untuk menghapus berita
  const handleDelete = (id: string) => {
    beritaStorage.delete(id)
    const updatedData = beritaStorage.getAll()
    setBeritaList(updatedData)
    setDeleteAlert(null)
  }

  // Fungsi untuk mengubah status berita
  const handleStatusChange = (id: string, newStatus: "draft" | "published" | "scheduled") => {
    beritaStorage.update(id, { status: newStatus })
    const updatedData = beritaStorage.getAll()
    setBeritaList(updatedData)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "draft":
        return (
          <Badge variant="outline" className="text-gray-600 border-gray-600">
            Draft
          </Badge>
        )
      case "published":
        return (
          <Badge variant="outline" className="text-green-600 border-green-600">
            Dipublikasi
          </Badge>
        )
      case "scheduled":
        return (
          <Badge variant="outline" className="text-blue-600 border-blue-600">
            Terjadwal
          </Badge>
        )
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

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

  const filteredBerita = beritaList.filter((berita) => {
    const matchesSearch =
      berita.judul.toLowerCase().includes(searchTerm.toLowerCase()) ||
      berita.penulis.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || berita.status === statusFilter
    const isUpcoming = new Date(berita.tanggal) > new Date()
    const matchesUpcoming = !showUpcoming || isUpcoming
    return matchesSearch && matchesStatus && matchesUpcoming
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Button variant="ghost" onClick={() => router.back()} className="mr-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Kembali
              </Button>
              <h1 className="text-xl font-semibold text-gray-900">Kelola Berita</h1>
            </div>
            <div className="flex gap-2">
              <Button variant={showUpcoming ? "default" : "outline"} onClick={() => setShowUpcoming(!showUpcoming)}>
                {showUpcoming ? "Semua Berita" : "Berita Mendatang"}
              </Button>
              <Button onClick={() => router.push("/admin/buat-berita")}>Buat Berita Baru</Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Delete Alert */}
        {deleteAlert && (
          <Alert className="mb-8 border-red-200 bg-red-50">
            <AlertDescription className="text-red-800">
              <div className="flex items-center justify-between">
                <span>Yakin ingin menghapus berita ini? Tindakan ini tidak dapat dibatalkan.</span>
                <div className="flex gap-2 ml-4">
                  <Button size="sm" variant="destructive" onClick={() => handleDelete(deleteAlert)}>
                    Hapus
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setDeleteAlert(null)}>
                    Batal
                  </Button>
                </div>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Search and Filter */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Cari berita atau penulis..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Filter status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Status</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Dipublikasi</SelectItem>
                  <SelectItem value="scheduled">Terjadwal</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Berita List */}
        <div className="space-y-4">
          {filteredBerita.map((berita) => (
            <Card key={berita.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {getStatusBadge(berita.status)}
                      <Badge variant="outline" className="text-xs">
                        {getCategoryLabel(berita.kategori)}
                      </Badge>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{berita.judul}</h3>
                    <p className="text-sm text-gray-600 line-clamp-2 mb-3">{berita.ringkasan}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {new Date(berita.tanggal).toLocaleDateString("id-ID")}
                      </span>
                      <span className="flex items-center">
                        <User className="h-4 w-4 mr-1" />
                        {berita.penulis}
                      </span>
                    </div>
                  </div>
                  <div className="ml-4 flex flex-col gap-2">
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => setPreviewBerita(berita)}>
                        <Eye className="h-4 w-4 mr-1" />
                        Preview
                      </Button>
                      <Button size="sm" variant="outline">
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => setDeleteAlert(berita.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <Select
                      value={berita.status}
                      onValueChange={(value: "draft" | "published" | "scheduled") =>
                        handleStatusChange(berita.id, value)
                      }
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="published">Publikasi</SelectItem>
                        <SelectItem value="scheduled">Terjadwal</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {filteredBerita.length === 0 && (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-gray-500">Tidak ada berita yang ditemukan</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Statistics */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-blue-600">{beritaList.length}</div>
              <div className="text-sm text-gray-600">Total Berita</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-gray-600">
                {beritaList.filter((b) => b.status === "draft").length}
              </div>
              <div className="text-sm text-gray-600">Draft</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-green-600">
                {beritaList.filter((b) => b.status === "published").length}
              </div>
              <div className="text-sm text-gray-600">Dipublikasi</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-blue-600">
                {beritaList.filter((b) => b.status === "scheduled").length}
              </div>
              <div className="text-sm text-gray-600">Terjadwal</div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Preview Dialog */}
      <Dialog open={!!previewBerita} onOpenChange={() => setPreviewBerita(null)}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Preview Berita</DialogTitle>
          </DialogHeader>
          {previewBerita && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                {getStatusBadge(previewBerita.status)}
                <Badge variant="outline">{getCategoryLabel(previewBerita.kategori)}</Badge>
              </div>
              <h1 className="text-2xl font-bold">{previewBerita.judul}</h1>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  {new Date(previewBerita.tanggal).toLocaleDateString("id-ID", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
                <span className="flex items-center">
                  <User className="h-4 w-4 mr-1" />
                  {previewBerita.penulis}
                </span>
              </div>
              <div className="bg-blue-50 border-l-4 border-blue-600 p-4">
                <p className="text-gray-700">{previewBerita.ringkasan}</p>
              </div>
              <div className="prose max-w-none">
                {previewBerita.konten.split("\n").map((paragraph, index) => (
                  <p
                    key={`${previewBerita.id}-paragraph-${index}-${paragraph.slice(0, 10).replace(/\s/g, "")}`}
                    className="mb-4"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
