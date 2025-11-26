/**
 * In-memory token cache with TTL awareness
 */

interface TokenData {
  token: string;
  expiresAt: number;
}

let cachedToken: TokenData | null = null;

// Default TTL: 55 minutes (assuming 1-hour token validity)
const DEFAULT_TTL_MS = 55 * 60 * 1000;

export const tokenCache = {
  /**
   * Get cached token if valid, otherwise null
   */
  getToken(): string | null {
    if (!cachedToken) {
      return null;
    }

    const now = Date.now();
    if (now >= cachedToken.expiresAt) {
      // Token expired, clear cache
      cachedToken = null;
      return null;
    }

    return cachedToken.token;
  },

  /**
   * Store token with TTL
   */
  setToken(token: string, ttlMs: number = DEFAULT_TTL_MS): void {
    cachedToken = {
      token,
      expiresAt: Date.now() + ttlMs
    };
  },

  /**
   * Clear cached token
   */
  clearToken(): void {
    cachedToken = null;
  },

  /**
   * Check if token exists and is valid
   */
  hasValidToken(): boolean {
    return this.getToken() !== null;
  }
};
