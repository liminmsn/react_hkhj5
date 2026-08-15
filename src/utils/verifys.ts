/**
 * 判断字符串是否为邮箱格式
 */
export function isEmail(value: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}