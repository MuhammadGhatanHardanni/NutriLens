// src/pages/DashboardPage.jsx - Buku Harian Makanan Autentik ala FatSecret Indonesia
import { useEffect, useState, useMemo } from 'react';
import { getDailySummary, deleteHistory } from '../services/history.service.js';
import {
  Calendar,
  AlertCircle,
  Plus,
  ChevronLeft,
  ChevronRight,
  Target,
  PieChart,
  Edit2,
  Check,
  Utensils,
  Coffee,
  Sun,
  Moon,
  Cookie,
  Camera,
  Trash2,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

// Fungsi penentuan waktu makan otomatis berdasarkan jam pencatatan
const getMealCategory = (dateString) => {
  if (!dateString) return 'lunch';
  const date = new Date(dateString);
  const hour = date.getHours();

  if (hour >= 5 && hour < 11) return 'breakfast';
  if (hour >= 11 && hour < 15) return 'lunch';
  if (hour >= 17 && hour < 22) return 'dinner';
  return 'snack';
};

const MEAL_SECTIONS = [
  { id: 'breakfast', name: 'Sarapan', timeDesc: '05:00 - 11:00', icon: Coffee },
  { id: 'lunch', name: 'Makan Siang', timeDesc: '11:00 - 15:00', icon: Sun },
  { id: 'dinner', name: 'Makan Malam', timeDesc: '17:00 - 22:00', icon: Moon },
  { id: 'snack', name: 'Kudapan / Camilan', timeDesc: 'Di antara waktu makan', icon: Cookie },
];

export default function DashboardPage() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Sasaran Target Kalori Harian
  const [targetCalories, setTargetCalories] = useState(() => {
    return Number(localStorage.getItem('nutrisnap_target_calories')) || 2000;
  });
  const [isEditingTarget, setIsEditingTarget] = useState(false);
  const [tempTarget, setTempTarget] = useState(targetCalories);

  useEffect(() => {
    fetchSummary();
  }, []);

  const fetchSummary = async () => {
    try {
      setLoading(true);
      const res = await getDailySummary();
      setSummary(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal memuat buku harian makanan.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveTarget = () => {
    const val = Number(tempTarget);
    if (val && val >= 500 && val <= 10000) {
      setTargetCalories(val);
      localStorage.setItem('nutrisnap_target_calories', String(val));
    }
    setIsEditingTarget(false);
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Hapus "${name}" dari buku harian?`)) return;
    try {
      await deleteHistory(id);
      toast.success('Makanan berhasil dihapus dari buku harian');
      fetchSummary();
    } catch (err) {
      toast.error('Gagal menghapus makanan');
    }
  };

  // Kelompokkan makanan per sesi
  const categorizedMeals = useMemo(() => {
    const groups = {
      breakfast: [],
      lunch: [],
      dinner: [],
      snack: [],
    };

    if (summary?.items) {
      summary.items.forEach((item) => {
        const cat = getMealCategory(item.detectedAt);
        groups[cat].push(item);
      });
    }

    return groups;
  }, [summary?.items]);

  const totalCalories = Math.round(summary?.totalCalories || 0);
  const totalProtein = Number((summary?.totalProtein || 0).toFixed(1));
  const totalFat = Number((summary?.totalFat || 0).toFixed(1));
  const totalCarbs = Number((summary?.totalCarbs || 0).toFixed(1));

  // Hitung Sisa & Neraca Kalori
  const remainingCalories = targetCalories - totalCalories;
  const pctCalories = Math.min(Math.round((totalCalories / targetCalories) * 100), 100);

  // Rasio Makronutrien Ala FatSecret (Karbo 4 kkal/g, Lemak 9 kkal/g, Prot 4 kkal/g)
  const calCarbs = totalCarbs * 4;
  const calProtein = totalProtein * 4;
  const calFat = totalFat * 9;
  const totalMacroCal = calCarbs + calProtein + calFat || 1;

  const pctCarbs = Math.round((calCarbs / totalMacroCal) * 100);
  const pctFat = Math.round((calFat / totalMacroCal) * 100);
  const pctProtein = Math.max(0, 100 - pctCarbs - pctFat);

  // Standar AKG Kemenkes RI (2000 kkal)
  const akgCarbs = Math.round((totalCarbs / 300) * 100);
  const akgFat = Math.round((totalFat / 67) * 100);
  const akgProtein = Math.round((totalProtein / 60) * 100);

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[400px] space-y-3">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-[#028543] border-t-transparent"></div>
        <p className="text-xs font-semibold text-gray-500">Memuat buku harian makanan...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto p-4 bg-red-50 text-red-700 rounded-lg border border-red-200 flex items-center gap-3">
        <AlertCircle size={20} className="flex-shrink-0" />
        <p className="text-sm font-medium">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-16 font-sans">
      {/* ─── 1. FatSecret Date Switcher Banner ─── */}
      <div className="bg-white border border-gray-200 rounded-lg p-3.5 shadow-2xs flex items-center justify-between">
        <button
          onClick={() => alert('Fitur navigasi tanggal dapat melihat riwayat hari sebelumnya.')}
          className="flex items-center gap-1 text-xs font-bold text-[#028543] hover:underline px-2 py-1"
        >
          <ChevronLeft size={16} />
          <span>Kemarin</span>
        </button>

        <div className="flex items-center gap-2 text-sm sm:text-base font-black text-gray-800">
          <Calendar size={18} className="text-[#028543]" />
          <span>
            Hari Ini,{' '}
            {new Date().toLocaleDateString('id-ID', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </span>
        </div>

        <button
          onClick={() => alert('Anda sedang berada di tanggal hari ini.')}
          className="flex items-center gap-1 text-xs font-bold text-gray-400 cursor-not-allowed px-2 py-1"
        >
          <span>Besok</span>
          <ChevronRight size={16} />
        </button>
      </div>

      {/* ─── 2. FatSecret 2-Column Portal Layout (70% Tables, 30% Summary Box) ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ─── Kolom Kiri: Tabel Buku Harian Makanan (70%) ─── */}
        <div className="lg:col-span-8 space-y-6">
          {MEAL_SECTIONS.map((section) => {
            const items = categorizedMeals[section.id] || [];
            const secCalories = items.reduce((sum, it) => sum + (it.calories || 0), 0);
            const secFat = items.reduce((sum, it) => sum + (it.fat || 0), 0);
            const secCarbs = items.reduce((sum, it) => sum + (it.carbs || 0), 0);
            const secProtein = items.reduce((sum, it) => sum + (it.protein || 0), 0);
            const SectionIcon = section.icon;

            return (
              <div
                key={section.id}
                className="bg-white border border-gray-200 rounded-lg shadow-2xs overflow-hidden"
              >
                {/* FatSecret Signature Table Header */}
                <div className="bg-[#028543] text-white px-4 py-2.5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <SectionIcon size={16} className="text-emerald-100" />
                    <h3 className="font-bold text-sm tracking-wide">{section.name}</h3>
                    <span className="text-[11px] text-emerald-100 font-normal hidden sm:inline">
                      ({section.timeDesc})
                    </span>
                  </div>

                  <Link
                    to="/detect"
                    className="inline-flex items-center gap-1 text-[11px] font-bold bg-white/20 hover:bg-white text-white hover:text-[#028543] px-2.5 py-1 rounded transition-colors"
                  >
                    <Plus size={13} />
                    <span>Pindai Foto</span>
                  </Link>
                </div>

                {/* Table Data */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="bg-gray-100/80 text-gray-600 font-bold border-b border-gray-200 uppercase text-[10px] tracking-wider">
                        <th className="py-2.5 px-4">Makanan</th>
                        <th className="py-2.5 px-3">Porsi</th>
                        <th className="py-2.5 px-3 text-right">Kkal</th>
                        <th className="py-2.5 px-3 text-right">Lemak (g)</th>
                        <th className="py-2.5 px-3 text-right">Karb (g)</th>
                        <th className="py-2.5 px-3 text-right">Prot (g)</th>
                        <th className="py-2.5 px-2 text-center w-8"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-gray-800">
                      {items.length > 0 ? (
                        items.map((it) => (
                          <tr key={it.id} className="hover:bg-gray-50/80 transition-colors">
                            <td className="py-2.5 px-4 font-semibold text-gray-900">
                              <div className="flex items-center gap-2">
                                {it.imageUrl ? (
                                  <img
                                    src={it.imageUrl}
                                    alt={it.foodName}
                                    className="w-8 h-8 rounded object-cover border border-gray-200 flex-shrink-0"
                                  />
                                ) : (
                                  <span className="w-8 h-8 rounded bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-xs flex-shrink-0">
                                    🥗
                                  </span>
                                )}
                                <span>{it.foodName}</span>
                              </div>
                            </td>
                            <td className="py-2.5 px-3 text-gray-500 whitespace-nowrap">
                              {it.servingSize || '1 porsi'}
                            </td>
                            <td className="py-2.5 px-3 text-right font-bold text-gray-900">
                              {Math.round(it.calories)}
                            </td>
                            <td className="py-2.5 px-3 text-right text-gray-700 font-medium">
                              {it.fat}
                            </td>
                            <td className="py-2.5 px-3 text-right text-gray-700 font-medium">
                              {it.carbs}
                            </td>
                            <td className="py-2.5 px-3 text-right text-gray-700 font-medium">
                              {it.protein}
                            </td>
                            <td className="py-2.5 px-2 text-center">
                              <button
                                onClick={() => handleDelete(it.id, it.foodName)}
                                className="p-1 text-gray-300 hover:text-red-600 rounded transition-colors"
                                title="Hapus dari buku harian"
                              >
                                <Trash2 size={13} />
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="7" className="py-4 px-4 text-center text-gray-400 italic">
                            Belum ada makanan dicatat untuk {section.name.toLowerCase()}.
                          </td>
                        </tr>
                      )}

                      {/* Subtotal Row ala FatSecret */}
                      <tr className="bg-gray-50 font-black text-gray-900 border-t border-gray-200 text-[11px]">
                        <td className="py-2.5 px-4" colSpan="2">
                          Subtotal {section.name}:
                        </td>
                        <td className="py-2.5 px-3 text-right text-[#028543]">
                          {Math.round(secCalories)}
                        </td>
                        <td className="py-2.5 px-3 text-right">{secFat.toFixed(1)}</td>
                        <td className="py-2.5 px-3 text-right">{secCarbs.toFixed(1)}</td>
                        <td className="py-2.5 px-3 text-right">{secProtein.toFixed(1)}</td>
                        <td className="py-2.5 px-2"></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })}

          {/* ─── Grand Total Row (Total Harian Buku Harian) ─── */}
          <div className="bg-emerald-50 border-2 border-[#028543] rounded-lg p-4 flex flex-col sm:flex-row justify-between items-center gap-3 shadow-2xs font-sans">
            <div>
              <span className="text-[10px] font-black uppercase text-[#028543] tracking-wider">
                Ringkasan Buku Harian
              </span>
              <h4 className="text-base font-black text-gray-900">TOTAL KONSUMSI HARI INI</h4>
            </div>

            <div className="flex items-center gap-6 text-center text-xs">
              <div>
                <span className="text-[10px] text-gray-500 font-bold uppercase block">Kalori</span>
                <span className="text-lg font-black text-[#028543]">{totalCalories} kkal</span>
              </div>
              <div className="border-l border-emerald-200 pl-4">
                <span className="text-[10px] text-gray-500 font-bold uppercase block">Lemak</span>
                <span className="text-sm font-bold text-gray-800">{totalFat} g</span>
              </div>
              <div className="border-l border-emerald-200 pl-4">
                <span className="text-[10px] text-gray-500 font-bold uppercase block">Karbo</span>
                <span className="text-sm font-bold text-gray-800">{totalCarbs} g</span>
              </div>
              <div className="border-l border-emerald-200 pl-4">
                <span className="text-[10px] text-gray-500 font-bold uppercase block">Protein</span>
                <span className="text-sm font-bold text-gray-800">{totalProtein} g</span>
              </div>
            </div>
          </div>
        </div>

        {/* ─── Kolom Kanan: Ringkasan Gizi & Neraca Kalori (30%) ─── */}
        <div className="lg:col-span-4 space-y-6">
          {/* Card: Ringkasan Kalori Harian */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-2xs p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-200 pb-3">
              <h3 className="font-bold text-sm text-gray-900 flex items-center gap-1.5">
                <Target size={16} className="text-[#028543]" />
                <span>Ringkasan Gizi Harian</span>
              </h3>

              {isEditingTarget ? (
                <div className="flex items-center gap-1 text-xs">
                  <input
                    type="number"
                    value={tempTarget}
                    onChange={(e) => setTempTarget(e.target.value)}
                    className="w-16 px-1.5 py-0.5 border border-[#028543] rounded text-center font-bold text-xs"
                  />
                  <button
                    onClick={handleSaveTarget}
                    className="p-1 bg-[#028543] text-white rounded hover:bg-[#016b35]"
                    title="Simpan"
                  >
                    <Check size={12} />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setTempTarget(targetCalories);
                    setIsEditingTarget(true);
                  }}
                  className="text-[11px] text-[#028543] font-bold hover:underline flex items-center gap-1"
                >
                  <Edit2 size={11} />
                  <span>Ubah Sasaran</span>
                </button>
              )}
            </div>

            {/* Formula Kotak Kalori FatSecret */}
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-gray-100">
                <span className="text-gray-600 font-medium">Sasaran Kalori (RDI):</span>
                <span className="font-bold text-gray-900">{targetCalories} kkal</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-100">
                <span className="text-gray-600 font-medium">Makanan (Terkonsumsi):</span>
                <span className="font-bold text-[#028543]">{totalCalories} kkal</span>
              </div>
              <div className="flex justify-between py-1.5 font-bold text-sm">
                <span className="text-gray-800">
                  {remainingCalories >= 0 ? 'Sisa Kalori:' : 'Kelebihan Kalori:'}
                </span>
                <span
                  className={
                    remainingCalories >= 0 ? 'text-[#028543] font-black' : 'text-red-600 font-black'
                  }
                >
                  {remainingCalories} kkal
                </span>
              </div>
            </div>

            {/* Progress Bar Asupan */}
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] font-bold text-gray-500">
                <span>Pencapaian: {pctCalories}%</span>
                <span>{totalCalories} / {targetCalories} kkal</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    totalCalories > targetCalories ? 'bg-red-500' : 'bg-[#028543]'
                  }`}
                  style={{ width: `${Math.min(pctCalories, 100)}%` }}
                />
              </div>
            </div>
          </div>

          {/* Card: Rincian Kalori Makronutrien (Bagan FatSecret) */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-2xs p-5 space-y-4">
            <h3 className="font-bold text-sm text-gray-900 flex items-center gap-1.5 border-b border-gray-200 pb-3">
              <PieChart size={16} className="text-[#028543]" />
              <span>Rincian Kalori Makro</span>
            </h3>

            {/* FatSecret Macro Split Bar */}
            <div className="space-y-2">
              <div className="h-4 w-full bg-gray-100 rounded flex overflow-hidden">
                <div
                  style={{ width: `${pctCarbs}%` }}
                  className="bg-[#028543] h-full"
                  title={`Karbo: ${pctCarbs}%`}
                />
                <div
                  style={{ width: `${pctFat}%` }}
                  className="bg-[#f59e0b] h-full"
                  title={`Lemak: ${pctFat}%`}
                />
                <div
                  style={{ width: `${pctProtein}%` }}
                  className="bg-[#2563eb] h-full"
                  title={`Protein: ${pctProtein}%`}
                />
              </div>

              {/* Legenda Makro FatSecret */}
              <div className="grid grid-cols-3 gap-1 pt-1 text-center text-xs">
                <div className="p-1.5 bg-emerald-50 rounded border border-emerald-100">
                  <span className="text-[10px] font-bold text-[#028543] block">Karbo</span>
                  <strong className="text-sm text-gray-900">{pctCarbs}%</strong>
                  <span className="text-[10px] text-gray-500 block">{totalCarbs}g</span>
                </div>
                <div className="p-1.5 bg-amber-50 rounded border border-amber-100">
                  <span className="text-[10px] font-bold text-amber-700 block">Lemak</span>
                  <strong className="text-sm text-gray-900">{pctFat}%</strong>
                  <span className="text-[10px] text-gray-500 block">{totalFat}g</span>
                </div>
                <div className="p-1.5 bg-blue-50 rounded border border-blue-100">
                  <span className="text-[10px] font-bold text-blue-700 block">Protein</span>
                  <strong className="text-sm text-gray-900">{pctProtein}%</strong>
                  <span className="text-[10px] text-gray-500 block">{totalProtein}g</span>
                </div>
              </div>
            </div>
          </div>

          {/* Card: Angka Kecukupan Gizi (AKG) Kemenkes RI */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-2xs p-5 space-y-3 text-xs">
            <h4 className="font-bold text-gray-900 uppercase text-[11px] tracking-wider border-b border-gray-200 pb-2">
              Pemenuhan AKG Harian (2.000 kkal)
            </h4>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Karbohidrat (300g):</span>
                <span className="font-bold text-gray-900">{akgCarbs}% AKG</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Lemak Total (67g):</span>
                <span className="font-bold text-gray-900">{akgFat}% AKG</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Protein (60g):</span>
                <span className="font-bold text-gray-900">{akgProtein}% AKG</span>
              </div>
            </div>
            <p className="text-[10px] text-gray-400 pt-2 border-t border-gray-100 leading-tight">
              *Berdasarkan Pedoman Angka Kecukupan Gizi Kementerian Kesehatan Republik Indonesia.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
