"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/templates/DashboardLayout";
import { LetterFormEditor } from "@/components/organisms/LetterFormEditor";
import { TemplateCard } from "@/components/molecules/TemplateCard";

const LOGO_OPTIONS_LEFT = [
  { label: "SMK Letris Indonesia 2", value: "/logo_letris.png" },
  { label: "SMK Letris Kesehatan", value: "/logo_letris_kesehatan.png" },
  { label: "Tanpa Logo Kiri", value: "" },
];

const LOGO_OPTIONS_RIGHT = [
  { label: "Provinsi Banten", value: "/logo_banten.png" },
  { label: "Tanpa Logo Kanan", value: "" },
];

const TEMPLATE_PRESETS: Record<string, { letterNumber: string; recipient: string; body: string }> = {
  "Surat Undangan": {
    letterNumber: "001/UND/SMK-2/2026",
    recipient: "Orang Tua / Wali Murid Kelas X",
    body: "Dengan hormat,\n\nSehubungan dengan pelaksanaan evaluasi pembelajaran semester, kami mengundang Bapak/Ibu Wali Murid untuk dapat hadir pada rapat koordinasi yang akan dilaksanakan pada:\n\nHari/Tanggal : Sabtu, 22 Agustus 2026\nWaktu : 09.00 WIB - Selesai\nTempat : Aula Utama SMK Letris Indonesia 2\n\nDemikian surat undangan ini kami sampaikan. Atas perhatian dan kehadiran Bapak/Ibu, kami ucapkan terima kasih.",
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

// Base64 Image Fetcher for DOCX exports
async function getBase64ImageFromUrl(imageUrl: string): Promise<string> {
  if (!imageUrl) return "";
  try {
    const fullUrl = imageUrl.startsWith("http")
      ? imageUrl
      : `${window.location.origin}${imageUrl.startsWith("/") ? "" : "/"}${imageUrl}`;

    const res = await fetch(fullUrl);
    if (!res.ok) throw new Error("Image fetch failed");
    const blob = await res.blob();
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = () => resolve("");
      reader.readAsDataURL(blob);
    });
  } catch (err) {
    console.warn("Could not encode image to Base64:", imageUrl, err);
    return "";
  }
}

function NewLetterContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const templateQuery = searchParams.get("template");

  const [selectedTemplate, setSelectedTemplate] = useState<any | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [leftLogo, setLeftLogo] = useState<string>(LOGO_OPTIONS_LEFT[0].value);
  const [rightLogo, setRightLogo] = useState<string>(LOGO_OPTIONS_RIGHT[0].value);

  const [letterData, setLetterData] = useState({
    institutionName: "",
    letterNumber: TEMPLATE_PRESETS["Surat Undangan"].letterNumber,
    recipient: TEMPLATE_PRESETS["Surat Undangan"].recipient,
    subject: "Surat Undangan",
    date: new Date().toISOString().split("T")[0],
    body: TEMPLATE_PRESETS["Surat Undangan"].body,
  });

  const navItems = [
    { label: "Overview", href: "/teacher", isActive: false },
    { label: "New letter", href: "/teacher/new-letter", isActive: true },
    { label: "History", href: "/teacher/history", isActive: false },
    { label: "Pending", href: "/teacher/pending", isActive: false },
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

  useEffect(() => {
    if (templateQuery) {
      applyTemplatePreset(templateQuery);
    }
  }, [templateQuery]);

  const handleSaveLetter = async (status: "PENDING" | "DRAFT") => {
    try {
      setIsSubmitting(true);
      const res = await fetch("/api/letters", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: selectedTemplate?.title || letterData.subject || "Surat",
          letterNumber: letterData.letterNumber,
          recipient: letterData.recipient,
          subject: letterData.subject,
          body: letterData.body,
          status,
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Gagal menyimpan surat.");
      }

      if (status === "PENDING") {
        alert("Surat berhasil dikirim ke Admin untuk diperiksa dan ditandatangani!");
        router.push("/teacher/pending");
      } else {
        alert("Draf surat berhasil disimpan!");
        router.push("/teacher/history");
      }
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Terjadi kesalahan saat menyimpan surat.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleExportDocx = async () => {
    const formattedBody = letterData.body ? letterData.body.replace(/\n/g, "<br/>") : "";
    const leftLogoBase64 = leftLogo ? await getBase64ImageFromUrl(leftLogo) : "";
    const rightLogoBase64 = rightLogo ? await getBase64ImageFromUrl(rightLogo) : "";

    const htmlString = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <meta charset='utf-8'>
        <title>${letterData.subject || "Surat"}</title>
        <style>
          @page { size: A4; margin: 2.5cm 2cm; }
          body { font-family: 'Arial', sans-serif; font-size: 11pt; line-height: 1.5; color: #000; }
          p { margin: 0 0 6pt 0; }
          table { border-collapse: collapse; }
          .kop-table { width: 100%; border-bottom: 3px double #000; padding-bottom: 8px; margin-bottom: 20px; }
          .logo-cell { width: 80px; text-align: center; vertical-align: middle; }
          .logo-img { max-width: 70px; max-height: 70px; height: auto; }
          .header-text { text-align: center; }
          .meta-table { width: 100%; margin-bottom: 20px; font-size: 10pt; }
          .body-text { font-size: 10.5pt; text-align: left; line-height: 1.6; margin-bottom: 30px; word-wrap: break-word; }
          .sig-table { width: 100%; font-size: 10pt; margin-top: 30px; }
        </style>
      </head>
      <body>
        <table class="kop-table" border="0" cellpadding="0" cellspacing="0">
          <tr>
            <td class="logo-cell">
              ${leftLogoBase64 ? `<img src="${leftLogoBase64}" class="logo-img" alt="Logo Kiri" />` : ""}
            </td>
            <td class="header-text">
              <div style="font-size: 10pt; font-weight: bold;">YAYASAN LEO SUTRISNO</div>
              <div style="font-size: 14pt; font-weight: bold;">SMK LETRIS INDONESIA 2</div>
              <div style="font-size: 8pt;">NPSN : 69894185 &nbsp;&nbsp; NSS : 402286303080</div>
              <div style="font-size: 8pt; font-weight: bold;">( AKREDITASI " A " )</div>
              <div style="font-size: 7.5pt;">Kompetensi Keahlian : DKV, TJKT, PPLG, MPLB, PM, Akuntansi</div>
              <div style="font-size: 7.5pt;">Jl. Raya Siliwangi No. 55 Pamulang, Kota Tangerang Selatan</div>
              <div style="font-size: 7.5pt; color: #0000FF; text-decoration: underline;">www.smkletrisdua.sch.id</div>
            </td>
            <td class="logo-cell">
              ${rightLogoBase64 ? `<img src="${rightLogoBase64}" class="logo-img" alt="Logo Kanan" />` : ""}
            </td>
          </tr>
        </table>

        <table class="meta-table" border="0" cellpadding="0" cellspacing="0">
          <tr>
            <td valign="top" width="60%">
              <b>Nomor:</b> ${letterData.letterNumber || "-"}<br/>
              <b>Hal:</b> ${letterData.subject || "Surat"}
            </td>
            <td align="right" valign="top" width="40%">
              Tangerang Selatan, ${letterData.date}
            </td>
          </tr>
        </table>

        <div style="font-size: 10pt; margin-bottom: 20px;">
          <b>Kepada Yth.</b><br/>
          ${letterData.recipient || "Penerima"}<br/>
          Di Tempat
        </div>

        ${letterData.institutionName ? `<p style="font-size: 10pt;"><b>Pengirim:</b> ${letterData.institutionName}</p>` : ""}

        <div class="body-text">${formattedBody}</div>

        <table class="sig-table" border="0" cellpadding="0" cellspacing="0">
          <tr>
            <td width="60%"></td>
            <td width="40%" align="center">
              <p>Mengetahui,</p>
              <p><b>Kepala Sekolah / Admin</b></p>
              <br/><br/><br/>
              <p><u><b>NIP. ....................</b></u></p>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;

    const blob = new Blob(["\ufeff", htmlString], { type: "application/msword" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${letterData.subject || "Surat"}_${letterData.letterNumber || "Draft"}.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  /* Isolated Iframe Print Handler */
  const handlePrintPdf = () => {
    const printElement = document.getElementById("printable-letter");
    if (!printElement) return;

    const iframe = document.createElement("iframe");
    iframe.style.position = "fixed";
    iframe.style.right = "0";
    iframe.style.bottom = "0";
    iframe.style.width = "0";
    iframe.style.height = "0";
    iframe.style.border = "0";
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow?.document;
    if (!doc) return;

    const styles = Array.from(document.querySelectorAll('style, link[rel="stylesheet"]'))
      .map((style) => style.outerHTML)
      .join("");

    doc.open();
    doc.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Print Letter</title>
          ${styles}
          <style>
            @page {
              size: A4 portrait;
              margin: 0;
            }
            body {
              background: #ffffff !important;
              margin: 0 !important;
              padding: 0 !important;
              display: flex;
              justify-content: center;
            }
            #print-root {
              width: 210mm !important;
              min-height: 297mm !important;
              max-height: 297mm !important;
              padding: 20mm 25mm !important;
              box-sizing: border-box !important;
              background: white !important;
              display: flex !important;
              flex-direction: column !important;
              justify-content: space-between !important;
              overflow: hidden !important;
            }
            #print-root h3 { font-size: 13pt !important; }
            #print-root h4 { font-size: 10.5pt !important; }
            #print-root p, #print-root span, #print-root div { font-size: 10pt !important; line-height: 1.5 !important; }
            #print-root img { max-height: 50px !important; object-fit: contain !important; }
          </style>
        </head>
        <body>
          <div id="print-root">${printElement.innerHTML}</div>
        </body>
      </html>
    `);
    doc.close();

    setTimeout(() => {
      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();
      document.body.removeChild(iframe);
    }, 300);
  };

  return (
    <DashboardLayout navItems={navItems} currentUser={mockUser}>
      <div className="flex flex-col gap-6">
        {!selectedTemplate ? (
          <>
            <h1 className="text-3xl font-serif text-stone-900">
              Welcome, <span className="italic">{mockUser.name}</span>
            </h1>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {templates.map((template) => (
                <TemplateCard
                  key={template.id}
                  title={template.title}
                  isSelected={selectedTemplate?.id === template.id}
                  onClick={() => applyTemplatePreset(template.title)}
                />
              ))}
            </div>
          </>
        ) : (
          <div className="flex flex-col gap-6">
            {/* Header */}
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
              {/* Left Column: Form Controls */}
              <div className="space-y-4">
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

                {/* Logo Selector Section */}
                <div className="bg-stone-50 p-3 rounded-xl border border-stone-200 space-y-2">
                  <label className="block text-xs font-bold text-stone-700">
                    Pilih Logo Kop Surat
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <span className="block text-[11px] text-stone-500 mb-1">
                        Logo Kiri
                      </span>
                      <select
                        value={leftLogo}
                        onChange={(e) => setLeftLogo(e.target.value)}
                        className="w-full p-2 border border-stone-300 rounded-lg text-xs bg-white focus:outline-none focus:ring-1 focus:ring-stone-800"
                      >
                        {LOGO_OPTIONS_LEFT.map((opt) => (
                          <option key={opt.label} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <span className="block text-[11px] text-stone-500 mb-1">
                        Logo Kanan
                      </span>
                      <select
                        value={rightLogo}
                        onChange={(e) => setRightLogo(e.target.value)}
                        className="w-full p-2 border border-stone-300 rounded-lg text-xs bg-white focus:outline-none focus:ring-1 focus:ring-stone-800"
                      >
                        {LOGO_OPTIONS_RIGHT.map((opt) => (
                          <option key={opt.label} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <LetterFormEditor
                  formData={letterData}
                  onChange={(updatedData) =>
                    setLetterData((prev) => ({ ...prev, ...updatedData }))
                  }
                  onSubmitForApproval={() => handleSaveLetter("PENDING")}
                  onSaveDraft={() => handleSaveLetter("DRAFT")}
                  isSubmitting={isSubmitting}
                />
              </div>

              {/* Right Column: Clean Admin-Style Document Preview */}
              <div className="sticky top-6 w-full max-w-md mx-auto space-y-3">
                {/* Standalone Action Bar Block */}
                <div className="bg-[#1c1917] text-white px-5 py-3 rounded-2xl flex justify-between items-center text-xs font-sans shadow-md">
                  <span className="font-semibold text-sm tracking-tight">
                    A4 Live Document Export
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleExportDocx}
                      className="px-3 py-1.5 bg-[#292524] hover:bg-[#383331] text-stone-200 rounded-lg border border-stone-700 transition-colors text-xs font-medium flex items-center gap-1"
                    >
                      ↓ DOCX
                    </button>
                    <button
                      type="button"
                      onClick={handlePrintPdf}
                      className="px-3.5 py-1.5 bg-[#059669] hover:bg-[#047857] text-white rounded-lg transition-colors text-xs font-medium flex items-center gap-1.5"
                    >
                      🖨 Print / PDF
                    </button>
                  </div>
                </div>

                {/* Separated Paper Document Container */}
                <div
                  id="printable-letter"
                  className="w-full min-h-145 bg-white rounded-3xl shadow-sm border border-stone-200 p-8 flex flex-col justify-between text-stone-900 font-serif text-[11px] leading-relaxed overflow-hidden"
                >
                  <div className="flex flex-col flex-1 min-h-0">
                    {/* Kop Surat Header */}
                    <div className="relative border-b-2 border-stone-900 pb-3 mb-4 text-center shrink-0 min-h-15 flex items-center justify-center">
                      {leftLogo && (
                        <img
                          src={leftLogo}
                          alt="Logo Kiri"
                          className="absolute left-0 top-1/2 -translate-y-1/2 w-10 h-10 object-contain"
                        />
                      )}
                      {rightLogo && (
                        <img
                          src={rightLogo}
                          alt="Logo Kanan"
                          className="absolute right-0 top-1/2 -translate-y-1/2 w-10 h-10 object-contain"
                        />
                      )}

                      <div className="px-10">
                        <h4 className="font-bold text-[9px] tracking-tight uppercase leading-tight">
                          YAYASAN LEO SUTRISNO
                        </h4>
                        <h3 className="font-bold text-[11px] tracking-wide uppercase leading-tight">
                          SMK LETRIS INDONESIA 2
                        </h3>
                        <p className="text-[7.5px] font-sans text-stone-700 leading-tight mt-0.5">
                          NPSN : 69894185 &nbsp;&nbsp; NSS : 402286303080
                        </p>
                        <p className="text-[7.5px] font-sans font-semibold text-stone-800 leading-tight">
                          ( AKREDITASI " A " )
                        </p>
                        <p className="text-[6.5px] font-sans text-stone-600 leading-tight mt-0.5">
                          Kompetensi Keahlian : DKV, TJKT, PPLG, MPLB, PM, Akuntansi
                        </p>
                        <p className="text-[6.5px] font-sans text-stone-600 leading-tight">
                          Jl. Raya Siliwangi No. 55 Pamulang, Kota Tangerang Selatan
                        </p>
                        <span className="text-[6.5px] text-blue-700 underline font-sans block mt-0.5">
                          www.smkletrisdua.sch.id
                        </span>
                      </div>
                    </div>

                    {/* Letter Meta */}
                    <div className="flex justify-between text-[9.5px] mb-4 font-sans shrink-0">
                      <div className="space-y-0.5">
                        <p>
                          <span className="font-semibold">Nomor:</span>{" "}
                          {letterData.letterNumber || "[Diisi oleh Teacher]"}
                        </p>
                        <p>
                          <span className="font-semibold">Hal:</span>{" "}
                          {letterData.subject || selectedTemplate?.title || "Surat"}
                        </p>
                      </div>
                      <div className="text-right">
                        <p>Tangerang Selatan, {letterData.date}</p>
                      </div>
                    </div>

                    {/* Recipient */}
                    <div className="mb-4 font-sans text-[9.5px] space-y-0.5 shrink-0">
                      <p className="font-semibold">Kepada Yth.</p>
                      <p>{letterData.recipient || "Bapak/Ibu Penerima"}</p>
                      <p className="text-stone-500">Di Tempat</p>
                    </div>

                    {/* Body Text */}
                    <div className="flex-1 overflow-y-auto pr-1 my-1 scrollbar-thin scrollbar-thumb-stone-300 min-h-0">
                      <p className="leading-relaxed whitespace-pre-wrap text-[9.5px] text-stone-800 font-sans">
                        {letterData.body || (
                          <span className="italic text-stone-400">
                            Isi surat akan langsung muncul di sini...
                          </span>
                        )}
                      </p>
                    </div>
                  </div>

                  {/* Signature Section */}
                  <div className="flex justify-end pt-4 font-sans text-[8.5px] shrink-0">
                    <div className="text-center w-40 border border-dashed border-stone-200 p-2.5 rounded-xl bg-stone-50/30">
                      <p className="text-stone-500">Mengetahui,</p>
                      <p className="font-semibold text-stone-800 mt-0.5">
                        Kepala Sekolah / Admin
                      </p>
                      <div className="h-10 flex items-center justify-center italic text-stone-400 text-[7.5px]">
                        [Belum Ditandatangani]
                      </div>
                      <p className="font-bold underline text-stone-800">
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