import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import VisitorTracker from "@/components/visitor-tracker"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Desa Karangampel - Portal UMKM dan Informasi Desa",
  description: "Website Desa Karangampel yang menyediakan informasi lengkap tentang desa dan promosi UMKM lokal",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id">
      <body className={inter.className}>
        <VisitorTracker />
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
