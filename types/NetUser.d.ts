export declare global {
    namespace NetUser {
        type BodyType = BodyInit | null | undefined;
        interface ResType<T> {
            code: number;
            message: string;
            data: T;
            timestamp: number;
            error: boolean;
            success: boolean;
        }


        namespace Parameter {
            namespace ModelUser {
                interface Register {
                    username: string;
                    password: string;
                    confirmPassword: string;
                    nickname: string;
                    email: string;
                    phone: null;
                    captcha: number;
                    captchaId: string;
                    source: null;
                    registerIp: null;
                }
                interface Login {
                    username: string;
                    password: string;
                    loginType: number;
                    rememberMe: boolean;
                    captcha: string;
                    captchaId: string;
                }
                interface ForgotPassword {
                    email: string;
                    newPassword: string;
                    confirmPassword: string;
                    captcha: string;
                    captchaId: string;
                }
                interface Captcha {
                    email: string;
                }
            }
        }
        namespace Response {
            interface Captcha {
                expireSeconds: number;
                captchaId: string;
            };
            namespace ModelPrice {
                type ListList = ListItem[];
                interface ListItem {
                    productCode: string;
                    productName: string;
                    price: number;
                    originalPrice: number;
                    description: string;
                    currency: string;
                }
            }
            namespace ModelUser {
                interface Login {
                    userId: number;
                    username: string;
                    nickname: string;
                    avatar: string;
                    email: string;
                    phone: null;
                    status: number;
                    token: string;
                    expiresIn: number;
                    expiresAt: string;
                    energy: number;
                    loginTime: string;
                }
            }
            namespace ModelEnergy {
                type Ranking = {
                    userId: number;
                    username: string;
                    nickname: string;
                    avatar: string;
                    energy: number;
                    totalEarned: number;
                    totalUsed: number;
                }
                type FlowingWater = {
                    amount: number;
                    balanceAfter: number;
                    balanceBefore: number;
                    changeType: number;
                    createTime: string;
                    description: string;
                    id: number;
                    sourceId: string;
                    sourceType: number;
                    userId: number;
                }
            }
        }
    }
}