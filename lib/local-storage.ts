// CATATAN: Sistem penyimpanan lokal untuk data UMKM dan berita
// Data akan tersimpan di browser dan muncul langsung di website

export interface UMKM {
  id: string
  namaUsaha: string
  kategori: string
  deskripsi: string
  alamat: string
  telepon: string
  email: string
  website?: string
  jamOperasional?: string
  hargaMin: number
  hargaMax: number
  produkUtama: string
  namaOwner: string
  nikOwner: string
  status: "pending" | "approved" | "rejected"
  tanggalDaftar: string
  fotoUrl?: string
  fotoTempatUrl?: string
}

export interface Berita {
  id: string
  judul: string
  kategori: string
  ringkasan: string
  konten: string
  penulis: string
  tanggal: string
  status: "draft" | "published" | "scheduled"
  gambarUrl?: string
  slug: string
}

export interface Review {
  id: string
  umkmId: string
  nama: string
  rating: number
  komentar: string
  tanggal: string
}

export interface VisitorStats {
  totalVisitors: number
  monthlyVisitors: number
  dailyVisitors: number
  lastVisit: string
  visitHistory: { date: string; count: number }[]
}

const generateUniqueId = (prefix: string): string => {
  const timestamp = Date.now()
  const randomPart1 = Math.random().toString(36).substring(2, 9)
  const randomPart2 = Math.random().toString(36).substring(2, 6)
  const randomPart3 = Math.random().toString(36).substring(2, 4)
  return `${prefix}_${timestamp}_${randomPart1}_${randomPart2}_${randomPart3}`
}

// CATATAN: Fungsi untuk mengelola data UMKM
export const umkmStorage = {
  // Ambil semua data UMKM
  getAll: (): UMKM[] => {
    if (typeof window === "undefined") return []
    const data = localStorage.getItem("umkm-data")
    return data ? JSON.parse(data) : []
  },

  // Simpan UMKM baru
  add: (umkm: Omit<UMKM, "id" | "tanggalDaftar" | "status">): UMKM => {
    const newUMKM: UMKM = {
      ...umkm,
      id: generateUniqueId("umkm"), // Using enhanced unique ID generation
      tanggalDaftar: new Date().toISOString().split("T")[0],
      status: "pending",
    }

    const existing = umkmStorage.getAll()
    const updated = [...existing, newUMKM]
    localStorage.setItem("umkm-data", JSON.stringify(updated))
    return newUMKM
  },

  // Update status UMKM (untuk admin)
  updateStatus: (id: string, status: "approved" | "rejected"): void => {
    const existing = umkmStorage.getAll()
    const updated = existing.map((umkm) => (umkm.id === id ? { ...umkm, status } : umkm))
    localStorage.setItem("umkm-data", JSON.stringify(updated))
  },

  // Hapus UMKM
  delete: (id: string): void => {
    const existing = umkmStorage.getAll()
    const updated = existing.filter((umkm) => umkm.id !== id)
    localStorage.setItem("umkm-data", JSON.stringify(updated))
  },

  // Ambil UMKM berdasarkan ID
  getById: (id: string): UMKM | null => {
    const umkmList = umkmStorage.getAll()
    return umkmList.find((umkm) => umkm.id === id) || null
  },

  // Ambil UMKM yang sudah disetujui (untuk ditampilkan di website)
  getApproved: (): UMKM[] => {
    return umkmStorage.getAll().filter((umkm) => umkm.status === "approved")
  },
}

