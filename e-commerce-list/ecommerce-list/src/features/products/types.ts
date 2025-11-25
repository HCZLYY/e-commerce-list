// src/features/products/types.ts
// 鍟嗗搧绫诲瀷瀹氫箟锛堝凡绉婚櫎 Filters.tags锛屼互閰嶅悎绉婚櫎鍙ｅ懗绛涢€夊姛鑳斤級
// 娉ㄩ噴涓枃锛屽瓧娈典笌 mock 鏁版嵁淇濇寔涓€鑷?

export interface Product {
    id: string;
    title: string;               // 鏄剧ず鏍囬锛堝寘鍚彛鍛充俊鎭級
    description?: string;
    price: number;
    images: string[];            // 澶氬浘鏁扮粍锛圥roductCard 鐢ㄥ埌 images[0]/images[1]锛?
    brand?: string;
    category?: string;
    createdAt?: string;          // ISO 瀛楃涓?
    popularity?: number;         // 人气值（用于排序）
    tags?: string[];             // 渚嬪 ['鎶硅尪','鏉忎粊']锛堜繚鐣欑敤浜庡睍绀猴紝浣嗕笉浣滀负绛涢€夛級
    isGiftBox?: boolean;         // 鏄惁涓虹ぜ鐩?
    allergensExclude?: string[]; // 渚嬪 ['鍧氭灉']锛屽彲閫?
}

// Filters 绫诲瀷锛氬凡绉婚櫎 tags 瀛楁锛堝彛鍛崇瓫閫夊姛鑳藉凡鍒犻櫎锛?
export interface Filters {
    categories?: string[];       // 鍒嗙被绛涢€夛紙涓ユ牸绛夊€煎尮閰嶏級
    brand?: string[];            // 鍝佺墝绛涢€?
    isGiftBox?: boolean;         // 绀肩洅绛涢€夛紙true/false锛?
    allergensExclude?: string[]; // 杩囨晱婧愭帓闄?
}

export type SortKey = 'price' | 'createdAt' | 'popularity';
export type SortOrder = 'asc' | 'desc';
