// src/pages/RegisterPage.jsx - Halaman Registrasi ala FatSecret
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { register as registerService } from '../services/auth.service.js';
import { Lock, Mail, User, Loader2, Salad } from 'lucide-react';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password.length < 6) {
      toast.error('Kata sandi minimal 6 karakter.');
      return;
    }

    setLoading(true);
    try {
      const res = await registerService(name, email, password);
      loginUser(res.data.token, res.data.user);
      toast.success('Pendaftaran berhasil! Selamat datang.');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registrasi gagal, silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto my-12 bg-white p-8 rounded-3xl shadow-sm border border-gray-200">
      <div className="text-center mb-8">
        <div className="inline-flex p-3 bg-emerald-50 text-emerald-700 rounded-2xl mb-3">
          <Salad size={36} />
        </div>
        <h1 className="text-2xl font-black text-gray-900 tracking-tight">Buat Akun NutriLens</h1>
        <p className="text-gray-500 text-xs mt-1">Daftar sekarang untuk mulai memantau buku harian gizi</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Nama Lengkap</label>
          <div className="relative">
            <User className="absolute left-3.5 top-3 text-gray-400" size={18} />
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Contoh: Budi Santoso"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 text-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Email</label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-3 text-gray-400" size={18} />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nama@email.com"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 text-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Kata Sandi</label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-3 text-gray-400" size={18} />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimal 6 karakter"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 text-sm"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-2 py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 disabled:opacity-60 transition-colors flex justify-center items-center gap-2 shadow-sm shadow-emerald-200 text-sm"
        >
          {loading ? <Loader2 size={18} className="animate-spin" /> : 'Daftar Akun Baru'}
        </button>
      </form>

      <p className="text-center text-xs text-gray-500 mt-6">
        Sudah punya akun?{' '}
        <Link to="/login" className="text-emerald-700 font-bold hover:underline">
          Masuk di sini
        </Link>
      </p>
    </div>
  );
}

