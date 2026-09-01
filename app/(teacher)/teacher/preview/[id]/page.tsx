"use client";

import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/templates/DashboardLayout";

export default function TeacherPreviewPage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params);
  const router = useRouter();
  const [scale, setScale] = useState<number>(0.8);
  const [letter, setLetter] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Default Kop Surat info
  const yayasan = "YAYASAN LEO SUTRISNO";
  const schoolName = "SMK LETRIS INDONESIA 2";
  const npsnNss = "NPSN : 69894185 NSS : 402286303080";
  const akreditasi = '( AKREDITASI " A " )';
  const jurusan = "Kompetensi Keahlian : Desain Komunikasi Visual (DKV) , Teknik Jaringan Komputer dan Telekomunikasi (TJKT) , Pengembangan Perangkat Lunak dan Gim (PPLG) , Manajemen Perkantoran dan Layanan Bisnis (MPLB) , Pemasaran (PM) , Akuntansi Keuangan Lembaga";
  const address = "Jl. Raya Siliwangi No. 55 Pondok Benda – Pamulang Telp. 021-29446273 Kota Tangerang Selatan Provinsi Banten";
  const website = "www.smkletris2pamulang.sch.id";

  useEffect(() => {
    async function fetchLetter() {
      try {
        const res = await fetch(`/api/letters/${unwrappedParams.id}`);
        if (res.ok) {
          const data = await res.json();
          setLetter(data);
        } else {
          router.push("/teacher/history");
        }
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchLetter();
  }, [unwrappedParams.id, router]);

  const zoomIn = () => setScale((prev) => Math.min(prev + 0.15, 2.0));
  const zoomOut = () => setScale((prev) => Math.max(prev - 0.15, 0.35));
  const resetZoom = () => setScale(1.0);
  const fitToMobile = () => setScale(0.45);

  if (loading) return <div className="min-h-screen bg-stone-900 flex items-center justify-center text-white">Loading...</div>;
  if (!letter) return null;

  return (
    <div className="min-h-screen bg-stone-900 flex flex-col justify-between overflow-hidden relative select-none">
      <style jsx global>{`
        @page { size: A4 portrait; margin: 0; }
        @media print {
          html, body { background: white !important; margin: 0 !important; width: 210mm !important; height: 297mm !important; }
          .no-print { display: none !important; }
          main { padding: 0 !important; overflow: visible !important; }
          .zoom-wrapper { transform: none !important; }
          .a4-container { border: none !important; margin: 0 !important; padding: 15mm !important; width: 210mm !important; height: 297mm !important; box-shadow: none !important; }
        }
      `}</style>

      <header className="no-print bg-stone-800/90 backdrop-blur border-b border-stone-700 px-4 py-3 flex items-center justify-between z-30 text-white">
        <div className="flex items-center gap-3">
          <Link href="/teacher/history" className="p-1.5 hover:bg-stone-700 rounded-lg border border-stone-600">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
          </Link>
          <div>
            <h1 className="font-serif text-sm font-bold">{letter.title}</h1>
            <p className="font-serif text-[10px] text-stone-400">Status: {letter.status}</p>
          </div>
        </div>
        <button onClick={() => window.print()} className="px-3 py-1.5 bg-stone-700 hover:bg-stone-600 rounded-lg font-serif text-xs border border-stone-600">Print / PDF</button>
      </header>

      <main className="flex-1 overflow-auto p-4 flex justify-center items-center bg-stone-950">
        <div className="zoom-wrapper transition-transform origin-top" style={{ transform: `scale(${scale})` }}>
          <div className="a4-container w-[210mm] min-h-[297mm] bg-white p-12 border border-stone-600 shadow-2xl font-serif text-stone-900 text-[11pt] flex flex-col box-border">
            {/* Kop Surat */}
            <div className="flex items-center justify-between gap-4 border-b-2 border-stone-900 pb-2 mb-6">
              <img src="/logo_letris.png" alt="Logo Kiri" className="w-16 h-16 object-contain" />
              <div className="text-center flex-1 space-y-0.5">
                <h2 className="font-bold text-[11pt] uppercase">{yayasan}</h2>
                <h1 className="font-extrabold text-[14pt] uppercase leading-tight">{schoolName}</h1>
                <p className="font-semibold text-[8pt]">{npsnNss}</p>
                <p className="font-bold text-[8pt]">{akreditasi}</p>
                <p className="text-[7.5pt] px-2 text-stone-700">{jurusan}</p>
                <p className="text-[7.5pt] text-stone-700">{address}</p>
                <p className="text-[7.5pt] text-blue-800 underline">{website}</p>
              </div>
              <img src="/logo_banten.png" alt="Logo Kanan" className="w-16 h-16 object-contain" />
            </div>

            <div className="flex-1">
              <div className="text-right mb-6">Tangerang Selatan, {new Date(letter.createdAt).toLocaleDateString('id-ID')}</div>
              <div className="space-y-1 mb-6">
                <p><b>Nomor:</b> {letter.letterNumber || "-"}</p>
                <p><b>Hal:</b> {letter.subject || letter.title}</p>
                <div className="pt-4"><p>Kepada Yth,</p><p className="font-semibold">{letter.recipient}</p><p>di Tempat</p></div>
              </div>
              {letter.institutionName && <p className="font-semibold mb-4">Pengirim: {letter.institutionName}</p>}
              <div className="mb-6 whitespace-pre-wrap text-justify">{letter.body}</div>
              {letter.attachmentUrl && (
                <div className="mt-8 border-t border-stone-200 pt-4">
                  <p className="font-bold text-stone-500 mb-2">Lampiran:</p>
                  <img src={letter.attachmentUrl} className="max-h-64 object-contain" />
                </div>
              )}
            </div>

            <div className="flex justify-end pt-8 mt-8 text-center min-w-50">
              <div>
                <p>Mengetahui,</p>
                <p className="font-semibold">Kepala Sekolah / Admin</p>
                <div className="h-24 flex items-center justify-center">
                  {letter.status === "APPROVED" ? (
                    <span className="italic font-serif text-emerald-700 text-lg border-b-2 border-emerald-700 -rotate-2">Approved</span>
                  ) : (
                    <span className="italic text-stone-400 text-sm">[Belum Ditandatangani]</span>
                  )}
                </div>
                <p className="font-bold underline uppercase">NIP. ....................</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="no-print fixed bottom-6 left-1/2 -translate-x-1/2 bg-stone-800/90 text-white px-4 py-2.5 rounded-full border border-stone-700 shadow-2xl flex items-center gap-3 z-40">
        <button onClick={zoomOut} className="p-1.5 hover:bg-stone-700 rounded-full">-</button>
        <span className="text-xs">{Math.round(scale * 100)}%</span>
        <button onClick={zoomIn} className="p-1.5 hover:bg-stone-700 rounded-full">+</button>
        <button onClick={resetZoom} className="px-2.5 py-1 text-xs">100%</button>
        <button onClick={fitToMobile} className="px-2.5 py-1 text-xs sm:hidden">Fit</button>
      </footer>
    </div>
  );
}