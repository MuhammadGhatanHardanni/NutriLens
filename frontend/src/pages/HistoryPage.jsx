// src/pages/HistoryPage.jsx - Riwayat Konsumsi Makanan ala FatSecret Indonesia
import { useEffect, useState, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { getHistory, deleteHistory } from '../services/history.service.js';
import {
  Trash2,
  Calendar,
  AlertCircle,
  Search,
  Utensils,
  History,
  ChevronRight,
  Camera,
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function HistoryPage() {
  const [searchParams] = useSearchParams();
  const queryParam = searchParams.get('q') || '';

  const [history, setHistory] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState(queryParam);

  useEffect(() => {
    if (queryParam) {
      setSearchQuery(queryParam);
    }
  }, [queryParam]);

  useEffect(() => {
    fetchHistory(pagination.page);
  }, [pagination.page]);

  const fetchHistory = async (page) => {
    try {
      setLoading(true);
      const res = await getHistory(page);
      setHistory(res.data);
      setPagination(res.pagination);
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal memuat riwayat makanan.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Hapus catatan "${name}" dari riwayat?`)) return;
    try {
      await deleteHistory(id);
      toast.success('Catatan berhasil dihapus');
      fetchHistory(pagination.page);
    } catch (err) {
      toast.error('Gagal menghapus riwayat');
    }
  };

  const filteredHistory = useMemo(() => {
    if (!searchQuery.trim()) return history;
    return history.filter((item) =>
      item.foodName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [history, searchQuery]);

  if (loading && history.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[350px] space-y-3">
        <div className="animate-spin rounded-full h-8 w-8 border-3 border-[#028543] border-t-transparent"></div>
        <p className="text-xs font-semibold text-gray-500">Memuat Riwayat Makanan...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-16 font-sans">
      {/* ─── Breadcrumb ─── */}
      <div className="flex items-center gap-1.5 text-xs text-gray-500">
        <Link to="/" className="text-[#028543] hover:underline">
          NutriSnap
        </Link>
        <ChevronRight size={13} className="text-gray-400" />
        <Link to="/dashboard" className="text-[#028543] hover:underline">
          Buku Harian
        </Link>
        <ChevronRight size={13} className="text-gray-400" />
        <span className="text-gray-800 font-semibold">Riwayat Pencatatan</span>
      </div>

      {/* ─── Header FatSecret ─── */}
      <div className="bg-white border-t-4 border-[#028543] border-x border-b border-gray-200 rounded-lg p-5 shadow-2xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h1 className="text-xl font-black text-gray-900 tracking-tight flex items-center gap-2">
            <History size={18} className="text-[#028543]" />
            <span>Riwayat & Arsip Makanan</span>
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Daftar seluruh masakan yang pernah Anda deteksi melalui foto di NutriSnap.
          </p>
        </div>

        <Link
          to="/detect"
          className="px-3.5 py-1.5 bg-[#028543] hover:bg-[#016b35] text-white font-bold rounded text-xs flex items-center gap-1.5 shadow-2xs transition-colors"
        >
          <Camera size={14} />
          <span>Pindai Foto Baru</span>
        </Link>
      </div>

      {/* ─── Search Bar ─── */}
      <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-2xs flex items-center gap-2 text-xs">
        <Search size={16} className="text-gray-400 ml-1" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Saring berdasarkan nama makanan (misal: Ketoprak, Ayam, Nasi)..."
          className="w-full outline-none text-gray-800 placeholder-gray-400"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="text-[11px] text-gray-500 hover:text-gray-800 px-2 py-0.5 bg-gray-100 rounded"
          >
            Reset
          </button>
        )}
      </div>

      {error && (
        <div className="p-3 bg-red-50 text-red-700 text-xs rounded border border-red-200 flex items-center gap-2">
          <AlertCircle size={15} />
          <span>{error}</span>
        </div>
      )}

      {/* ─── Tabel Riwayat Ala FatSecret ─── */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-2xs overflow-hidden">
        <div className="bg-[#028543] text-white px-4 py-2.5 flex items-center justify-between text-xs font-bold">
          <span>Daftar Makanan Tercatat ({filteredHistory.length})</span>
          <span className="text-[11px] text-emerald-100 font-normal">Diurutkan terbaru</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-gray-100/90 text-gray-700 font-bold border-b border-gray-200 uppercase text-[10px] tracking-wider">
                <th className="py-2.5 px-4">Nama Makanan</th>
                <th className="py-2.5 px-3">Tanggal & Porsi</th>
                <th className="py-2.5 px-3 text-right">Kkal</th>
                <th className="py-2.5 px-3 text-right">Lemak</th>
                <th className="py-2.5 px-3 text-right">Karbo</th>
                <th className="py-2.5 px-3 text-right">Protein</th>
                <th className="py-2.5 px-3 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-800">
              {filteredHistory.length > 0 ? (
                filteredHistory.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="py-3 px-4 font-bold text-gray-900">
                      <div className="flex items-center gap-2.5">
                        {item.imageUrl ? (
                          <img
                            src={item.imageUrl}
                            alt={item.foodName}
                            className="w-10 h-10 rounded object-cover border border-gray-200 flex-shrink-0"
                          />
                        ) : (
                          <span className="w-10 h-10 rounded bg-emerald-50 text-[#028543] flex items-center justify-center font-bold text-sm flex-shrink-0">
                            🥗
                          </span>
                        )}
                        <span>{item.foodName}</span>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-gray-500 whitespace-nowrap">
                      <div>
                        {new Date(item.detectedAt).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </div>
                      <span className="text-[11px] text-gray-400">
                        {item.servingSize || '1 porsi'}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right font-black text-[#028543]">
                      {Math.round(item.calories)} kkal
                    </td>
                    <td className="py-3 px-3 text-right text-gray-700">{item.fat}g</td>
                    <td className="py-3 px-3 text-right text-gray-700">{item.carbs}g</td>
                    <td className="py-3 px-3 text-right text-gray-700">{item.protein}g</td>
                    <td className="py-3 px-3 text-center">
                      <button
                        onClick={() => handleDelete(item.id, item.foodName)}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                        title="Hapus dari riwayat"
                      >
                        <Trash2 size={15} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="py-8 text-center text-gray-400 italic">
                    {searchQuery
                      ? `Tidak ada catatan makanan yang cocok dengan kata kunci "${searchQuery}".`
                      : 'Belum ada riwayat makanan yang tercatat.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ─── Pagination ─── */}
      {pagination.totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 pt-2 text-xs">
          <button
            disabled={pagination.page <= 1}
            onClick={() => setPagination((prev) => ({ ...prev, page: prev.page - 1 }))}
            className="px-3 py-1.5 border border-gray-300 bg-white rounded font-bold disabled:opacity-50 hover:bg-gray-50"
          >
            « Sebelumnya
          </button>
          <span className="px-2 text-gray-600 font-medium">
            Halaman {pagination.page} dari {pagination.totalPages}
          </span>
          <button
            disabled={pagination.page >= pagination.totalPages}
            onClick={() => setPagination((prev) => ({ ...prev, page: prev.page + 1 }))}
            className="px-3 py-1.5 border border-gray-300 bg-white rounded font-bold disabled:opacity-50 hover:bg-gray-50"
          >
            Berikutnya »
          </button>
        </div>
      )}
    </div>
  );
}
