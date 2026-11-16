// src/components/layout/Footer.jsx - Footer Resmi NutriSnap (Format FatSecret Indonesia)
import { Link } from 'react-router-dom';
import { Salad, ShieldCheck } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-16 text-gray-600 text-xs font-sans">
      <div className="container mx-auto px-4 max-w-6xl py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand & Overview */}
          <div className="space-y-3 md:col-span-2">
            <Link to="/" className="flex items-center gap-2 font-black text-lg text-[#028543]">
              <div className="w-7 h-7 rounded bg-[#028543] flex items-center justify-center text-white">
                <Salad size={17} />
              </div>
              <span className="tracking-tight">NutriSnap Indonesia</span>
            </Link>
            <p className="text-gray-500 max-w-sm leading-relaxed text-xs">
              Platform pelacak gizi dan penghitung kalori makanan berbasis kecerdasan buatan,
              mengadopsi standar Buku Harian Konsumsi dan Informasi Nilai Gizi resmi Indonesia.
            </p>
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#028543]">
              <ShieldCheck size={14} />
              <span>Standar Acuan AKG Kementerian Kesehatan RI (2.000 kkal)</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-2">
            <h4 className="font-bold text-gray-900 text-xs uppercase tracking-wider">
              Layanan & Alat
            </h4>
            <ul className="space-y-1.5 text-xs text-gray-500">
              <li>
                <Link to="/dashboard" className="hover:text-[#028543] transition-colors">
                  Buku Harian Makanan
                </Link>
              </li>
              <li>
                <Link to="/detect" className="hover:text-[#028543] transition-colors">
                  Pemindai Foto Makanan AI
                </Link>
              </li>
              <li>
                <Link to="/history" className="hover:text-[#028543] transition-colors">
                  Riwayat & Rekam Konsumsi
                </Link>
              </li>
              <li>
                <Link to="/" className="hover:text-[#028543] transition-colors">
                  Basis Data Makanan Nusantara
                </Link>
              </li>
            </ul>
          </div>

          {/* Standards & Legal */}
          <div className="space-y-2">
            <h4 className="font-bold text-gray-900 text-xs uppercase tracking-wider">
              Standar Nutrisi
            </h4>
            <ul className="space-y-1.5 text-xs text-gray-500">
              <li>
                <span className="hover:text-[#028543] cursor-pointer">
                  Pedoman Angka Kecukupan Gizi (AKG)
                </span>
              </li>
              <li>
                <span className="hover:text-[#028543] cursor-pointer">
                  Tabel Komposisi Pangan Indonesia
                </span>
              </li>
              <li>
                <span className="hover:text-[#028543] cursor-pointer">
                  Kebijakan Privasi
                </span>
              </li>
              <li>
                <span className="hover:text-[#028543] cursor-pointer">
                  Ketentuan Penggunaan
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Disclaimer & Copyright */}
        <div className="pt-6 mt-6 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-3 text-gray-400 text-[11px]">
          <p>© {new Date().getFullYear()} NutriSnap Indonesia. Seluruh hak cipta dilindungi.</p>
          <p>
            Informasi nutrisi disediakan untuk tujuan panduan pola makan sehat harian.
          </p>
        </div>
      </div>
    </footer>
  );
}
