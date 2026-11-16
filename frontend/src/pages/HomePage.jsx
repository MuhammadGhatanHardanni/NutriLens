import { Link } from 'react-router-dom';
import { ArrowUpRight, Camera, ChevronRight, Clock3, Flame, Leaf, ScanLine, ShieldCheck, Utensils, WalletCards } from 'lucide-react';

const features = [
  { number: '01', icon: ScanLine, title: 'Kenali isi piringmu', text: 'Unggah foto makanan dan biarkan AI membantu mengenali hidangan serta kandungan gizinya.' },
  { number: '02', icon: WalletCards, title: 'Catat dengan mudah', text: 'Simpan hasil pemindaian ke buku harian dan pantau asupan harianmu.' },
  { number: '03', icon: Leaf, title: 'Pahami nutrisinya', text: 'Lihat rincian kalori, protein, karbohidrat, lemak, dan serat dalam satu tampilan.' },
  { number: '04', icon: Clock3, title: 'Lihat perjalananmu', text: 'Buka kembali catatan makanan kapan saja melalui halaman riwayat.' },
];

const foods = [
  { name: 'Nasi goreng ayam', details: '1 porsi · perkiraan', calories: '520', color: 'sage' },
  { name: 'Gado-gado', details: '1 piring · perkiraan', calories: '410', color: 'olive' },
  { name: 'Soto ayam', details: '1 mangkuk · perkiraan', calories: '310', color: 'sand' },
];

export default function HomePage() {
  return (
    <div className="home-page">
      <section className="home-hero">
        <div className="hero-copy">
          <span className="eyebrow"><span className="eyebrow-dot" /> MAKAN DENGAN LEBIH SADAR</span>
          <h1>Kenali makananmu.<br />Pahami <em>nutrisinya.</em></h1>
          <p>Foto makananmu, dapatkan perkiraan kalori dan nutrisi, lalu simpan ke jurnal harian. Praktis untuk membantu pilihan makan sehari-hari.</p>
          <div className="hero-actions">
            <Link to="/detect" className="button-primary"><Camera size={17} /> Mulai pindai <ArrowUpRight size={16} /></Link>
            <Link to="/dashboard" className="button-secondary">Buka jurnal <ChevronRight size={16} /></Link>
          </div>
          <div className="hero-note"><ShieldCheck size={15} /> Informasi nutrisi sebagai panduan harian</div>
        </div>
        <div className="hero-art" aria-label="Ilustrasi piring makanan seimbang" role="img">
          <div className="art-orbit orbit-one" /><div className="art-orbit orbit-two" />
          <div className="plate"><div className="plate-food food-greens" /><div className="plate-food food-grains" /><div className="plate-food food-tomatoes" /><div className="plate-food food-protein" /><div className="plate-food food-herbs" /></div>
          <div className="nutrition-note"><span className="note-icon"><Flame size={16} /></span><span><small>ESTIMASI ENERGI</small><strong>520 <small>kkal</small></strong></span></div>
          <div className="organic-tag"><Leaf size={13} /> Pilihan lebih sadar</div>
          <span className="art-caption">GIZI DIMULAI DARI RASA INGIN TAHU</span>
        </div>
      </section>

      <div className="value-strip"><span><Leaf size={15} /> Kenali makanan</span><i /><span><ScanLine size={15} /> Pindai dengan AI</span><i /><span><Utensils size={15} /> Pantau asupan</span><i /><span><ShieldCheck size={15} /> Simpan dengan mudah</span></div>

      <section className="home-section explore-section">
        <div className="section-heading"><div><span className="eyebrow">NUTRILENS MEMBANTUMU</span><h2>Langkah kecil, pilihan lebih baik.</h2></div><Link to="/detect" className="text-link">Coba pemindai <ArrowUpRight size={15} /></Link></div>
        <div className="feature-grid">{features.map(({ number, icon: Icon, title, text }) => <article className="feature-card" key={number}><div className="feature-top"><span>{number}</span><Icon size={19} /></div><h3>{title}</h3><p>{text}</p></article>)}</div>
      </section>

      <section className="food-section">
        <div className="section-heading"><div><span className="eyebrow">INSPIRASI HARI INI</span><h2>Kenali isi piringmu.</h2></div><p>Nilai di bawah hanya contoh perkiraan per porsi.</p></div>
        <div className="food-list">{foods.map((food, index) => <article className="food-row" key={food.name}><span className={`food-mark ${food.color}`}><Utensils size={18} /></span><span className="food-name"><strong>{food.name}</strong><small>{food.details}</small></span><span className="food-calories"><strong>{food.calories}</strong><small>kkal</small></span><Link to="/detect" aria-label={`Pindai ${food.name}`}><ArrowUpRight size={17} /></Link></article>)}</div>
      </section>
      <section className="closing-banner"><div><span className="eyebrow">MULAI DARI SATU FOTO</span><h2>Lebih kenal dengan apa yang kamu makan.</h2></div><Link to="/detect" className="button-light"><Camera size={16} /> Pindai makanan <ArrowUpRight size={15} /></Link></section>
    </div>
  );
}
