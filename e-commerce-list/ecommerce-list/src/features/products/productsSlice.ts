// src/features/products/productsSlice.ts
// Redux Toolkit slice：管理商品列表的状态（items / total / page / filters / sort / keyword 等）
// 注意：使用 `import type` 导入仅作类型的项，避免运行时尝试读取不存在的导出

import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Product, Filters } from './types';
import { fetchProducts as apiFetchProducts } from '../../api/products';

// State 类型
interface ProductsState {
    items: Product[];
    total: number;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error?: string | null;

    page: number;
    pageSize: number;
    sortKey: string;
    sortOrder: 'asc' | 'desc';
    filters: Filters;
    keyword: string;

    featuredIndex: number;
}

const initialState: ProductsState = {
    items: [],
    total: 0,
    status: 'idle',
    error: null,
    page: 1,
    pageSize: 12,
    sortKey: 'price',
    sortOrder: 'desc',
    filters: {},
    keyword: '',
    featuredIndex: 0,
};

// Thunk：异步获取商品（直接调用 api/products.ts 中的函数）
export const fetchProductsThunk = createAsyncThunk(
    'products/fetchProducts',
    async (
        params: {
            page?: number;
            pageSize?: number;
            sortKey?: string;
            sortOrder?: 'asc' | 'desc';
            filters?: Filters;
            keyword?: string;
        },
        { rejectWithValue }
    ) => {
        try {
            const resp = await apiFetchProducts(params);
            return resp;
        } catch (err: unknown) {
            // 将错误转换为字符串返回
            const msg = (err && typeof err === 'object' && 'message' in err) ? (err as any).message : String(err);
            return rejectWithValue(msg);
        }
    }
);

const productsSlice = createSlice({
    name: 'products',
    initialState,
    reducers: {
        setPage(state, action: PayloadAction<number>) {
            state.page = action.payload;
        },
        setPageSize(state, action: PayloadAction<number>) {
            state.pageSize = action.payload;
        },
        setSortKey(state, action: PayloadAction<string>) {
            state.sortKey = action.payload;
        },
        setSortOrder(state, action: PayloadAction<'asc' | 'desc'>) {
            state.sortOrder = action.payload;
        },
        setFilters(state, action: PayloadAction<Filters>) {
            state.filters = action.payload;
        },
        // 局部更新 filters 字段（适用少量动态更新）
        updateFilterField(state, action: PayloadAction<{ key: keyof Filters; value: unknown }>) {
            const { key, value } = action.payload;
            // 使用类型断言保证赋值符合 Filters 的字段类型
            // @ts-expect-error - 这里按 Filters 定义动态赋值
            state.filters[key] = value as any;
        },
        setKeyword(state, action: PayloadAction<string>) {
            state.keyword = action.payload;
        },
        clearFilters(state) {
            state.filters = {};
        },
        setFeaturedIndex(state, action: PayloadAction<number>) {
            state.featuredIndex = action.payload;
        },
        incFeaturedIndex(state) {
            if (state.items.length === 0) {
                state.featuredIndex = 0;
            } else {
                state.featuredIndex = (state.featuredIndex + 1) % state.items.length;
            }
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchProductsThunk.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchProductsThunk.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.items = action.payload.items;
                state.total = action.payload.total;
                state.error = null;
                if (state.featuredIndex >= state.items.length) state.featuredIndex = 0;
            })
            .addCase(fetchProductsThunk.rejected, (state, action) => {
                state.status = 'failed';
                state.error = (action.payload as string) ?? action.error.message ?? 'unknown';
            });
    },
});

export const {
    setPage,
    setPageSize,
    setSortKey,
    setSortOrder,
    setFilters,
    updateFilterField,
    setKeyword,
    clearFilters,
    setFeaturedIndex,
    incFeaturedIndex,
} = productsSlice.actions;

export default productsSlice.reducer;
