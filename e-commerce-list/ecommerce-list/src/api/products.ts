// src/api/products.ts
// 自动导入 src/assets/images/products 下的图片（eager 模式）
// 若未找到对应本地图片则退回到 picsum 占位图

import type { Product, Filters } from '../features/products/types';

/**
 * Vite 的 import.meta.glob(..., { eager: true }) 返回模块对象集合
 * 我们声明为 Record<string, ImageModule>，ImageModule 为 { default: string } | string
 */
type ImageModule = { default: string } | string;
const rawImages = import.meta.glob('/src/assets/images/products/*.{jpg,jpeg,png,webp}', { eager: true }) as Record<string, ImageModule>;

// 构建文件名（去扩展） -> 图片 URL 映射
const IMAGES_MAP: Record<string, string> = {};
Object.keys(rawImages).forEach((p) => {
    const mod = rawImages[p];
    const filename = p.split('/').pop() ?? '';
    const name = filename.replace(/\.[^/.]+$/, '');
    // mod 可能是 string 或 { default: string }
    IMAGES_MAP[name] = (typeof mod === 'string' ? mod : (mod && (mod as { default: string }).default)) as string;
});

// 延迟模拟
const wait = (ms: number) => new Promise<void>((res) => setTimeout(res, ms));

// 分类顺序（与你的命名约定一致）
const CATEGORIES = ['慕斯', '曲奇', '芝士挞', '布丁', '礼盒'];

// flavor 文件名 key 与显示标签（你之前设定的）
const flavorKeys = ['Matcha', 'Chocolate', 'Strawberry', 'Almond', 'Blueberry', 'Lemon', 'Fruit'];
const flavorLabels = ['抹茶', '巧克力', '草莓', '杏仁', '蓝莓', '柠檬', '水果混合'];

const ADJECTIVES = ['经典', '手工', '法式', '绵密', '浓醇', '清新', '焦糖'];
const TAG_POOL = ['手工', '限量', '抹茶', '巧克力', '柠檬', '杏仁', '水果'];

/* 生成 mock 商品（每分类 perCategory 个） */
function generateMockProducts(perCategory = 6): Product[] {
    const arr: Product[] = [];
    let idCounter = 1;
    for (let ci = 0; ci < CATEGORIES.length; ci++) {
        const category = CATEGORIES[ci];
        for (let i = 0; i < perCategory; i++, idCounter++) {
            const fk = flavorKeys[i % flavorKeys.length];
            const flabel = flavorLabels[i % flavorLabels.length];
            const adj = ADJECTIVES[(idCounter + i) % ADJECTIVES.length];
            const title = `${adj} ${flabel} ${category}`;

            const categoryIndex = ci + 1;
            const imgKeyBase = `${categoryIndex}-${fk}`; // 例如 "1-Matcha"

            const img1 = IMAGES_MAP[imgKeyBase] ?? IMAGES_MAP[`${imgKeyBase}-1`] ?? `https://picsum.photos/seed/dessert-${idCounter}-1/1200/900`;
            const img2 = IMAGES_MAP[`${imgKeyBase}-2`] ?? IMAGES_MAP[imgKeyBase] ?? `https://picsum.photos/seed/dessert-${idCounter}-2/1200/900`;

            const tags: string[] = [];
            const tcount = 1 + ((idCounter + i) % 3);
            for (let t = 0; t < tcount; t++) tags.push(TAG_POOL[(idCounter + t) % TAG_POOL.length]);
            if ((idCounter + i) % 7 === 0 && !tags.includes('杏仁')) tags.push('杏仁');
            if ((idCounter + i) % 5 === 0 && !tags.includes('水果')) tags.push('水果');

            const p: Product = {
                id: String(idCounter),
                title,
                description: `${title} — 甄选原料，手工烘焙。`,
                price: Number((5 + Math.random() * 60).toFixed(2)),
                images: [img1, img2],
                brand: ['SweetHouse', 'HappyBake', 'SugarJoy'][idCounter % 3],
                category,
                createdAt: new Date(Date.now() - idCounter * 86400000).toISOString(),
                tags,
                isGiftBox: idCounter % 4 === 0,
                allergensExclude: idCounter % 6 === 0 ? ['坚果'] : [],
            };

            arr.push(p);
        }
    }
    return arr;
}

const MOCK_PRODUCTS: Product[] = generateMockProducts(6);

// ★ 删除标题完全等于 "焦糖 巧克力 礼盒" 的单条商品（确保不影响其它同名片段）
const FILTERED_PRODUCTS: Product[] = MOCK_PRODUCTS.filter((p) => p.title !== '焦糖 巧克力 礼盒');

export interface FetchResult {
    items: Product[];
    total: number;
}

export interface FetchParams {
    page?: number;
    pageSize?: number;
    sortKey?: string;
    sortOrder?: 'asc' | 'desc';
    filters?: Filters;
    keyword?: string;
}

export async function fetchProducts(params: FetchParams = {}): Promise<FetchResult> {
    await wait(150 + Math.random() * 200);

    const {
        page = 1,
        pageSize = 12,
        keyword,
        sortKey,
        sortOrder = 'desc',
        filters,
    } = params;

    // 使用已过滤后的数据源
    let data: Product[] = FILTERED_PRODUCTS.slice();

    if (keyword && keyword.trim()) {
        const kw = keyword.trim().toLowerCase();
        data = data.filter((p) => (p.title ?? '').toLowerCase().includes(kw) || (p.description ?? '').toLowerCase().includes(kw));
    }

    if (filters?.categories && filters.categories.length > 0) {
        const cats = filters.categories.map((c) => (c ?? '').toString().trim());
        data = data.filter((p) => {
            const pc = (p.category ?? '').toString().trim();
            return cats.includes(pc);
        });
    }

    if (filters?.brand && filters.brand.length > 0) {
        const brands = filters.brand.map((b) => (b ?? '').toString().trim());
        data = data.filter((p) => brands.includes((p.brand ?? '').toString()));
    }

    if (typeof filters?.isGiftBox === 'boolean') {
        data = data.filter((p) => !!p.isGiftBox === filters!.isGiftBox);
    }

    if (filters?.allergensExclude && filters.allergensExclude.length > 0) {
        const ex = filters.allergensExclude.map((a) => (a ?? '').toString().trim());
        data = data.filter((p) => {
            const als = p.allergensExclude ?? [];
            return !als.some((a) => ex.includes((a ?? '').toString()));
        });
    }

    if (sortKey) {
        data.sort((a, b) => {
            const getVal = (it: Product): number => {
                if (sortKey === 'createdAt') {
                    const t = it.createdAt ? new Date(it.createdAt).getTime() : 0;
                    return Number.isFinite(t) ? t : 0;
                }
                const val = (it as any)[sortKey as string];
                return typeof val === 'number' ? val : 0;
            };
            const av = getVal(a);
            const bv = getVal(b);
            return sortOrder === 'asc' ? av - bv : bv - av;
        });
    }

    const total = data.length;
    const start = (page - 1) * pageSize;
    const items = data.slice(start, start + pageSize);

    return { items, total };
}
