// src/app/store.ts
import { configureStore } from '@reduxjs/toolkit';
import productsReducer from '../features/products/productsSlice';

// 配置 Redux store（将来可在这里加入更多 reducer）
const store = configureStore({
    reducer: {
        products: productsReducer,
    },
});

// 导出类型以便在项目中使用
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
