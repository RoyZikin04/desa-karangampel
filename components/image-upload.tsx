import { supabase } from "@/lib/supabaseClient";
import { useState, useRef } from "react";
import { Upload, Camera, X, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ImageUploadProps {
  onImageUpload: (imageUrl: string) => void;
  currentImage?: string;
  label: string;
  required?: boolean;
  maxSize?: number; // in MB
  acceptedFormats?: string[];
}

export function ImageUpload({
  onImageUpload,
  currentImage,
  label,
  required = false,
  maxSize = 5,
  acceptedFormats = ["image/jpeg", "image/jpg", "image/png", "image/webp"],
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentImage || null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setError(null);

    if (!acceptedFormats.includes(file.type)) {
      setError(
        `Format file tidak didukung. Gunakan: ${acceptedFormats.map((f) => f.split("/")[1].toUpperCase()).join(", ")}`
      );
      return;
    }

    if (file.size > maxSize * 1024 * 1024) {
      setError(`Ukuran file terlalu besar. Maksimal ${maxSize}MB`);
      return;
    }

    setUploading(true);

    try {
      const fileName = `${Date.now()}-${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from("uploads") // nama bucket di Supabase
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Ambil URL publik
      const { data } = supabase.storage.from("uploads").getPublicUrl(fileName);
      const publicUrl = data.publicUrl;

      setPreview(publicUrl);
      onImageUpload(publicUrl);

      console.log(`✅ Upload berhasil: ${file.name}`);
    } catch (error) {
      console.error("❌ Upload gagal:", error);
      setError("Gagal mengupload gambar. Silakan coba lagi.");
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setPreview(null);
    onImageUpload("");
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      {error && (
        <Alert className="mb-4 border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">{error}</AlertDescription>
        </Alert>
      )}

      {preview ? (
        <div className="relative">
          <div className="relative w-full h-48 border-2 border-gray-300 rounded-lg overflow-hidden">
            <Image
              src={preview || "/placeholder.svg"}
              alt="Preview"
              fill
              className="object-cover"
            />
          </div>
          <Button
            type="button"
            variant="destructive"
            size="sm"
            className="absolute top-2 right-2"
            onClick={handleRemoveImage}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div
          className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors cursor-pointer"
          onClick={() => fileInputRef.current?.click()}
        >
          <Camera className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-sm text-gray-600 mb-2">Klik untuk upload {label.toLowerCase()}</p>
          <p className="text-xs text-gray-500">
            Format: {acceptedFormats.map((f) => f.split("/")[1].toUpperCase()).join(", ")} (Max {maxSize}MB)
          </p>
          <Button type="button" variant="outline" size="sm" className="mt-2 bg-transparent" disabled={uploading}>
            <Upload className="h-4 w-4 mr-2" />
            {uploading ? "Mengupload..." : "Pilih Gambar"}
          </Button>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept={acceptedFormats.join(",")}
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
}
