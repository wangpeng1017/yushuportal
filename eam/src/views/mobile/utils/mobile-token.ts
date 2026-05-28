const TOKEN_KEY = 'mobileToken'
const EXPIRE_KEY = 'mobileTokenExpiresAt'
const TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000 // 7 天

export function setMobileToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token)
  localStorage.setItem(EXPIRE_KEY, String(Date.now() + TOKEN_TTL_MS))
}

export function getMobileToken(): string | null {
  const token = localStorage.getItem(TOKEN_KEY)
  const expiresAt = Number(localStorage.getItem(EXPIRE_KEY) || 0)
  if (!token) return null
  if (Date.now() > expiresAt) {
    clearMobileToken()
    return null
  }
  return token
}

export function clearMobileToken(): void {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(EXPIRE_KEY)
}

export function isMobileTokenValid(): boolean {
  return getMobileToken() !== null
}
