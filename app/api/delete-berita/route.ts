import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Gunakan Service Role Key di server
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json({ error: "ID tidak diberikan" }, { status: 400 });
    }

    // Hapus dari Supabase
    const { error } = await supabase.from("berita").delete().eq("id", id);

    if (error) {
      console.error("Gagal hapus berita:", error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
