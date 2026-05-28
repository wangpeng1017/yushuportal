import request from '@/config/axios'

export interface MobileLoginParams {
  username: string
  password: string
}

export interface MobileLoginVo {
  token: string
  userId: string
  nickname: string
  expiresIn: number
}

export const mobileLogin = (data: MobileLoginParams) =>
  request.post<MobileLoginVo>({ url: '/mobile/auth/login', data })