// CATATAN: Fungsi untuk mengelola data berita
export const beritaStorage = {
  // Ambil semua data berita
  getAll: (): Berita[] => {
    if (typeof window === "undefined") return []
    const data = localStorage.getItem("berita-data")
    return data ? JSON.parse(data) : []
  },

  // Simpan berita baru
  add: (berita: Omit<Berita, "id" | "slug">): Berita => {
    const baseSlug = berita.judul
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")

    const newBerita: Berita = {
      ...berita,
      id: generateUniqueId("berita"), // Using enhanced unique ID generation
      slug: `${baseSlug}-${Date.now()}-${Math.random().toString(36).substring(2, 8)}-${Math.random().toString(36).substring(2, 4)}`, // Enhanced unique slug generation
    }

    const existing = beritaStorage.getAll()
    const updated = [...existing, newBerita]
    localStorage.setItem("berita-data", JSON.stringify(updated))
    return newBerita
  },

  // Hapus berita
  delete: (id: string): void => {
    const existing = beritaStorage.getAll()
    const updated = existing.filter((berita) => berita.id !== id)
    localStorage.setItem("berita-data", JSON.stringify(updated))
  },

  // Update berita
  update: (id: string, updatedBerita: Partial<Berita>): void => {
    const existing = beritaStorage.getAll()
    const updated = existing.map((berita) => (berita.id === id ? { ...berita, ...updatedBerita } : berita))
    localStorage.setItem("berita-data", JSON.stringify(updated))
  },

  // Ambil berita berdasarkan ID
  getById: (id: string): Berita | null => {
    const beritaList = beritaStorage.getAll()
    return beritaList.find((berita) => berita.id === id) || null
  },

  // Ambil berita yang sudah dipublikasi
  getPublished: (): Berita[] => {
    return beritaStorage
      .getAll()
      .filter((berita) => berita.status === "published")
      .sort((a, b) => new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime())
  },

  // Ambil berita berdasarkan slug
  getBySlug: (slug: string): Berita | null => {
    const berita = beritaStorage.getAll().find((b) => b.slug === slug)
    return berita || null
  },
}

// CATATAN: Fungsi untuk mengelola upload gambar
export const imageStorage = {
  // Simpan gambar ke localStorage sebagai base64
  saveImage: (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => {
        try {
          const base64 = reader.result as string
          const imageId = generateUniqueId("img")

          // Simpan ke localStorage dengan metadata lengkap
          const existingImages = JSON.parse(localStorage.getItem("uploaded-images") || "{}")
          existingImages[imageId] = {
            id: imageId,
            name: file.name,
            data: base64,
            size: file.size,
            type: file.type,
            uploadedAt: new Date().toISOString(),
          }
          localStorage.setItem("uploaded-images", JSON.stringify(existingImages))

          console.log(`✅ Gambar berhasil diupload: ${file.name} (${(file.size / 1024).toFixed(1)} KB)`)
          resolve(base64) // Return base64 directly for immediate use
        } catch (error) {
          console.error(`❌ Gagal menyimpan gambar: ${file.name}`, error)
          reject(error)
        }
      }
      reader.onerror = () => {
        console.error(`❌ Gagal membaca file: ${file.name}`)
        reject(new Error("Gagal membaca file"))
      }
      reader.readAsDataURL(file)
    })
  },

  // Ambil gambar berdasarkan ID
  getImage: (imageId: string): string | null => {
    if (typeof window === "undefined") return null
    try {
      const images = JSON.parse(localStorage.getItem("uploaded-images") || "{}")
      return images[imageId]?.data || null
    } catch (error) {
      console.error("Error retrieving image:", error)
      return null
    }
  },

  // Ambil semua gambar yang tersimpan
  getAllImages: () => {
    if (typeof window === "undefined") return {}
    try {
      return JSON.parse(localStorage.getItem("uploaded-images") || "{}")
    } catch (error) {
      console.error("Error retrieving all images:", error)
      return {}
    }
  },

  // Hapus gambar berdasarkan ID
  deleteImage: (imageId: string): boolean => {
    if (typeof window === "undefined") return false
    try {
      const images = JSON.parse(localStorage.getItem("uploaded-images") || "{}")
      if (images[imageId]) {
        delete images[imageId]
        localStorage.setItem("uploaded-images", JSON.stringify(images))
        console.log(`✅ Gambar berhasil dihapus: ${imageId}`)
        return true
      }
      return false
    } catch (error) {
      console.error("Error deleting image:", error)
      return false
    }
  },
}

