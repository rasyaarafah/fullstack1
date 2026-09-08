"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

interface LetterData {
  id?: string;
  nomor?: string;
  perihal?: string;
  recipient?: string;
  openingText?: string;
  closingText?: string;
  cityDate?: string;
  signerTitle?: string;
  signerName?: string;
  title?: string;
  content?: string;
  body?: string;
  createdAt?: string;
  // Dynamic custom attributes stored as an object or JSON
  variables?: Record<string, string>;
  // Direct fields if stored directly on letter
  nama?: string;
  ttl?: string;
  jenisKelamin?: string;
  nisn?: string;
  npsn?: string;
  kelas?: string;
  kompetensiKeahlian?: string;
  tahunAjaran?: string;
  eventDay?: string;
  eventTime?: string;
  eventLocation?: string;
}

export default function TemplatePreviewPage() {
  const params = useParams();
  const templateId = params.id as string;

  const [letterData, setLetterData] = useState<LetterData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [scale, setScale] = useState<number>(0.8);

  // Kop Surat constants
  const yayasan = "YAYASAN LEO SUTRISNO";
  const schoolName = "SMK LETRIS INDONESIA 2";
  const npsnNss = "NPSN : 69894185 NSS : 402286303080";
  const akreditasi = "( AKREDITASI “ A “ )";
  const jurusan =
    "Kompetensi Keahlian : Desain Komunikasi Visual (DKV) , Teknik Jaringan Komputer dan Telekomunikasi (TJKT) , Pengembangan Perangkat Lunak dan Gim (PPLG) , Manajemen Perkantoran dan Layanan Bisnis (MPLB) , Pemasaran (PM) , Akuntansi Keuangan Lembaga";
  const address =
    "Jl. Raya Siliwangi No. 55 Pondok Benda – Pamulang Telp. 021-29446273 Kota Tangerang Selatan Provinsi Banten";
  const website = "www.smkletris2pamulang.sch.id";

  useEffect(() => {
    async function fetchDocumentData() {
      if (!templateId) return;

      try {
        setLoading(true);

        let res = await fetch(`/api/letters/${templateId}`);
        if (!res.ok) {
          res = await fetch(`/api/templates/${templateId}`);
        }

        if (res.ok) {
          const data = await res.json();
          // Parse variables if sent as JSON string from DB
          if (typeof data.variables === "string") {
            try {
              data.variables = JSON.parse(data.variables);
            } catch {
              data.variables = {};
            }
          }
          setLetterData(data);
        } else {
          setError("Document record not found.");
        }
      } catch (err) {
        console.error("Error fetching document data:", err);
        setError("Failed to load document data.");
      } finally {
        setLoading(false);
      }
    }

    fetchDocumentData();
  }, [templateId]);

  const zoomIn = () => setScale((prev) => Math.min(prev + 0.15, 2.0));
  const zoomOut = () => setScale((prev) => Math.max(prev - 0.15, 0.35));
  const resetZoom = () => setScale(1.0);

  // Fallbacks
  const perihal = letterData?.perihal || letterData?.title || "Surat Keterangan Aktif Siswa";
  const isKeteranganSiswa = perihal.toLowerCase().includes("keterangan") || perihal.toLowerCase().includes("aktif");

  const formattedDate = letterData?.createdAt
    ? `Tangerang Selatan, ${new Date(letterData.createdAt).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })}`
    : "Tangerang Selatan, 4 September 2026";

  const nomor = letterData?.nomor || "421.5/102-SMK/LETRIS-2/2026";
  const recipient = letterData?.recipient || "Siswa / Siswi Terlampir";
  
  // Helper function to extract field values directly from the stored DB body string via REGEX
  const extractField = (pattern: RegExp, fallback: string = "—") => {
    const text = letterData?.body || letterData?.content || "";
    const match = text.match(pattern);
    if (!match) return fallback;
    
    const val = match[1].trim();
    // Ignore placeholder templates like {{tahun_ajaran}} in match and use fallback
    if (val.startsWith("{{") && val.endsWith("}}")) {
      return fallback;
    }
    return val;
  };

  // Extract custom variables from variables object or directly parse from database body text
  const vars = letterData?.variables || {};
  const studentData = {
    nama:
      vars.nama ||
      vars.nama_siswa ||
      vars["{{nama_siswa}}"] ||
      vars.namaSiswa ||
      letterData?.nama ||
      extractField(/Nama\s*:\s*(.+)/i, "Gilby Maleeq Jibrani"),
    ttl:
      vars.ttl ||
      vars.ttl_siswa ||
      vars["{{ttl}}"] ||
      vars.tempatTanggalLahir ||
      letterData?.ttl ||
      extractField(/Tempat Tanggal Lahir\s*:\s*(.+)/i, "Jakarta, 17 Mei 2009"),
    jenisKelamin:
      vars.jenisKelamin ||
      vars.jenis_kelamin ||
      vars["{{jenis_kelamin}}"] ||
      letterData?.jenisKelamin ||
      extractField(/Jenis kelamin\s*:\s*(.+)/i, "Laki-laki"),
    nisn:
      vars.nisn ||
      vars["{{nisn}}"] ||
      letterData?.nisn ||
      extractField(/NISN\s*:\s*(.+)/i, "0092877072"),
    npsn:
      vars.npsn ||
      vars["{{npsn}}"] ||
      letterData?.npsn ||
      extractField(/NPSN\s*:\s*(.+)/i, "69894185"),
    kelas:
      vars.kelas ||
      vars["{{kelas}}"] ||
      letterData?.kelas ||
      extractField(/Kelas\s*:\s*(.+)/i, "XII DKVB 4"),
    kompetensiKeahlian:
      vars.kompetensiKeahlian ||
      vars.kompetensi ||
      vars["{{kompetensi_keahlian}}"] ||
      letterData?.kompetensiKeahlian ||
      extractField(/Kompetensi Keahlian\s*:\s*(.+)/i, "Desain Komunikasi Visual"),
    tahunAjaran:
      vars.tahunAjaran ||
      vars.tahun_ajaran ||
      vars["{{tahun_ajaran}}"] ||
      letterData?.tahunAjaran ||
      extractField(/Tahun Ajaran\s*(.+?)(?=\.|\n|$)/i, "2025/2026"),
  };

  const signerTitle = letterData?.signerTitle || "Kepala Sekolah SMK Letris Indonesia 2";
  const signerName = letterData?.signerName || "Juaman, S.Kom";

  return (
    <div className="min-h-screen bg-stone-900 flex flex-col justify-between overflow-hidden relative select-none font-serif">
      {/* Top Bar */}
      <header className="no-print bg-stone-800/90 backdrop-blur border-b border-stone-700 px-4 py-3 flex items-center justify-between z-30 shrink-0 text-white">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/history"
            className="p-1.5 hover:bg-stone-700 rounded-lg transition-colors border border-stone-600"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <div>
            <h1 className="font-serif text-sm sm:text-base font-bold">Full Document Preview</h1>
            <p className="font-serif text-[10px] sm:text-xs text-stone-400">ID: {templateId}</p>
          </div>
        </div>

        <button
          onClick={() => window.print()}
          className="px-3 py-1.5 bg-stone-700 hover:bg-stone-600 text-stone-100 rounded-lg font-serif text-xs border border-stone-600 flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          Print / Export PDF
        </button>
      </header>

      {/* Main Canvas Area */}
      <main className="flex-1 overflow-auto p-4 sm:p-12 flex justify-center items-center relative bg-stone-950">
        {loading ? (
          <div className="text-white text-lg">Loading document...</div>
        ) : error ? (
          <div className="text-rose-400 text-lg">{error}</div>
        ) : (
          <div
            className="zoom-wrapper transition-transform duration-200 ease-out origin-top flex justify-center items-center"
            style={{ transform: `scale(${scale})` }}
          >
            <div className="a4-container w-[210mm] min-h-[297mm] bg-white p-12 border border-stone-600 shadow-2xl font-serif text-stone-900 text-xs leading-normal flex flex-col justify-between shrink-0 box-border">
              <div>
                {/* Kop Surat Header */}
                <div className="flex items-center justify-between gap-4 border-b-2 border-stone-900 pb-2 mb-4">
                  <div className="w-16 h-16 shrink-0 flex items-center justify-center border-2 border-dashed border-blue-600 rounded-full bg-blue-50 text-[9px] font-bold text-blue-900 text-center p-1">
                    LOGO LETRIS 2
                  </div>

                  <div className="text-center flex-1 space-y-0.5">
                    <h2 className="font-bold text-[11px] uppercase">{yayasan}</h2>
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

                {/* Date */}
                <div className="text-right mb-4">
                  <span>{formattedDate}</span>
                </div>

                {/* Title and Metadata */}
                {isKeteranganSiswa ? (
                  <div className="text-center my-6 space-y-1">
                    <h2 className="font-bold text-sm tracking-wide uppercase underline">
                      {perihal}
                    </h2>
                    <p className="text-xs">Nomor : {nomor}</p>
                  </div>
                ) : (
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
                )}

                {/* Body Content */}
                {isKeteranganSiswa ? (
                  <div className="space-y-4 my-4">
                    <p className="text-justify leading-relaxed">
                      Yang bertanda tangan di bawah ini Kepala Sekolah SMK Letris Indonesia 2 Pamulang Kota Tangerang Selatan - Prov. Banten menerangkan bahwa:
                    </p>

                    {/* Student Key-Value Table */}
                    <div className="pl-6 space-y-1.5 font-serif text-xs">
                      <div className="grid grid-cols-12">
                        <span className="col-span-4">Nama</span>
                        <span className="col-span-8">: {studentData.nama}</span>
                      </div>
                      <div className="grid grid-cols-12">
                        <span className="col-span-4">Tempat Tanggal Lahir</span>
                        <span className="col-span-8">: {studentData.ttl}</span>
                      </div>
                      <div className="grid grid-cols-12">
                        <span className="col-span-4">Jenis Kelamin</span>
                        <span className="col-span-8">: {studentData.jenisKelamin}</span>
                      </div>
                      <div className="grid grid-cols-12">
                        <span className="col-span-4">NISN</span>
                        <span className="col-span-8">: {studentData.nisn}</span>
                      </div>
                      <div className="grid grid-cols-12">
                        <span className="col-span-4">NPSN</span>
                        <span className="col-span-8">: {studentData.npsn}</span>
                      </div>
                      <div className="grid grid-cols-12">
                        <span className="col-span-4">Kelas</span>
                        <span className="col-span-8">: {studentData.kelas}</span>
                      </div>
                      <div className="grid grid-cols-12">
                        <span className="col-span-4">Kompetensi Keahlian</span>
                        <span className="col-span-8">: {studentData.kompetensiKeahlian}</span>
                      </div>
                    </div>

                    <p className="text-justify leading-relaxed pt-2">
                      Benar nama yang tersebut di atas terdaftar sebagai peserta didik kelas {studentData.kelas} di SMK Letris Indonesia 2 Tahun Ajaran {studentData.tahunAjaran}. Demikian surat keterangan ini kami berikan untuk digunakan sebagaimana mestinya.
                    </p>
                  </div>
                ) : (
                  /* Standard Undangan / General Letter Body */
                  <div className="space-y-4 mb-4">
                    <p>Dengan hormat,</p>
                    <p className="text-justify indent-8 leading-relaxed whitespace-pre-line">
                      {letterData?.openingText || letterData?.content || "Sehubungan dengan kegiatan sekolah..."}
                    </p>
                    <p className="text-justify indent-8 leading-relaxed">
                      {letterData?.closingText || "Demikian surat ini kami sampaikan, atas perhatian dan kerjasamanya kami ucapkan terima kasih."}
                    </p>
                  </div>
                )}
              </div>

              {/* Signature Section */}
              <div className="flex justify-end pt-4">
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
        )}
      </main>

      {/* Floating Toolbar */}
      <footer className="no-print fixed bottom-6 left-1/2 -translate-x-1/2 bg-stone-800/90 backdrop-blur text-white px-4 py-2.5 rounded-full border border-stone-700 shadow-2xl flex items-center gap-3 z-40">
        <button onClick={zoomOut} className="p-1.5 hover:bg-stone-700 rounded-full transition-colors">
          -
        </button>
        <span className="font-mono text-xs font-semibold w-12 text-center">
          {Math.round(scale * 100)}%
        </span>
        <button onClick={zoomIn} className="p-1.5 hover:bg-stone-700 rounded-full transition-colors">
          +
        </button>
        <div className="h-4 w-px bg-stone-700" />
        <button onClick={resetZoom} className="px-2.5 py-1 hover:bg-stone-700 text-stone-300 rounded text-xs">
          100%
        </button>
      </footer>
    </div>
  );
}