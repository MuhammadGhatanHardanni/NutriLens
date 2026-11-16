import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { Camera, BookOpen, History, LogOut, Menu, X, Leaf } from 'lucide-react';

export default function Navbar() {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isActive = (path) => location.pathname === path;
  const closeMenu = () => setIsMobileMenuOpen(false);
  const handleLogout = () => { logoutUser(); closeMenu(); navigate('/'); };
  const links = [
    { to: '/', label: 'Beranda' },
    { to: '/detect', label: 'Pindai makanan', icon: Camera },
    { to: '/dashboard', label: 'Buku harian', icon: BookOpen },
    { to: '/history', label: 'Riwayat', icon: History },
  ];

  return (
    <header className="site-header">
      <div className="site-header-inner">
        <Link to="/" className="brand-link" aria-label="NutriLens beranda">
          <span className="brand-mark"><Leaf size={18} /></span>
          <span><span className="brand-name">NutriLens</span><span className="brand-caption">FOOD · NUTRITION · WELLNESS</span></span>
        </Link>
        <nav className="site-nav" aria-label="Navigasi utama">
          {links.map(({ to, label }) => <Link key={to} to={to} className={isActive(to) ? 'nav-active' : ''}>{label}</Link>)}
        </nav>
        <div className="header-actions">
          {user ? <><span className="header-user">Halo, <strong>{user.name.split(' ')[0]}</strong></span><button className="header-logout" onClick={handleLogout}><LogOut size={14} /> Keluar</button></> : <><Link to="/login" className="header-login">Masuk</Link><Link to="/register" className="header-register">Buat akun <span aria-hidden="true">↗</span></Link></>}
        </div>
        <button className="mobile-toggle" onClick={() => setIsMobileMenuOpen((open) => !open)} aria-label={isMobileMenuOpen ? 'Tutup menu' : 'Buka menu'}>
          {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>
      {isMobileMenuOpen && <div className="mobile-drawer">
        {links.map(({ to, label }) => <Link key={to} to={to} onClick={closeMenu}>{label}</Link>)}
        <div className="mobile-drawer-actions">{user ? <><span className="header-user">{user.name}</span><button className="header-logout" onClick={handleLogout}><LogOut size={14} /> Keluar</button></> : <><Link to="/login" onClick={closeMenu}>Masuk</Link><Link to="/register" onClick={closeMenu}>Buat akun</Link></>}</div>
      </div>}
    </header>
  );
}
