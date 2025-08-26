"use client"

import { useState } from "react"

import type React from "react"
import { useEffect } from "react"
import { Eye, EyeOff, Users, FileText, Settings, BarChart3, ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { supabase } from "@/lib/supabaseClient"

export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(true)
  const [session, setSession] = useState<any>(null)
  const [loginData, setLoginData] = useState({
    username: "",
    password: "",
  })
  const [loginError, setLoginError] = useState("")
  const [stats, setStats] = useState({
    totalUMKM: 0,
    totalBerita: 0,
    pendingUMKM: 0,
    monthlyVisitors: 0,
  })
  const [recentActivities, setRecentActivities] = useState<any[]>([])

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        setSession(session)
      } else {
        setSession(null)
      }
      setLoading(false)
    }

    getSession()

    // Supabase listener kalau session berubah
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (!session) return;

    const fetchStats = async () => {
      try {
        // Hitung Total UMKM
        const { count: totalUMKM } = await supabase
          .from("umkm")
          .select("*", { count: "exact", head: true })
          .eq("status", "approved");

        // Hitung Total Berita
        const { count: totalBerita } = await supabase
          .from("berita")
          .select("*", { count: "exact", head: true });

        // Hitung Pending UMKM
        const { count: pendingUMKM } = await supabase
          .from("umkm")
          .select("*", { count: "exact", head: true })
          .eq("status", "pending");

        // Simpan kunjungan baru
        await supabase.from("visitors").insert({});

        // Hitung pengunjung bulan ini
        const awalBulan = new Date();
        awalBulan.setDate(1);
        awalBulan.setHours(0, 0, 0, 0);

        const { count: monthlyVisitors } = await supabase
          .from("visitors")
          .select("*", { count: "exact", head: true })
          .gte("visited_at", awalBulan.toISOString());

        setStats({
          totalUMKM: totalUMKM || 0,
          totalBerita: totalBerita || 0,
          pendingUMKM: pendingUMKM || 0,
          monthlyVisitors: monthlyVisitors || 0,
        });
      } catch (err) {
        console.error("Gagal ambil statistik:", err);
      }
    };

    fetchStats();
  }, [session]);


  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    const { data, error } = await supabase.auth.signInWithPassword({
      email: loginData.username,
      password: loginData.password,
    })

    if (error) {
      setLoginError(error.message)
    } else {
      setLoginError("")
      setSession(data.session) // ✅ otomatis tersimpan di supabase-js
    }
  }



const handleLogout = async () => {
  await supabase.auth.signOut()
  setSession(null)
}


if (loading) return <p>Loading...</p>
  if (!session) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h2 className="mt-6 text-3xl font-bold text-gray-900">Panel Admin</h2>
            <p className="mt-2 text-sm text-gray-600">Masuk untuk mengelola website desa</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Login Admin</CardTitle>
              <CardDescription>
                {/* CATATAN: Hanya admin yang dapat mengakses fitur ini */}
                Akses terbatas untuk administrator desa
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loginError && (
                <Alert className="mb-4 border-red-200 bg-red-50">
                  <AlertDescription className="text-red-800">{loginError}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    type="text"
                    value={loginData.username}
                    onChange={(e) => setLoginData((prev) => ({ ...prev, username: e.target.value }))}
                    placeholder="Masukkan username"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={loginData.password}
                      onChange={(e) => setLoginData((prev) => ({ ...prev, password: e.target.value }))}
                      placeholder="Masukkan password"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <Button type="submit" className="w-full">
                  Masuk
                </Button>
              </form>

              {/* <Alert className="mt-4">
                <AlertDescription className="text-sm">
                  <strong>Demo Login:</strong>
                  <br />
                  Username: admin
                  <br />
                  Password: admin123
                  <br />
                  <em className="text-red-600">⚠️ WAJIB diganti untuk keamanan!</em>
                </AlertDescription>
              </Alert> */}
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-semibold text-gray-900">Panel Admin Desa Karangampel</h1>
            <Button onClick={handleLogout} variant="outline">
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="bg-blue-100 p-3 rounded-full">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total UMKM</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalUMKM}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="bg-green-100 p-3 rounded-full">
                  <FileText className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Berita</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalBerita}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="bg-yellow-100 p-3 rounded-full">
                  <Settings className="h-6 w-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Pending UMKM</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.pendingUMKM}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="bg-purple-100 p-3 rounded-full">
                  <BarChart3 className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Pengunjung Bulan Ini</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.monthlyVisitors.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2 text-blue-600" />
                Buat Berita Baru
              </CardTitle>
              <CardDescription>Tambahkan berita atau pengumuman terbaru untuk website desa</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" asChild>
                <a href="/admin/buat-berita">Buat Berita</a>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="h-5 w-5 mr-2 text-green-600" />
                Kelola UMKM
              </CardTitle>
              <CardDescription>Review dan kelola pendaftaran UMKM yang masuk</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full bg-transparent" variant="outline" asChild>
                <a href="/admin/kelola-umkm">Kelola UMKM</a>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2 text-purple-600" />
                Kelola Berita
              </CardTitle>
              <CardDescription>Edit, hapus, dan kelola semua berita yang telah dibuat</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full bg-transparent" variant="outline" asChild>
                <a href="/admin/kelola-berita">Kelola Berita</a>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center">
                <ImageIcon className="h-5 w-5 mr-2 text-orange-600" />
                Template Gambar
              </CardTitle>
              <CardDescription>Panduan lengkap untuk mengelola gambar dan logo website</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full bg-transparent" variant="outline" asChild>
                <a href="/admin/template-gambar">Lihat Template</a>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activities */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Aktivitas Terbaru</CardTitle>
              <CardDescription>Ringkasan aktivitas website dalam 7 hari terakhir</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.length > 0 ? (
                  recentActivities.map((activity, index) => (
                    <div
                      key={`activity-${index}-${activity.time}`}
                      className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg"
                    >
                      <div
                        className={`p-2 rounded-full ${
                          activity.type === "umkm"
                            ? "bg-green-100"
                            : activity.type === "berita"
                              ? "bg-blue-100"
                              : "bg-yellow-100"
                        }`}
                      >
                        {activity.icon === "Users" && <Users className="h-4 w-4 text-green-600" />}
                        {activity.icon === "FileText" && <FileText className="h-4 w-4 text-blue-600" />}
                        {activity.icon === "Settings" && <Settings className="h-4 w-4 text-yellow-600" />}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{activity.message}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(activity.time).toLocaleDateString("id-ID", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <p>Belum ada aktivitas terbaru</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
