/**
 * 拼接设备二维码 URL
 * @param baseUrl - 域名前缀，例如 https://eam.com
 * @param equipmentSn - 设备编号
 * @returns 完整二维码 URL
 */
export function buildEquipmentQrUrl(baseUrl: string, equipmentSn: string): string {
  if (!equipmentSn) {
    throw new Error('equipmentSn 不能为空')
  }
  const cleanBase = baseUrl.replace(/\/+$/, '')
  return `${cleanBase}/m/equipment/${encodeURIComponent(equipmentSn)}`
}

/**
 * 从 canvas 元素生成 PNG 并触发下载
 */
export function downloadCanvasAsPng(canvas: HTMLCanvasElement, filename: string): void {
  const url = canvas.toDataURL('image/png')
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
}

/**
 * 获取部署环境的 base URL
 */
export function getDeployBaseUrl(): string {
  return import.meta.env.VITE_APP_URL || window.location.origin
}

const LABELS_PER_PAGE = 44 // A4 4×11 排版

export function calcLabelPages(count: number): {
  totalPages: number
  perPage: number
  lastPageCount: number
} {
  if (count <= 0) {
    return { totalPages: 0, perPage: LABELS_PER_PAGE, lastPageCount: 0 }
  }
  const totalPages = Math.ceil(count / LABELS_PER_PAGE)
  const lastPageCount = count % LABELS_PER_PAGE === 0 ? LABELS_PER_PAGE : count % LABELS_PER_PAGE
  return { totalPages, perPage: LABELS_PER_PAGE, lastPageCount }
}
