// src/pages/ProductListPage.tsx
// 商品列表页（含左右装饰图片组件 DecorativeImages）
// 中文注释，整个文件可直接替换

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
    Row,
    Col,
    Input,
    Button,
    Drawer,
    Checkbox,
    Select,
    Spin,
    Empty,
    Pagination,
} from 'antd';
import { FilterOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';

import { fetchProducts } from '../api/products';
import type { Product, Filters } from '../features/products/types';
import ProductCard from '../components/ProductCard';
import DecorativeImages from '../components/DecorativeImages';
import './product-list.css';

const { Option } = Select;

/* 类型安全的防抖函数 */
function debounce<T extends (...args: unknown[]) => void>(fn: T, wait = 300) {
    let timer: ReturnType<typeof setTimeout> | null = null;
    return (...args: Parameters<T>) => {
        if (timer) clearTimeout(timer);
        timer = setTimeout(() => fn(...args), wait);
    };
}

const CATEGORY_OPTIONS = ['慕斯', '曲奇', '芝士挞', '布丁', '礼盒'];

const ProductListPage: React.FC = () => {
    // 商品数据与加载状态
    const [items, setItems] = useState<Product[]>([]);
    const [total, setTotal] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(false);

    // 分页 / 排序 / 筛选 / 关键字
    const [page, setPage] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(12);
    const [sortKey, setSortKey] = useState<string>('price');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
    const [keyword, setKeyword] = useState<string>('');

    // Drawer 筛选 UI 状态
    const [drawerVisible, setDrawerVisible] = useState<boolean>(false);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [selectedGift, setSelectedGift] = useState<'yes' | 'no' | undefined>(undefined);

    // 构建 Filters（类型来自 features/products/types.ts）
    const buildFilters = useCallback((): Filters => {
        const f: Filters = {};
        if (selectedCategories.length) f.categories = selectedCategories.map((s) => s.trim());
        if (selectedGift === 'yes') f.isGiftBox = true;
        if (selectedGift === 'no') f.isGiftBox = false;
        return f;
    }, [selectedCategories, selectedGift]);

    // 加载商品（调用 src/api/products.fetchProducts）
    const loadProducts = useCallback(async () => {
        setLoading(true);
        try {
            const filters = buildFilters();
            const resp = await fetchProducts({
                page,
                pageSize,
                sortKey: (sortKey as any) || undefined,
                sortOrder,
                filters,
                keyword: keyword || undefined,
            });
            setItems(resp.items);
            setTotal(resp.total);
        } catch (err) {
            // eslint-disable-next-line no-console
            console.error('fetchProducts error', err);
        } finally {
            setLoading(false);
        }
    }, [page, pageSize, sortKey, sortOrder, buildFilters, keyword]);

    // 初始与依赖更新时拉取数据
    useEffect(() => {
        void loadProducts();
    }, [loadProducts]);

    // 防抖搜索处理
    const debouncedSearch = useMemo(
        () =>
            debounce((v: string) => {
                setKeyword(v);
                setPage(1);
            }, 300),
        []
    );

    const onSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        debouncedSearch(e.target.value);
    };

    const applyFilters = () => {
        setPage(1);
        void loadProducts();
    };

    const clearAllFilters = () => {
        setSelectedCategories([]);
        setSelectedGift(undefined);
        setKeyword('');
        setPage(1);
    };

    const onPageChange = (p: number, ps?: number) => {
        setPage(p);
        if (ps && ps !== pageSize) setPageSize(ps);
    };

    // 顶部固定展示的商品（始终使用 items[0]，不做自动切换）
    const featured = items.length > 0 ? items[0] : null;

    return (
        <div className="pl-page-centered">
            {/* 装饰图片（左右两侧浮动，不遮挡主内容） */}
            <DecorativeImages />

            {/* 顶部工具栏：筛选 / 搜索 / 排序 */}
            <div className="top-toolbar">
                <div className="top-toolbar-inner">
                    <div className="toolbar-left">
                        <Button icon={<FilterOutlined />} onClick={() => setDrawerVisible(true)}>
                            筛选
                        </Button>
                    </div>

                    <div className="toolbar-center">
                        <Input placeholder="搜索甜点名称" onChange={onSearchChange} allowClear />
                        <Button
                            type="primary"
                            style={{ marginLeft: 8 }}
                            onClick={() => {
                                const el = document.querySelector<HTMLInputElement>('.top-toolbar .toolbar-center input');
                                if (el) {
                                    setKeyword(el.value);
                                    setPage(1);
                                }
                            }}
                        >
                            搜索
                        </Button>
                    </div>

                    <div className="toolbar-right">
                        <Select
                            value={sortKey}
                            onChange={(v) => {
                                setSortKey(String(v));
                                setPage(1);
                            }}
                            style={{ width: 140 }}
                        >
                            <Option value="price">价格</Option>
                            <Option value="createdAt">上新</Option>
                            <Option value="popularity">人气</Option>
                        </Select>

                        <Button
                            style={{ marginLeft: 8 }}
                            onClick={() => {
                                setSortOrder((s) => (s === 'asc' ? 'desc' : 'asc'));
                                setPage(1);
                            }}
                        >
                            {sortOrder === 'asc' ? '升序' : '降序'}
                        </Button>
                    </div>
                </div>
            </div>

            {/* 主内容区 */}
            <div className="pl-content">
                {/* 顶部固定展示（左图右文字）—— 不再自动切换或闪烁 */}
                <div className="featured-banner">
                    <div className="banner-left">
                        <img
                            src={featured?.images?.[0] ?? 'https://picsum.photos/seed/featured/900/600'}
                            alt={featured?.title ?? '精选'}
                        />
                    </div>
                    <div className="banner-right">
                        <h3 style={{ margin: 0 }}>{featured?.title ?? '本周精选甜点'}</h3>
                        <p style={{ marginTop: 8, color: '#333' }}>{featured?.description ?? '手工制作，匠心独具。'}</p>
                        {featured && (
                            <div style={{ marginTop: 12, color: '#666' }}>价格：¥ {featured.price.toFixed(2)}</div>
                        )}
                    </div>
                </div>

                {/* 商品列表 */}
                <div style={{ marginTop: 18 }}>
                    {loading ? (
                        <div style={{ textAlign: 'center', padding: 100 }}>
                            <Spin size="large" />
                        </div>
                    ) : items.length === 0 ? (
                        <Empty description="暂无商品" />
                    ) : (
                        <Row gutter={[48, 56]}>
                            {items.map((p: Product) => (
                                <Col key={p.id} xs={24} sm={12} md={8} lg={6}>
                                    <ProductCard product={p} />
                                </Col>
                            ))}
                        </Row>
                    )}
                </div>

                {/* 分页 */}
                <div style={{ marginTop: 36, textAlign: 'right' }}>
                    <Pagination
                        current={page}
                        pageSize={pageSize}
                        total={total}
                        showSizeChanger
                        onChange={onPageChange}
                        onShowSizeChange={(_, s) => setPageSize(s)}
                    />
                </div>

                {/* 底部文案与三图展示（已简化：无小图标，无上滑遮罩） */}
                <div className="bottom-section simplified-bottom">
                    <div className="brand-footer-text panel-inline">
                        <h3>我们的承诺 · 匠心与味道</h3>
                        <p>
                            每一口甜点都凝结着我们的匠人精神与对品质的苛求。我们坚持精选原料、手工烘焙，用温度与时间带出最纯粹的味道。
                        </p>
                        <p>从配方到出品，我们看重每一道工序，愿每一次分享都带来赏心悦目的甜蜜瞬间。</p>
                    </div>

                    <div className="brand-showcase-inline simplified-showcase">
                        {[0, 1, 2].map((idx) => (
                            <div className="showcase-item-inline simple-item" key={idx}>
                                <div className="img-wrap-inline simple-imgwrap">
                                    <img src={`https://picsum.photos/seed/showcase-${idx}/1200/900`} alt={`showcase-${idx}`} />
                                </div>

                                <div className="showcase-meta-inline simple-meta">
                                    <div className="simple-title" style={{ fontWeight: 700 }}>
                                        {idx === 0 ? '精选原料' : idx === 1 ? '手工工艺' : '严苛质控'}
                                    </div>
                                    <div style={{ color: '#666', fontSize: 13, marginTop: 6 }}>
                                        {idx === 0 ? '只选上乘原料' : idx === 1 ? '匠心手作，口感细腻' : '从源头到出品，每一步都严格把控'}
                                    </div>
                                    <div style={{ marginTop: 10 }}>
                                        <Link to="/">
                                            <Button size="small" type="primary">
                                                了解更多
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* 筛选 Drawer */}
            <Drawer
                title="筛选"
                placement="left"
                onClose={() => setDrawerVisible(false)}
                open={drawerVisible}
                width={360}
                bodyStyle={{ border: 'none' }}
            >
                <div style={{ padding: 12 }}>
                    <div style={{ marginBottom: 12 }}>
                        <div style={{ fontSize: 12, color: '#666' }}>分类</div>
                        <Checkbox.Group value={selectedCategories} onChange={(v) => setSelectedCategories(v as string[])}>
                            {CATEGORY_OPTIONS.map((c) => (
                                <div key={c}>
                                    <Checkbox value={c}>{c}</Checkbox>
                                </div>
                            ))}
                        </Checkbox.Group>
                    </div>

                    <div style={{ marginBottom: 12 }}>
                        <div style={{ fontSize: 12, color: '#666' }}>是否礼盒</div>
                        <Select
                            style={{ width: '100%' }}
                            value={selectedGift}
                            onChange={(v) => setSelectedGift(v as 'yes' | 'no' | undefined)}
                            placeholder="不限"
                        >
                            <Option value="yes">礼盒</Option>
                            <Option value="no">非礼盒</Option>
                        </Select>
                    </div>

                    <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
                        <Button
                            type="primary"
                            onClick={() => {
                                applyFilters();
                                setDrawerVisible(false);
                            }}
                        >
                            应用
                        </Button>
                        <Button onClick={() => setDrawerVisible(false)}>取消</Button>
                        <Button
                            onClick={() => {
                                clearAllFilters();
                                setDrawerVisible(false);
                            }}
                            style={{ marginLeft: 'auto' }}
                        >
                            清除
                        </Button>
                    </div>
                </div>
            </Drawer>
        </div>
    );
};

export default ProductListPage;
