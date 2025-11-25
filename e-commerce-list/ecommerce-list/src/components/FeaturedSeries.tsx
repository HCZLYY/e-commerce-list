// src/components/FeaturedSeries.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

interface SeriesItem {
    key: string;
    title: string;
    desc?: string;
    img?: string;
}

interface Props {
    series: SeriesItem[];
}

const FeaturedSeries: React.FC<Props> = ({ series }) => {
    const nav = useNavigate();

    const handleKey = (e: React.KeyboardEvent, key: string) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            nav(`/products?series=${encodeURIComponent(key)}`);
        }
    };

    return (
        <div className="series-grid container" style={{ display: 'flex', gap: 18, justifyContent: 'space-between' }}>
            {series.map((s) => (
                <div
                    key={s.key}
                    className="series-card"
                    style={{
                        width: '32%',
                        background: '#fff',
                        borderRadius: 8,
                        overflow: 'hidden',
                        boxShadow: '0 6px 18px rgba(0,0,0,0.04)',
                        cursor: 'pointer',
                        transition: 'transform .22s ease, box-shadow .22s ease',
                        display: 'flex',
                        flexDirection: 'column',
                    }}
                    onClick={() => nav(`/products?series=${encodeURIComponent(s.key)}`)}
                    onKeyDown={(e) => handleKey(e, s.key)}
                    role="button"
                    tabIndex={0}
                    aria-label={`查看 ${s.title} 系列`}
                >
                    <div className="series-img" style={{ height: 160, overflow: 'hidden', flex: '0 0 160px' }}>
                        <img
                            src={s.img ?? 'https://picsum.photos/seed/series/600/400'}
                            alt={s.title}
                            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform .6s ease' }}
                        />
                    </div>
                    <div className="series-body" style={{ padding: 14, flex: 1 }}>
                        <h4 style={{ margin: 0 }}>{s.title}</h4>
                        <p style={{ marginTop: 8, color: '#666' }}>{s.desc}</p>
                        <div style={{ marginTop: 12, color: '#b07a4f', fontWeight: 600 }}>查看系列</div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default FeaturedSeries;
