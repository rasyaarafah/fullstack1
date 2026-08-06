"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function TemplatePreviewPage() {
  const params = useParams();
  const templateId = params.id as string;

  // Zoom scale state (1 = 100% standard size)
  const [scale, setScale] = useState<number>(0.8);

  // Sample data
  const [yayasan] = useState("YAYASAN LEO SUTRISNO");
  const [schoolName] = useState("SMK LETRIS INDONESIA 2");
  const [npsnNss] = useState("NPSN : 69894185 NSS : 402286303080");
  const [akreditasi] = useState("( AKREDITASI “ A “ )");
  const [jurusan] = useState(
    "Kompetensi Keahlian : Desain Komunikasi Visual (DKV) , Teknik Jaringan Komputer dan Telekomunikasi (TJKT) , Pengembangan Perangkat Lunak dan Gim (PPLG) , Manajemen Perkantoran dan Layanan Bisnis (MPLB) , Pemasaran (PM) , Akuntansi Keuangan Lembaga"
  );
  const [address] = useState(
    "Jl. Raya Siliwangi No. 55 Pondok Benda – Pamulang Telp. 021-29446273 Kota Tangerang Selatan Provinsi Banten"
  );
  const [website] = useState("www.smkletris2pamulang.sch.id");

  const [cityDate] = useState("Tangerang Selatan, 20 Juni 2026");
  const [nomor] = useState("421.5/102-SMK/LETRIS-2/2026");
  const [perihal] = useState("Undangan Pengambilan Raport");
  const [recipient] = useState("Bapak/Ibu Orang Tua/Wali Siswa\nJohn Doe");

  const [openingText] = useState(
    "Sehubungan dengan telah berakhrinya kegiatan Pembelajaran Semester, maka SMK Letris Indonesia 2 akan mengadakan pembagian raport. Untuk itu, kami mengundang para Bapak/Ibu Orang tua/Wali siswa untuk mengambil raport pada :"
  );
  const [closingText] = useState(
    "Demikian surat undangan ini kami sampaikan, atas perhatian dan kehadirannya kami ucapkan terima kasih."
  );

  const [eventDay] = useState("Sabtu, 27 Juni 2026");
  const [eventTime] = useState("08.00 WIB - Selesai");
  const [eventLocation] = useState("Aula SMK Letris Indonesia 2");

  const [signerTitle] = useState("Kepala Sekolah SMK Letris Indonesia 2");
  const [signerName] = useState("Drs. H. Ahmad Syafi'i, M.Pd.");

  // Zoom Controls
  const zoomIn = () => setScale((prev) => Math.min(prev + 0.15, 2.0));
  const zoomOut = () => setScale((prev) => Math.max(prev - 0.15, 0.35));
  const resetZoom = () => setScale(1.0);
  const fitToMobile = () => setScale(0.45);

  return (
    <div className="min-h-screen bg-stone-900 flex flex-col justify-between overflow-hidden relative select-none">
      {/* Print Engine Fix Styles */}
      <style jsx global>{`
        @page {
          size: A4 portrait;
          margin: 0;
        }
        @media print {
          html, body {
            background: white !important;
            margin: 0 !important;
            padding: 0 !important;
            width: 210mm !important;
            height: 297mm !important;
            -webkit-print-color-adjust: exact;
          }

          .no-print {
            display: none !important;
          }

          /* Reset layout wrappers so dark background and scaling are ignored */
          main {
            padding: 0 !important;
            background: white !important;
            overflow: visible !important;
            display: block !important;
          }

          .zoom-wrapper {
            transform: none !important;
            display: block !important;
          }

          .a4-container {
            box-shadow: none !important;
            border: none !important;
            margin: 0 !important;
            padding: 15mm !important; /* Proper internal print margin */
            width: 210mm !important;
            max-width: 210mm !important;
            min-height: 297mm !important;
            height: 297mm !important;
            box-sizing: border-box !important;
            page-break-after: avoid !important;
            page-break-inside: avoid !important;
          }
        }
      `}</style>

      {/* Top Floating Bar */}
      <header className="no-print bg-stone-800/90 backdrop-blur border-b border-stone-700 px-4 py-3 flex items-center justify-between z-30 shrink-0 text-white">
        <div className="flex items-center gap-3">
          <Link
            href={`/admin/templates/edit/${templateId}`}
            className="p-1.5 hover:bg-stone-700 rounded-lg transition-colors border border-stone-600"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <div>
            <h1 className="font-serif text-sm sm:text-base font-bold">
              Full Document Preview
            </h1>
            <p className="font-serif text-[10px] sm:text-xs text-stone-400">
              Template ID: {templateId}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="px-3 py-1.5 bg-stone-700 hover:bg-stone-600 text-stone-100 rounded-lg font-serif text-xs border border-stone-600 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            <span className="hidden sm:inline">Print / Export PDF</span>
          </button>
        </div>
      </header>

      {/* Interactive Pan/Zoom Canvas Area */}
      <main className="flex-1 overflow-auto p-4 sm:p-12 flex justify-center items-center relative bg-stone-950">
        <div
          className="zoom-wrapper transition-transform duration-200 ease-out origin-top flex justify-center items-center"
          style={{ transform: `scale(${scale})` }}
        >
          {/* Strict A4 Document Sheet */}
          <div className="a4-container w-[210mm] min-h-[297mm] bg-white p-12 border border-stone-600 shadow-2xl font-serif text-stone-900 text-xs leading-normal flex flex-col justify-between shrink-0 box-border">
            <div>
              {/* Kop Surat Header */}
              <div className="flex items-center justify-between gap-4 border-b-2 border-stone-900 pb-2 mb-4">
                <div className="w-16 h-16 shrink-0 flex items-center justify-center border-2 border-dashed border-blue-600 rounded-full bg-blue-50 text-[9px] font-bold text-blue-900 text-center p-1">
                  LOGO LETRIS 2
                </div>

                <div className="text-center flex-1 space-y-0.5">
                  <h2 className="font-bold text-[11px] tracking-wider uppercase">{yayasan}</h2>
                  <h1 className="font-extrabold text-base tracking-wide uppercase leading-tight">{schoolName}</h1>
                  <p className="font-semibold text-[10px]">{npsnNss}</p>
                  <p className="font-bold text-[10px]">{akreditasi}</p>
                  <p className="text-[9px] px-2 leading-tight text-stone-700">{jurusan}</p>
                  <p className="text-[9px] text-stone-700">{address}</p>
                  <p className="text-[9px] text-blue-800 underline">{website}</p>
                </div>

                <div className="w-16 h-16 shrink-0 flex items-center justify-center border-2 border-dashed border-emerald-600 rounded bg-emerald-50 text-[9px] font-bold text-emerald-900 text-center p-1">
                  LOGO BANTEN
                </div>
              </div>

              {/* City and Date Header */}
              <div className="text-right mb-4">
                <span>{cityDate}</span>
              </div>

              {/* Letter Metadata */}
              <div className="space-y-1 mb-4">
                <div className="grid grid-cols-12">
                  <span className="col-span-2">Nomor</span>
                  <span className="col-span-10">: {nomor}</span>
                </div>
                <div className="grid grid-cols-12">
                  <span className="col-span-2">Perihal</span>
                  <span className="col-span-10 font-semibold">: {perihal}</span>
                </div>
                <div className="pt-2 space-y-0.5">
                  <p>Kepada Yth,</p>
                  <p className="font-semibold whitespace-pre-line leading-snug">{recipient}</p>
                  <p>di Tempat</p>
                </div>
              </div>

              {/* Opening Body */}
              <div className="space-y-2 mb-4">
                <p>Dengan hormat,</p>
                <p className="text-justify indent-8 leading-relaxed">{openingText}</p>
              </div>

              {/* Event Schedule Details */}
              <div className="pl-8 space-y-1 mb-4">
                <div className="grid grid-cols-12">
                  <span className="col-span-3">Hari/Tanggal</span>
                  <span className="col-span-9">: {eventDay}</span>
                </div>
                <div className="grid grid-cols-12">
                  <span className="col-span-3">Waktu</span>
                  <span className="col-span-9">: {eventTime}</span>
                </div>
                <div className="grid grid-cols-12">
                  <span className="col-span-3">Tempat</span>
                  <span className="col-span-9">: {eventLocation}</span>
                </div>
              </div>

              {/* Closing Body */}
              <div className="space-y-2 mb-4">
                <p className="text-justify indent-8 leading-relaxed">{closingText}</p>
              </div>
            </div>

            {/* Bottom Signature Section */}
            <div className="flex justify-end pt-2 mt-2">
              <div className="text-center min-w-56 space-y-12">
                <div>
                  <p>Hormat Kami,</p>
                  <p className="font-semibold">{signerTitle}</p>
                </div>
                <div>
                  <p className="font-bold underline uppercase">{signerName}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Floating Bottom Toolbar (Zoom Controls) */}
      <footer className="no-print fixed bottom-6 left-1/2 -translate-x-1/2 bg-stone-800/90 backdrop-blur text-white px-4 py-2.5 rounded-full border border-stone-700 shadow-2xl flex items-center gap-3 z-40">
        <button
          onClick={zoomOut}
          title="Zoom Out"
          className="p-1.5 hover:bg-stone-700 rounded-full transition-colors text-stone-200"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" />
          </svg>
        </button>

        <span className="font-mono text-xs font-semibold w-12 text-center text-stone-300">
          {Math.round(scale * 100)}%
        </span>

        <button
          onClick={zoomIn}
          title="Zoom In"
          className="p-1.5 hover:bg-stone-700 rounded-full transition-colors text-stone-200"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
        </button>

        <div className="h-4 w-px bg-stone-700" />

        <button
          onClick={resetZoom}
          className="px-2.5 py-1 hover:bg-stone-700 text-stone-300 rounded font-serif text-xs transition-colors"
        >
          100%
        </button>

        <button
          onClick={fitToMobile}
          className="px-2.5 py-1 hover:bg-stone-700 text-stone-300 rounded font-serif text-xs transition-colors sm:hidden"
        >
          Fit Width
        </button>
      </footer>
    </div>
  );
}