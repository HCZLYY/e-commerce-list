// src/components/DecorativeImages.tsx
// 仅使用三张图片：left-1, left-2 放左侧；left-3 放右侧
// 如果本地找不到对应图片会回退到占位图（picsum）
// 请把图片放到 src/assets/decor/ 目录下，命名为 left-1.png left-2.png left-3.png 等

import React from "react";
import "./decorative-images.css";

type ImgMod = { default: string } | string;
const decorRaw = import.meta.glob('/src/assets/decor/*.{jpg,jpeg,png,webp}', { eager: true }) as Record<string, ImgMod>;

// 建立映射 filename (no ext) => url
const IMAGES_MAP: Record<string, string> = {};
Object.keys(decorRaw).forEach((p) => {
    const m = decorRaw[p];
    const filename = p.split('/').pop() ?? '';
    const name = filename.replace(/\.[^/.]+$/, '');
    IMAGES_MAP[name] = (typeof m === 'string' ? m : (m && (m as { default: string }).default)) as string;
});

// 我们期望的键名
const left1 = IMAGES_MAP['left-1'] ?? IMAGES_MAP['left1'] ?? 'https://picsum.photos/seed/decor-left-1/260/360';
const left2 = IMAGES_MAP['left-2'] ?? IMAGES_MAP['left2'] ?? 'https://picsum.photos/seed/decor-left-2/200/280';
const left3 = IMAGES_MAP['left-3'] ?? IMAGES_MAP['left3'] ?? 'https://picsum.photos/seed/decor-right-1/200/260';

// 组件：两个左侧（上：大，下：小），一个右侧（小）
export default function DecorativeImages() {
    return (
        <>
            {/* 左侧两张图 */}
            <div className="decor-left">
                <img src={left1} className="decor-img decor-left-large" alt="decor-left-1" />
                <img src={left2} className="decor-img decor-left-small" alt="decor-left-2" />
            </div>

            {/* 右侧一张图 */}
            <div className="decor-right">
                <img src={left3} className="decor-img decor-right-small" alt="decor-right-3" />
            </div>
        </>
    );
}
