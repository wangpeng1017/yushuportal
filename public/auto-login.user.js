// ==UserScript==
// @name         宇树 Portal · 演示自动登录
// @namespace    https://github.com/wangpeng1017/yushuportal
// @version      1.0.0
// @description  IoT平台 + 数据集成平台 演示账号自动填表自动登录
// @author       wangpeng
// @match        http://123.235.0.227:11916/*
// @match        https://218.92.236.114:3001/*
// @run-at       document-end
// @grant        none
// ==/UserScript==

(function () {
  'use strict';

  const host = location.host;

  // ThingsBoard IoT 平台 (Angular SPA)
  if (host === '123.235.0.227:11916') {
    autoLoginThingsboard();
  }

  // 数据集成平台 (jQuery + 自定义 submitFrom)
  if (host === '218.92.236.114:3001') {
    autoLoginDataIntegration();
  }

  // ---------- ThingsBoard ----------
  function autoLoginThingsboard() {
    const CRED = { user: 'lizhengliang@iiglocal.com', pass: 'lizhengliang' };
    const start = Date.now();
    const timer = setInterval(() => {
      if (Date.now() - start > 15000) { clearInterval(timer); return; }
      // 已登录则不再处理
      if (!location.pathname.includes('login')) { clearInterval(timer); return; }
      const userInput = document.querySelector('input[formcontrolname="username"], input[id*="username" i], input[type="email"]');
      const passInput = document.querySelector('input[formcontrolname="password"], input[id*="password" i], input[type="password"]');
      const btn = document.querySelector('button[type="submit"], button.mat-flat-button, button.tb-login-button');
      if (!userInput || !passInput || !btn) return;
      clearInterval(timer);
      setInputValue(userInput, CRED.user);
      setInputValue(passInput, CRED.pass);
      setTimeout(() => btn.click(), 300);
    }, 300);
  }

  // ---------- 数据集成平台 ----------
  function autoLoginDataIntegration() {
    const CRED = { user: 'admin', pass: 'Admin123@dtdip!' };
    if (!location.pathname.includes('login')) return;
    const start = Date.now();
    const timer = setInterval(() => {
      if (Date.now() - start > 10000) { clearInterval(timer); return; }
      const u = document.querySelector('#username');
      const p = document.querySelector('#password');
      if (!u || !p) return;
      clearInterval(timer);
      u.value = CRED.user;
      p.value = CRED.pass;
      // 优先调用页面自己的 submitFrom()，兜底点击登录按钮
      if (typeof window.submitFrom === 'function') {
        setTimeout(() => { try { window.submitFrom(); } catch (e) { clickLoginBtn(); } }, 200);
      } else {
        setTimeout(clickLoginBtn, 200);
      }
    }, 300);

    function clickLoginBtn() {
      const btn = document.querySelector('.btn-login, button[onclick*="submitFrom"]');
      if (btn) btn.click();
    }
  }

  // 给 Angular / Vue 受控 input 写值并触发事件
  function setInputValue(input, value) {
    const proto = Object.getPrototypeOf(input);
    const setter = Object.getOwnPropertyDescriptor(proto, 'value')?.set;
    if (setter) setter.call(input, value); else input.value = value;
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.dispatchEvent(new Event('change', { bubbles: true }));
    input.dispatchEvent(new Event('blur', { bubbles: true }));
  }
})();
