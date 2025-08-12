"use client"

import { Label } from "@/components/ui/label"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Search, Eye, Check, X, Phone, Mail, MapPin, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"

// Import fungsi penyimpanan lokal
import { umkmStorage, type UMKM } from "@/lib/local-storage"

export default function KelolaUMKMPage() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedUMKM, setSelectedUMKM] = useState<any>(null)
  const [deleteAlert, setDeleteAlert] = useState<string | null>(null)

  // Ganti data dummy dengan data dari localStorage
  const [umkmList, setUmkmList] = useState<UMKM[]>([])

  // Load data dari localStorage saat komponen dimount
  useEffect(() => {
    const loadData = () => {
      const data = umkmStorage.getAll()
      setUmkmList(data)
    }

    loadData()

    // Update data setiap 1 detik untuk sinkronisasi real-time
    const interval = setInterval(loadData, 1000)
    return () => clearInterval(interval)
  }, [])

  // Update fungsi handleApprove untuk menggunakan localStorage
  const handleApprove = (id: string) => {
    umkmStorage.updateStatus(id, "approved")
    const updatedData = umkmStorage.getAll()
    setUmkmList(updatedData)
    setSelectedUMKM(null)
  }

  // Update fungsi handleReject untuk menggunakan localStorage
  const handleReject = (id: string) => {
    umkmStorage.updateStatus(id, "rejected")
    const updatedData = umkmStorage.getAll()
    setUmkmList(updatedData)
    setSelectedUMKM(null)
  }

  // Fungsi untuk menghapus UMKM
  const handleDelete = (id: string) => {
    umkmStorage.delete(id)
    const updatedData = umkmStorage.getAll()
    setUmkmList(updatedData)
    setSelectedUMKM(null)
    setDeleteAlert(null)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="text-yellow-600 border-yellow-600">
            Menunggu Review
          </Badge>
        )
      case "approved":
        return (
          <Badge variant="outline" className="text-green-600 border-green-600">
            Disetujui
          </Badge>
        )
      case "rejected":
        return (
          <Badge variant="outline" className="text-red-600 border-red-600">
            Ditolak
          </Badge>
        )
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const filteredUMKM = umkmList.filter((umkm) => {
    const matchesSearch =
      umkm.namaUsaha.toLowerCase().includes(searchTerm.toLowerCase()) ||
      umkm.namaOwner.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || umkm.status === statusFilter
    return matchesSearch && matchesStatus
  })

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
            <h1 className="text-xl font-semibold text-gray-900">Kelola UMKM</h1>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Delete Alert */}
        {deleteAlert && (
          <Alert className="mb-8 border-red-200 bg-red-50">
            <AlertDescription className="text-red-800">
              <div className="flex items-center justify-between">
                <span>Yakin ingin menghapus UMKM ini? Tindakan ini tidak dapat dibatalkan.</span>
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
                  placeholder="Cari UMKM atau nama pemilik..."
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
                  <SelectItem value="pending">Menunggu Review</SelectItem>
                  <SelectItem value="approved">Disetujui</SelectItem>
                  <SelectItem value="rejected">Ditolak</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* UMKM List */}
          <div className="lg:col-span-2">
            <div className="space-y-4">
              {filteredUMKM.map((umkm) => (
                <Card key={umkm.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">{umkm.namaUsaha}</h3>
                        <p className="text-sm text-gray-600 mb-2">Pemilik: {umkm.namaOwner}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-500 mb-2">
                          <span className="flex items-center">
                            <MapPin className="h-4 w-4 mr-1" />
                            {umkm.alamat}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 line-clamp-2">{umkm.deskripsi}</p>
                      </div>
                      <div className="ml-4 text-right">
                        {getStatusBadge(umkm.status)}
                        <p className="text-xs text-gray-500 mt-2">
                          Daftar: {new Date(umkm.tanggalDaftar).toLocaleDateString("id-ID")}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {umkm.kategori}
                        </Badge>
                        <span className="text-sm text-gray-500">
                          Rp {umkm.hargaMin.toLocaleString()} - {umkm.hargaMax.toLocaleString()}
                        </span>
                      </div>

                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => setSelectedUMKM(umkm)}>
                          <Eye className="h-4 w-4 mr-1" />
                          Detail
                        </Button>
                        {umkm.status === "pending" && (
                          <>
                            <Button
                              size="sm"
                              onClick={() => handleApprove(umkm.id)}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <Check className="h-4 w-4 mr-1" />
                              Setujui
                            </Button>
                            <Button size="sm" variant="destructive" onClick={() => handleReject(umkm.id)}>
                              <X className="h-4 w-4 mr-1" />
                              Tolak
                            </Button>
                          </>
                        )}
                        <Button size="sm" variant="destructive" onClick={() => setDeleteAlert(umkm.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {filteredUMKM.length === 0 && (
                <Card>
                  <CardContent className="p-8 text-center">
                    <p className="text-gray-500">Tidak ada UMKM yang ditemukan</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Detail Panel */}
          <div>
            {selectedUMKM ? (
              <Card className="sticky top-4">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    Detail UMKM
                    <Button variant="ghost" size="sm" onClick={() => setSelectedUMKM(null)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-lg">{selectedUMKM.namaUsaha}</h4>
                    {getStatusBadge(selectedUMKM.status)}
                  </div>

                  <div className="space-y-3">
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Pemilik</Label>
                      <p className="text-sm">{selectedUMKM.namaOwner}</p>
                    </div>

                    <div>
                      <Label className="text-sm font-medium text-gray-700">Kategori</Label>
                      <p className="text-sm capitalize">{selectedUMKM.kategori}</p>
                    </div>

                    <div>
                      <Label className="text-sm font-medium text-gray-700">Deskripsi</Label>
                      <p className="text-sm">{selectedUMKM.deskripsi}</p>
                    </div>

                    <div>
                      <Label className="text-sm font-medium text-gray-700">Produk Utama</Label>
                      <p className="text-sm">{selectedUMKM.produkUtama}</p>
                    </div>

                    <div>
                      <Label className="text-sm font-medium text-gray-700">Alamat</Label>
                      <p className="text-sm">{selectedUMKM.alamat}</p>
                    </div>

                    <div>
                      <Label className="text-sm font-medium text-gray-700">Kontak</Label>
                      <div className="space-y-1">
                        <p className="text-sm flex items-center">
                          <Phone className="h-4 w-4 mr-2" />
                          {selectedUMKM.telepon}
                        </p>
                        <p className="text-sm flex items-center">
                          <Mail className="h-4 w-4 mr-2" />
                          {selectedUMKM.email}
                        </p>
                      </div>
                    </div>

                    <div>
                      <Label className="text-sm font-medium text-gray-700">Range Harga</Label>
                      <p className="text-sm">
                        Rp {selectedUMKM.hargaMin.toLocaleString()} - {selectedUMKM.hargaMax.toLocaleString()}
                      </p>
                    </div>

                    <div>
                      <Label className="text-sm font-medium text-gray-700">Tanggal Daftar</Label>
                      <p className="text-sm">{new Date(selectedUMKM.tanggalDaftar).toLocaleDateString("id-ID")}</p>
                    </div>
                  </div>

                  {selectedUMKM.status === "pending" && (
                    <div className="flex gap-2 pt-4">
                      <Button
                        size="sm"
                        onClick={() => handleApprove(selectedUMKM.id)}
                        className="flex-1 bg-green-600 hover:bg-green-700"
                      >
                        <Check className="h-4 w-4 mr-1" />
                        Setujui
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleReject(selectedUMKM.id)}
                        className="flex-1"
                      >
                        <X className="h-4 w-4 mr-1" />
                        Tolak
                      </Button>
                    </div>
                  )}

                  <div className="pt-4 border-t">
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => setDeleteAlert(selectedUMKM.id)}
                      className="w-full"
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Hapus UMKM
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <Eye className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Pilih UMKM untuk melihat detail</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Statistics */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-blue-600">{umkmList.length}</div>
              <div className="text-sm text-gray-600">Total UMKM</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {umkmList.filter((u) => u.status === "pending").length}
              </div>
              <div className="text-sm text-gray-600">Menunggu Review</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-green-600">
                {umkmList.filter((u) => u.status === "approved").length}
              </div>
              <div className="text-sm text-gray-600">Disetujui</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-red-600">
                {umkmList.filter((u) => u.status === "rejected").length}
              </div>
              <div className="text-sm text-gray-600">Ditolak</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
