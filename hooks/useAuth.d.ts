export interface AuthUser {
    email: string;
    token: string;
    role: string;
}

export interface Auth {
    user: AuthUser | null;
    loading: boolean;
    login: (userData: AuthUser) => void;
    logout: () => void;
}

export function useAuth(): Auth;
