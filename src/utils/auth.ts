const TOKEN_KEY = 'authToken';
const USER_KEY = 'authUser';
const REMEMBER_KEY = 'rememberMe';

const getStorage = (remember: boolean) => (remember ? localStorage : sessionStorage);

const getFallbackStorage = (remember: boolean) => (remember ? sessionStorage : localStorage);

const safeWindow = typeof window !== 'undefined';

const getItem = (key: string): string | null => {
  if (!safeWindow) return null;
  return localStorage.getItem(key) ?? sessionStorage.getItem(key);
};

export const authStorage = {
  saveSession: <TUser extends object>(
    token: string,
    user: TUser,
    options: { remember: boolean }
  ) => {
    if (!safeWindow) return;

    const storage = getStorage(options.remember);
    const fallbackStorage = getFallbackStorage(options.remember);

    storage.setItem(TOKEN_KEY, token);
    storage.setItem(USER_KEY, JSON.stringify(user));
    storage.setItem(REMEMBER_KEY, String(options.remember));

    fallbackStorage.removeItem(TOKEN_KEY);
    fallbackStorage.removeItem(USER_KEY);
    fallbackStorage.removeItem(REMEMBER_KEY);
  },

  clearSession: () => {
    if (!safeWindow) return;
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(REMEMBER_KEY);
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(USER_KEY);
    sessionStorage.removeItem(REMEMBER_KEY);
  },

  getToken: () => getItem(TOKEN_KEY),

  getUser: <TUser = unknown>(): TUser | null => {
    const raw = getItem(USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as TUser;
    } catch (error) {
      console.error('Failed to parse stored user', error);
      return null;
    }
  },

  isRemembered: () => {
    const value = getItem(REMEMBER_KEY);
    return value === 'true';
  },
};

export const isAuthenticated = () => Boolean(authStorage.getToken());

