// src/components/layout/Navbar.jsx - Header Minimalis Persis FatSecret Indonesia
import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import {
  Camera,
  BookOpen,
  History,
  LogOut,
  LogIn,
  Menu,
  X,
  User,
  Utensils,
  Leaf,
} from 'lucide-react';

export default function Navbar() {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logoutUser();
    setIsMobileMenuOpen(false);
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100">
      <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
        <div className="flex items-center justify-between h-20">
          {/* Logo FatSecret Style: Icon Lingkaran Hijau + Teks Hijau 'nutrisnap' */}
          <Link
            to="/"
            className="flex items-center gap-2 text-2xl font-bold tracking-tight text-[#00a859] hover:opacity-95 transition-opacity"
          >
            <div className="w-8 h-8 rounded-full bg-[#00a859] flex items-center justify-center text-white shadow-xs">
              <Leaf size={18} className="fill-white" />
            </div>
            <span className="font-extrabold tracking-tight lowercase">nutrisnap</span>
          </Link>

          {/* Desktop Nav Links (Clean text links like FatSecret: Makanan, Buku Harian, Deteksi AI, Riwayat) */}
          <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-gray-700">
            <Link
              to="/"
              className={`transition-colors hover:text-[#00a859] ${
                isActive('/') ? 'text-[#00a859] font-bold' : ''
              }`}
            >
              Makanan
            </Link>

            <Link
              to="/dashboard"
              className={`transition-colors hover:text-[#00a859] ${
                isActive('/dashboard') ? 'text-[#00a859] font-bold' : ''
              }`}
            >
              Buku Harian
            </Link>

            <Link
              to="/detect"
              className={`transition-colors hover:text-[#00a859] ${
                isActive('/detect') ? 'text-[#00a859] font-bold' : ''
              }`}
            >
              Deteksi AI
            </Link>

            <Link
              to="/history"
              className={`transition-colors hover:text-[#00a859] ${
                isActive('/history') ? 'text-[#00a859] font-bold' : ''
              }`}
            >
              Riwayat
            </Link>
          </nav>

          {/* Desktop Right Side: Flag + Login Button */}
          <div className="hidden md:flex items-center gap-4">
            {/* Indonesian Flag Indicator ala FatSecret */}
            <div
              className="flex items-center justify-center w-10 h-7 rounded border border-gray-200 bg-white shadow-2xs cursor-default"
              title="Indonesia (ID)"
            >
              <div className="w-5 h-3.5 flex flex-col rounded-xs overflow-hidden border border-gray-200">
                <div className="w-full h-1/2 bg-[#ff0000]"></div>
                <div className="w-full h-1/2 bg-white"></div>
              </div>
            </div>

            {user ? (
              <div className="flex items-center gap-3 text-sm">
                <span className="text-gray-600 font-medium">
                  Halo, <strong className="text-gray-900 font-bold">{user.name.split(' ')[0]}</strong>
                </span>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1 text-xs text-red-600 hover:text-red-700 font-medium px-2 py-1 rounded hover:bg-red-50 transition-colors"
                >
                  <LogOut size={13} />
                  <span>Keluar</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="text-sm font-semibold text-gray-700 hover:text-[#00a859] transition-colors"
                >
                  Masuk
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-[#00a859] hover:bg-[#00924d] text-white font-bold text-sm rounded-md transition-all shadow-xs"
                >
                  Daftar
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-gray-700 hover:text-[#00a859]"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-4 space-y-3 shadow-lg">
          <Link
            to="/"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block py-2 text-sm font-semibold text-gray-700 hover:text-[#00a859]"
          >
            Makanan
          </Link>
          <Link
            to="/dashboard"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block py-2 text-sm font-semibold text-gray-700 hover:text-[#00a859]"
          >
            Buku Harian
          </Link>
          <Link
            to="/detect"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block py-2 text-sm font-semibold text-gray-700 hover:text-[#00a859]"
          >
            Deteksi AI
          </Link>
          <Link
            to="/history"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block py-2 text-sm font-semibold text-gray-700 hover:text-[#00a859]"
          >
            Riwayat
          </Link>

          <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
            {user ? (
              <div className="flex items-center justify-between w-full">
                <span className="text-xs text-gray-600 font-bold">{user.name}</span>
                <button
                  onClick={handleLogout}
                  className="text-xs text-red-600 font-bold px-3 py-1 bg-red-50 rounded"
                >
                  Keluar
                </button>
              </div>
            ) : (
              <div className="flex gap-2 w-full">
                <Link
                  to="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex-1 py-2 text-center text-xs font-bold border border-gray-300 rounded text-gray-700"
                >
                  Masuk
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex-1 py-2 text-center text-xs font-bold bg-[#00a859] text-white rounded"
                >
                  Daftar
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
