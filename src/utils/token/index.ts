import { LOCAL_TOKEN_KEY } from '@/config';

export function getToken(): string | null {
    const dataStr = window.localStorage.getItem(LOCAL_TOKEN_KEY);
    if (dataStr) {
        const data = JSON.parse(dataStr);
        return data.token || null;
    } else {
        return null;
    }
}

export function setToken(token: string): void {
    const data = {
        token,
        setTime: new Date().getTime(),
    };
    window.localStorage.setItem(LOCAL_TOKEN_KEY, JSON.stringify(data));
}
