// src/pages/DetectPage.jsx - Pemeriksa Gizi Makanan AI ala FatSecret Indonesia
import { useState, useCallback, useRef, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import {
  Camera,
  Upload,
  Loader2,
  AlertCircle,
  CheckCircle,
  RefreshCw,
  Sparkles,
  PieChart,
  Info,
  Calendar,
  Layers,
  Utensils,
  BookOpen,
  VideoOff,
  ChevronRight,
  Plus,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { detectFood } from '../services/food.service.js';
import toast from 'react-hot-toast';

// Standar Acuan AKG (Angka Kecukupan Gizi) Indonesia 2.000 kkal
const AKG_STANDARD = {
  calories: 2000,
  protein: 60,
  fat: 67,
  carbs: 300,
  fiber: 30,
};

export default function DetectPage() {
  const [activeTab, setActiveTab] = useState('upload'); // 'upload' | 'camera'
  const [preview, setPreview] = useState(null);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  // Penyesuaian Porsi & Waktu Makan ala FatSecret
  const [portionMultiplier, setPortionMultiplier] = useState(1);
  const [targetMeal, setTargetMeal] = useState('lunch');

  // Kamera stream
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraStream, setCameraStream] = useState(null);
  const videoRef = useRef(null);

  useEffect(() => {
    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [cameraStream]);

  // Dropzone file
  const onDrop = useCallback((acceptedFiles) => {
    const f = acceptedFiles[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
    setResult(null);
    setError(null);
    setPortionMultiplier(1);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpg', '.jpeg', '.png', '.webp'] },
    maxFiles: 1,
  });

  // Start Camera
  const startCamera = async () => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setCameraStream(stream);
      setIsCameraActive(true);
    } catch (err) {
      toast.error('Gagal mengakses kamera. Periksa izin kamera pada browser.');
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
      setCameraStream(null);
    }
    setIsCameraActive(false);
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(
      (blob) => {
        if (!blob) return;
        const capturedFile = new File([blob], `capture-${Date.now()}.jpg`, { type: 'image/jpeg' });
        setFile(capturedFile);
        setPreview(URL.createObjectURL(capturedFile));
        setResult(null);
        setError(null);
        stopCamera();
        toast.success('Foto berhasil diambil!');
      },
      'image/jpeg',
      0.92
    );
  };

  const handleDetect = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);
    try {
      const data = await detectFood(file);
      setResult(data.data);
      setPortionMultiplier(1);
      toast.success('Makanan berhasil dianalisis!');
    } catch (err) {
      const msg = err.response?.data?.message || 'Gagal menganalisis foto makanan.';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setPreview(null);
    setFile(null);
    setResult(null);
    setError(null);
    setPortionMultiplier(1);
    stopCamera();
  };

  const nutrition = result?.nutrition;
  const rawNutrients = nutrition?.nutrients || { calories: 0, protein: 0, fat: 0, carbs: 0, fiber: 0 };

  // Hitung nilai nutrisi sesuai multiplier porsi
  const currentNutrients = {
    calories: Math.round((rawNutrients.calories || 0) * portionMultiplier),
    protein: Number(((rawNutrients.protein || 0) * portionMultiplier).toFixed(1)),
    fat: Number(((rawNutrients.fat || 0) * portionMultiplier).toFixed(1)),
    carbs: Number(((rawNutrients.carbs || 0) * portionMultiplier).toFixed(1)),
    fiber: Number(((rawNutrients.fiber || 0) * portionMultiplier).toFixed(1)),
  };

  // Rasio Makronutrien Ala FatSecret (Karbo 4 kkal, Lemak 9 kkal, Protein 4 kkal)
  const calCarbs = currentNutrients.carbs * 4;
  const calProtein = currentNutrients.protein * 4;
  const calFat = currentNutrients.fat * 9;
  const totalMacroCal = calCarbs + calProtein + calFat || 1;

  const pctCarbs = Math.round((calCarbs / totalMacroCal) * 100);
  const pctFat = Math.round((calFat / totalMacroCal) * 100);
  const pctProtein = Math.max(0, 100 - pctCarbs - pctFat);

  // % AKG
  const akgCalories = Math.round((currentNutrients.calories / AKG_STANDARD.calories) * 100);
  const akgProtein = Math.round((currentNutrients.protein / AKG_STANDARD.protein) * 100);
  const akgFat = Math.round((currentNutrients.fat / AKG_STANDARD.fat) * 100);
  const akgCarbs = Math.round((currentNutrients.carbs / AKG_STANDARD.carbs) * 100);
  const akgFiber = Math.round((currentNutrients.fiber / AKG_STANDARD.fiber) * 100);

  return (
    <div className="space-y-6 pb-16 font-sans">
      {/* ─── Breadcrumb FatSecret Style ─── */}
      <div className="flex items-center gap-1.5 text-xs text-gray-500">
        <Link to="/" className="text-[#028543] hover:underline">
          NutriSnap
        </Link>
        <ChevronRight size={13} className="text-gray-400" />
        <Link to="/dashboard" className="text-[#028543] hover:underline">
          Buku Harian
        </Link>
        <ChevronRight size={13} className="text-gray-400" />
        <span className="text-gray-800 font-semibold">Deteksi Makanan AI</span>
      </div>

      {/* ─── Header Portal ─── */}
      <div className="bg-white border-t-4 border-[#028543] border-x border-b border-gray-200 rounded-lg p-5 shadow-2xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-emerald-100 text-[#028543] rounded">
              <Camera size={18} />
            </span>
            <h1 className="text-xl font-black text-gray-900 tracking-tight">
              Pemeriksa & Deteksi Nilai Gizi Makanan
            </h1>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Ambil atau unggah foto hidangan Anda. AI akan mengidentifikasi jenis makanan dan
            menampilkan rincian Informasi Nilai Gizi standar FatSecret Indonesia.
          </p>
        </div>

        {result && (
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-1.5 border border-[#028543] text-[#028543] font-bold rounded text-xs hover:bg-emerald-50 transition-colors"
          >
            <RefreshCw size={13} />
            <span>Pindai Foto Lain</span>
          </button>
        )}
      </div>

      {/* ─── UPLOAD & CAMERA SECTION ─── */}
      {!result && (
        <div className="bg-white border border-gray-200 rounded-lg shadow-2xs overflow-hidden">
          {/* Tabs Mode */}
          <div className="flex border-b border-gray-200 bg-gray-50 text-xs font-bold">
            <button
              onClick={() => {
                setActiveTab('upload');
                stopCamera();
              }}
              className={`py-3 px-6 flex items-center gap-2 border-b-2 transition-colors ${activeTab === 'upload'
                ? 'bg-white text-[#028543] border-[#028543]'
                : 'text-gray-500 border-transparent hover:text-gray-800'
                }`}
            >
              <Upload size={15} />
              <span>Unggah Berkas Galeri</span>
            </button>
            <button
              onClick={() => {
                setActiveTab('camera');
                startCamera();
              }}
              className={`py-3 px-6 flex items-center gap-2 border-b-2 transition-colors ${activeTab === 'camera'
                ? 'bg-white text-[#028543] border-[#028543]'
                : 'text-gray-500 border-transparent hover:text-gray-800'
                }`}
            >
              <Camera size={15} />
              <span>Ambil Foto Langsung (Kamera)</span>
            </button>
          </div>

          <div className="p-6">
            {/* Tab 1: Upload */}
            {activeTab === 'upload' && !preview && (
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-10 text-center cursor-pointer transition-all ${isDragActive
                  ? 'border-[#028543] bg-emerald-50/50'
                  : 'border-gray-300 hover:border-[#028543] hover:bg-gray-50'
                  }`}
              >
                <input {...getInputProps()} />
                <div className="space-y-3">
                  <div className="w-14 h-14 mx-auto bg-emerald-50 text-[#028543] rounded-full flex items-center justify-center">
                    <Upload size={24} />
                  </div>
                  <div>
                    <p className="text-gray-800 font-bold text-sm">
                      {isDragActive
                        ? 'Lepaskan foto makanan di sini...'
                        : 'Klik untuk memilih foto, atau seret foto ke dalam area ini'}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Format JPG, PNG, atau WEBP (Maksimal 10MB)
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: Camera */}
            {activeTab === 'camera' && !preview && (
              <div className="space-y-4">
                <div className="relative bg-black rounded-lg overflow-hidden max-h-[380px] aspect-video flex items-center justify-center">
                  <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                  {!isCameraActive && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-white bg-gray-900/80 p-4 text-center">
                      <VideoOff size={36} className="mb-2 text-gray-400" />
                      <p className="text-xs font-semibold">Kamera Belum Aktif</p>
                      <button
                        onClick={startCamera}
                        className="mt-2 px-3 py-1.5 bg-[#028543] text-white rounded text-xs font-bold hover:bg-[#016b35]"
                      >
                        Nyalakan Kamera
                      </button>
                    </div>
                  )}
                </div>

                {isCameraActive && (
                  <div className="flex justify-center gap-2">
                    <button
                      onClick={capturePhoto}
                      className="px-5 py-2.5 bg-[#028543] hover:bg-[#016b35] text-white font-bold rounded-md flex items-center gap-2 text-xs shadow-xs"
                    >
                      <Camera size={16} />
                      <span>Jepret Foto Sekarang</span>
                    </button>
                    <button
                      onClick={stopCamera}
                      className="px-3 py-2.5 border border-gray-300 text-gray-600 rounded-md text-xs font-medium hover:bg-gray-100"
                    >
                      Tutup Kamera
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Preview Selected Photo */}
            {preview && (
              <div className="space-y-4 max-w-lg mx-auto">
                <div className="relative rounded-lg overflow-hidden border border-gray-200 bg-gray-100 h-64">
                  <img src={preview} alt="Preview Makanan" className="w-full h-full object-cover" />
                  <span className="absolute top-2 right-2 bg-black/60 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                    Foto Siap Dianalisis
                  </span>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={handleDetect}
                    disabled={loading}
                    className="flex-1 py-2.5 bg-[#028543] hover:bg-[#016b35] text-white font-black rounded-md flex items-center justify-center gap-2 text-xs shadow-xs disabled:opacity-60 transition-colors"
                  >
                    {loading ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        <span>Menganalisis dengan Google Gemini AI...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles size={16} />
                        <span>Analisis Makanan & Tampilkan Nilai Gizi</span>
                      </>
                    )}
                  </button>
                  <button
                    onClick={handleReset}
                    disabled={loading}
                    className="px-4 py-2.5 border border-gray-300 text-gray-700 font-bold rounded-md text-xs hover:bg-gray-50"
                  >
                    Ganti Foto
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {error && (
        <div className="p-3.5 bg-red-50 border border-red-200 rounded-lg text-red-700 text-xs flex items-center gap-2">
          <AlertCircle size={16} className="flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* ─── HASIL ANALISIS ALA FATSECRET INDONESIA ─── */}
      {result && (
        <div className="space-y-6">
          {/* Header Makanan Teridentifikasi */}
          <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-2xs space-y-3">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-gray-100 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#028543]">
                  Hidangan Terdeteksi
                </span>
                <h2 className="text-2xl font-black text-gray-900">
                  {nutrition?.label || result.detectedFoods[0]?.name || 'Makanan Terdeteksi'}
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  Takaran saji rujukan: <strong>{nutrition?.servingSize || '1 porsi'}</strong> •{' '}
                  <span className="text-emerald-700 font-semibold">
                    Kepercayaan AI: {Math.round((result.detectedFoods[0]?.confidence || 0.95) * 100)}%
                  </span>
                </p>
              </div>

              {/* Status Badge */}
              <div>
                {result.isMock ? (
                  <span className="text-[11px] bg-amber-100 text-amber-800 px-2.5 py-1 rounded font-bold border border-amber-200">
                    Mode Demo (Mock)
                  </span>
                ) : (
                  <span className="text-[11px] bg-emerald-50 text-[#028543] px-2.5 py-1 rounded font-bold border border-emerald-200 flex items-center gap-1">
                    <Sparkles size={12} />
                    <span>Gemini AI: {result.modelUsed || '3.6-flash'}</span>
                  </span>
                )}
              </div>
            </div>

            {/* Quick Overview Bar Ala FatSecret: [Energi] [Lemak] [Karb] [Prot] */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
              <div>
                <span className="text-[10px] font-bold text-gray-500 uppercase block">Energi</span>
                <strong className="text-base font-black text-gray-900">
                  {currentNutrients.calories} kkal
                </strong>
              </div>
              <div className="border-l border-gray-200">
                <span className="text-[10px] font-bold text-amber-700 uppercase block">Lemak</span>
                <strong className="text-base font-black text-gray-900">
                  {currentNutrients.fat} g
                </strong>
              </div>
              <div className="border-l border-gray-200">
                <span className="text-[10px] font-bold text-[#028543] uppercase block">Karbo</span>
                <strong className="text-base font-black text-gray-900">
                  {currentNutrients.carbs} g
                </strong>
              </div>
              <div className="border-l border-gray-200">
                <span className="text-[10px] font-bold text-blue-700 uppercase block">Protein</span>
                <strong className="text-base font-black text-gray-900">
                  {currentNutrients.protein} g
                </strong>
              </div>
            </div>

            {/* Komponen Lauk Tambahan */}
            {result.detectedFoods?.length > 1 && (
              <div className="text-xs pt-1">
                <span className="text-gray-500 font-bold mr-1">Lauk / Isian terdeteksi:</span>
                <span className="text-gray-800">
                  {result.detectedFoods.slice(1).map((f) => f.name).join(', ')}
                </span>
              </div>
            )}
          </div>

          {/* ─── Grid 2 Kolom: Detail Porsi & Tabel Informasi Nilai Gizi ─── */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Kolom Kiri: Porsi & Masukkan ke Buku Harian (60%) */}
            <div className="lg:col-span-7 space-y-6">
              {/* Box 1: Berapa Banyak yang Anda Makan? (Portion Adjuster) */}
              <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-2xs space-y-3">
                <h3 className="font-bold text-sm text-gray-900 flex items-center gap-1.5 border-b border-gray-200 pb-2">
                  <Layers size={16} className="text-[#028543]" />
                  <span>Berapa Banyak yang Anda Makan?</span>
                </h3>

                <p className="text-xs text-gray-500">
                  Pilih takaran porsi konsumsi Anda untuk memperbarui rincian nilai gizi:
                </p>

                <div className="grid grid-cols-4 gap-2 pt-1">
                  {[
                    { label: '½ Porsi', value: 0.5 },
                    { label: '1 Porsi', value: 1.0 },
                    { label: '1½ Porsi', value: 1.5 },
                    { label: '2 Porsi', value: 2.0 },
                  ].map((p) => (
                    <button
                      key={p.value}
                      onClick={() => setPortionMultiplier(p.value)}
                      className={`py-2 text-xs font-bold rounded border transition-colors ${portionMultiplier === p.value
                        ? 'bg-[#028543] text-white border-[#028543]'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-emerald-400 hover:bg-emerald-50/50'
                        }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Box 2: Rincian Kalori Makronutrien (Diagram FatSecret) */}
              <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-2xs space-y-3">
                <h3 className="font-bold text-sm text-gray-900 flex items-center gap-1.5 border-b border-gray-200 pb-2">
                  <PieChart size={16} className="text-[#028543]" />
                  <span>Rincian Kalori (Makronutrien)</span>
                </h3>

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

                  <div className="grid grid-cols-3 gap-2 text-center text-xs pt-1">
                    <div className="p-2 bg-emerald-50 rounded border border-emerald-100">
                      <span className="text-[10px] font-bold text-[#028543] block">Karbohidrat</span>
                      <strong className="text-base text-gray-900">{pctCarbs}%</strong>
                      <span className="text-[10px] text-gray-500 block">{currentNutrients.carbs}g</span>
                    </div>
                    <div className="p-2 bg-amber-50 rounded border border-amber-100">
                      <span className="text-[10px] font-bold text-amber-700 block">Lemak</span>
                      <strong className="text-base text-gray-900">{pctFat}%</strong>
                      <span className="text-[10px] text-gray-500 block">{currentNutrients.fat}g</span>
                    </div>
                    <div className="p-2 bg-blue-50 rounded border border-blue-100">
                      <span className="text-[10px] font-bold text-blue-700 block">Protein</span>
                      <strong className="text-base text-gray-900">{pctProtein}%</strong>
                      <span className="text-[10px] text-gray-500 block">{currentNutrients.protein}g</span>
                    </div>
                  </div>
                </div>

                {nutrition?.description && (
                  <div className="bg-gray-50 border border-gray-200 rounded p-3 text-xs text-gray-600 leading-relaxed mt-2">
                    <strong className="text-gray-800 block mb-0.5">Ulasan Nutrisi:</strong>
                    {nutrition.description}
                  </div>
                )}
              </div>

              {/* Box 3: Tindakan Buku Harian */}
              <div className="bg-emerald-50 border border-[#028543] rounded-lg p-4 flex flex-col sm:flex-row justify-between items-center gap-3">
                <div className="flex items-center gap-2">
                  <CheckCircle size={20} className="text-[#028543]" />
                  <div>
                    <strong className="text-sm text-gray-900 block leading-tight">
                      Data Siap Tersimpan
                    </strong>
                    <span className="text-xs text-gray-600">
                      Makanan ini otomatis tercatat ke riwayat konsumsi Anda.
                    </span>
                  </div>
                </div>

                <Link
                  to="/dashboard"
                  className="px-4 py-2 bg-[#028543] hover:bg-[#016b35] text-white text-xs font-bold rounded shadow-2xs transition-colors flex items-center gap-1.5 whitespace-nowrap"
                >
                  <BookOpen size={14} />
                  <span>Buka Buku Harian</span>
                </Link>
              </div>
            </div>

            {/* Kolom Kanan: LABEL INFORMASI NILAI GIZI RESMI FATSECRET (40%) ─── */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-white border-2 border-gray-900 rounded p-4 shadow-sm font-sans">
                {/* Header Title */}
                <h3 className="text-2xl font-black text-gray-950 uppercase tracking-tight border-b-6 border-gray-950 pb-1">
                  Informasi Nilai Gizi
                </h3>

                {/* Ukuran Porsi */}
                <div className="py-2 border-b border-gray-300 text-xs">
                  <div className="flex justify-between font-bold text-gray-900">
                    <span>Ukuran Porsi</span>
                    <span>
                      {portionMultiplier !== 1
                        ? `${portionMultiplier}x (${nutrition?.servingSize})`
                        : nutrition?.servingSize || '1 porsi'}
                    </span>
                  </div>
                </div>

                {/* Energi / Kalori */}
                <div className="py-2.5 border-b-4 border-gray-950 flex justify-between items-baseline">
                  <div>
                    <span className="text-[10px] font-black text-gray-900 uppercase">Jumlah Per Porsi</span>
                    <h4 className="text-lg font-black text-gray-950">Energi Total</h4>
                  </div>
                  <div className="text-right">
                    <span className="text-3xl font-black text-gray-950">
                      {currentNutrients.calories}
                    </span>
                    <span className="text-xs font-bold text-gray-600 ml-1">kkal</span>
                  </div>
                </div>

                {/* % AKG Header */}
                <div className="py-1 text-right border-b border-gray-300 text-[10px] font-bold text-gray-700">
                  % AKG*
                </div>

                {/* Rows Nutrisi */}
                <div className="divide-y divide-gray-200 text-xs">
                  <div className="py-1.5 flex justify-between items-center">
                    <div>
                      <strong className="text-gray-900">Lemak Total</strong>{' '}
                      <span className="text-gray-600">{currentNutrients.fat}g</span>
                    </div>
                    <span className="font-bold text-gray-900">{akgFat}%</span>
                  </div>

                  <div className="py-1.5 flex justify-between items-center">
                    <div>
                      <strong className="text-gray-900">Protein</strong>{' '}
                      <span className="text-gray-600">{currentNutrients.protein}g</span>
                    </div>
                    <span className="font-bold text-gray-900">{akgProtein}%</span>
                  </div>

                  <div className="py-1.5 flex justify-between items-center">
                    <div>
                      <strong className="text-gray-900">Karbohidrat Total</strong>{' '}
                      <span className="text-gray-600">{currentNutrients.carbs}g</span>
                    </div>
                    <span className="font-bold text-gray-900">{akgCarbs}%</span>
                  </div>

                  <div className="py-1.5 pl-4 flex justify-between items-center text-gray-700">
                    <div>
                      <span>Serat Pangan</span>{' '}
                      <span className="text-gray-500">{currentNutrients.fiber}g</span>
                    </div>
                    <span className="font-bold text-gray-800">{akgFiber}%</span>
                  </div>
                </div>

                {/* Footer Catatan AKG */}
                <div className="pt-2.5 mt-2 border-t-4 border-gray-950 text-[10px] text-gray-500 leading-tight">
                  <p>
                    *Persen Angka Kecukupan Gizi (AKG) berdasarkan kebutuhan energi 2.000 kkal.
                    Kebutuhan energi Anda mungkin lebih tinggi atau lebih rendah.
                  </p>
                </div>
              </div>

              {/* Action Reset Button */}
              <button
                onClick={handleReset}
                className="w-full py-2.5 border border-[#028543] text-[#028543] font-bold rounded text-xs hover:bg-emerald-50 transition-colors flex items-center justify-center gap-1.5"
              >
                <RefreshCw size={14} />
                <span>Pindai Foto Makanan Lain</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
