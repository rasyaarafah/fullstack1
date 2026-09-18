"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

interface LetterData {
  id?: string;
  nomor?: string;
  letterNumber?: string;
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
  variables?: Record<string, string>;
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

  // Kop Surat constants (School standard branding)
  const yayasan = "YAYASAN LEO SUTRISNO";
  const schoolName = "SMK LETRIS INDONESIA 2";
  const npsnNss = "NPSN : 69894185 NSS : 402286303080";
  const akreditasi = "( AKREDITASI “ A “ )";
  const jurusan =
    "Kompetensi Keahlian : Desain Komunikasi Visual (DKV) , Teknik Jaringan Komputer dan Telekomunikasi (TJKT) , Pengembangan Perangkat Lunak dan Gim (PPLG) , Manajemen Perkantoran dan Layanan Bisnis (MPLB) , Pemasaran (PM) , Akuntansi Keuangan Lembaga";
  const address =
    "Jl. Raya Siliwangi No. 55 Pondok Benda – Pamulang Telp. 021-29446273 Kota Tangerang Selatan Provinsi Banten";
  const website = "www.smkletris2pamulang.sch.id";

  // Signer constant — update if Kepala Sekolah changes
  const defaultSignerName = "Juaman, S.Kom";

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

  // Dynamic variable extractor (checks `variables` object, root properties, then regex from body text)
  const vars = letterData?.variables || {};

  const extractFieldFromText = (pattern: RegExp) => {
    const text = letterData?.body || letterData?.content || "";
    const match = text.match(pattern);
    if (!match) return undefined;
    const val = match[1].trim();
    if (val.startsWith("{{") && val.endsWith("}}")) return undefined;
    return val;
  };

  const getDynamicValue = (keys: string[], regex?: RegExp) => {
    for (const key of keys) {
      if (vars[key]) return vars[key];
      if ((letterData as Record<string, any>)?.[key]) {
        return (letterData as Record<string, any>)[key];
      }
    }
    if (regex) {
      const extracted = extractFieldFromText(regex);
      if (extracted) return extracted;
    }
    return "—";
  };

  // Dynamic letter header fields
  const perihal = letterData?.perihal || letterData?.title || vars.perihal || "—";
  const isKeteranganSiswa =
    perihal.toLowerCase().includes("keterangan") || perihal.toLowerCase().includes("aktif");

  const nomor = letterData?.letterNumber || letterData?.nomor || vars.nomor || "—";
  const recipient = letterData?.recipient || vars.recipient || "—";

  const formattedDate = letterData?.cityDate
    ? letterData.cityDate
    : letterData?.createdAt
    ? `Tangerang Selatan, ${new Date(letterData.createdAt).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })}`
    : "Tangerang Selatan, —";

  // Dynamic student attributes
  const studentData = {
    nama: getDynamicValue(
      ["nama", "nama_siswa", "{{nama_siswa}}", "namaSiswa"],
      /Nama\s*:\s*(.+)/i
    ),
    ttl: getDynamicValue(
      ["ttl", "ttl_siswa", "{{ttl}}", "tempatTanggalLahir"],
      /Tempat Tanggal Lahir\s*:\s*(.+)/i
    ),
    jenisKelamin: getDynamicValue(
      ["jenisKelamin", "jenis_kelamin", "{{jenis_kelamin}}"],
      /Jenis kelamin\s*:\s*(.+)/i
    ),
    nisn: getDynamicValue(["nisn", "{{nisn}}"], /NISN\s*:\s*(.+)/i),
    npsn: getDynamicValue(["npsn", "{{npsn}}"], /NPSN\s*:\s*(.+)/i),
    kelas: getDynamicValue(["kelas", "{{kelas}}"], /Kelas\s*:\s*(.+)/i),
    kompetensiKeahlian: getDynamicValue(
      ["kompetensiKeahlian", "kompetensi", "{{kompetensi_keahlian}}"],
      /Kompetensi Keahlian\s*:\s*(.+)/i
    ),
    tahunAjaran: getDynamicValue(
      ["tahunAjaran", "tahun_ajaran", "{{tahun_ajaran}}"],
      /Tahun Ajaran\s*(.+?)(?=\.|\n|$)/i
    ),
  };

