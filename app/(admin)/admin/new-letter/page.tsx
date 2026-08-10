"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/templates/DashboardLayout";
import { LetterFormEditor, LetterFormData } from "@/components/organisms/LetterFormEditor";

interface Template {
  id: string;
  title: string;
  defaultNumber?: string;
  defaultRecipient?: string;
  defaultBody?: string;
}

const templates: Template[] = [
  {
    id: "1",
    title: "Surat undangan",
    defaultNumber: "001/UND/SMK-2/2026",
    defaultRecipient: "Orang Tua / Wali Murid Kelas X",
    defaultBody:
      "Dengan hormat,\n\nSehubungan dengan pelaksanaan evaluasi pembelajaran semester, kami mengundang Bapak/Ibu Wali Murid untuk dapat hadir pada rapat koordinasi yang akan dilaksanakan pada:\n\nHari/Tanggal : Sabtu, 22 Agustus 2026\nWaktu : 09.00 WIB - Selesai\nTempat : Aula Utama SMK Letris Indonesia 2\n\nDemikian surat undangan ini kami sampaikan. Atas perhatian dan kehadiran Bapak/Ibu, kami ucapkan terima kasih.",
  },
  {
    id: "2",
    title: "Surat tugas",
    defaultNumber: "002/ST/SMK-2/2026",
    defaultRecipient: "Bapak/Ibu Guru Pendamping",
    defaultBody:
      "Yang bertanda tangan di bawah ini Kepala SMK Letris Indonesia 2 memberikan tugas kepada nama terlampir untuk melaksanakan pendampingan kegiatan Lomba Keterampilan Siswa (LKS) Tingkat Kota Tangsel.",
  },
  {
    id: "3",
    title: "Surat keterangan",
    defaultNumber: "003/SK/SMK-2/2026",
    defaultRecipient: "Siswa / Siswi Terlampir",
    defaultBody:
      "Kepala SMK Letris Indonesia 2 menerangkan bahwa nama yang tercantum di bawah ini adalah benar tercatat sebagai siswa aktif SMK Letris Indonesia 2 Tahun Ajaran 2026/2027.",
  },
  {
    id: "4",
    title: "Surat keputusan",
    defaultNumber: "004/SKep/SMK-2/2026",
    defaultRecipient: "Seluruh Dewan Guru & Staf",
    defaultBody:
      "MEMUTUSKAN:\n1. Menetapkan susunan panitia Ujian Akhir Semester.\n2. Keputusan ini berlaku sejak tanggal ditetapkan.",
  },
  {
    id: "5",
    title: "Surat pemberitahuan",
    defaultNumber: "005/PEMT/SMK-2/2026",
    defaultRecipient: "Seluruh Orang Tua Murid",
    defaultBody:
      "Diberitahukan kepada seluruh Orang Tua/Wali Murid bahwa kegiatan Pembelajaran Jarak Jauh (PJJ) akan dilaksanakan pada tanggal terlampir.",
  },
];

function AdminNewLetterContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const templateQuery = searchParams.get("template");

  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);

  const [letterData, setLetterData] = useState<LetterFormData>({
    institutionName: "",
    letterNumber: "",
    recipient: "",
    subject: "",
    date: new Date().toISOString().split("T")[0],
    body: "",
    attachmentUrl: null,
  });

  const navItems = [
    { label: "Overview", href: "/admin", isActive: false },
    { label: "Pending Approval", href: "/admin/pending", isActive: false },
    { label: "Archive", href: "/admin/history", isActive: false },
    { label: "User Management", href: "/admin/users", isActive: false },
    { label: "New letter", href: "/admin/new-letter", isActive: true },
  ];

  const adminTools = [
    { label: "Edit template", href: "/admin/templates/edit", isActive: false },
    { label: "Add template", href: "/admin/templates/new", isActive: false },
    { label: "Broadcast notice", href: "/admin/notice", isActive: false },
  ];

  const mockUser = {
    name: "Admin",
    username: "admin_dev",
    avatarUrl: "",
    role: "admin",
  };

  const handleSelectTemplate = (templateObj: Template | null) => {
    setSelectedTemplate(templateObj);
    if (templateObj) {
      setLetterData((prev) => ({
        ...prev,
        letterNumber: templateObj.defaultNumber || prev.letterNumber,
        recipient: templateObj.defaultRecipient || prev.recipient,
        body: templateObj.defaultBody || prev.body,
      }));
    }
  };

  useEffect(() => {
    if (templateQuery) {
      const matched = templates.find(
        (t) => t.title.toLowerCase() === templateQuery.toLowerCase()
      );
      if (matched) {
        handleSelectTemplate(matched);
      } else {
        handleSelectTemplate({ id: "custom", title: templateQuery });
      }
    }
  }, [templateQuery]);

  // Client-side PDF / Browser Print
  const handlePrintPdf = () => {
    window.print();
  };

  // Client-side DOCX Export Generator
  const handleExportDocx = () => {
    const formattedBody = letterData.body ? letterData.body.replace(/\n/g, "<br/>") : "";
    const htmlString = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <meta charset='utf-8'>
        <title>${selectedTemplate?.title || "Surat"}</title>
        <style>
          body { font-family: 'Times New Roman', serif; font-size: 12pt; line-height: 1.5; }
          .header { text-align: center; font-weight: bold; text-transform: uppercase; border-bottom: 3px double #000; padding-bottom: 10px; margin-bottom: 20px; }
          .meta { margin-bottom: 20px; }
          .recipient { margin-bottom: 20px; }
          .body { text-align: justify; margin-bottom: 30px; }
          .signature { float: right; width: 200px; text-align: center; }
        </style>
      </head>
      <body>
        <div className="header">
          <p style="font-size: 10pt; margin: 0;">YAYASAN LEO SUTRISNO</p>
          <p style="font-size: 14pt; margin: 0;"><b>SMK LETRIS INDONESIA 2</b></p>
          <p style="font-size: 8pt; margin: 0;">NPSN: 69894185 | AKREDITASI "A"</p>
          <p style="font-size: 8pt; margin: 0;">Jl. Raya Siliwangi No. 55 Pamulang, Kota Tangerang Selatan</p>
        </div>

        <table width="100%" style="margin-bottom: 20px;">
          <tr>
            <td>
              <b>Nomor:</b> ${letterData.letterNumber || "-"}<br/>
              <b>Hal:</b> ${selectedTemplate?.title || "Surat"}
            </td>
            <td align="right" valign="top">
              Tangerang Selatan, ${letterData.date}
            </td>
          </tr>
        </table>

        <div className="recipient">
          <b>Kepada Yth.</b><br/>
          ${letterData.recipient || "Penerima"}<br/>
          Di Tempat
        </div>

        ${letterData.institutionName ? `<p><b>Pengirim:</b> ${letterData.institutionName}</p>` : ""}

        <div className="body">
          ${formattedBody}
        </div>

        <br/><br/>
        <div className="signature">
          <p>Mengetahui,</p>
          <p><b>Kepala Sekolah / Admin</b></p>
          <br/><br/><br/>
          <p><u>NIP. ....................</u></p>
        </div>
      </body>
      </html>
    `;

    const blob = new Blob(["\ufeff", htmlString], { type: "application/msword" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${selectedTemplate?.title || "Surat"}_${letterData.letterNumber || "Draft"}.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleSubmitForApproval = () => {
    alert("Surat berhasil dibuat dan diterbitkan!");
    router.push("/admin/history");
  };

  return (
    <DashboardLayout
      navItems={navItems}
      adminTools={adminTools}
      currentUser={mockUser}
    >
      <div className="flex flex-col gap-6 print:block print:p-0">
        {!selectedTemplate ? (
          /* Template Selection View */
          <>
            <h1 className="text-3xl font-serif text-stone-900 print:hidden">
              Welcome, <span className="italic">{mockUser.name}</span>
            </h1>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 print:hidden">
              {templates.map((template) => (
                <button
                  key={template.id}
                  onClick={() => handleSelectTemplate(template)}
                  className="group flex flex-col items-center gap-2 text-center transition-transform hover:-translate-y-1"
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
          <div className="flex flex-col gap-6 print:block">
            {/* Top Bar with Back Button */}
            <div className="print:hidden">
              <button
                type="button"
                onClick={() => setSelectedTemplate(null)}
                className="px-4 py-1.5 rounded-full bg-black text-white text-xs font-medium hover:bg-stone-800 transition-colors"
              >
                ← Change Template
              </button>
            </div>

            {/* Form Header */}
            <div className="print:hidden">
              <span className="text-xs font-semibold uppercase text-stone-500 tracking-wider">
                Pembuatan Surat Admin
              </span>
              <h1 className="text-3xl font-serif font-bold text-stone-900 mt-1">
                {selectedTemplate.title}
              </h1>
            </div>

            {/* Side-by-Side Form + Fixed Paper Preview */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start print:block">
              {/* Left Column: Form Editor (HIDDEN ON PRINT) */}
              <div className="print:hidden">
                <LetterFormEditor
                  formData={letterData}
                  onChange={(updatedData) =>
                    setLetterData((prev) => ({ ...prev, ...updatedData }))
                  }
                  onSubmitForApproval={handleSubmitForApproval}
                  onSaveDraft={() => alert("Draf surat berhasil disimpan di browser!")}
                  onSelectTemplatePreset={(id) => {
                    const match = templates.find((t) => t.id === id);
                    if (match) handleSelectTemplate(match);
                  }}
                />
              </div>

              {/* Right Column: Sticky Fixed Height A4 Preview Container */}
              <div className="sticky top-6 w-full max-w-md mx-auto print:static print:max-w-none print:w-full print:m-0">
                
                {/* Export Action Bar Above Paper Preview */}
                <div className="mb-2 flex items-center justify-between bg-stone-900 text-white px-3 py-2 rounded-xl print:hidden">
                  <span className="text-xs font-medium">A4 Live Document Export</span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleExportDocx}
                      className="px-2.5 py-1 bg-stone-700 hover:bg-stone-600 text-white rounded-lg text-[11px] font-medium transition-colors"
                    >
                      ↓ DOCX
                    </button>
                    <button
                      type="button"
                      onClick={handlePrintPdf}
                      className="px-2.5 py-1 bg-emerald-700 hover:bg-emerald-600 text-white rounded-lg text-[11px] font-medium transition-colors"
                    >
                      🖨 Print / PDF
                    </button>
                  </div>
                </div>

                <div className="w-full h-160 bg-white rounded-xl shadow-2xl border border-stone-300 p-6 flex flex-col justify-between text-stone-900 font-serif text-[11px] leading-relaxed overflow-hidden print:h-auto print:shadow-none print:border-none print:p-0 print:overflow-visible print:text-xs">
                  {/* Content Container */}
                  <div className="flex flex-col flex-1 min-h-0 print:min-h-0 print:block">
                    {/* Status Banner */}
                    <div className="mb-3 flex justify-between items-center border-b pb-2 border-dashed border-stone-300 font-sans shrink-0 print:hidden">
                      <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wide flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                        STATUS: Pembuatan Surat Admin
                      </span>
                      <span className="text-[9px] bg-stone-100 text-stone-600 px-2 py-0.5 rounded font-sans">
                        A4 Paper View
                      </span>
                    </div>

                    {/* Kop Surat Header */}
                    <div className="relative border-b-4 border-double border-stone-900 pb-2 mb-4 text-center shrink-0">
                      <div className="absolute left-0 top-0 w-10 h-10 border border-dashed border-blue-400 rounded-full flex items-center justify-center text-[7px] text-blue-600 font-sans font-bold text-center leading-tight print:border-solid">
                        LOGO LETRIS 2
                      </div>
                      <div className="absolute right-0 top-0 w-10 h-10 border border-dashed border-emerald-500 rounded flex items-center justify-center text-[7px] text-emerald-700 font-sans font-bold text-center leading-tight print:border-solid">
                        LOGO BANTEN
                      </div>

                      <div className="px-10">
                        <h4 className="font-bold text-[10px] tracking-tight uppercase leading-tight print:text-xs">
                          YAYASAN LEO SUTRISNO
                        </h4>
                        <h3 className="font-bold text-[12px] tracking-wide uppercase leading-tight print:text-sm">
                          SMK LETRIS INDONESIA 2
                        </h3>
                        <p className="text-[8px] font-sans text-stone-700 leading-tight print:text-[9px]">
                          NPSN : 69894185 &nbsp;&nbsp; NSS : 402286303080
                        </p>
                        <p className="text-[8px] font-sans font-semibold text-stone-800 leading-tight print:text-[9px]">
                          ( AKREDITASI " A " )
                        </p>
                        <p className="text-[7px] font-sans text-stone-600 leading-tight print:text-[8px]">
                          Kompetensi Keahlian : DKV, TJKT, PPLG, MPLB, PM, Akuntansi
                        </p>
                        <p className="text-[7px] font-sans text-stone-600 leading-tight print:text-[8px]">
                          Jl. Raya Siliwangi No. 55 Pamulang, Kota Tangerang Selatan
                        </p>
                        <span className="text-[7px] text-blue-700 underline font-sans print:text-[8px]">
                          www.smkletrisdua.sch.id
                        </span>
                      </div>
                    </div>

                    {/* Letter Meta */}
                    <div className="flex justify-between text-[10px] mb-4 font-sans shrink-0 print:text-xs">
                      <div className="space-y-0.5">
                        <p>
                          <span className="font-semibold">Nomor:</span>{" "}
                          {letterData.letterNumber || "[Diisi oleh Admin]"}
                        </p>
                        <p>
                          <span className="font-semibold">Hal:</span>{" "}
                          {selectedTemplate?.title || "Surat"}
                        </p>
                      </div>
                      <div className="text-right">
                        <p>Tangerang Selatan, {letterData.date}</p>
                      </div>
                    </div>

                    {/* Recipient */}
                    <div className="mb-4 font-sans text-[10px] space-y-0.5 shrink-0 print:text-xs">
                      <p className="font-semibold">Kepada Yth.</p>
                      <p>{letterData.recipient || "Bapak/Ibu Penerima"}</p>
                      <p className="text-stone-500">Di Tempat</p>
                    </div>

                    {/* Sender Subhead */}
                    {letterData.institutionName && (
                      <p className="text-[10px] font-semibold text-stone-700 mb-3 font-sans shrink-0 print:text-xs">
                        Pengirim: {letterData.institutionName}
                      </p>
                    )}

                    {/* Body Scrollable Area */}
                    <div className="flex-1 overflow-y-auto pr-1 my-1 scrollbar-thin scrollbar-thumb-stone-300 min-h-0 print:overflow-visible print:h-auto print:block">
                      <p className="leading-relaxed whitespace-pre-wrap text-[10px] text-stone-800 font-sans print:text-xs">
                        {letterData.body || (
                          <span className="italic text-stone-400">
                            Isi surat akan langsung muncul di sini saat Anda mengetik di formulir...
                          </span>
                        )}
                      </p>

                      {/* Attachment / Image Preview on Letter Paper */}
                      {letterData.attachmentUrl && (
                        <div className="mt-4 border-t border-stone-200 pt-2">
                          <p className="text-[8px] font-bold uppercase text-stone-500 mb-1 print:text-[9px]">
                            Lampiran / Gambar:
                          </p>
                          <img
                            src={letterData.attachmentUrl}
                            alt="Lampiran Surat"
                            className="max-h-28 max-w-full object-contain rounded border border-stone-200"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Fixed Bottom Signature Placeholder */}
                  <div className="flex justify-end pt-4 mt-6 border-t border-stone-100 font-sans text-[9px] shrink-0 print:text-xs">
                    <div className="text-center w-40 border border-dashed border-stone-200 p-2 rounded bg-stone-50/50 print:border-none print:p-0 print:bg-transparent">
                      <p className="text-stone-500">Mengetahui,</p>
                      <p className="font-semibold text-stone-800">
                        Kepala Sekolah / Admin
                      </p>
                      <div className="h-12 flex items-center justify-center italic text-stone-400 text-[8px] print:h-16">
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

export default function AdminNewLetterPage() {
  return (
    <Suspense fallback={<div className="p-8 font-sans text-stone-600">Loading...</div>}>
      <AdminNewLetterContent />
    </Suspense>
  );
}