// CATATAN: Fungsi untuk mengelola ulasan
export const reviewStorage = {
  // Ambil semua ulasan
  getAll: (): Review[] => {
    if (typeof window === "undefined") return []
    const data = localStorage.getItem("review-data")
    return data ? JSON.parse(data) : []
  },

  // Simpan ulasan baru
  add: (review: Omit<Review, "id" | "tanggal">): Review => {
    const newReview: Review = {
      ...review,
      id: generateUniqueId("review"),
      tanggal: new Date().toISOString(),
    }

    const existing = reviewStorage.getAll()
    const updated = [...existing, newReview]
    localStorage.setItem("review-data", JSON.stringify(updated))
    return newReview
  },

  // Ambil ulasan berdasarkan UMKM ID
  getByUmkmId: (umkmId: string): Review[] => {
    return reviewStorage.getAll().filter((review) => review.umkmId === umkmId)
  },

  // Hitung rata-rata rating untuk UMKM
  getAverageRating: (umkmId: string): { average: number; count: number } => {
    const reviews = reviewStorage.getByUmkmId(umkmId)
    if (reviews.length === 0) return { average: 0, count: 0 }

    const total = reviews.reduce((sum, review) => sum + review.rating, 0)
    return {
      average: Math.round((total / reviews.length) * 10) / 10, // Round to 1 decimal
      count: reviews.length,
    }
  },

  // Hapus ulasan
  delete: (id: string): void => {
    const existing = reviewStorage.getAll()
    const updated = existing.filter((review) => review.id !== id)
    localStorage.setItem("review-data", JSON.stringify(updated))
  },
}

// CATATAN: Fungsi untuk mengelola statistik pengunjung
export const visitorStorage = {
  // Track visitor
  trackVisitor: (): void => {
    if (typeof window === "undefined") return

    const today = new Date().toISOString().split("T")[0]
    const currentMonth = new Date().toISOString().substring(0, 7)

    const stats = visitorStorage.getStats()

    // Update total visitors
    stats.totalVisitors += 1

    // Update daily visitors
    const todayVisit = stats.visitHistory.find((v) => v.date === today)
    if (todayVisit) {
      todayVisit.count += 1
    } else {
      stats.visitHistory.push({ date: today, count: 1 })
    }

    // Calculate monthly visitors (current month)
    stats.monthlyVisitors = stats.visitHistory
      .filter((v) => v.date.startsWith(currentMonth))
      .reduce((sum, v) => sum + v.count, 0)

    // Calculate daily visitors (today)
    stats.dailyVisitors = todayVisit ? todayVisit.count : 1

    stats.lastVisit = new Date().toISOString()

    // Keep only last 90 days of history
    const ninetyDaysAgo = new Date()
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90)
    stats.visitHistory = stats.visitHistory.filter((v) => new Date(v.date) >= ninetyDaysAgo)

    localStorage.setItem("visitor-stats", JSON.stringify(stats))
  },

  // Get visitor statistics
  getStats: (): VisitorStats => {
    if (typeof window === "undefined")
      return {
        totalVisitors: 0,
        monthlyVisitors: 0,
        dailyVisitors: 0,
        lastVisit: new Date().toISOString(),
        visitHistory: [],
      }

    const data = localStorage.getItem("visitor-stats")
    if (!data) {
      const initialStats: VisitorStats = {
        totalVisitors: 0,
        monthlyVisitors: 0,
        dailyVisitors: 0,
        lastVisit: new Date().toISOString(),
        visitHistory: [],
      }
      localStorage.setItem("visitor-stats", JSON.stringify(initialStats))
      return initialStats
    }

    return JSON.parse(data)
  },
}

