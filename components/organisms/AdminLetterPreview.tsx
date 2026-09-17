import React from "react";
import { KOP_SURAT_DEFAULTS } from "@/lib/kopSuratDefault";

interface AdminLetterPreviewProps {
  letterData: {
    institutionName?: string;
    letterNumber?: string;
    date?: string;
    recipient?: string;
    subject?: string;
    body?: string;
    attachmentUrl?: string | null;
    leftLogo?: string;
    rightLogo?: string;
    // Per-letter/per-template signer. Falls back to KOP_SURAT_DEFAULTS
    // when a template hasn't set its own signer yet.
    signerName?: string;
    signerRole?: string;
  };
  selectedTemplate?: any;
}

export function AdminLetterPreview({ letterData }: AdminLetterPreviewProps) {
  const renderFormattedBody = (text: string) => {
    if (!text) return "Isi surat akan ditampilkan di sini...";

    const lines = text.split("\n");
    const elements: React.ReactNode[] = [];
    let listBuffer: { key: string; val: string }[] = [];

    const flushListBuffer = () => {
      if (listBuffer.length > 0) {
        elements.push(
          <div key={`table-${elements.length}`} className="my-3 w-full">
            <table className="w-full text-[11px] font-serif border-collapse">
              <tbody>
                {listBuffer.map((item, idx) => (
                  <tr key={idx} className="align-top">
                    <td className="w-36 pr-2 py-0.5 font-medium shrink-0">
                      {item.key}
                    </td>
                    <td className="w-4 py-0.5 font-medium text-center">:</td>
                    <td className="py-0.5 pl-1 wrap-break-word">{item.val}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
        listBuffer = [];
      }
    };

    lines.forEach((line, index) => {
      const separatorMatch = line.match(/^([^:|]+)\s*[:|]\s*(.*)$/);

      if (separatorMatch && separatorMatch[1].trim().length < 30) {
        listBuffer.push({
          key: separatorMatch[1].trim(),
          val: separatorMatch[2].trim(),
        });
      } else {
        flushListBuffer();
        if (line.trim() === "") {
          elements.push(<div key={`empty-${index}`} className="h-2" />);
        } else {
          elements.push(
            <p key={`p-${index}`} className="leading-relaxed text-justify my-1">
              {line}
            </p>
          );
        }
      }
    });

    flushListBuffer();
    return elements;
  };

  const signerName = letterData.signerName || KOP_SURAT_DEFAULTS.defaultSignerName;
  const signerRole = letterData.signerRole || KOP_SURAT_DEFAULTS.defaultSignerRole;

  return (
    <div className="sticky top-6 w-full flex justify-center max-h-[calc(100vh-3rem)] overflow-y-auto">
      {/* Strict A4 sheet dimensions wrapper (210mm x 297mm ratio) */}
      <div className="bg-white p-10 shadow-lg border border-stone-200 text-stone-900 w-full max-w-[210mm] min-h-[297mm] aspect-[1/1.4142] flex flex-col justify-between box-border font-serif">
        <div>
          {/* Header / Kop Surat */}
          <div className="relative border-b-2 border-stone-800 pb-3 mb-6 clear-both">
            <div className="float-left w-20 h-20 flex items-center justify-center shrink-0 mr-0">
              {letterData.leftLogo ? (
                <img
                  src={letterData.leftLogo}
                  alt="Left Logo"
                  className="max-h-full max-w-full object-contain"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-stone-200 flex items-center justify-center text-[9px] text-stone-500">
                  Logo
                </div>
              )}
            </div>

            <div className="float-right w-20 h-20 flex items-center justify-center shrink-0 ml-0">
              {letterData.rightLogo ? (
                <img
                  src={letterData.rightLogo}
                  alt="Right Logo"
                  className="max-h-full max-w-full object-contain"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-stone-200 flex items-center justify-center text-[9px] text-stone-500">
                  Logo
                </div>
              )}
            </div>

            <div className="text-center px-10">
              <h2 className="text-sm font-bold uppercase tracking-wide">
                {KOP_SURAT_DEFAULTS.yayasan}
              </h2>
              <h1 className="text-2xl font-black uppercase tracking-wide text-stone-900 mt-0.5">
                {KOP_SURAT_DEFAULTS.schoolName}
              </h1>
              <p className="text-xs font-bold text-stone-800 mt-0.5">
                {KOP_SURAT_DEFAULTS.npsnNss}
              </p>
              <p className="text-xs font-bold text-stone-800">
                {KOP_SURAT_DEFAULTS.akreditasi}
              </p>
              <p className="text-[11px] text-stone-600 mt-0.5 leading-tight clear-both">
                {KOP_SURAT_DEFAULTS.jurusan}
                <br />
                {KOP_SURAT_DEFAULTS.address}
                <br />
                <span className="text-blue-600 underline">
                  {KOP_SURAT_DEFAULTS.website}
                </span>
              </p>
            </div>
          </div>

          {/* Letter Meta */}
          <div className="text-center mb-6">
            <h2 className="text-xs font-bold uppercase underline tracking-wide">
              {letterData.subject || "SURAT KETERANGAN AKTIF SISWA"}
            </h2>
            <p className="text-[11px] text-stone-800 font-mono mt-0.5">
              Nomor : {letterData.letterNumber || "135/SKet/421.5/SMK.LI2/VIII/2026"}
            </p>
          </div>

          {/* Letter Body */}
          <div className="text-[11px] font-serif text-stone-900">
            {renderFormattedBody(letterData.body || "")}
          </div>

          {/* Attachment Preview */}
          {letterData.attachmentUrl && (
            <div className="mt-6 pt-4 border-t border-stone-200">
              <p className="text-[10px] text-stone-500 font-sans mb-2 font-bold uppercase">
                Lampiran:
              </p>
              <img
                src={letterData.attachmentUrl}
                alt="Attachment Preview"
                className="max-h-40 object-contain rounded border border-stone-200"
              />
            </div>
          )}
        </div>

        {/* Signature Block */}
        <div className="mt-10 flex justify-end">
          <div className="text-left text-[11px] font-serif space-y-16 w-52 shrink-0">
            <div>
              <p>Tangerang Selatan, {letterData.date || "07 Agustus 2026"}</p>
              <p>{signerRole}</p>
            </div>
            <div>
              <p className="font-bold underline">{signerName}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}