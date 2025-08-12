"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo dan Nama Desa */}
          <Link href="/" className="flex items-center space-x-3">
            {/* CATATAN: Ganti dengan logo desa Anda */}
            <Image
              src="/logo.png?height=40&width=40"
              alt="Logo Desa"
              width={40}
              height={40}
              className="rounded-full"
            />
            {/* CATATAN: Ganti dengan nama desa Anda */}
            <span className="text-xl font-bold text-gray-900">Desa Karangampel</span>
          </Link>

          {/* Menu Desktop */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-700 hover:text-blue-600 transition-colors">
              Beranda
            </Link>
            <Link href="/tentang-desa" className="text-gray-700 hover:text-blue-600 transition-colors">
              Tentang Desa
            </Link>
            <Link href="/umkm" className="text-gray-700 hover:text-blue-600 transition-colors">
              UMKM
            </Link>
            <Link href="/berita" className="text-gray-700 hover:text-blue-600 transition-colors">
              Berita
            </Link>
            <Link href="/kontak" className="text-gray-700 hover:text-blue-600 transition-colors">
              Kontak
            </Link>
            {/* CATATAN: Menu baru untuk pendaftaran UMKM dan admin */}
            <Link href="/daftar-umkm" className="text-gray-700 hover:text-blue-600 transition-colors">
              Daftar UMKM
            </Link>
            <Link href="/admin" className="text-gray-700 hover:text-blue-600 transition-colors">
              Admin
            </Link>
          </div>

          {/* Tombol Mobile Menu */}
          <div className="md:hidden">
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Menu Mobile */}
        {isOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="flex flex-col space-y-4">
              <Link
                href="/"
                className="text-gray-700 hover:text-blue-600 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Beranda
              </Link>
              <Link
                href="/tentang-desa"
                className="text-gray-700 hover:text-blue-600 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Tentang Desa
              </Link>
              <Link
                href="/umkm"
                className="text-gray-700 hover:text-blue-600 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                UMKM
              </Link>
              <Link
                href="/berita"
                className="text-gray-700 hover:text-blue-600 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Berita
              </Link>
              <Link
                href="/kontak"
                className="text-gray-700 hover:text-blue-600 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Kontak
              </Link>
              {/* CATATAN: Menu baru untuk pendaftaran UMKM dan admin */}
              <Link
                href="/daftar-umkm"
                className="text-gray-700 hover:text-blue-600 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Daftar UMKM
              </Link>
              <Link
                href="/admin"
                className="text-gray-700 hover:text-blue-600 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Admin
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