// CATATAN: Fungsi untuk mendapatkan statistik dashboard
export const dashboardStats = {
  // Get all statistics for admin dashboard
  getAllStats: () => {
    const umkmList = umkmStorage.getAll()
    const beritaList = beritaStorage.getAll()
    const reviewList = reviewStorage.getAll()
    const visitorStats = visitorStorage.getStats()

    return {
      totalUMKM: umkmList.length,
      approvedUMKM: umkmList.filter((u) => u.status === "approved").length,
      pendingUMKM: umkmList.filter((u) => u.status === "pending").length,
      rejectedUMKM: umkmList.filter((u) => u.status === "rejected").length,

      totalBerita: beritaList.length,
      publishedBerita: beritaList.filter((b) => b.status === "published").length,
      draftBerita: beritaList.filter((b) => b.status === "draft").length,
      scheduledBerita: beritaList.filter((b) => b.status === "scheduled").length,

      totalReviews: reviewList.length,
      pendingReviews: 0, // All reviews are auto-approved in this system

      totalVisitors: visitorStats.totalVisitors,
      monthlyVisitors: visitorStats.monthlyVisitors,
      dailyVisitors: visitorStats.dailyVisitors,
      lastVisit: visitorStats.lastVisit,
    }
  },

  // Get recent activities
  getRecentActivities: () => {
    const umkmList = umkmStorage.getAll()
    const beritaList = beritaStorage.getAll()
    const reviewList = reviewStorage.getAll()

    const activities = []

    // Recent UMKM registrations
    const recentUMKM = umkmList
      .filter((u) => u.status === "pending")
      .sort((a, b) => new Date(b.tanggalDaftar).getTime() - new Date(a.tanggalDaftar).getTime())
      .slice(0, 3)

    recentUMKM.forEach((umkm) => {
      activities.push({
        type: "umkm",
        message: `UMKM baru terdaftar: "${umkm.namaUsaha}"`,
        time: umkm.tanggalDaftar,
        icon: "Users",
      })
    })

    // Recent published news
    const recentBerita = beritaList
      .filter((b) => b.status === "published")
      .sort((a, b) => new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime())
      .slice(0, 3)

    recentBerita.forEach((berita) => {
      activities.push({
        type: "berita",
        message: `Berita dipublikasi: "${berita.judul}"`,
        time: berita.tanggal,
        icon: "FileText",
      })
    })

    // Recent reviews
    const recentReviews = reviewList
      .sort((a, b) => new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime())
      .slice(0, 2)

    recentReviews.forEach((review) => {
      const umkm = umkmStorage.getById(review.umkmId)
      if (umkm) {
        activities.push({
          type: "review",
          message: `Ulasan baru untuk "${umkm.namaUsaha}" (${review.rating} bintang)`,
          time: review.tanggal,
          icon: "Settings",
        })
      }
    })

    // Sort by time and return latest 5
    return activities.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()).slice(0, 5)
  },
}

