"use client";

import React, { useState, useEffect, Suspense, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/templates/DashboardLayout";
import { LetterFormEditor, LetterFormData } from "@/components/organisms/LetterFormEditor";
import { Avatar } from "@/components/atoms/Avatar";

interface DynamicTemplate {
  id: string;
  title: string;
  category?: string;
  description?: string;
  placeholders?: string;
  bodyContent?: string;
  defaultNumber?: string;
  defaultRecipient?: string;
  defaultBody?: string;
}

const DEFAULT_LEFT_LOGO = "/logo_letris.png";
const DEFAULT_RIGHT_LOGO = "/logo_banten.png";

const FALLBACK_TEMPLATES: DynamicTemplate[] = [
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
];

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

function MiniPaperThumbnail({ template }: { template: DynamicTemplate }) {
  const [currentDate, setCurrentDate] = useState<string>("");

  useEffect(() => {
    setCurrentDate(new Date().toISOString().split("T")[0]);
  }, []);

  const bodyPreview = template.bodyContent || template.defaultBody || "";

  return (
    <div className="w-full aspect-3/4 bg-stone-200/60 rounded-2xl border border-stone-300 overflow-hidden relative shadow-sm group-hover:shadow-md transition-all flex items-center justify-center p-2 select-none">
      <div className="w-[190%] h-[190%] scale-[0.52] shrink-0 pointer-events-none bg-white p-6 shadow-md border border-stone-200 text-[10px] font-serif leading-tight text-stone-900 flex flex-col justify-between origin-center">
        <div>
          <div className="relative border-b-2 border-double border-stone-900 pb-2 mb-3 text-center flex items-center justify-between">
            <img src={DEFAULT_LEFT_LOGO} alt="Logo Left" className="w-8 h-8 object-contain" />
            <div className="px-2">
              <p className="font-bold text-[8px] uppercase tracking-tighter">YAYASAN LEO SUTRISNO</p>
              <p className="font-bold text-[10px] uppercase">SMK LETRIS INDONESIA 2</p>
              <p className="text-[6px] font-sans text-stone-600">NPSN: 69894185 | NSS: 402286303080</p>
              <p className="text-[5px] font-sans text-blue-700 underline">www.smkletrisdua.sch.id</p>
            </div>
            <img src={DEFAULT_RIGHT_LOGO} alt="Logo Right" className="w-8 h-8 object-contain" />
          </div>

          <div className="flex justify-between text-[8px] font-sans mb-3">
            <div>
              <p><span className="font-semibold">Nomor:</span> {template.defaultNumber || "[Auto]"}</p>
              <p><span className="font-semibold">Hal:</span> {template.title}</p>
            </div>
            <div className="text-right">
              <p>Tangsel, {currentDate || "..."}</p>
            </div>
          </div>

          <div className="text-[8px] font-sans mb-3">
            <p className="font-semibold">Kepada Yth.</p>
            <p>{template.defaultRecipient || "Penerima"}</p>
            <p className="text-stone-500">Di Tempat</p>
          </div>

          <div className="text-[7.5px] font-sans text-stone-700 leading-normal line-clamp-6 whitespace-pre-wrap">
            {bodyPreview}
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

  const [templatesList, setTemplatesList] = useState<DynamicTemplate[]>(FALLBACK_TEMPLATES);
  const [isLoadingTemplates, setIsLoadingTemplates] = useState(true);

  const [currentUser, setCurrentUser] = useState({
    name: "Rasya",
    username: "rasya",
    email: "",
    image: "",
    role: "admin",
  });

  const [selectedTemplate, setSelectedTemplate] = useState<DynamicTemplate | null>(null);
  const [leftLogoSrc, setLeftLogoSrc] = useState(DEFAULT_LEFT_LOGO);
  const [rightLogoSrc, setRightLogoSrc] = useState(DEFAULT_RIGHT_LOGO);

  const [letterData, setLetterData] = useState<LetterFormData>({
    institutionName: "",
    letterNumber: "",
    recipient: "",
    subject: "",
    date: "",
    body: "",
    attachmentUrl: null,
    leftLogo: DEFAULT_LEFT_LOGO,
    rightLogo: DEFAULT_RIGHT_LOGO,
  });

  useEffect(() => {
    async function fetchDatabaseTemplates() {
      try {
        const res = await fetch("/api/templates");
        if (res.ok) {
          const dbTemplates: DynamicTemplate[] = await res.json();
          if (dbTemplates.length > 0) {
            setTemplatesList(dbTemplates);
          }
        }
      } catch (err) {
        console.error("Failed to fetch templates from database:", err);
      } finally {
        setIsLoadingTemplates(false);
      }
    }

    fetchDatabaseTemplates();
  }, []);

  useEffect(() => {
    async function loadUserSession() {
      try {
        const res = await fetch("/api/me");
        if (res.ok) {
          const user = await res.json();
          setCurrentUser({
            name: user.name || "Rasya",
            username: user.email ? user.email.split("@")[0] : "rasya",
            email: user.email || "",
            image: user.image || user.avatarUrl || "",
            role: user.role ? user.role.toLowerCase() : "admin",
          });
        }
      } catch (error) {
        console.error("Failed to load active session:", error);
      }
    }

    loadUserSession();
  }, []);

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    setLetterData((prev) => ({ ...prev, date: today }));
  }, []);

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

  const handleSelectTemplate = useCallback((templateObj: DynamicTemplate | null) => {
    setSelectedTemplate(templateObj);
    if (templateObj) {
      setLetterData((prev) => ({
        ...prev,
        letterNumber: templateObj.defaultNumber || prev.letterNumber,
        recipient: templateObj.defaultRecipient || prev.recipient,
        body: templateObj.bodyContent || templateObj.defaultBody || prev.body,
      }));
    }
  }, []);

  useEffect(() => {
    if (!templateQuery || isLoadingTemplates) return;

    const matched = templatesList.find(
      (t) => t.title.toLowerCase() === templateQuery.toLowerCase()
    );

    if (matched) {
      handleSelectTemplate(matched);
    } else {
      setSelectedTemplate({ id: "custom", title: templateQuery });
    }
  }, [templateQuery, templatesList, isLoadingTemplates, handleSelectTemplate]);

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
            @page { size: A4 portrait; margin: 0; }
            body { background: #ffffff !important; margin: 0 !important; padding: 0 !important; display: flex; justify-content: center; }
            #print-root {
              width: 210mm !important;
              min-height: 297mm !important;
              padding: 20mm 25mm !important;
              box-sizing: border-box !important;
              background: white !important;
              display: flex !important;
              flex-direction: column !important;
              justify-content: space-between !important;
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
    const formattedBody = letterData.body ? letterData.body.replace(/\n/g, "<br/>") : "";
    const leftLogoBase64 = letterData.leftLogo ? await getBase64ImageFromUrl(letterData.leftLogo) : "";
    const rightLogoBase64 = letterData.rightLogo ? await getBase64ImageFromUrl(letterData.rightLogo) : "";
    const attachmentBase64 = letterData.attachmentUrl ? await getBase64ImageFromUrl(letterData.attachmentUrl) : "";

    const htmlString = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <meta charset='utf-8'>
        <style>
          @page { size: A4; margin: 2.5cm 2cm; }
          body { font-family: 'Arial', sans-serif; font-size: 11pt; line-height: 1.5; color: #000; }
          .kop-table { width: 100%; border-bottom: 3px double #000; padding-bottom: 8px; margin-bottom: 20px; }
          .logo-cell { width: 80px; text-align: center; vertical-align: middle; }
          .logo-img { max-width: 70px; max-height: 70px; }
          .header-text { text-align: center; }
          .meta-table { width: 100%; margin-bottom: 20px; font-size: 10pt; }
          .body-text { font-size: 10.5pt; text-align: left; line-height: 1.6; margin-bottom: 30px; }
          .sig-table { width: 100%; font-size: 10pt; margin-top: 30px; }
        </style>
      </head>
      <body>
        <table class="kop-table" border="0" cellpadding="0" cellspacing="0">
          <tr>
            <td class="logo-cell">${leftLogoBase64 ? `<img src="${leftLogoBase64}" class="logo-img" alt="Logo" />` : ""}</td>
            <td class="header-text">
              <div style="font-size: 10pt; font-weight: bold;">YAYASAN LEO SUTRISNO</div>
              <div style="font-size: 14pt; font-weight: bold;">SMK LETRIS INDONESIA 2</div>
              <div style="font-size: 8pt;">NPSN : 69894185 &nbsp;&nbsp; NSS : 402286303080</div>
              <div style="font-size: 8pt; font-weight: bold;">( AKREDITASI " A " )</div>
              <div style="font-size: 7.5pt;">Jl. Raya Siliwangi No. 55 Pamulang, Kota Tangerang Selatan</div>
            </td>
            <td class="logo-cell">${rightLogoBase64 ? `<img src="${rightLogoBase64}" class="logo-img" alt="Logo" />` : ""}</td>
          </tr>
        </table>
        <table class="meta-table" border="0">
          <tr>
            <td valign="top" width="60%">
              <b>Nomor:</b> ${letterData.letterNumber || "-"}<br/>
              <b>Hal:</b> ${selectedTemplate?.title || "Surat"}
            </td>
            <td align="right" valign="top" width="40%">Tangerang Selatan, ${letterData.date}</td>
          </tr>
        </table>
        <div style="font-size: 10pt; margin-bottom: 20px;">
          <b>Kepada Yth.</b><br/>${letterData.recipient || "Penerima"}<br/>Di Tempat
        </div>
        <div class="body-text">${formattedBody}</div>
        ${attachmentBase64 ? `<div style="margin-bottom:20px;"><img src="${attachmentBase64}" style="max-width:300px;" /></div>` : ""}
        <table class="sig-table" border="0">
          <tr>
            <td width="60%"></td>
            <td width="40%" align="center">
              <p>Mengetahui,</p>
              <p><b>Kepala Sekolah / Admin</b></p>
              <br/><br/>
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

  return (
    <DashboardLayout navItems={navItems} adminTools={adminTools} currentUser={currentUser}>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-serif text-stone-900">
            Welcome, <span className="italic">{currentUser.name}</span>
          </h1>
          <div className="w-10 h-10 rounded-full border border-stone-300 overflow-hidden flex items-center justify-center shrink-0 bg-stone-200">
            {currentUser.image ? (
              <img
                src={currentUser.image}
                alt={currentUser.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <Avatar src={undefined} alt={currentUser.name} />
            )}
          </div>
        </div>

        {!selectedTemplate ? (
          <div>
            {isLoadingTemplates ? (
              <div className="p-8 text-stone-500 font-sans text-sm">Loading available templates...</div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-4">
                {templatesList.map((template) => (
                  <button
                    key={template.id}
                    onClick={() => handleSelectTemplate(template)}
                    className="group flex flex-col items-center gap-3 text-center transition-transform hover:-translate-y-1 cursor-pointer"
                  >
                    <MiniPaperThumbnail template={template} />
                    <span className="font-serif text-base text-stone-900 font-medium group-hover:underline">
                      {template.title}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            <div>
              <button
                type="button"
                onClick={() => setSelectedTemplate(null)}
                className="px-4 py-1.5 rounded-full bg-black text-white text-xs font-medium hover:bg-stone-800 transition-colors cursor-pointer"
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
                  currentUser={currentUser}
                  onSubmitForApproval={async () => {
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
                          subject: letterData.subject,
                          body: letterData.body,
                          attachmentUrl: letterData.attachmentUrl,
                          userEmail: currentUser.email,
                          createdByRole: "ADMIN",
                          status: "APPROVED",
                        }),
                      });

                      if (res.ok) {
                        alert("Surat berhasil diterbitkan dan masuk ke Archive!");
                        router.push("/admin/history");
                      } else {
                        const errorData = await res.json();
                        alert(`Gagal membuat surat: ${errorData.error || "Terjadi kesalahan"}`);
                      }
                    } catch (err) {
                      console.error("Error creating letter:", err);
                      alert("Terjadi kesalahan koneksi saat membuat surat.");
                    }
                  }}
                  onSaveDraft={() => alert("Draf surat berhasil disimpan!")}
                  onSelectTemplatePreset={(id) => {
                    const match = templatesList.find((t) => t.id === id);
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
                      className="px-2.5 py-1 bg-stone-700 hover:bg-stone-600 text-white rounded-lg text-[11px] font-medium transition-colors cursor-pointer"
                    >
                      ↓ DOCX
                    </button>
                    <button
                      type="button"
                      onClick={handlePrintPdf}
                      className="px-2.5 py-1 bg-emerald-700 hover:bg-emerald-600 text-white rounded-lg text-[11px] font-medium transition-colors cursor-pointer"
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
                    <div className="relative border-b-2 border-solid border-stone-900 pb-2 mb-4 flex items-center justify-between shrink-0">
                      <div className="w-10 h-10 flex items-center justify-center">
                        {letterData.leftLogo && (
                          <img
                            src={leftLogoSrc}
                            alt="Logo Left"
                            className="w-10 h-10 object-contain"
                            onError={() => setLeftLogoSrc(DEFAULT_LEFT_LOGO)}
                          />
                        )}
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
                        {letterData.rightLogo && (
                          <img
                            src={rightLogoSrc}
                            alt="Logo Right"
                            className="w-10 h-10 object-contain"
                            onError={() => setRightLogoSrc(DEFAULT_RIGHT_LOGO)}
                          />
                        )}
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
                      <p className="font-semibold text-stone-800">Kepala Sekolah / Admin</p>
                      <div className="h-12 flex items-center justify-center italic text-stone-400 text-[8px]">
                        [Belum Ditandatangani]
                      </div>
                      <p className="font-bold underline text-stone-700">NIP. ....................</p>
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