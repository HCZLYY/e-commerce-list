// src/components/SortBar.tsx
import React, { useMemo } from 'react';
import { Dropdown, Button, Space, Tooltip } from 'antd';
import { CaretDownOutlined, ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import type { SortKey } from '../api/products';
import type { MenuProps } from 'antd';

interface Props {
    current?: SortKey;
    order?: 'asc' | 'desc' | undefined;
    onChange: (payload: { key?: SortKey; order?: 'asc' | 'desc' }) => void;
}

/**
 * SortBar（去掉评分选项）
 */
const SortBar: React.FC<Props> = ({ current, order, onChange }) => {
    const items: MenuProps['items'] = useMemo(
        () => [
            { key: 'none', label: '综合' },
            { type: 'divider' as const, key: 'div-1' },
            { key: 'price', label: '价格' },
            { key: 'createdAt', label: '上新' },
        ],
        []
    );

    const handleMenuClick: MenuProps['onClick'] = ({ key }) => {
        if (key === 'none') {
            onChange({ key: undefined, order: undefined });
        } else {
            const k = key as SortKey;
            const newOrder: 'asc' | 'desc' = order ?? 'desc';
            onChange({ key: k, order: newOrder });
        }
    };

    const toggleOrder = () => {
        if (!current) return;
        const next = order === 'asc' ? 'desc' : 'asc';
        onChange({ key: current, order: next });
    };

    const label = current === 'price' ? '价格' : current === 'createdAt' ? '上新' : '综合';

    return (
        <Space>
            <Dropdown
                menu={{
                    items,
                    selectable: true,
                    selectedKeys: current ? [current] : [],
                    onClick: handleMenuClick,
                }}
                trigger={['click']}
            >
                <Button>
                    {label}
                    <CaretDownOutlined style={{ marginLeft: 6 }} />
                </Button>
            </Dropdown>

            <Tooltip title={current ? (order === 'asc' ? '升序' : '降序') : '请选择排序字段'}>
                <Button onClick={toggleOrder} disabled={!current} aria-label="切换升降序">
                    {order === 'asc' ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
                </Button>
            </Tooltip>
        </Space>
    );
};

export default SortBar;
