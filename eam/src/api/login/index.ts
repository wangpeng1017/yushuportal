import request from '@/config/axios'
import type { RegisterVO, UserLoginVO, UserNameLoginVO } from './types'

export interface SmsCodeVO {
  mobile: string
  scene: number
}

export interface SmsLoginVO {
  mobile: string
  code: string
}

// 登录
export const login = (data: UserLoginVO) => {
  return request.post({
    url: '/system/auth/login',
    data,
    headers: {
      isEncrypt: false
    }
  })
}

// 登录-用户名登录
export const loginByUsername = (data: UserNameLoginVO) => {
  return request.post({
    url: '/system/auth/loginByUsername',
    data,
    headers: {
      isEncrypt: false
    }
  })
}

export const codeLogin = (data: any) => {
  // 如果没有clientid的话 就默认他是umc登录
  return request.get({
    url: `/system/auth/codeLogin`,
    params: data,
    headers: {
      Accept: '*',
      'tenant-id': '1'
    }
  })
}

// 注册
export const register = (data: RegisterVO) => {
  return request.post({ url: '/system/auth/register', data })
}

// 使用租户名，获得租户编号
export const getTenantIdByName = (name: string) => {
  return request.get({ url: '/system/tenant/get-id-by-name?name=' + name })
}

// 使用租户域名，获得租户信息
export const getTenantByWebsite = (website: string) => {
  return request.get({ url: '/system/tenant/get-by-website?website=' + website })
}

// 登出
export const loginOut = (clientId, oauth2Token) => {
  return request.post({
    url: '/system/auth/logout?clientId=' + clientId + '&oauth2Token=' + oauth2Token
  })
}

// 获取用户权限信息
export const getInfo = () => {
  return request.get({
    // url: '/system/auth/get-permission-info?clientUuid=' + import.meta.env.VITE_APP_API_CLIENT_UUID
    url: '/system/auth/get-permission-info'
  })
}

//获取登录验证码
export const sendSmsCode = (data: SmsCodeVO) => {
  return request.post({ url: '/system/auth/send-sms-code', data })
}

// 短信验证码登录
export const smsLogin = (data: SmsLoginVO) => {
  return request.post({ url: '/system/auth/sms-login', data })
}

// 社交快捷登录，使用 code 授权码
export function socialLogin(type: string, code: string, state: string) {
  return request.post({
    url: '/system/auth/social-login',
    data: {
      type,
      code,
      state
    }
  })
}

// 社交授权的跳转
export const socialAuthRedirect = (type: number, redirectUri: string) => {
  return request.get({
    url: '/system/auth/social-auth-redirect?type=' + type + '&redirectUri=' + redirectUri
  })
}
// 获取验证图片以及 token
export const getCode = (data: any) => {
  return request.postOriginal({ url: 'system/captcha/get', data })
}

// 滑动或者点选验证
export const reqCheck = (data: any) => {
  return request.postOriginal({ url: 'system/captcha/check', data })
}

// 通过短信重置密码
export const smsResetPassword = (data: any) => {
  return request.post({ url: '/system/auth/reset-password', data })
}
