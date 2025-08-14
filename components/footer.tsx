import Link from "next/link"
import Image from "next/image"
import { MapPin, Phone, Mail, Facebook, Instagram, Youtube } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Informasi Desa */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              {/* CATATAN: Ganti dengan logo desa Anda */}
              <Image
                src="/logo.png?height=40&width=40"
                alt="Logo Desa"
                width={40}
                height={40}
                className="rounded-full"
              />
              {/* CATATAN: Ganti dengan nama desa Anda */}
              <span className="text-xl font-bold">Desa Karangampel</span>
            </div>
            {/* CATATAN: Ganti dengan deskripsi desa Anda */}
            <p className="text-gray-300 mb-4 max-w-md">
              Desa Karangampel adalah desa yang berkomitmen untuk mengembangkan ekonomi lokal melalui pemberdayaan UMKM dan
              pelestarian budaya tradisional.
            </p>
            <div className="flex space-x-4">
              {/* CATATAN: Ganti dengan link media sosial desa Anda */}
              <Link href="#" className="text-gray-300 hover:text-white transition-colors">
                <Facebook className="h-6 w-6" />
              </Link>
              <Link href="#" className="text-gray-300 hover:text-white transition-colors">
                <Instagram className="h-6 w-6" />
              </Link>
              <Link href="#" className="text-gray-300 hover:text-white transition-colors">
                <Youtube className="h-6 w-6" />
              </Link>
            </div>
          </div>

          {/* Menu Navigasi */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Menu</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-300 hover:text-white transition-colors">
                  Beranda
                </Link>
              </li>
              <li>
                <Link href="/tentang-desa" className="text-gray-300 hover:text-white transition-colors">
                  Tentang Desa
                </Link>
              </li>
              <li>
                <Link href="/umkm" className="text-gray-300 hover:text-white transition-colors">
                  UMKM
                </Link>
              </li>
              <li>
                <Link href="/berita" className="text-gray-300 hover:text-white transition-colors">
                  Berita
                </Link>
              </li>
              <li>
                <Link href="/kontak" className="text-gray-300 hover:text-white transition-colors">
                  Kontak
                </Link>
              </li>
              {/* CATATAN: Menu baru untuk pendaftaran UMKM */}
              <li>
                <Link href="/daftar-umkm" className="text-gray-300 hover:text-white transition-colors">
                  Daftar UMKM
                </Link>
              </li>
            </ul>
          </div>

          {/* Kontak */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Kontak</h3>
            <div className="space-y-3">
              {/* CATATAN: Ganti dengan alamat desa Anda */}
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-gray-300 mt-1 flex-shrink-0" />
                <span className="text-gray-300 text-sm">
                  Jl. Raya Desa No. 123
                  <br />
                  Kecamatan Makmur
                  <br />
                  Kabupaten Sejahtera 12345
                </span>
              </div>
              {/* CATATAN: Ganti dengan nomor telepon desa Anda */}
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-gray-300" />
                <span className="text-gray-300 text-sm">(021) 1234-5678</span>
              </div>
              {/* CATATAN: Ganti dengan email desa Anda */}
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-gray-300" />
                <span className="text-gray-300 text-sm">info@desamakmur.id</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-300 text-sm">© 2025 Desa Karangampel. Semua hak cipta dilindungi.</p>
        </div>
      </div>
    </footer>
  )
}
