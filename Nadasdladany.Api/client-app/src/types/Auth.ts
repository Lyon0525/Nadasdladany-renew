export interface User {
    email: string;
    role: string;
}
export interface LoginResponse {
    email: string;
    role: string;
    mustChangePassword?: boolean;
    expiresAt: number;
}