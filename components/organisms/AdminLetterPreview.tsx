"use client";

import React from "react";
import { LetterFormData } from "./LetterFormEditor";
import { Template } from "../molecules/MiniPaperThumbnail";

interface AdminLetterPreviewProps {
  letterData: LetterFormData;
  selectedTemplate: Template | null;
}

// Helper: Convert image path/URL to Base64
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

export function AdminLetterPreview({ letterData, selectedTemplate }: AdminLetterPreviewProps) {
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
            @page { size: A4 portrait; margin: 0; }
            body { background: #ffffff !important; margin: 0 !important; padding: 0 !important; display: flex; justify-content: center; }
            #print-root {
              width: 210mm !important; min-height: 297mm !important; max-height: 297mm !important;
              padding: 20mm 25mm !important; box-sizing: border-box !important; background: white !important;
              display: flex !important; flex-direction: column !important; justify-content: space-between !important;
              overflow: hidden !important;
            }
            #print-root h3 { font-size: 13pt !important; }
            #print-root h4 { font-size: 10.5pt !important; }
            #print-root p, #print-root span, #print-root div { font-size: 10pt !important; line-height: 1.5 !important; }
            #print-root img { max-height: 50px !important; object-fit: contain !important; }
            #print-root .border-dashed { border: none !important; background: transparent !important; padding: 0 !important; }
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

  return (
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
              <h4 className="font-bold text-[10px] tracking-tight uppercase leading-tight">YAYASAN LEO SUTRISNO</h4>
              <h3 className="font-bold text-[12px] tracking-wide uppercase leading-tight">SMK LETRIS INDONESIA 2</h3>
              <p className="text-[8px] font-sans text-stone-700 leading-tight">NPSN : 69894185 &nbsp;&nbsp; NSS : 402286303080</p>
              <p className="text-[8px] font-sans font-semibold text-stone-800 leading-tight">( AKREDITASI " A " )</p>
              <p className="text-[7px] font-sans text-stone-600 leading-tight">Kompetensi Keahlian : DKV, TJKT, PPLG, MPLB, PM, Akuntansi</p>
              <p className="text-[7px] font-sans text-stone-600 leading-tight">Jl. Raya Siliwangi No. 55 Pamulang, Kota Tangerang Selatan</p>
              <span className="text-[7px] text-blue-700 underline font-sans">www.smkletrisdua.sch.id</span>
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
              <p><span className="font-semibold">Nomor:</span> {letterData.letterNumber || "[Diisi oleh Admin]"}</p>
              <p><span className="font-semibold">Hal:</span> {selectedTemplate?.title || "Surat"}</p>
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
  );
}


