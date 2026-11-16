import { Link } from 'react-router-dom';
import { Leaf, ShieldCheck } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-grid">
          <div>
            <Link to="/" className="footer-brand"><span className="footer-brand-mark"><Leaf size={17} /></span> NutriLens</Link>
            <p className="footer-copy">Kenali makanan dan pahami nutrisinya. NutriLens membantu mencatat asupan dengan pemindaian foto yang praktis.</p>
            <div className="footer-standard"><ShieldCheck size={14} /> Panduan asupan harian mengacu pada AKG 2.000 kkal</div>
          </div>
          <div className="footer-column"><h4>JELAJAHI</h4><Link to="/detect">Pemindai makanan</Link><Link to="/dashboard">Buku harian</Link><Link to="/history">Riwayat konsumsi</Link></div>
          <div className="footer-column"><h4>TENTANG NUTRISI</h4><Link to="/detect">Informasi nilai gizi</Link><Link to="/dashboard">Pantau asupan harian</Link><Link to="/">Cara kerja NutriLens</Link></div>
        </div>
        <div className="footer-bottom"><span>© {new Date().getFullYear()} NutriLens. Semua hak dilindungi.</span><span>Estimasi nutrisi digunakan sebagai informasi panduan.</span></div>
      </div>
    </footer>
  );
}
