// src/components/ProductCard.tsx
// 商品卡：更宽图片 + 购买按钮 hover 动效（按钮左移，小图标从下方显现）
// 注释中文

import React, { useState } from 'react';
import { Button } from 'antd';
import type { Product } from '../features/products/types';
import '../pages/product-list.css';

interface Props {
    product: Product;
}

const ProductCard: React.FC<Props> = ({ product }) => {
    const [hover, setHover] = useState(false);

    const primary = product.images?.[0] ?? '';
    const secondary = product.images?.[1] ?? primary;

    return (
        <div
            className="product-card-transparent"
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            style={{ borderRadius: 10, overflow: 'hidden', width: '100%' }}
        >
            <div className="product-image-wrap">
                <img
                    src={hover ? secondary : primary}
                    alt={product.title ?? product.id}
                    className="product-image"
                    style={{ transform: hover ? 'scale(1.04)' : 'scale(1)' }}
                />
            </div>

            <div className="product-info" style={{ marginTop: 12 }}>
                <div className="product-title" style={{ fontWeight: 600, minHeight: 46 }}>
                    {product.title ?? product.id}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
                    <div style={{ fontSize: 16, fontWeight: 700 }}>{`¥${(product.price ?? 0).toFixed(2)}`}</div>

                    {/* 购买按钮区域，内部包含隐藏的小图标（buy-icon），在 hover 时显现并让按钮左移 */}
                    <div className="buy-wrap" aria-hidden={false}>
                        <div className="buy-icon" aria-hidden>
                            {/* 小图标（可替换为 svg） */}
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="#163012" xmlns="http://www.w3.org/2000/svg">
                                <path d="M7 4h-2l-1 2h2l1-2zm0 0" />
                                <path d="M7 4h10l-1.5 9h-7z" opacity="0.9" />
                                <path d="M10 20a2 2 0 100-4 2 2 0 000 4zm6 0a2 2 0 100-4 2 2 0 000 4z" />
                            </svg>
                        </div>
                        <Button
                            className="buy-btn"
                            type="primary"
                            size="small"
                            onClick={() => {
                                console.log('购买', product.id);
                                alert(`已加入购物车：${product.title ?? product.id}`);
                            }}
                        >
                            购买
                        </Button>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default ProductCard;
