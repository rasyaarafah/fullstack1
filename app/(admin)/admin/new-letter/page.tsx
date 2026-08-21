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

// Helper to convert image URL or local public path to Base64 Data URL
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

function MiniPaperThumbnail({ template }: { template: Template }) {
  const currentDate = new Date().toISOString().split("T")[0];

  return (
    <div className="w-full aspect-3/4 bg-stone-200/60 rounded-2xl border border-stone-300 overflow-hidden relative shadow-sm group-hover:shadow-md transition-all flex items-center justify-center p-2 select-none">
      <div className="w-[190%] h-[190%] scale-[0.52] shrink-0 pointer-events-none bg-white p-6 shadow-md border border-stone-200 text-[10px] font-serif leading-tight text-stone-900 flex flex-col justify-between origin-center">
        <div>
          <div className="relative border-b-2 border-double border-stone-900 pb-2 mb-3 text-center flex items-center justify-between">
            <img src="/logo_letris.png" alt="Logo Left" className="w-8 h-8 object-contain" />
            <div className="px-2">
              <p className="font-bold text-[8px] uppercase tracking-tighter">YAYASAN LEO SUTRISNO</p>
              <p className="font-bold text-[10px] uppercase">SMK LETRIS INDONESIA 2</p>
              <p className="text-[6px] font-sans text-stone-600">NPSN: 69894185 | NSS: 402286303080</p>
              <p className="text-[5px] font-sans text-blue-700 underline">www.smkletrisdua.sch.id</p>
            </div>
            <img src="/logo_banten.png" alt="Logo Right" className="w-8 h-8 object-contain" />
          </div>

          <div className="flex justify-between text-[8px] font-sans mb-3">
            <div>
              <p><span className="font-semibold">Nomor:</span> {template.defaultNumber || "-"}</p>
              <p><span className="font-semibold">Hal:</span> {template.title}</p>
            </div>
            <div className="text-right">
              <p>Tangsel, {currentDate}</p>
            </div>
          </div>

          <div className="text-[8px] font-sans mb-3">
            <p className="font-semibold">Kepada Yth.</p>
            <p>{template.defaultRecipient || "Penerima"}</p>
            <p className="text-stone-500">Di Tempat</p>
          </div>

          <div className="text-[7.5px] font-sans text-stone-700 leading-normal line-clamp-6 whitespace-pre-wrap">
            {template.defaultBody}
          </div>
        </div>

        <div className="flex justify-end pt-2 border-t border-stone-100 font-sans text-[7px]">
          <div className="text-center w-28 border border-dashed border-stone-300 p-1 rounded">
            <p className="text-stone-500">Mengetahui,</p>
            <p className="font-semibold">Kepala Sekolah / Admin</p>
            <div className="h-6"></div>
            <p className="font-bold underline">NIP. ....................</p>
          </div>
        </div>
      </div>
    </div>
  );
}

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
    leftLogo: "/logo_letris.png",
    rightLogo: "/logo_banten.png",
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
    if (!templateQuery) return;

    const matched = templates.find(
      (t) => t.title.toLowerCase() === templateQuery.toLowerCase()
    );

    if (matched) {
      setSelectedTemplate(matched);
      setLetterData((prev) => ({
        ...prev,
        letterNumber: matched.defaultNumber || prev.letterNumber,
        recipient: matched.defaultRecipient || prev.recipient,
        body: matched.defaultBody || prev.body,
      }));
    } else {
      setSelectedTemplate({ id: "custom", title: templateQuery });
    }
  }, [templateQuery]);

  const handlePrintPdf = () => {
    const printElement = document.getElementById("printable-letter");
    if (!printElement) {
      console.warn("Print element #printable-letter not found!");
      return;
    }

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
            #print-root .border-dashed {
              border: none !important;
              background: transparent !important;
              padding: 0 !important;
            }
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

  const handleExportDocx = async () => {
    const formattedBody = letterData.body
      ? letterData.body.replace(/\n/g, "<br/>")
      : "";

    const leftLogoBase64 = letterData.leftLogo ? await getBase64ImageFromUrl(letterData.leftLogo) : "";
    const rightLogoBase64 = letterData.rightLogo ? await getBase64ImageFromUrl(letterData.rightLogo) : "";
    const attachmentBase64 = letterData.attachmentUrl ? await getBase64ImageFromUrl(letterData.attachmentUrl) : "";

    const htmlString = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <meta charset='utf-8'>
        <title>${selectedTemplate?.title || "Surat"}</title>
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
              <b>Hal:</b> ${selectedTemplate?.title || "Surat"}
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

        ${attachmentBase64 ? `<div style="margin-bottom:20px;"><p><b>Lampiran:</b></p><img src="${attachmentBase64}" style="max-width:300px; max-height:200px;" /></div>` : ""}

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
    link.download = `${selectedTemplate?.title || "Surat"}_${letterData.letterNumber || "Draft"}.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

 const handleSubmitForApproval = async () => {
    try {
      const res = await fetch("/api/letters", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: selectedTemplate?.title || "Surat Baru",
          letterNumber: letterData.letterNumber,
          recipient: letterData.recipient,
          subject: selectedTemplate?.title || "Surat",
          body: letterData.body,
          createdByRole: "ADMIN", // Ensures the backend status sets to APPROVED
          status: "APPROVED",
        }),
      });

      if (res.ok) {
        alert("Surat berhasil dibuat dan diterbitkan!");
        router.push("/admin/history");
      } else {
        const errorData = await res.json();
        alert(`Gagal membuat surat: ${errorData.error || "Unknown error"}`);
      }
    } catch (err) {
      console.error("Error submitting letter:", err);
      alert("Terjadi kesalahan saat menyimpan surat.");
    }
  };

  return (
    <DashboardLayout
      navItems={navItems}
      adminTools={adminTools}
      currentUser={mockUser}
    >
      <div className="flex flex-col gap-6">
        {!selectedTemplate ? (
          <>
            <h1 className="text-3xl font-serif text-stone-900">
              Welcome, <span className="italic">{mockUser.name}</span>
            </h1>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {templates.map((template) => (
                <button
                  key={template.id}
                  onClick={() => handleSelectTemplate(template)}
                  className="group flex flex-col items-center gap-3 text-center transition-transform hover:-translate-y-1"
                >
                  <MiniPaperThumbnail template={template} />
                  <span className="font-serif text-base text-stone-900 font-medium group-hover:underline">
                    {template.title}
                  </span>
                </button>
              ))}
            </div>
          </>
        ) : (
          <div className="flex flex-col gap-6">
            <div>
              <button
                type="button"
                onClick={() => setSelectedTemplate(null)}
                className="px-4 py-1.5 rounded-full bg-black text-white text-xs font-medium hover:bg-stone-800 transition-colors"
              >
                ← Change Template
              </button>
            </div>

            <div>
              <span className="text-xs font-semibold uppercase text-stone-500 tracking-wider">
                Pembuatan Surat Admin
              </span>
              <h1 className="text-3xl font-serif font-bold text-stone-900 mt-1">
                {selectedTemplate.title}
              </h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
              <div>
                <LetterFormEditor
                  formData={letterData}
                  onChange={(updatedData) =>
                    setLetterData((prev) => ({ ...prev, ...updatedData }))
                  }
                  onSubmitForApproval={handleSubmitForApproval}
                  onSaveDraft={() => alert("Draf surat berhasil disimpan!")}
                  onSelectTemplatePreset={(id) => {
                    const match = templates.find((t) => t.id === id);
                    if (match) handleSelectTemplate(match);
                  }}
                />
              </div>

              <div className="sticky top-6 w-full max-w-md mx-auto">
                <div className="mb-2 flex items-center justify-between bg-stone-900 text-white px-3 py-2 rounded-xl">
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

                <div
                  id="printable-letter"
                  className="w-full min-h-145 bg-white rounded-xl shadow-2xl border border-stone-300 p-6 flex flex-col justify-between text-stone-900 font-serif text-[10.5px] leading-relaxed"
                >
                  <div className="flex flex-col flex-1 min-h-0">
                    {/* Header / Kop Surat */}
                    <div className="relative border-b-2 border-solid border-stone-900 pb-2 mb-4 flex items-center justify-between shrink-0">
                      <div className="w-10 h-10 flex items-center justify-center">
                        {letterData.leftLogo ? (
                          <img
                            src={letterData.leftLogo}
                            alt="Logo Left"
                            className="w-10 h-10 object-contain"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = "/logo_letris.png";
                            }}
                          />
                        ) : null}
                      </div>

                      <div className="px-4 text-center flex-1">
                        <h4 className="font-bold text-[10px] tracking-tight uppercase leading-tight">
                          YAYASAN LEO SUTRISNO
                        </h4>
                        <h3 className="font-bold text-[12px] tracking-wide uppercase leading-tight">
                          SMK LETRIS INDONESIA 2
                        </h3>
                        <p className="text-[8px] font-sans text-stone-700 leading-tight">
                          NPSN : 69894185 &nbsp;&nbsp; NSS : 402286303080
                        </p>
                        <p className="text-[8px] font-sans font-semibold text-stone-800 leading-tight">
                          ( AKREDITASI " A " )
                        </p>
                        <p className="text-[7px] font-sans text-stone-600 leading-tight">
                          Kompetensi Keahlian : DKV, TJKT, PPLG, MPLB, PM, Akuntansi
                        </p>
                        <p className="text-[7px] font-sans text-stone-600 leading-tight">
                          Jl. Raya Siliwangi No. 55 Pamulang, Kota Tangerang Selatan
                        </p>
                        <span className="text-[7px] text-blue-700 underline font-sans">
                          www.smkletrisdua.sch.id
                        </span>
                      </div>

                      <div className="w-10 h-10 flex items-center justify-center">
                        {letterData.rightLogo ? (
                          <img
                            src={letterData.rightLogo}
                            alt="Logo Right"
                            className="w-10 h-10 object-contain"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = "/logo_banten.png";
                            }}
                          />
                        ) : null}
                      </div>
                    </div>

                    <div className="flex justify-between text-[10px] mb-4 font-sans shrink-0">
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

                    <div className="mb-4 font-sans text-[10px] space-y-0.5 shrink-0">
                      <p className="font-semibold">Kepada Yth.</p>
                      <p>{letterData.recipient || "Bapak/Ibu Penerima"}</p>
                      <p className="text-stone-500">Di Tempat</p>
                    </div>

                    {letterData.institutionName && (
                      <p className="text-[10px] font-semibold text-stone-700 mb-3 font-sans shrink-0">
                        Pengirim: {letterData.institutionName}
                      </p>
                    )}

                    <div className="my-1">
                      <p className="leading-relaxed whitespace-pre-wrap text-[10px] text-stone-800 font-sans">
                        {letterData.body || (
                          <span className="italic text-stone-400">
                            Isi surat akan langsung muncul di sini saat Anda mengetik di formulir...
                          </span>
                        )}
                      </p>

                      {letterData.attachmentUrl && (
                        <div className="mt-4 border-t border-stone-200 pt-2">
                          <p className="text-[8px] font-bold uppercase text-stone-500 mb-1">
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

                  <div className="flex justify-end pt-4 mt-6 border-t border-stone-100 font-sans text-[9px] shrink-0">
                    <div className="text-center w-40 border border-dashed border-stone-200 p-2 rounded bg-stone-50/50">
                      <p className="text-stone-500">Mengetahui,</p>
                      <p className="font-semibold text-stone-800">
                        Kepala Sekolah / Admin
                      </p>
                      <div className="h-12 flex items-center justify-center italic text-stone-400 text-[8px]">
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