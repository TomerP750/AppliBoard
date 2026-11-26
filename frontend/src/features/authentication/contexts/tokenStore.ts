let accessToken: string | null = null;

/**
 * Keeps the short-lived JWT access token in memory only, so other scripts on
 * the page can't read it from storage. A reload loses it; the app then gets a
 * new one from the httpOnly refresh cookie (see `refreshSession`).
 */
export const tokenStore = {
    get: () => accessToken,
    set: (token: string) => {
        accessToken = token;
    },
    clear: () => {
        accessToken = null;
    },
};
