// src/utils/debounce.ts
// 类型安全的防抖函数：参数列表类型作为独立泛型 Args，避免 any 与类型不兼容
// Args 表示 fn 的参数元组类型，例如 [string]、[number, string] 等

export function debounce<Args extends readonly unknown[]>(
    fn: (...args: Args) => void,
    wait = 300
) {
    let timer: ReturnType<typeof setTimeout> | null = null;

    // 返回一个接受同样参数列表的函数
    return (...args: Args): void => {
        if (timer !== null) clearTimeout(timer);
        timer = setTimeout(() => {
            fn(...args);
            timer = null;
        }, wait);
    };
}
