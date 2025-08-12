"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Copy, ImageIcon, Upload } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export function ImageTemplateGuide() {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    alert("Kode berhasil disalin!")
  }

  const imageSpecs = [
    {
      location: "Logo Desa",
      size: "200x200px",
      format: "PNG dengan background transparan",
      usage: "Header website, dokumen resmi",
      path: "/images/logo-desa.png",
    },
    {
      location: "Hero Banner",
      size: "1200x600px",
      format: "JPG/PNG",
      usage: "Gambar utama halaman beranda",
      path: "/images/hero-banner.jpg",
    },
    {
      location: "Foto UMKM",
      size: "400x300px",
      format: "JPG/PNG",
      usage: "Produk dan tempat usaha UMKM",
      path: "Upload via form pendaftaran",
    },
    {
      location: "Berita/Artikel",
      size: "800x400px",
      format: "JPG/PNG",
      usage: "Gambar pendukung berita",
      path: "Upload via form admin",
    },
    {
      location: "Galeri Desa",
      size: "600x400px",
      format: "JPG/PNG",
      usage: "Dokumentasi kegiatan desa",
      path: "/images/gallery/",
    },
  ]

  const codeExamples = [
    {
      title: "Menambah Logo di Header",
      code: `// Di components/navbar.tsx
<Image 
  src="/images/logo-desa.png" 
  alt="Logo Desa Makmur" 
  width={40} 
  height={40} 
  className="rounded-full"
/>`,
    },
    {
      title: "Hero Image dengan Overlay",
      code: `// Di app/page.tsx
<div className="relative h-[500px]">
  <Image 
    src="/images/hero-banner.jpg" 
    alt="Desa Makmur" 
    fill 
    className="object-cover" 
  />
  <div className="absolute inset-0 bg-black/40" />
  <div className="relative z-10 text-white">
    {/* Konten hero */}
  </div>
</div>`,
    },
    {
      title: "Galeri Grid Layout",
      code: `// Untuk halaman galeri
<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
  {images.map((img, index) => (
    <div key={index} className="relative h-48">
      <Image 
        src={img.src || "/placeholder.svg"} 
        alt={img.alt} 
        fill 
        className="object-cover rounded-lg" 
      />
    </div>
  ))}
</div>`,
    },
    {
      title: "Placeholder dengan Query",
      code: `// Untuk gambar placeholder
<Image 
  src="/placeholder.svg?height=300&width=400" 
  alt="Placeholder" 
  width={400} 
  height={300} 
  className="object-cover"
/>`,
    },
  ]

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <ImageIcon className="h-5 w-5 mr-2" />
            Template Gambar & Logo Website Desa
          </CardTitle>
          <CardDescription>
            Panduan lengkap untuk menambahkan dan mengelola gambar di website profil desa
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Spesifikasi Gambar */}
      <Card>
        <CardHeader>
          <CardTitle>📐 Spesifikasi Gambar yang Direkomendasikan</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {imageSpecs.map((spec, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold">{spec.location}</h4>
                  <Badge variant="outline">{spec.size}</Badge>
                </div>
                <p className="text-sm text-gray-600 mb-1">Format: {spec.format}</p>
                <p className="text-sm text-gray-600 mb-2">Penggunaan: {spec.usage}</p>
                <code className="text-xs bg-gray-100 px-2 py-1 rounded">{spec.path}</code>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Cara Upload Gambar */}
      <Card>
        <CardHeader>
          <CardTitle>📤 Cara Upload Gambar</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <Upload className="h-4 w-4" />
            <AlertDescription>
              <strong>Untuk UMKM & Berita:</strong> Gunakan form upload yang tersedia di halaman pendaftaran UMKM dan
              pembuatan berita admin.
            </AlertDescription>
          </Alert>

          <div className="space-y-3">
            <h4 className="font-semibold">Untuk Logo & Gambar Statis:</h4>
            <ol className="list-decimal list-inside space-y-2 text-sm">
              <li>Siapkan gambar sesuai spesifikasi di atas</li>
              <li>
                Buat folder <code className="bg-gray-100 px-1 rounded">public/images/</code> di project
              </li>
              <li>Upload gambar ke folder tersebut</li>
              <li>
                Gunakan path <code className="bg-gray-100 px-1 rounded">/images/nama-file.jpg</code> di kode
              </li>
              <li>Restart development server jika diperlukan</li>
            </ol>
          </div>
        </CardContent>
      </Card>

      {/* Contoh Kode */}
      <Card>
        <CardHeader>
          <CardTitle>💻 Contoh Kode Implementasi</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {codeExamples.map((example, index) => (
            <div key={index} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold">{example.title}</h4>
                <Button variant="outline" size="sm" onClick={() => copyToClipboard(example.code)}>
                  <Copy className="h-4 w-4 mr-1" />
                  Salin
                </Button>
              </div>
              <pre className="bg-gray-100 p-3 rounded text-sm overflow-x-auto">
                <code>{example.code}</code>
              </pre>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Tips Optimasi */}
      <Card>
        <CardHeader>
          <CardTitle>⚡ Tips Optimasi Gambar</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-3">✅ Yang Harus Dilakukan:</h4>
              <ul className="space-y-2 text-sm">
                <li>Kompres gambar sebelum upload (gunakan TinyPNG)</li>
                <li>Gunakan format WebP untuk gambar modern</li>
                <li>Beri nama file yang deskriptif</li>
                <li>Tambahkan alt text yang bermakna</li>
                <li>Gunakan lazy loading untuk performa</li>
                <li>Konsisten dengan aspect ratio</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">❌ Yang Harus Dihindari:</h4>
              <ul className="space-y-2 text-sm">
                <li>Upload gambar berukuran terlalu besar &gt;2MB</li>
                <li>Menggunakan gambar blur atau berkualitas rendah</li>
                <li>Nama file dengan spasi atau karakter khusus</li>
                <li>Menggunakan gambar tanpa hak cipta</li>
                <li>Lupa menambahkan alt text</li>
                <li>Aspect ratio yang tidak konsisten</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Struktur Folder */}
      <Card>
        <CardHeader>
          <CardTitle>📁 Struktur Folder yang Direkomendasikan</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="bg-gray-100 p-4 rounded text-sm">
            {`public/
├── images/
│   ├── logo-desa.png          # Logo utama desa
│   ├── hero-banner.jpg        # Banner halaman utama
│   ├── about/
│   │   ├── sejarah-desa.jpg   # Foto sejarah
│   │   └── peta-desa.png      # Peta wilayah
│   ├── gallery/
│   │   ├── kegiatan-1.jpg     # Dokumentasi kegiatan
│   │   ├── kegiatan-2.jpg
│   │   └── fasilitas/
│   │       ├── balai-desa.jpg
│   │       └── posyandu.jpg
│   └── icons/
│       ├── favicon.ico
│       └── apple-touch-icon.png`}
          </pre>
        </CardContent>
      </Card>

      {/* Tools Rekomendasi */}
      <Card>
        <CardHeader>
          <CardTitle>🛠️ Tools yang Direkomendasikan</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <h4 className="font-semibold mb-2">Kompres Gambar</h4>
              <p className="text-sm text-gray-600 mb-3">Kurangi ukuran file tanpa mengurangi kualitas</p>
              <Button variant="outline" size="sm" asChild>
                <a href="https://tinypng.com" target="_blank" rel="noopener noreferrer">
                  TinyPNG
                </a>
              </Button>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <h4 className="font-semibold mb-2">Edit Gambar</h4>
              <p className="text-sm text-gray-600 mb-3">Resize dan edit gambar online</p>
              <Button variant="outline" size="sm" asChild>
                <a href="https://canva.com" target="_blank" rel="noopener noreferrer">
                  Canva
                </a>
              </Button>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <h4 className="font-semibold mb-2">Gambar Gratis</h4>
              <p className="text-sm text-gray-600 mb-3">Download gambar bebas hak cipta</p>
              <Button variant="outline" size="sm" asChild>
                <a href="https://unsplash.com" target="_blank" rel="noopener noreferrer">
                  Unsplash
                </a>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
