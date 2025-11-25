// src/components/Hero.tsx
// Hero：宽屏大图 + 文字层 + 下滑触发的遮罩动画（为首页提供参考站式的大图体验）
// 注：所有注释用中文，便于你阅读与后续维护

import React, { useEffect, useRef, useState } from 'react';
import { Button } from 'antd';
import { useNavigate } from 'react-router-dom';

interface Props {
    title?: string;
    subtitle?: string;
    ctaLabel?: string;
}

const Hero: React.FC<Props> = ({ title = 'Bloom Patisserie', subtitle, ctaLabel = '查看全部商品' }) => {
    const navigate = useNavigate();
    const heroRef = useRef<HTMLElement | null>(null);
    const [scrolled, setScrolled] = useState(false);
    const [imgVisible, setImgVisible] = useState(false);

    useEffect(() => {
        // 进入可视后展示图片（淡入）
        const t = setTimeout(() => setImgVisible(true), 120);

        const onScroll = () => {
            const y = window.scrollY || window.pageYOffset;
            setScrolled(y > 80);
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => {
            clearTimeout(t);
            window.removeEventListener('scroll', onScroll);
        };
    }, []);

    return (
        <section ref={heroRef} className={`hero-advanced ${scrolled ? 'hero-scrolled' : ''}`}>
            <div className="hero-viewport">
                <div className="hero-left">
                    <h1 className="hero-big-title">{title}</h1>
                    {subtitle && <p className="hero-sub">{subtitle}</p>}
                    <div style={{ marginTop: 20 }}>
                        <Button type="primary" size="large" onClick={() => navigate('/products')}>
                            {ctaLabel}
                        </Button>
                    </div>
                </div>

                <div className="hero-right">
                    {/* 大图，进入时淡入，并当页面下滑时有向上被“覆盖”的位移动画 */}
                    <div className={`hero-image-wrap ${imgVisible ? 'enter' : ''}`}>
                        <img src="src/assets/images/products/5-Almond.png" alt="hero" />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
