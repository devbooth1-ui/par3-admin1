export interface Auth {
    user: any;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
}

export function useAuth(): Auth;
