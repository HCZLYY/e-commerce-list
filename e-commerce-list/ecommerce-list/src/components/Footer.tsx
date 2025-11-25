// src/components/Footer.tsx
import React from 'react';

const Footer: React.FC = () => {
    return (
        <footer className="site-footer">
            <div className="container footer-inner">
                <div>
                    <strong>Bloom Patisserie</strong>
                    <div style={{ marginTop: 6, color: '#666' }}>手作 · 天然 · 礼赠</div>
                </div>

                <div>
                    <div>联系我们</div>
                    <div style={{ marginTop: 6, color: '#666' }}>email@example.com</div>
                </div>

                <div>
                    <div>© {new Date().getFullYear()} Bloom Patisserie</div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
