"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Star, User, MessageCircle, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface Review {
  id: string
  umkmId: string
  nama: string
  rating: number
  komentar: string
  tanggal: string
}

interface ReviewSystemProps {
  umkmId: string
  umkmName: string
}

export function ReviewSystem({ umkmId, umkmName }: ReviewSystemProps) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [showForm, setShowForm] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [formData, setFormData] = useState({
    nama: "",
    rating: 0,
    komentar: "",
  })

  // Load reviews from localStorage
  useEffect(() => {
    const loadReviews = () => {
      if (typeof window === "undefined") return
      const data = localStorage.getItem("umkm-reviews")
      const allReviews: Review[] = data ? JSON.parse(data) : []
      const umkmReviews = allReviews.filter((review) => review.umkmId === umkmId)
      setReviews(umkmReviews)
    }

    loadReviews()
  }, [umkmId])

  // Save review to localStorage
  const saveReview = (review: Review) => {
    if (typeof window === "undefined") return
    const data = localStorage.getItem("umkm-reviews")
    const allReviews: Review[] = data ? JSON.parse(data) : []
    const updatedReviews = [...allReviews, review]
    localStorage.setItem("umkm-reviews", JSON.stringify(updatedReviews))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (formData.rating === 0) {
      alert("Silakan berikan rating terlebih dahulu")
      return
    }

    const newReview: Review = {
      id: `review_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      umkmId,
      nama: formData.nama,
      rating: formData.rating,
      komentar: formData.komentar,
      tanggal: new Date().toISOString(),
    }

    saveReview(newReview)
    setReviews((prev) => [newReview, ...prev])
    setFormData({ nama: "", rating: 0, komentar: "" })
    setShowForm(false)
    setSubmitSuccess(true)

    setTimeout(() => setSubmitSuccess(false), 3000)
  }

  const renderStars = (rating: number, interactive = false, onRatingChange?: (rating: number) => void) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating ? "fill-yellow-400 text-yellow-400" : "fill-gray-300 text-gray-300"
            } ${interactive ? "cursor-pointer hover:scale-110 transition-transform" : ""}`}
            onClick={interactive && onRatingChange ? () => onRatingChange(star) : undefined}
          />
        ))}
      </div>
    )
  }

  const averageRating =
    reviews.length > 0 ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length : 0

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center">
            <MessageCircle className="h-5 w-5 mr-2" />
            Ulasan Pelanggan
          </span>
          <Button variant="outline" size="sm" onClick={() => setShowForm(!showForm)}>
            Tulis Ulasan
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {submitSuccess && (
          <Alert className="border-green-200 bg-green-50">
            <AlertDescription className="text-green-800">
              ✅ Terima kasih! Ulasan Anda telah berhasil ditambahkan.
            </AlertDescription>
          </Alert>
        )}

        {/* Rating Summary */}
        {reviews.length > 0 && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">{averageRating.toFixed(1)}</div>
                {renderStars(Math.round(averageRating))}
                <div className="text-sm text-gray-600 mt-1">{reviews.length} ulasan</div>
              </div>
              <div className="flex-1">
                {[5, 4, 3, 2, 1].map((rating) => {
                  const count = reviews.filter((r) => r.rating === rating).length
                  const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0
                  return (
                    <div key={rating} className="flex items-center gap-2 text-sm">
                      <span>{rating}</span>
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div className="bg-yellow-400 h-2 rounded-full" style={{ width: `${percentage}%` }} />
                      </div>
                      <span className="text-gray-600">{count}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {/* Review Form */}
        {showForm && (
          <Card className="border-blue-200">
            <CardContent className="p-4">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="nama">Nama Anda</Label>
                  <Input
                    id="nama"
                    value={formData.nama}
                    onChange={(e) => setFormData((prev) => ({ ...prev, nama: e.target.value }))}
                    placeholder="Masukkan nama Anda"
                    required
                  />
                </div>

                <div>
                  <Label>Rating</Label>
                  <div className="mt-2">
                    {renderStars(formData.rating, true, (rating) => setFormData((prev) => ({ ...prev, rating })))}
                  </div>
                </div>

                <div>
                  <Label htmlFor="komentar">Ulasan Anda</Label>
                  <Textarea
                    id="komentar"
                    value={formData.komentar}
                    onChange={(e) => setFormData((prev) => ({ ...prev, komentar: e.target.value }))}
                    placeholder={`Bagikan pengalaman Anda dengan ${umkmName}...`}
                    rows={3}
                    required
                  />
                </div>

                <div className="flex gap-2">
                  <Button type="submit" size="sm">
                    <Send className="h-4 w-4 mr-1" />
                    Kirim Ulasan
                  </Button>
                  <Button type="button" variant="outline" size="sm" onClick={() => setShowForm(false)}>
                    Batal
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Reviews List */}
        <div className="space-y-4">
          {reviews.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <MessageCircle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>Belum ada ulasan untuk UMKM ini.</p>
              <p className="text-sm">Jadilah yang pertama memberikan ulasan!</p>
            </div>
          ) : (
            reviews.map((review) => (
              <Card key={review.id} className="border-gray-200">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h4 className="font-semibold text-gray-900">{review.nama}</h4>
                          <div className="flex items-center gap-2">
                            {renderStars(review.rating)}
                            <span className="text-sm text-gray-500">
                              {new Date(review.tanggal).toLocaleDateString("id-ID", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })}
                            </span>
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-700">{review.komentar}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
