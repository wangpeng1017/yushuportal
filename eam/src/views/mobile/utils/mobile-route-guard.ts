const PUBLIC_PATHS = [
  /^\/m\/login/,
  /^\/m\/equipment\/detail/,
  /^\/m\/equipment\/[^/]+$/,
  /^\/m\/repair\/quick/,
]

export function isPublicMobileRoute(path: string): boolean {
  if (!path.startsWith('/m/')) return true
  return PUBLIC_PATHS.some(re => re.test(path))
}

export function buildLoginRedirect(originalPath: string): string {
  if (!originalPath) return '/m/login'
  return `/m/login?redirect=${encodeURIComponent(originalPath)}`
}
