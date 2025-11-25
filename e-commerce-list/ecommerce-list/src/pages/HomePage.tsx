// src/pages/HomePage.tsx
import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import FeaturedSeries from '../components/FeaturedSeries';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import { fetchProducts } from '../api/products';
import type { Product } from '../features/products/types';
import './home.css';
import { useNavigate } from 'react-router-dom';
import seriesImg1 from '../assets/images/products/index-1.png';
import seriesImg2 from '../assets/images/products/index-2.png';
import seriesImg3 from '../assets/images/products/index-3.png';

/**
 * 首页（大改）
 * - 顶部 Hero（大图、右侧大图、左侧文案）
 * - 接近 sanaburilemon 的“下滑覆盖/大图展示”节奏：Hero -> 大商品图块 -> 系列 -> 精选商品
 * - 所有动效用 CSS + 少量 JS（滚动监听）
 */

const HomePage: React.FC = () => {
    const [featured, setFeatured] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        let mounted = true;
        async function load() {
            setLoading(true);
            try {
                const res = await fetchProducts({ page: 1, pageSize: 9 });
                if (!mounted) return;
                setFeatured(res.items);
            } catch (e) {
                console.error(e);
            } finally {
                if (mounted) setLoading(false);
            }
        }
        load();
        return () => {
            mounted = false;
        };
    }, []);

    return (
        <div className="page-home">
            <Header />
            <Hero subtitle="手作·天然·礼赠 — 用甜点记录日常的美好" ctaLabel="立即选购" />

            {/* 大图块：模仿 sanaburilemon 的大图段落（图文覆盖/拉上去的视觉） */}
            <section className="big-visual">
                <div className="big-visual-inner">
                    <div className="big-visual-left">
                        <h2>我们的精选</h2>
                        <p>精选时令食材，匠心烘焙。每一道甜点都承载着对品质与温度的追求。</p>
                        <button className="ghost-btn" onClick={() => navigate('/products')}>查看全部</button>
                    </div>

                    <div className="big-visual-right">
                        <img src="src\assets\images\products\橱窗.png" alt="big" />
                    </div>
                </div>
            </section>

            <main className="home-main container">
                <section className="series">
                    <h3>主打系列</h3>
                    <FeaturedSeries
                        series={[
                            { key: 'tarts', title: '手作奶油塔', desc: '酥脆塔皮 · 轻盈奶油', img: seriesImg1 },
                            { key: 'caramel', title: '焦糖系列', desc: '焦糖工艺 · 浓郁风味', img: seriesImg2 },
                            { key: 'gift', title: '精致礼盒', desc: '礼赠 · 节日推荐', img: seriesImg3 },
                        ]}
                    />
                </section>

                <section className="featured-products">
                    <h3>店长推荐</h3>
                    <div className="grid-products">
                        {loading
                            ? new Array(6).fill(null).map((_, i) => <div className="product-skel" key={i}></div>)
                            : featured.slice(0, 6).map((p) => (
                                <div key={p.id} className="grid-item">
                                    <ProductCard product={p} />
                                </div>
                            ))}
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
};

export default HomePage;
