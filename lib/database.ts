import { supabase } from "./supabaseClient";

export async function tambahUMKM(data: any) {
  const { error } = await supabase.from("umkm").insert([data]);
  if (error) {
    console.error("Supabase error:", error);
    throw error;
  }
}


// Simpan Berita
export async function tambahBerita(data: any) {
  const { error } = await supabase.from("berita").insert([data]);
  if (error) throw error;
}

