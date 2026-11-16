// src/pages/HomePage.jsx - Portal Resmi NutriSnap (Format FatSecret Indonesia)
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Camera,
  Search,
  BookOpen,
  PieChart,
  ShieldCheck,
  CheckCircle,
  ChevronRight,
  Utensils,
  Sparkles,
  Award,
  ArrowRight,
  Activity,
  Flame,
} from 'lucide-react';

const foodCategories = [
  { name: 'Nasi & Olahan Pokok', icon: '🍚', count: '120+ menu' },
  { name: 'Daging, Ayam & Ikan', icon: '🍗', count: '250+ menu' },
  { name: 'Sayuran & Masakan Nabati', icon: '🥗', count: '180+ menu' },
  { name: 'Sup, Soto & Hidangan Kuah', icon: '🍲', count: '95+ menu' },
  { name: 'Kudapan, Camilan & Kue', icon: '🥟', count: '140+ menu' },
  { name: 'Minuman Tradisional & Kopi', icon: '☕', count: '80+ menu' },
];

const popularDatabase = [
  { name: 'Ketoprak Jakarta', serving: '1 porsi (350 g)', cal: 480, fat: 22.0, carbs: 58.0, prot: 16.0 },
  { name: 'Nasi Goreng Ayam Spesial', serving: '1 piring (300 g)', cal: 520, fat: 18.5, carbs: 68.0, prot: 19.0 },
  { name: 'Sate Ayam Madura (5 tusuk + bumbu)', serving: '1 porsi (150 g)', cal: 340, fat: 16.0, carbs: 12.0, prot: 24.0 },
  { name: 'Rendang Daging Sapi Padang', serving: '1 potong (100 g)', cal: 320, fat: 22.0, carbs: 8.0, prot: 22.0 },
  { name: 'Gado-Gado Bumbu Kacang', serving: '1 piring (300 g)', cal: 410, fat: 19.0, carbs: 45.0, prot: 15.0 },
  { name: 'Soto Ayam Lamongan Lengkap', serving: '1 mangkok (350 ml)', cal: 310, fat: 11.0, carbs: 28.0, prot: 22.0 },
  { name: 'Ayam Geprek Sambal Bawang', serving: '1 porsi (180 g)', cal: 440, fat: 24.0, carbs: 18.0, prot: 34.0 },
  { name: 'Tahu & Tempe Goreng Bacem', serving: '2 potong (100 g)', cal: 195, fat: 9.5, carbs: 14.0, prot: 13.5 },
];

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/history?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <div className="space-y-8 pb-16 font-sans">
      {/* ─── 1. Portal Hero Banner ─── */}
      <section className="bg-white border border-gray-200 rounded-lg p-6 sm:p-10 shadow-2xs text-center space-y-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-[#028543] rounded-full text-xs font-bold border border-emerald-200">
          <ShieldCheck size={14} />
          <span>Platform Penghitung Kalori & Informasi Nilai Gizi Indonesia</span>
        </div>

        <div className="max-w-2xl mx-auto space-y-2.5">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 tracking-tight leading-tight">
            Penghitung Kalori & Diet <br />
            <span className="text-[#028543]">Untuk Hidup Sehat & Berat Badan Ideal</span>
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed max-w-xl mx-auto">
            Pantau konsumsi makanan harian Anda dengan buku harian terstruktur dan teknologi pemindai
            foto berbasis AI yang disesuaikan khusus untuk hidangan khas nusantara.
          </p>
        </div>

        {/* Big Search Bar */}
        <form onSubmit={handleSearch} className="max-w-xl mx-auto relative">
          <div className="flex shadow-xs rounded overflow-hidden border-2 border-[#028543]">
            <div className="relative flex-1">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari makanan nusantara, kalori, atau nilai gizi..."
                className="w-full pl-10 pr-4 py-3 text-xs sm:text-sm outline-none bg-white text-gray-800"
              />
              <Search size={18} className="absolute left-3 top-3.5 text-gray-400" />
            </div>
            <button
              type="submit"
              className="bg-[#028543] hover:bg-[#016b35] text-white px-6 font-bold text-xs sm:text-sm transition-colors flex items-center gap-1.5"
            >
              <span>Cari</span>
            </button>
          </div>
        </form>

        {/* Action Buttons */}
        <div className="flex flex-wrap justify-center gap-3 pt-1">
          <Link
            to="/detect"
            className="px-6 py-2.5 bg-[#028543] hover:bg-[#016b35] text-white font-bold rounded text-xs sm:text-sm flex items-center gap-2 shadow-xs transition-colors"
          >
            <Camera size={16} />
            <span>Pindai Foto Makanan (Kamera / Galeri)</span>
          </Link>
          <Link
            to="/dashboard"
            className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold rounded text-xs sm:text-sm flex items-center gap-1.5 border border-gray-300 transition-colors"
          >
            <BookOpen size={16} />
            <span>Buka Buku Harian Saya</span>
          </Link>
        </div>
      </section>

      {/* ─── 2. Kategori Makanan Populer ─── */}
      <section className="bg-white border border-gray-200 rounded-lg p-5 shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-gray-100 pb-2.5">
          <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide flex items-center gap-2">
            <Utensils size={15} className="text-[#028543]" />
            <span>Jelajahi Kategori Makanan Indonesia</span>
          </h2>
          <span className="text-xs text-gray-400 font-medium hidden sm:inline">Basis Data Lokal Terlengkap</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {foodCategories.map((c, i) => (
            <Link
              key={i}
              to="/detect"
              className="p-3 bg-gray-50/70 hover:bg-emerald-50/60 border border-gray-200 hover:border-emerald-300 rounded text-center transition-all group"
            >
              <div className="text-2xl mb-1 group-hover:scale-110 transition-transform">{c.icon}</div>
              <h3 className="font-bold text-gray-800 text-xs leading-tight group-hover:text-[#028543]">
                {c.name}
              </h3>
              <span className="text-[10px] text-gray-400 mt-0.5 block">{c.count}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ─── 3. Dua Kolom: Database Pilihan & Fitur Utama ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Kolom Kiri: Tabel Database Makanan (70%) */}
        <div className="lg:col-span-8 bg-white border border-gray-200 rounded-lg shadow-2xs overflow-hidden">
          <div className="bg-[#028543] text-white px-4 py-2.5 flex items-center justify-between">
            <h3 className="font-bold text-sm tracking-wide flex items-center gap-2">
              <Flame size={16} className="text-emerald-200" />
              <span>Daftar Nilai Gizi Makanan Populer</span>
            </h3>
            <span className="text-[11px] text-emerald-100 font-normal">Acuan Standar Porsi</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-gray-100/90 text-gray-700 font-bold border-b border-gray-200 uppercase text-[10px] tracking-wider">
                  <th className="py-2.5 px-4">Nama Hidangan</th>
                  <th className="py-2.5 px-3">Takaran Porsi</th>
                  <th className="py-2.5 px-3 text-right">Kalori</th>
                  <th className="py-2.5 px-3 text-right">Lemak</th>
                  <th className="py-2.5 px-3 text-right">Karbo</th>
                  <th className="py-2.5 px-3 text-right">Protein</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-800">
                {popularDatabase.map((item, idx) => (
                  <tr key={idx} className="hover:bg-emerald-50/40 transition-colors">
                    <td className="py-2.5 px-4 font-bold text-gray-900">
                      <Link to="/detect" className="hover:text-[#028543] hover:underline">
                        {item.name}
                      </Link>
                    </td>
                    <td className="py-2.5 px-3 text-gray-500 whitespace-nowrap">{item.serving}</td>
                    <td className="py-2.5 px-3 text-right font-black text-[#028543]">
                      {item.cal} kkal
                    </td>
                    <td className="py-2.5 px-3 text-right text-gray-700 font-medium">{item.fat}g</td>
                    <td className="py-2.5 px-3 text-right text-gray-700 font-medium">{item.carbs}g</td>
                    <td className="py-2.5 px-3 text-right text-gray-700 font-medium">{item.prot}g</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-3 bg-gray-50 border-t border-gray-200 text-center">
            <Link
              to="/detect"
              className="text-xs font-bold text-[#028543] hover:underline inline-flex items-center gap-1"
            >
              <span>Ingin mengecek makanan Anda sendiri? Pindai langsung fotonya sekarang</span>
              <ChevronRight size={14} />
            </Link>
          </div>
        </div>

        {/* Kolom Kanan: Panduan & Keunggulan Layanan (30%) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white border border-gray-200 rounded-lg shadow-2xs p-5 space-y-3.5">
            <h4 className="font-bold text-sm text-gray-900 border-b border-gray-200 pb-2 flex items-center gap-1.5">
              <Activity size={16} className="text-[#028543]" />
              <span>Standar Informasi Nilai Gizi</span>
            </h4>
            <p className="text-xs text-gray-600 leading-relaxed">
              Semua perhitungan kalori dan nutrisi makanan di NutriSnap dikalibrasi mengikuti standar
              Angka Kecukupan Gizi (AKG) Kementerian Kesehatan RI (2.000 kkal).
            </p>

            <div className="space-y-2 pt-1 text-xs">
              <div className="p-2.5 bg-gray-50 rounded border border-gray-100 flex items-start gap-2">
                <CheckCircle size={15} className="text-[#028543] flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="text-gray-900 block font-bold">Buku Harian 4 Waktu Makan</strong>
                  <span className="text-gray-500 text-[11px]">
                    Catat dan kelompokkan ke dalam Sarapan, Makan Siang, Makan Malam, dan Kudapan.
                  </span>
                </div>
              </div>

              <div className="p-2.5 bg-gray-50 rounded border border-gray-100 flex items-start gap-2">
                <CheckCircle size={15} className="text-[#028543] flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="text-gray-900 block font-bold">Rasio Makronutrien Otomatis</strong>
                  <span className="text-gray-500 text-[11px]">
                    Bagan persentase kalori dari Karbohidrat, Lemak, dan Protein secara real-time.
                  </span>
                </div>
              </div>

              <div className="p-2.5 bg-gray-50 rounded border border-gray-100 flex items-start gap-2">
                <CheckCircle size={15} className="text-[#028543] flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="text-gray-900 block font-bold">Deteksi Gambar AI Instan</strong>
                  <span className="text-gray-500 text-[11px]">
                    Identifikasi hidangan Indonesia secara akurat hanya melalui kamera atau foto.
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Start Info Box */}
          <div className="bg-[#028543] text-white rounded-lg p-5 shadow-xs space-y-2.5">
            <h4 className="font-black text-sm tracking-wide">Mulai Pantau Gizi Hari Ini</h4>
            <p className="text-xs text-emerald-100 leading-relaxed">
              Gunakan kamera ponsel atau laptop Anda untuk memindai hidangan di atas meja, lalu simpan
              ke buku harian Anda dalam hitungan detik.
            </p>
            <Link
              to="/detect"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-white text-[#028543] font-bold text-xs rounded hover:bg-emerald-50 transition-colors shadow-2xs mt-1"
            >
              <span>Pindai Foto Gratis</span>
              <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
