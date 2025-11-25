// src/components/Header.tsx
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Header: React.FC = () => {
    const loc = useLocation();
    const navigate = useNavigate();

    return (
        <header className="site-header">
            <div className="container header-inner">
                <div className="logo" onClick={() => navigate('/')}>
                    <span className="logo-mark">🌿</span>
                    <span className="logo-text">Bloom Patisserie</span>
                </div>

                <nav className="nav">
                    <Link to="/" className={loc.pathname === '/' ? 'active' : ''}>
                        首页
                    </Link>
                    <Link to="/products" className={loc.pathname === '/products' ? 'active' : ''}>
                        商品
                    </Link>
                    <a href="#story">品牌</a>
                    <a href="#stores">门店</a>
                </nav>
            </div>
        </header>
    );
};

export default Header;
