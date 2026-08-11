"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/templates/DashboardLayout";
import { LetterFormEditor } from "@/components/organisms/LetterFormEditor";

// Pre-configured preset data matching all admin templates
const TEMPLATE_PRESETS: Record<string, { letterNumber: string; recipient: string; body: string }> = {
  "Surat Undangan": {
    letterNumber: "001/UND/SMK-2/2026",
    recipient: "Orang Tua / Wali Murid Kelas X",
    body: "Dengan hormat,\n\nSehubungan dengan pelaksanaan evaluasi pembelajaran semester, kami mengundang Bapak/Ibu Wali Murid untuk dapat hadir pada rapat koordinasi yang akan dilaksanakan pada:",
  },
  "Surat Tugas": {
    letterNumber: "002/ST/SMK-2/2026",
    recipient: "Bapak/Ibu Guru Pendamping",
    body: "Yang bertanda tangan di bawah ini Kepala SMK Letris Indonesia 2 memberikan tugas kepada nama terlampir untuk melaksanakan pendampingan kegiatan Lomba Keterampilan Siswa (LKS) Tingkat Kota Tangsel.",
  },
  "Surat Keterangan": {
    letterNumber: "003/SK/SMK-2/2026",
    recipient: "Siswa / Siswi Terlampir",
    body: "Kepala SMK Letris Indonesia 2 menerangkan bahwa nama yang tercantum di bawah ini adalah benar tercatat sebagai siswa aktif SMK Letris Indonesia 2 Tahun Ajaran 2026/2027.",
  },
  "Surat Keputusan": {
    letterNumber: "004/SKep/SMK-2/2026",
    recipient: "Seluruh Dewan Guru & Staf",
    body: "MEMUTUSKAN:\n1. Menetapkan susunan panitia Ujian Akhir Semester.\n2. Keputusan ini berlaku sejak tanggal ditetapkan.",
  },
  "Surat Pemberitahuan": {
    letterNumber: "005/PEMT/SMK-2/2026",
    recipient: "Seluruh Orang Tua Murid",
    body: "Diberitahukan kepada seluruh Orang Tua/Wali Murid bahwa kegiatan Pembelajaran Jarak Jauh (PJJ) akan dilaksanakan pada tanggal terlampir.",
  },
};

function NewLetterContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const templateQuery = searchParams.get("template");

  const [selectedTemplate, setSelectedTemplate] = useState<any | null>(null);

  const [letterData, setLetterData] = useState({
    institutionName: "",
    letterNumber: TEMPLATE_PRESETS["Surat Undangan"].letterNumber,
    recipient: TEMPLATE_PRESETS["Surat Undangan"].recipient,
    subject: "Surat Undangan",
    date: new Date().toISOString().split("T")[0],
    body: TEMPLATE_PRESETS["Surat Undangan"].body,
  });

  const navItems = [
    { label: "Overview", href: "/", isActive: false },
    { label: "New letter", href: "/new-letter", isActive: true },
    { label: "History", href: "/history", isActive: false },
    { label: "Pending", href: "/pending", isActive: false },
  ];

  const mockUser = {
    name: "Teacher",
    username: "teacher_dev",
    avatarUrl: "",
    role: "teacher",
  };

  const templates = [
    { id: "1", title: "Surat Undangan" },
    { id: "2", title: "Surat Tugas" },
    { id: "3", title: "Surat Keterangan" },
    { id: "4", title: "Surat Keputusan" },
    { id: "5", title: "Surat Pemberitahuan" },
  ];

  // Helper function to set active template and auto-fill corresponding data
  const applyTemplatePreset = (title: string) => {
    const matched = templates.find(
      (t) => t.title.toLowerCase() === title.toLowerCase()
    ) || { id: "custom", title };

    setSelectedTemplate(matched);

    const preset = TEMPLATE_PRESETS[matched.title];
    if (preset) {
      setLetterData((prev) => ({
        ...prev,
        subject: matched.title,
        letterNumber: preset.letterNumber,
        recipient: preset.recipient,
        body: preset.body,
      }));
    } else {
      setLetterData((prev) => ({
        ...prev,
        subject: matched.title,
      }));
    }
  };

  // Auto-select template if passed via URL
  useEffect(() => {
    if (templateQuery) {
      applyTemplatePreset(templateQuery);
    }
  }, [templateQuery]);

  const handleSubmitForApproval = () => {
    alert("Surat berhasil dikirim ke Admin untuk diperiksa dan ditandatangani!");
    router.push("/pending");
  };

  const handleExportDocx = () => {
    alert("Memproses unduhan format .DOCX...");
  };

  const handlePrintPdf = () => {
    window.print();
  };

  return (
    <DashboardLayout navItems={navItems} currentUser={mockUser}>
      <div className="flex flex-col gap-6">
        {!selectedTemplate ? (
          /* Template Selection View */
          <>
            <h1 className="text-3xl font-serif text-stone-900">
              Welcome, <span className="italic">{mockUser.name}</span>
            </h1>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {templates.map((template) => (
                <button
                  key={template.id}
                  type="button"
                  onClick={() => applyTemplatePreset(template.title)}
                  className="group flex flex-col items-center gap-2 text-center transition-transform hover:-translate-y-1 cursor-pointer"
                >
                  <div className="w-full aspect-3/4 bg-stone-800 rounded-3xl overflow-hidden border-2 border-transparent group-hover:border-stone-900 shadow-md relative">
                    <div className="w-full h-full bg-slate-900 flex items-center justify-center text-white text-xs p-4">
                      <span>Template Preview</span>
                    </div>
                  </div>
                  <span className="font-serif text-base text-stone-900 font-medium">
                    {template.title}
                  </span>
                </button>
              ))}
            </div>
          </>
        ) : (
          /* Form Editor View */
          <div className="flex flex-col gap-6">
            {/* Page Header */}
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold uppercase text-stone-500 tracking-wider">
                  Pengajuan Surat Guru
                </span>
                <h1 className="text-3xl font-serif font-bold text-stone-900 mt-0.5">
                  {selectedTemplate.title}
                </h1>
              </div>

              <button
                type="button"
                onClick={() => setSelectedTemplate(null)}
                className="px-4 py-1.5 rounded-full bg-black text-white text-xs font-medium hover:bg-stone-800 transition-colors shadow-sm"
              >
                ← Change Template
              </button>
            </div>

            {/* Side-by-Side Form + Paper Preview */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
              {/* Left Column: Form Editor with Preset Selector */}
              <div className="space-y-4">
                {/* Quick Preset Selector */}
                <div className="bg-stone-50 p-3 rounded-xl border border-stone-200">
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Ganti Template Cepat (Isi Otomatis)
                  </label>
                  <select
                    value={selectedTemplate.title}
                    onChange={(e) => applyTemplatePreset(e.target.value)}
                    className="w-full p-2 border border-stone-300 rounded-lg text-xs bg-white focus:outline-none focus:ring-1 focus:ring-stone-800 font-serif"
                  >
                    {templates.map((t) => (
                      <option key={t.id} value={t.title}>
                        {t.title}
                      </option>
                    ))}
                  </select>
                </div>

                <LetterFormEditor
                  formData={letterData}
                  onChange={(updatedData) =>
                    setLetterData((prev) => ({ ...prev, ...updatedData }))
                  }
                  onSubmitForApproval={handleSubmitForApproval}
                  onSaveDraft={() => alert("Draf surat berhasil disimpan!")}
                />
              </div>

              {/* Right Column: Live A4 Document Preview Header & Paper */}
              <div className="sticky top-6 w-full max-w-md mx-auto">
                {/* Top Action Bar matching Admin Header */}
                <div className="bg-stone-900 text-white p-3 rounded-t-xl flex justify-between items-center text-xs font-sans">
                  <span className="font-semibold tracking-wide">
                    Live Document Export
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleExportDocx}
                      className="px-2.5 py-1 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded border border-stone-700 transition-colors text-[10px] flex items-center gap-1"
                    >
                      ↓ DOCX
                    </button>
                    <button
                      type="button"
                      onClick={handlePrintPdf}
                      className="px-2.5 py-1 bg-emerald-700 hover:bg-emerald-600 text-white rounded transition-colors text-[10px] flex items-center gap-1 font-medium"
                    >
                      Print / PDF
                    </button>
                  </div>
                </div>

                {/* Paper Container */}
                <div className="w-full h-160 bg-white rounded-b-xl shadow-2xl border-x border-b border-stone-300 p-6 flex flex-col justify-between text-stone-900 font-serif text-[11px] leading-relaxed overflow-hidden">
                  <div className="flex flex-col flex-1 min-h-0">
                    {/* Status Sub-header */}
                    <div className="mb-3 flex justify-between items-center border-b pb-2 border-dashed border-stone-300 font-sans shrink-0">
                      <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wide flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                        STATUS: PEMBUATAN SURAT TEACHER
                      </span>
                      <span className="text-[9px] bg-stone-100 text-stone-600 px-1.5 py-0.5 rounded font-sans">
                        A4 Paper View
                      </span>
                    </div>

                    {/* Kop Surat Header */}
                    <div className="relative border-b-4 border-double border-stone-900 pb-2 mb-3 text-center shrink-0">
                      <div className="absolute left-0 top-0 w-9 h-9 border border-dashed border-blue-400 rounded-full flex items-center justify-center text-[6px] text-blue-600 font-sans font-bold text-center leading-tight">
                        LOGO LETRIS 2
                      </div>
                      <div className="absolute right-0 top-0 w-9 h-9 border border-dashed border-emerald-500 rounded flex items-center justify-center text-[6px] text-emerald-700 font-sans font-bold text-center leading-tight">
                        LOGO BANTEN
                      </div>

                      <div className="px-8">
                        <h4 className="font-bold text-[9px] tracking-tight uppercase leading-tight">
                          YAYASAN LEO SUTRISNO
                        </h4>
                        <h3 className="font-bold text-[11px] tracking-wide uppercase leading-tight">
                          SMK LETRIS INDONESIA 2
                        </h3>
                        <p className="text-[7.5px] font-sans text-stone-700 leading-tight">
                          NPSN : 69894185 &nbsp;&nbsp; NSS : 402286303080
                        </p>
                        <p className="text-[7.5px] font-sans font-semibold text-stone-800 leading-tight">
                          ( AKREDITASI " A " )
                        </p>
                        <p className="text-[6.5px] font-sans text-stone-600 leading-tight">
                          Kompetensi Keahlian : DKV, TJKT, PPLG, MPLB, PM, Akuntansi
                        </p>
                        <p className="text-[6.5px] font-sans text-stone-600 leading-tight">
                          Jl. Raya Siliwangi No. 55 Pamulang, Kota Tangerang Selatan
                        </p>
                        <span className="text-[6.5px] text-blue-700 underline font-sans">
                          www.smkletrisdua.sch.id
                        </span>
                      </div>
                    </div>

                    {/* Letter Meta */}
                    <div className="flex justify-between text-[9.5px] mb-3 font-sans shrink-0">
                      <div className="space-y-0.5">
                        <p>
                          <span className="font-semibold">Nomor:</span>{" "}
                          {letterData.letterNumber || "[Diisi oleh Teacher]"}
                        </p>
                        <p>
                          <span className="font-semibold">Hal:</span>{" "}
                          {selectedTemplate?.title || "Surat"}
                        </p>
                      </div>
                      <div className="text-right">
                        <p>Tangerang Selatan, {letterData.date || "2026-08-11"}</p>
                      </div>
                    </div>

                    {/* Recipient */}
                    <div className="mb-3 font-sans text-[9.5px] space-y-0.5 shrink-0">
                      <p className="font-semibold">Kepada Yth.</p>
                      <p>{letterData.recipient || "Bapak/Ibu Penerima"}</p>
                      <p className="text-stone-500">Di Tempat</p>
                    </div>

                    {/* Sender Subhead */}
                    {letterData.institutionName && (
                      <p className="text-[9.5px] font-semibold text-stone-700 mb-2 font-sans shrink-0">
                        Pengirim: {letterData.institutionName}
                      </p>
                    )}

                    {/* Body Scrollable Area */}
                    <div className="flex-1 overflow-y-auto pr-1 my-1 scrollbar-thin scrollbar-thumb-stone-300 min-h-0">
                      <p className="leading-relaxed whitespace-pre-wrap text-[9.5px] text-stone-800 font-sans">
                        {letterData.body || (
                          <span className="italic text-stone-400">
                            Isi surat akan langsung muncul di sini saat Anda mengetik di formulir...
                          </span>
                        )}
                      </p>
                    </div>
                  </div>

                  {/* Signature Section */}
                  <div className="flex justify-end pt-3 border-t border-stone-100 font-sans text-[8.5px] shrink-0">
                    <div className="text-center w-36 border border-dashed border-stone-200 p-1.5 rounded bg-stone-50/50">
                      <p className="text-stone-500">Mengetahui,</p>
                      <p className="font-semibold text-stone-800">
                        Kepala Sekolah / Admin
                      </p>
                      <div className="h-8 flex items-center justify-center italic text-stone-400 text-[7.5px]">
                        [Belum Ditandatangani]
                      </div>
                      <p className="font-bold underline text-stone-700">
                        NIP. ....................
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

export default function NewLetterPage() {
  return (
    <Suspense fallback={<div className="p-8 font-sans">Loading...</div>}>
      <NewLetterContent />
    </Suspense>
  );
}