  const signerTitle =
    letterData?.signerTitle || vars.signerTitle || "Kepala Sekolah SMK Letris Indonesia 2";
  const signerName = letterData?.signerName || vars.signerName || defaultSignerName;

  return (
    <div className="min-h-screen bg-stone-900 flex flex-col justify-between overflow-hidden relative select-none font-serif print-wrapper">
      <style jsx global>{`
        @media print {
          html, body {
            height: auto !important;
            overflow: visible !important;
          }
          body {
            background-color: white !important;
            color: black !important;
          }
          .no-print {
            display: none !important;
          }
          .print-wrapper {
            background: transparent !important;
            min-height: auto !important;
            overflow: visible !important;
          }
          .print-main {
            display: block !important;
            overflow: visible !important;
            height: auto !important;
            padding: 0 !important;
            background: white !important;
          }
          .zoom-wrapper {
            display: block !important;
            transform: none !important;
          }
          .a4-container {
            border: none !important;
            box-shadow: none !important;
            width: 100% !important;
            min-height: auto !important;
            padding: 0 !important;
            margin: 0 !important;
          }
        }
      `}</style>

      {/* Top Bar */}
      <header className="no-print bg-stone-800 border-b border-stone-700 px-4 py-3 flex items-center justify-between z-30 shrink-0 text-white">
        <div className="flex items-center gap-3">
          <Link
            href="/teacher/history"
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
      <main className="print-main flex-1 overflow-auto p-4 sm:p-12 flex justify-center items-center relative bg-stone-950">
        {loading ? (
          <div className="text-white text-lg">Loading document...</div>
        ) : error ? (
          <div className="text-rose-400 text-lg">{error}</div>
        ) : (
          <div
            className="zoom-wrapper transition-transform duration-200 ease-out origin-top flex justify-center items-center"
            style={{ transform: `scale(${scale})` }}
          >
            <div id="printable-letter-document" className="a4-container w-[210mm] min-h-[297mm] bg-white p-12 border border-stone-600 shadow-2xl font-serif text-stone-900 text-xs leading-normal flex flex-col justify-between shrink-0 box-border">
              <div>
                {/* Kop Surat Header */}
                <div className="relative border-b-2 border-stone-900 pb-2 mb-4 clear-both">
                  <div className="float-left w-20 h-20 shrink-0 flex items-center justify-center mr-0">
                    <img src="/logo_letris.png" alt="Logo Letris" className="w-full h-full object-contain" />
                  </div>

                  <div className="float-right w-20 h-20 shrink-0 flex items-center justify-center ml-0">
                    <img src="/logo_banten.png" alt="Logo Banten" className="w-full h-full object-contain" />
                  </div>

                  <div className="text-center space-y-0.5 px-10">
                    <h2 className="font-bold text-sm uppercase">{yayasan}</h2>
                    <h1 className="font-extrabold text-3xl uppercase leading-tight">{schoolName}</h1>
                    <p className="font-semibold text-xs">{npsnNss}</p>
                    <p className="font-bold text-xs">{akreditasi}</p>
                    <p className="text-[11px] leading-tight text-stone-700 clear-both">{jurusan}</p>
                    <p className="text-[11px] text-stone-700">{address}</p>
                    <p className="text-[11px] text-blue-800 underline">{website}</p>
                  </div>
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
                      {letterData?.openingText || letterData?.body || letterData?.content || "—"}
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
                    <p>{formattedDate}</p>
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
      <footer className="no-print fixed bottom-6 left-1/2 -translate-x-1/2 bg-stone-800 text-white px-4 py-2.5 rounded-full border border-stone-700 shadow-2xl flex items-center gap-3 z-40">
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