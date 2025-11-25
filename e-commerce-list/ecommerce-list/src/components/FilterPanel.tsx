// src/components/FilterPanel.tsx
/**
 * FilterPanel：品牌/分类多选 + 价格区间 + 重置与已选数量显示
 *
 * 注意：不使用 antd 内部的 CheckboxValueType，直接用 string[]。
 * priceRange 可以为 undefined（表示未设置），组件会显示默认区间。
 */

import React, { useMemo } from 'react';
import { Card, Checkbox, Slider, Divider, Row, Col, Button } from 'antd';

export interface FiltersShape {
    brand: string[];
    categories: string[];
    priceRange?: [number, number];
}

interface Props {
    selectedBrands: string[];
    selectedCategories: string[];
    priceRange?: [number, number];
    onChange: (filters: FiltersShape) => void;
}

const BRAND_OPTIONS = ['A牌', 'B牌', 'C牌'];
const CATEGORY_OPTIONS = ['手机', '电脑', '家电', '数码', '服饰'];

const DEFAULT_PRICE_RANGE: [number, number] = [0, 3000];

// 统计已选项数（品牌数量 + 分类数量 + 价格区间是否非默认）
function countSelected(filters: FiltersShape) {
    let c = 0;
    c += (filters.brand?.length ?? 0);
    c += (filters.categories?.length ?? 0);
    if (
        filters.priceRange &&
        (filters.priceRange[0] > DEFAULT_PRICE_RANGE[0] || filters.priceRange[1] < DEFAULT_PRICE_RANGE[1])
    ) {
        c += 1;
    }
    return c;
}

const FilterPanel: React.FC<Props> = ({ selectedBrands, selectedCategories, priceRange, onChange }) => {
    const current: FiltersShape = useMemo(
        () => ({ brand: selectedBrands ?? [], categories: selectedCategories ?? [], priceRange }),
        [selectedBrands, selectedCategories, priceRange]
    );

    const onBrandChange = (vals: (string | number)[]) => {
        onChange({ brand: vals as string[], categories: selectedCategories, priceRange });
    };

    const onCategoryChange = (vals: (string | number)[]) => {
        onChange({ brand: selectedBrands, categories: vals as string[], priceRange });
    };

    const onPriceChange = (vals: number[] | number) => {
        if (Array.isArray(vals) && vals.length === 2) {
            onChange({ brand: selectedBrands, categories: selectedCategories, priceRange: [vals[0], vals[1]] });
        } else {
            // 不可能的分支，兜底
            onChange({ brand: selectedBrands, categories: selectedCategories, priceRange });
        }
    };

    const onReset = () => {
        onChange({ brand: [], categories: [], priceRange: DEFAULT_PRICE_RANGE });
    };

    const selectedCount = countSelected(current);

    return (
        <div style={{ overflowY: 'auto', maxHeight: '70vh', paddingRight: 8 }}>
            <Card
                size="small"
                title={
                    <Row justify="space-between" align="middle">
                        <Col>
                            筛选 {selectedCount > 0 ? <span style={{ color: '#1890ff' }}>（已选 {selectedCount}）</span> : null}
                        </Col>
                        <Col>
                            <Button size="small" onClick={onReset}>
                                重置
                            </Button>
                        </Col>
                    </Row>
                }
            >
                <div style={{ marginBottom: 12 }}>
                    <div style={{ marginBottom: 8, fontWeight: 600 }}>品牌</div>
                    <Checkbox.Group options={BRAND_OPTIONS} value={selectedBrands} onChange={onBrandChange} />
                </div>

                <Divider />

                <div style={{ marginBottom: 12 }}>
                    <div style={{ marginBottom: 8, fontWeight: 600 }}>分类</div>
                    <Checkbox.Group options={CATEGORY_OPTIONS} value={selectedCategories} onChange={onCategoryChange} />
                </div>

                <Divider />

                <div>
                    <div style={{ marginBottom: 8, fontWeight: 600 }}>价格区间（元）</div>
                    <Slider
                        range
                        min={DEFAULT_PRICE_RANGE[0]}
                        max={DEFAULT_PRICE_RANGE[1]}
                        step={10}
                        value={priceRange ? [priceRange[0], priceRange[1]] : DEFAULT_PRICE_RANGE}
                        onChange={onPriceChange}
                    />
                </div>
            </Card>
        </div>
    );
};

export default FilterPanel;
