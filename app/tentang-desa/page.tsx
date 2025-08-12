import Image from "next/image"
import { MapPin, Users, Award } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function TentangDesaPage() {
  return (
    <div className="min-h-screen">
      {/* Header Section */}
      <section className="relative h-[400px] flex items-center justify-center bg-gradient-to-r from-green-600 to-blue-600">
        <div className="absolute inset-0 bg-black/40" />
        {/* CATATAN: Ganti dengan foto pemandangan desa Anda */}
        <Image src="/tentangdesa.jpg?height=400&width=1200" alt="Pemandangan Desa" fill className="object-cover" />
        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Tentang Desa Makmur</h1>
          <p className="text-xl">Mengenal lebih dekat sejarah, budaya, dan potensi desa kami</p>
        </div>
      </section>

      {/* Sejarah Desa */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Sejarah Desa</h2>
              {/* CATATAN: Ganti dengan sejarah desa Anda */}
              <div className="space-y-4 text-gray-600">
                <p>
                  Desa Makmur didirikan pada tahun 1945 oleh para pendiri yang memiliki visi untuk menciptakan komunitas
                  yang sejahtera dan harmonis. Nama "Makmur" dipilih sebagai harapan agar desa ini selalu berkembang dan
                  penduduknya hidup dalam kemakmuran.
                </p>
                <p>
                  Sejak awal berdirinya, desa ini dikenal sebagai penghasil produk pertanian berkualitas tinggi. Seiring
                  berjalannya waktu, masyarakat mulai mengembangkan berbagai usaha kecil dan menengah yang kini menjadi
                  tulang punggung ekonomi desa.
                </p>
                <p>
                  Pada tahun 2010, Desa Makmur mulai fokus pada pengembangan UMKM dan pariwisata berbasis komunitas,
                  yang berhasil meningkatkan kesejahteraan masyarakat secara signifikan.
                </p>
              </div>
            </div>
            <div className="relative h-[400px] rounded-lg overflow-hidden">
              {/* CATATAN: Ganti dengan foto sejarah atau landmark desa Anda */}
              <Image src="/placeholder.svg?height=400&width=600" alt="Sejarah Desa" fill className="object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* Visi Misi */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Visi & Misi</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="text-2xl text-blue-600">Visi</CardTitle>
              </CardHeader>
              <CardContent>
                {/* CATATAN: Ganti dengan visi desa Anda */}
                <p className="text-gray-600 text-lg leading-relaxed">
                  "Menjadi desa mandiri, sejahtera, dan berkelanjutan yang berbasis pada pemberdayaan masyarakat dan
                  pengembangan ekonomi lokal melalui UMKM yang inovatif."
                </p>
              </CardContent>
            </Card>

            <Card className="h-full">
              <CardHeader>
                <CardTitle className="text-2xl text-green-600">Misi</CardTitle>
              </CardHeader>
              <CardContent>
                {/* CATATAN: Ganti dengan misi desa Anda */}
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-green-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    Memberdayakan masyarakat melalui pengembangan UMKM yang berkelanjutan
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-green-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    Meningkatkan kualitas sumber daya manusia melalui pendidikan dan pelatihan
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-green-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    Melestarikan budaya lokal dan lingkungan hidup
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-green-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    Membangun infrastruktur yang mendukung pertumbuhan ekonomi
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Demografi */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Data Demografi</h2>
            <p className="text-xl text-gray-600">Informasi kependudukan Desa Makmur</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* CATATAN: Sesuaikan data demografi dengan data desa Anda */}
            <Card className="text-center">
              <CardHeader>
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle className="text-3xl font-bold">2,500</CardTitle>
                <CardDescription>Total Penduduk</CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-green-600" />
                </div>
                <CardTitle className="text-3xl font-bold">650</CardTitle>
                <CardDescription>Kepala Keluarga</CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="bg-yellow-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="h-8 w-8 text-yellow-600" />
                </div>
                <CardTitle className="text-3xl font-bold">15</CardTitle>
                <CardDescription>Dusun</CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="h-8 w-8 text-purple-600" />
                </div>
                <CardTitle className="text-3xl font-bold">45</CardTitle>
                <CardDescription>UMKM Aktif</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Struktur Pemerintahan */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Struktur Pemerintahan Desa</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* CATATAN: Ganti dengan data pejabat desa Anda */}
            <Card className="text-center">
              <CardHeader>
                <div className="relative w-24 h-24 mx-auto mb-4">
                  {/* CATATAN: Ganti dengan foto kepala desa */}
                  <Image
                    src="/placeholder.svg?height=96&width=96"
                    alt="Kepala Desa"
                    fill
                    className="object-cover rounded-full"
                  />
                </div>
                <CardTitle>Bapak Suharto</CardTitle>
                <CardDescription>Kepala Desa</CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="relative w-24 h-24 mx-auto mb-4">
                  {/* CATATAN: Ganti dengan foto sekretaris desa */}
                  <Image
                    src="/placeholder.svg?height=96&width=96"
                    alt="Sekretaris Desa"
                    fill
                    className="object-cover rounded-full"
                  />
                </div>
                <CardTitle>Ibu Siti Aminah</CardTitle>
                <CardDescription>Sekretaris Desa</CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="relative w-24 h-24 mx-auto mb-4">
                  {/* CATATAN: Ganti dengan foto bendahara desa */}
                  <Image
                    src="/placeholder.svg?height=96&width=96"
                    alt="Bendahara Desa"
                    fill
                    className="object-cover rounded-full"
                  />
                </div>
                <CardTitle>Bapak Ahmad Yani</CardTitle>
                <CardDescription>Bendahara Desa</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}