// CATATAN: Fungsi untuk inisialisasi data demo (opsional)
export const initializeDemoData = () => {
  // Cek apakah sudah ada data
  if (umkmStorage.getAll().length === 0) {
    // Tambah data demo UMKM
    const demoUMKM = [
      {
        namaUsaha: "Kerajinan Bambu Berkah",
        kategori: "kerajinan",
        deskripsi:
          "Memproduksi berbagai kerajinan bambu seperti tas, tempat pensil, dan dekorasi rumah dengan kualitas tinggi.",
        alamat: "Dusun Makmur 1, RT 02/RW 01",
        telepon: "0812-3456-7890",
        email: "bambuberkah@email.com",
        hargaMin: 15000,
        hargaMax: 150000,
        produkUtama: "Tas bambu, tempat pensil, hiasan dinding",
        namaOwner: "Ibu Sari Wulandari",
        nikOwner: "1234567890123456",
      },
      {
        namaUsaha: "Camilan Nusantara",
        kategori: "makanan",
        deskripsi: "Memproduksi keripik singkong, emping, dan berbagai camilan tradisional dengan cita rasa autentik.",
        alamat: "Dusun Sejahtera 2, RT 03/RW 02",
        telepon: "0813-4567-8901",
        email: "camilan@email.com",
        hargaMin: 8000,
        hargaMax: 25000,
        produkUtama: "Keripik singkong, emping, kue tradisional",
        namaOwner: "Bapak Ahmad Santoso",
        nikOwner: "1234567890123457",
      },
      {
        namaUsaha: "Sayur Organik Segar",
        kategori: "pertanian",
        deskripsi: "Menyediakan sayuran organik segar tanpa pestisid langsung dari kebun untuk kesehatan keluarga.",
        alamat: "Dusun Hijau 3, RT 01/RW 03",
        telepon: "0814-5678-9012",
        email: "organik@email.com",
        hargaMin: 5000,
        hargaMax: 20000,
        produkUtama: "Sayur kangkung, bayam, tomat, cabai",
        namaOwner: "Ibu Dewi Sartika",
        nikOwner: "1234567890123458",
      },
    ]

    // Tambahkan dan setujui data demo
    demoUMKM.forEach((data) => {
      const umkm = umkmStorage.add(data)
      umkmStorage.updateStatus(umkm.id, "approved")
    })
  }

  // Tambah data demo berita jika belum ada
  if (beritaStorage.getAll().length === 0) {
    const demoBerita = [
      {
        judul: "Festival Budaya Desa Makmur 2024 Sukses Digelar",
        kategori: "acara",
        ringkasan:
          "Festival tahunan yang menampilkan berbagai kesenian tradisional, pameran produk UMKM, dan kuliner khas desa berhasil menarik ribuan pengunjung dari berbagai daerah.",
        konten:
          "Festival Budaya Desa Makmur 2024 telah sukses digelar pada tanggal 15 Desember 2024 di Lapangan Desa Makmur. Acara yang berlangsung selama tiga hari ini menampilkan berbagai kesenian tradisional seperti tari-tarian daerah, musik gamelan, dan pertunjukan wayang kulit.\n\nSelain pertunjukan seni, festival ini juga menghadirkan pameran produk UMKM lokal yang memamerkan berbagai kerajinan tangan, makanan tradisional, dan produk pertanian organik. Para pengunjung dapat langsung membeli produk-produk berkualitas dari masyarakat desa.\n\nKepala Desa Makmur, Bapak Suharto, menyampaikan rasa syukur atas kesuksesan acara ini. 'Festival ini tidak hanya sebagai ajang hiburan, tetapi juga sebagai sarana promosi potensi desa dan mempererat silaturahmi antar warga,' ujarnya.\n\nAcara ini berhasil menarik lebih dari 5.000 pengunjung dari berbagai daerah dan diharapkan dapat menjadi agenda tahunan yang semakin berkembang.",
        penulis: "Admin Desa",
        tanggal: "2024-12-15",
        status: "published" as const,
      },
      {
        judul: "Pelatihan Digital Marketing untuk UMKM Sukses Digelar",
        kategori: "pelatihan",
        ringkasan:
          "Sebanyak 30 pelaku UMKM mengikuti pelatihan digital marketing yang diselenggarakan oleh pemerintah desa bekerjasama dengan dinas koperasi kabupaten.",
        konten:
          "Pemerintah Desa Makmur bekerjasama dengan Dinas Koperasi Kabupaten Sejahtera menggelar pelatihan digital marketing untuk pelaku UMKM pada tanggal 10 Desember 2024. Pelatihan yang diikuti oleh 30 peserta ini bertujuan untuk meningkatkan kemampuan pemasaran digital para pelaku usaha lokal.\n\nMateri pelatihan meliputi penggunaan media sosial untuk promosi, pembuatan konten yang menarik, strategi penjualan online, dan pengelolaan toko online. Para peserta juga diajarkan cara menggunakan platform e-commerce dan aplikasi pembayaran digital.\n\nNarasumber pelatihan, Ibu Dr. Siti Nurhaliza dari Universitas Digital Indonesia, menekankan pentingnya adaptasi teknologi dalam dunia usaha. 'Era digital menuntut pelaku UMKM untuk memanfaatkan teknologi agar dapat bersaing dan menjangkau pasar yang lebih luas,' jelasnya.\n\nSalah satu peserta, Ibu Sari pemilik Kerajinan Bambu Berkah, mengaku sangat terbantu dengan pelatihan ini. 'Sekarang saya lebih paham cara mempromosikan produk di Instagram dan Facebook. Penjualan saya meningkat 50% setelah menerapkan ilmu dari pelatihan ini,' ungkapnya.",
        penulis: "Tim Humas Desa",
        tanggal: "2024-12-10",
        status: "published" as const,
      },
    ]

    demoBerita.forEach((data) => {
      beritaStorage.add(data)
    })
  }
}
