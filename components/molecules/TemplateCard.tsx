import React from "react";

interface TemplateCardProps {
  title: string;
  category?: string;
  previewUrl?: string;
  isSelected?: boolean;
  onClick?: () => void;
}

// Preset content map matching your exact document layout
const TEMPLATE_PRESETS: Record<
  string,
  { letterNumber: string; recipient: string; body: string }
> = {
  "Surat undangan": {
    letterNumber: "001/UND/SMK-2/2026",
    recipient: "Orang Tua / Wali Murid Kelas X",
    body: "Dengan hormat,\n\nSehubungan dengan pelaksanaan evaluasi pembelajaran semester, kami mengundang Bapak/Ibu Wali Murid untuk dapat hadir pada rapat koordinasi yang akan dilaksanakan pada:",
  },
  "Surat tugas": {
    letterNumber: "002/ST/SMK-2/2026",
    recipient: "Bapak/Ibu Guru Pendamping",
    body: "Yang bertanda tangan di bawah ini Kepala SMK Letris Indonesia 2 memberikan tugas kepada nama terlampir untuk melaksanakan pendampingan kegiatan Lomba Keterampilan Siswa (LKS) Tingkat Kota Tangsel.",
  },
  "Surat keterangan": {
    letterNumber: "003/SK/SMK-2/2026",
    recipient: "Siswa / Siswi Terlampir",
    body: "Kepala SMK Letris Indonesia 2 menerangkan bahwa nama yang tercantum di bawah ini adalah benar tercatat sebagai siswa aktif SMK Letris Indonesia 2 Tahun Ajaran 2026/2027.",
  },
  "Surat keputusan": {
    letterNumber: "004/SKep/SMK-2/2026",
    recipient: "Seluruh Dewan Guru & Staf",
    body: "MEMUTUSKAN:\n1. Menetapkan susunan panitia Ujian Akhir Semester.\n2. Keputusan ini berlaku sejak tanggal ditetapkan.",
  },
  "Surat pemberitahuan": {
    letterNumber: "005/PEMT/SMK-2/2026",
    recipient: "Seluruh Orang Tua Murid",
    body: "Diberitahukan kepada seluruh Orang Tua/Wali Murid bahwa kegiatan Pembelajaran Jarak Jauh (PJJ) akan dilaksanakan pada tanggal terlampir.",
  },
};

const MiniDocumentPreview = ({ title }: { title: string }) => {
  const normalizedTitle =
    Object.keys(TEMPLATE_PRESETS).find(
      (key) => key.toLowerCase() === title.toLowerCase()
    ) || title;

  const preset = TEMPLATE_PRESETS[normalizedTitle] || {
    letterNumber: "001/SK/SMK-2/2026",
    recipient: "Penerima Surat",
    body: "Isi surat pratinjau...",
  };

  return (
    <div className="w-full h-full bg-white p-2.5 text-stone-900 flex flex-col justify-between text-[5px] pointer-events-none select-none font-serif leading-tight rounded border border-stone-200 shadow-sm transition-transform group-hover:scale-[1.02]">
      <div>
        {/* Kop Surat Header */}
        <div className="relative border-b border-stone-900 pb-1 mb-1 text-center">
          <div className="absolute left-0 top-0 w-2.5 h-2.5 border border-dashed border-blue-400 rounded-full flex items-center justify-center text-[2px] text-blue-600 font-sans font-bold leading-none">
            LOGO
          </div>
          <div className="absolute right-0 top-0 w-2.5 h-2.5 border border-dashed border-emerald-500 rounded flex items-center justify-center text-[2px] text-emerald-700 font-sans font-bold leading-none">
            LOGO
          </div>

          <div className="px-2">
            <h4 className="font-bold text-[3.5px] tracking-tight uppercase leading-none">
              YAYASAN LEO SUTRISNO
            </h4>
            <h3 className="font-bold text-[4.5px] tracking-wide uppercase leading-tight">
              SMK LETRIS INDONESIA 2
            </h3>
            <p className="text-[3px] font-sans text-stone-700 leading-none">
              NPSN : 69894185 &nbsp; NSS : 402286303080
            </p>
            <p className="text-[2.5px] font-sans text-stone-800 leading-none font-semibold">
              ( AKREDITASI " A " )
            </p>
            <p className="text-[2.5px] font-sans text-stone-600 leading-none">
              Jl. Raya Siliwangi No. 55 Pamulang, Tangsel
            </p>
            <span className="text-[2.5px] text-blue-700 underline font-sans">
              www.smkletrisdua.sch.id
            </span>
          </div>
        </div>

        {/* Letter Meta */}
        <div className="flex justify-between text-[4px] mb-1 font-sans">
          <div>
            <p>
              <span className="font-semibold">Nomor:</span> {preset.letterNumber}
            </p>
            <p>
              <span className="font-semibold">Hal:</span> {title}
            </p>
          </div>
          <div className="text-right">
            <p>Tangerang Selatan, 2026-08-11</p>
          </div>
        </div>

        {/* Recipient */}
        <div className="mb-1 font-sans text-[4px]">
          <p className="font-semibold">Kepada Yth.</p>
          <p>{preset.recipient}</p>
          <p className="text-stone-500">Di Tempat</p>
        </div>

        {/* Body Text Area */}
        <div className="font-sans text-[4px] text-stone-800 line-clamp-3 leading-relaxed whitespace-pre-wrap">
          {preset.body}
        </div>
      </div>

      {/* Signature Section */}
      <div className="flex justify-end pt-0.5 font-sans text-[3.5px]">
        <div className="text-center w-12 border border-dashed border-stone-300 p-0.5 rounded bg-stone-50">
          <p className="text-stone-500">Mengetahui,</p>
          <p className="font-semibold text-stone-800">Kepala Sekolah / Admin</p>
          <div className="h-2 flex items-center justify-center italic text-stone-400 text-[3px]">
            [Tandatangan]
          </div>
          <p className="font-bold underline text-stone-700">NIP. ..................</p>
        </div>
      </div>
    </div>
  );
};

export const TemplateCard = ({
  title,
  category = "Surat Resmi",
  previewUrl,
  isSelected = false,
  onClick,
}: TemplateCardProps) => {
  return (
    <div
      onClick={onClick}
      className={`group relative flex flex-col justify-between gap-3 p-3.5 rounded-2xl border-2 transition-all cursor-pointer bg-white hover:shadow-lg ${
        isSelected
          ? "border-black bg-black/5"
          : "border-black/10 hover:border-black/30"
      }`}
    >
      {/* Thumbnail Container: Center-aligned Portrait Paper View */}
      <div className="w-full bg-stone-100/80 rounded-xl border border-black/5 flex items-center justify-center p-3 shadow-inner overflow-hidden">
        {/* Enforce fixed portrait dimensions (A4 ratio) so paper doesn't stretch */}
        <div className="w-35 h-49.5 shadow-md rounded overflow-hidden shrink-0 bg-white">
          {previewUrl ? (
            <img
              src={previewUrl}
              alt={title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <MiniDocumentPreview title={title} />
          )}
        </div>
      </div>

      {/* Info Area */}
      <div className="flex flex-col gap-0.5 px-0.5">
        <span className="text-[10px] font-bold tracking-wider uppercase text-stone-400">
          {category}
        </span>
        <h4 className="text-sm font-bold text-black truncate capitalize">{title}</h4>
      </div>
    </div>
  );
};