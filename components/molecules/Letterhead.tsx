import React from "react";

export function Letterhead() {
  return (
    <div className="w-full text-center font-serif text-black border-b-2 border-black pb-2 mb-4 relative select-none">
      {/* Left Logo */}
      <img
        src="/logo_letris.png"
        alt="Logo Letris"
        className="absolute left-0 top-0 w-12 h-12 object-contain"
      />

      {/* Kop Content */}
      <div className="px-12 flex flex-col items-center justify-center leading-tight">
        <h3 className="text-[9px] uppercase font-medium tracking-wide">YAYASAN LEO SUTRISNO</h3>
        <h1 className="text-xs font-bold uppercase tracking-wide">SMK LETRIS INDONESIA 2</h1>
        <p className="text-[8px] font-semibold">NPSN : 69894185 NSS : 402286303080</p>
        <p className="text-[8px] font-bold">( AKREDITASI “A” )</p>
        <p className="text-[6.5px] mt-0.5 leading-tight text-center font-sans">
          Kompetensi Keahlian : Desain Komunikasi Visual (DKV) , Teknik Jaringan Komputer dan Telekomunikasi (TJKT) ,<br />
          Pengembangan Perangkat Lunak dan Gim (PPLG) , Manajemen Perkantoran dan Layanan Bisnis (MPLB) ,<br />
          Pemasaran (PM) , Akuntansi Keuangan Lembaga
        </p>
        <p className="text-[6.5px] mt-0.5 font-sans">
          Jl. Raya Siliwangi No. 55 Pondok Benda – Pamulang Telp. 021-29446273 Kota Tangerang Selatan Provinsi Banten
        </p>
        <a href="https://www.smkletris2pamulang.sch.id" target="_blank" rel="noreferrer" className="text-[6.5px] text-blue-800 underline font-sans">
          www.smkletris2pamulang.sch.id
        </a>
      </div>

      {/* Right Logo */}
      <img
        src="/logo_banten.png"
        alt="Logo Banten"
        className="absolute right-0 top-0 w-12 h-12 object-contain"
      />
    </div>
  );
}