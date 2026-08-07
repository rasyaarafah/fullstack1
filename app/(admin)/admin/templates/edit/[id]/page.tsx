"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { DashboardLayout } from "@/components/templates/DashboardLayout";

export default function TemplateEditorPage() {
  const params = useParams();
  const templateId = params.id as string;

  const adminNavItems = [
    { label: "Overview", href: "/admin" },
    { label: "Pending Approval", href: "/admin/pending" },
    { label: "Archive", href: "/admin/history" },
    { label: "User Management", href: "/admin/users" },
    { label: "New letter", href: "/admin/new-letter" },
  ];

  const adminToolsItems = [
    { label: "Edit template", href: "/admin/templates/edit", isActive: true },
    { label: "Add template", href: "/admin/templates/new" },
    { label: "Broadcast notice", href: "/admin/notice" },
  ];

  // Header Details State
  const [yayasan, setYayasan] = useState("YAYASAN LEO SUTRISNO");
  const [schoolName, setSchoolName] = useState("SMK LETRIS INDONESIA 2");
  const [npsnNss, setNpsnNss] = useState("NPSN : 69894185 NSS : 402286303080");
  const [akreditasi, setAkreditasi] = useState('( AKREDITASI " A " )');
  const [jurusan, setJurusan] = useState(
    "Kompetensi Keahlian : Desain Komunikasi Visual (DKV) , Teknik Jaringan Komputer dan Telekomunikasi (TJKT) , Pengembangan Perangkat Lunak dan Gim (PPLG) , Manajemen Perkantoran dan Layanan Bisnis (MPLB) , Pemasaran (PM) , Akuntansi Keuangan Lembaga"
  );
  const [address, setAddress] = useState(
    "Jl. Raya Siliwangi No. 55 Pondok Benda – Pamulang Telp. 021-29446273 Kota Tangerang Selatan Provinsi Banten"
  );
  const [website, setWebsite] = useState("www.smkletris2pamulang.sch.id");

  // Letter Metadata State
  const [cityDate, setCityDate] = useState("Tangerang Selatan, {tanggal_surat}");
  const [nomor, setNomor] = useState("{nomor_surat}");
  const [perihal, setPerihal] = useState("Undangan Pengambilan Raport");
  const [recipient, setRecipient] = useState(
    "Bapak/Ibu Orang Tua/Wali Siswa\n{nama_siswa}"
  );

  // Body Paragraphs State
  const [openingText, setOpeningText] = useState(
    "Sehubungan dengan telah berakhrinya kegiatan Pembelajaran Semester, maka SMK Letris Indonesia 2 akan mengadakan pembagian raport. Untuk itu, kami mengundang para Bapak/Ibu Orang tua/Wali siswa untuk mengambil raport pada :"
  );
  const [closingText, setClosingText] = useState(
    "Demikian surat undangan ini kami sampaikan, atas perhatian dan kehadirannya kami ucapkan terima kasih."
  );

  // Event Details
  const [eventDay, setEventDay] = useState("{hari_tanggal}");
  const [eventTime, setEventTime] = useState("{waktu}");
  const [eventLocation, setEventLocation] = useState(
    "Aula SMK Letris Indonesia 2"
  );

  // Signer Details
  const [signerTitle, setSignerTitle] = useState(
    "Kepala Sekolah SMK Letris Indonesia 2"
  );
  const [signerName, setSignerName] = useState("{nama_kepala_sekolah}");

  const availableVariables = [
    "{tanggal_surat}",
    "{nomor_surat}",
    "{nama_siswa}",
    "{hari_tanggal}",
    "{waktu}",
    "{nama_kepala_sekolah}",
  ];

  return (
    <DashboardLayout navItems={adminNavItems} adminTools={adminToolsItems}>
      <style jsx global>{`
        @page {
          size: A4 portrait;
          margin: 15mm;
        }
        @media print {
          body {
            background: white !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          .no-print {
            display: none !important;
          }
          .a4-container {
            box-shadow: none !important;
            border: none !important;
            margin: 0 !important;
            padding: 0 !important;
            width: 100% !important;
            min-height: auto !important;
            height: auto !important;
            transform: none !important;
          }
        }
      `}</style>

      <div className="space-y-4 max-w-[1600px] mx-auto w-full px-2 sm:px-0">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-300 pb-3 no-print">
          <div className="flex items-center gap-3">
            <Link
              href="/admin/templates/edit"
              className="p-1.5 hover:bg-stone-200 rounded-lg transition-colors border border-stone-800 text-stone-800 shrink-0"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </Link>
            <div>
              <h1 className="font-serif text-xl sm:text-2xl font-bold text-stone-900 leading-tight">
                Edit Template:{" "}
                <span className="italic font-normal">{schoolName}</span>
              </h1>
              <p className="font-serif text-xs text-stone-500">
                A4 Document Standard (210mm x 297mm)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <Link
              href={`/admin/templates/preview/${templateId}`}
              target="_blank"
              className="px-3 py-1.5 sm:px-4 sm:py-2 border border-stone-800 rounded-lg font-serif text-xs sm:text-sm text-stone-900 hover:bg-stone-100 transition-colors flex items-center gap-1.5"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
              <span>Full Preview</span>
            </Link>

            <Link
              href="/admin/templates/edit"
              className="px-3 py-1.5 sm:px-4 sm:py-2 border border-stone-800 rounded-lg font-serif text-xs sm:text-sm text-stone-900 hover:bg-stone-100 transition-colors"
            >
              Cancel
            </Link>

            <button
              onClick={() => alert("Template saved successfully!")}
              className="px-3 py-1.5 sm:px-4 sm:py-2 bg-stone-900 text-white rounded-lg font-serif text-xs sm:text-sm hover:bg-stone-800 transition-colors cursor-pointer"
            >
              Save Changes
            </button>
          </div>
        </div>

        {/* Dynamic Variable Pills */}
        <div className="bg-stone-50 p-2.5 sm:p-3 border border-stone-300 rounded-xl flex items-center gap-2 overflow-x-auto no-print">
          <span className="font-serif text-xs font-semibold text-stone-700 whitespace-nowrap">
            Variables:
          </span>
          {availableVariables.map((v) => (
            <span
              key={v}
              className="px-2 py-0.5 text-xs font-mono bg-white border border-stone-400 rounded text-stone-800 shrink-0"
            >
              {v}
            </span>
          ))}
        </div>

        {/* Editor Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
          {/* Form Controls Column (5 cols) */}
          <div className="xl:col-span-5 space-y-4 bg-white p-4 sm:p-5 border border-stone-800 rounded-xl xl:max-h-[85vh] xl:overflow-y-auto no-print">
            <h2 className="font-serif text-lg font-bold text-stone-900 border-b pb-2 border-stone-200">
              Template Controls
            </h2>

            {/* Header Details */}
            <div className="space-y-3">
              <h3 className="font-serif text-xs font-bold text-stone-500 uppercase tracking-wider">
                Header (Kop Surat)
              </h3>
              <div>
                <label className="block text-xs font-semibold text-stone-600 mb-1">
                  Yayasan
                </label>
                <input
                  type="text"
                  value={yayasan}
                  onChange={(e) => setYayasan(e.target.value)}
                  className="w-full p-2 border border-stone-300 rounded font-serif text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-600 mb-1">
                  Nama Sekolah
                </label>
                <input
                  type="text"
                  value={schoolName}
                  onChange={(e) => setSchoolName(e.target.value)}
                  className="w-full p-2 border border-stone-300 rounded font-serif text-xs font-bold"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-stone-600 mb-1">
                    NPSN / NSS
                  </label>
                  <input
                    type="text"
                    value={npsnNss}
                    onChange={(e) => setNpsnNss(e.target.value)}
                    className="w-full p-2 border border-stone-300 rounded font-serif text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-600 mb-1">
                    Akreditasi
                  </label>
                  <input
                    type="text"
                    value={akreditasi}
                    onChange={(e) => setAkreditasi(e.target.value)}
                    className="w-full p-2 border border-stone-300 rounded font-serif text-xs"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-600 mb-1">
                  Jurusan / Keahlian
                </label>
                <textarea
                  rows={2}
                  value={jurusan}
                  onChange={(e) => setJurusan(e.target.value)}
                  className="w-full p-2 border border-stone-300 rounded font-serif text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-600 mb-1">
                  Alamat
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full p-2 border border-stone-300 rounded font-serif text-xs"
                />
              </div>
            </div>

            {/* Letter Metadata */}
            <div className="space-y-3 pt-3 border-t border-stone-200">
              <h3 className="font-serif text-xs font-bold text-stone-500 uppercase tracking-wider">
                Surat Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-stone-600 mb-1">
                    Nomor Surat
                  </label>
                  <input
                    type="text"
                    value={nomor}
                    onChange={(e) => setNomor(e.target.value)}
                    className="w-full p-2 border border-stone-300 rounded font-serif text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-600 mb-1">
                    Kota & Tanggal
                  </label>
                  <input
                    type="text"
                    value={cityDate}
                    onChange={(e) => setCityDate(e.target.value)}
                    className="w-full p-2 border border-stone-300 rounded font-serif text-xs"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-600 mb-1">
                  Perihal
                </label>
                <input
                  type="text"
                  value={perihal}
                  onChange={(e) => setPerihal(e.target.value)}
                  className="w-full p-2 border border-stone-300 rounded font-serif text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-600 mb-1">
                  Penerima (Recipient)
                </label>
                <textarea
                  rows={2}
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  className="w-full p-2 border border-stone-300 rounded font-serif text-xs"
                />
              </div>
            </div>

            {/* Content Paragraphs */}
            <div className="space-y-3 pt-3 border-t border-stone-200">
              <h3 className="font-serif text-xs font-bold text-stone-500 uppercase tracking-wider">
                Body Paragraphs
              </h3>
              <div>
                <label className="block text-xs font-semibold text-stone-600 mb-1">
                  Paragraf Pembuka (Opening)
                </label>
                <textarea
                  rows={4}
                  value={openingText}
                  onChange={(e) => setOpeningText(e.target.value)}
                  className="w-full p-2 border border-stone-300 rounded font-serif text-xs leading-relaxed"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-600 mb-1">
                  Paragraf Penutup (Closing)
                </label>
                <textarea
                  rows={3}
                  value={closingText}
                  onChange={(e) => setClosingText(e.target.value)}
                  className="w-full p-2 border border-stone-300 rounded font-serif text-xs leading-relaxed"
                />
              </div>
            </div>

            {/* Event Details */}
            <div className="space-y-3 pt-3 border-t border-stone-200">
              <h3 className="font-serif text-xs font-bold text-stone-500 uppercase tracking-wider">
                Event Schedule
              </h3>
              <div>
                <label className="block text-xs font-semibold text-stone-600 mb-1">
                  Hari / Tanggal
                </label>
                <input
                  type="text"
                  value={eventDay}
                  onChange={(e) => setEventDay(e.target.value)}
                  className="w-full p-2 border border-stone-300 rounded font-serif text-xs"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-stone-600 mb-1">
                    Waktu
                  </label>
                  <input
                    type="text"
                    value={eventTime}
                    onChange={(e) => setEventTime(e.target.value)}
                    className="w-full p-2 border border-stone-300 rounded font-serif text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-600 mb-1">
                    Tempat
                  </label>
                  <input
                    type="text"
                    value={eventLocation}
                    onChange={(e) => setEventLocation(e.target.value)}
                    className="w-full p-2 border border-stone-300 rounded font-serif text-xs"
                  />
                </div>
              </div>
            </div>

            {/* Signer Details */}
            <div className="space-y-3 pt-3 border-t border-stone-200">
              <h3 className="font-serif text-xs font-bold text-stone-500 uppercase tracking-wider">
                Signer
              </h3>
              <div>
                <label className="block text-xs font-semibold text-stone-600 mb-1">
                  Jabatan Penandatangan
                </label>
                <input
                  type="text"
                  value={signerTitle}
                  onChange={(e) => setSignerTitle(e.target.value)}
                  className="w-full p-2 border border-stone-300 rounded font-serif text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-600 mb-1">
                  Nama Penandatangan
                </label>
                <input
                  type="text"
                  value={signerName}
                  onChange={(e) => setSignerName(e.target.value)}
                  className="w-full p-2 border border-stone-300 rounded font-serif text-xs font-bold"
                />
              </div>
            </div>
          </div>

          {/* Responsive A4 Wrapper */}
          <div className="xl:col-span-7 bg-stone-300 p-2 sm:p-6 border border-stone-800 rounded-xl overflow-x-auto flex justify-center items-start w-full">
            {/* A4 Container */}
            <div className="a4-container w-full max-w-[210mm] min-h-[297mm] bg-white p-4 sm:p-8 md:p-12 border border-stone-400 shadow-2xl font-serif text-stone-900 text-[10px] sm:text-xs leading-normal flex flex-col justify-between box-border overflow-hidden shrink-0 my-0 mx-auto scale-[0.85] sm:scale-100 origin-top">
              <div>
                {/* Header Kop Surat */}
                <div className="flex items-center justify-between gap-1.5 sm:gap-4 border-b-2 border-stone-900 pb-2 mb-4">
                  <div className="w-10 h-10 sm:w-16 sm:h-16 shrink-0 flex items-center justify-center border-2 border-dashed border-blue-600 rounded-full bg-blue-50 text-[7px] sm:text-[9px] font-bold text-blue-900 text-center p-0.5 sm:p-1">
                    LOGO LETRIS 2
                  </div>

                  <div className="text-center flex-1 space-y-0.5 overflow-hidden">
                    <h2 className="font-bold text-[9px] sm:text-[11px] tracking-wider uppercase wrap-break-word">
                      {yayasan}
                    </h2>
                    <h1 className="font-extrabold text-[11px] sm:text-base tracking-wide uppercase leading-tight wrap-break-word">
                      {schoolName}
                    </h1>
                    <p className="font-semibold text-[8px] sm:text-[10px] wrap-break-word">
                      {npsnNss}
                    </p>
                    <p className="font-bold text-[8px] sm:text-[10px] wrap-break-word">
                      {akreditasi}
                    </p>
                    <p className="text-[7.5px] sm:text-[9px] px-1 sm:px-2 leading-tight text-stone-700 wrap-break-word">
                      {jurusan}
                    </p>
                    <p className="text-[7.5px] sm:text-[9px] text-stone-700 wrap-break-word">
                      {address}
                    </p>
                    <p className="text-[7.5px] sm:text-[9px] text-blue-800 underline wrap-break-word">
                      {website}
                    </p>
                  </div>

                  <div className="w-10 h-10 sm:w-16 sm:h-16 shrink-0 flex items-center justify-center border-2 border-dashed border-emerald-600 rounded bg-emerald-50 text-[7px] sm:text-[9px] font-bold text-emerald-900 text-center p-0.5 sm:p-1">
                    LOGO BANTEN
                  </div>
                </div>

                {/* City and Date Header */}
                <div className="flex justify-end mb-4 w-full">
                  <span className="text-right max-w-full wrap-break-word">
                    {cityDate}
                  </span>
                </div>

                {/* Letter Metadata */}
                <div className="space-y-1 mb-4">
                  <div className="grid grid-cols-12 gap-1">
                    <span className="col-span-3 sm:col-span-2">Nomor</span>
                    <span className="col-span-9 sm:col-span-10 wrap-break-word">: {nomor}</span>
                  </div>
                  <div className="grid grid-cols-12 gap-1">
                    <span className="col-span-3 sm:col-span-2">Perihal</span>
                    <span className="col-span-9 sm:col-span-10 font-semibold wrap-break-word">
                      : {perihal}
                    </span>
                  </div>
                  <div className="pt-2 space-y-0.5">
                    <p>Kepada Yth,</p>
                    <p className="font-semibold whitespace-pre-line leading-snug wrap-break-word">
                      {recipient}
                    </p>
                    <p>di Tempat</p>
                  </div>
                </div>

                {/* Opening Body */}
                <div className="space-y-2 mb-4">
                  <p>Dengan hormat,</p>
                  <p className="text-justify indent-6 sm:indent-8 leading-relaxed wrap-break-word">
                    {openingText}
                  </p>
                </div>

                {/* Event Schedule Details */}
                <div className="pl-3 sm:pl-8 space-y-1 mb-4">
                  <div className="grid grid-cols-12 gap-1">
                    <span className="col-span-4 sm:col-span-3">Hari/Tanggal</span>
                    <span className="col-span-8 sm:col-span-9 wrap-break-word">: {eventDay}</span>
                  </div>
                  <div className="grid grid-cols-12 gap-1">
                    <span className="col-span-4 sm:col-span-3">Waktu</span>
                    <span className="col-span-8 sm:col-span-9 wrap-break-word">: {eventTime}</span>
                  </div>
                  <div className="grid grid-cols-12 gap-1">
                    <span className="col-span-4 sm:col-span-3">Tempat</span>
                    <span className="col-span-8 sm:col-span-9 wrap-break-word">
                      : {eventLocation}
                    </span>
                  </div>
                </div>

                {/* Closing Body */}
                <div className="space-y-2 mb-4">
                  <p className="text-justify indent-6 sm:indent-8 leading-relaxed wrap-break-word">
                    {closingText}
                  </p>
                </div>
              </div>

              {/* Bottom Signature Section */}
              <div className="flex justify-end pt-2 mt-2">
                <div className="text-center min-w-36 sm:min-w-56 max-w-xs space-y-8 sm:space-y-12">
                  <div>
                    <p>Hormat Kami,</p>
                    <p className="font-semibold wrap-break-word">{signerTitle}</p>
                  </div>
                  <div>
                    <p className="font-bold underline uppercase wrap-break-word">
                      {signerName}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}