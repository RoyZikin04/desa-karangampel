"use client"

import { useState, useEffect } from "react"
import { MapPin, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface GoogleMapsProps {
  address: string
  businessName: string
  className?: string
}

export function GoogleMaps({ address, businessName, className = "" }: GoogleMapsProps) {
  const [mapUrl, setMapUrl] = useState("")

  useEffect(() => {
    // Create Google Maps embed URL
    const query = encodeURIComponent(`${businessName}, ${address}`)
    const embedUrl = `https://www.google.com/maps/embed/v1/place?key=YOUR_GOOGLE_MAPS_API_KEY&q=${query}`
    setMapUrl(embedUrl)
  }, [address, businessName])

  const openInGoogleMaps = () => {
    const query = encodeURIComponent(`${businessName}, ${address}`)
    const url = `https://www.google.com/maps/search/?api=1&query=${query}`
    window.open(url, "_blank")
  }

  return (
    <Card className={className}>
      <CardContent className="p-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold flex items-center">
              <MapPin className="h-4 w-4 mr-2 text-blue-600" />
              Lokasi
            </h4>
            <Button variant="outline" size="sm" onClick={openInGoogleMaps}>
              <ExternalLink className="h-4 w-4 mr-1" />
              Buka di Maps
            </Button>
          </div>

          {/* Placeholder for Google Maps - Replace with actual API key */}
          <div className="bg-gray-100 h-48 rounded-lg flex items-center justify-center relative overflow-hidden">
            <div className="text-center text-gray-500">
              <MapPin className="h-8 w-8 mx-auto mb-2" />
              <p className="text-sm font-medium">Peta Lokasi</p>
              <p className="text-xs">Klik "Buka di Maps" untuk navigasi</p>
            </div>
            {/* Uncomment when you have Google Maps API key */}
            {/* <iframe
              src={mapUrl}
              width="100%"
              height="192"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="rounded-lg"
            /> */}
          </div>

          <p className="text-sm text-gray-600">{address}</p>

          <div className="bg-blue-50 p-3 rounded-lg">
            <p className="text-xs text-blue-700">
              💡 <strong>Cara Mengaktifkan Peta:</strong>
              <br />
              1. Dapatkan Google Maps API key dari Google Cloud Console
              <br />
              2. Ganti "YOUR_GOOGLE_MAPS_API_KEY" di kode dengan API key Anda
              <br />
              3. Uncomment kode iframe di atas
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
