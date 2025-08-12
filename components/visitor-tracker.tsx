"use client"

import { useEffect } from "react"
import { visitorStorage } from "@/lib/local-storage"

export default function VisitorTracker() {
  useEffect(() => {
    // Track visitor when component mounts
    visitorStorage.trackVisitor()

    // Optional: Track page visibility changes for more accurate counting
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        visitorStorage.trackVisitor()
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange)

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange)
    }
  }, [])

  // This component doesn't render anything visible
  return null
}
