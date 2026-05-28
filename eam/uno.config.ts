import { defineConfig, toEscapedSelector as e, presetUno } from 'unocss'
// import transformerVariantGroup from '@unocss/transformer-variant-group'

export default defineConfig({
  // ...UnoCSS options
  rules: [
    [
      /^custom-hover$/,
      ([], { rawSelector }) => {
        const selector = e(rawSelector)
        return `
${selector} {
  display: flex;
  height: 100%;
  padding: 0 10px;
  cursor: pointer;
  align-items: center;
  transition: all 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
}
/* you can have multiple rules */
${selector}:hover {
  background-color: var(--top-header-hover-color);
}
.dark ${selector}:hover {
  background-color: var(--el-bg-color-overlay);
}
`
      }
    ],
    [
      /^layout-border__left$/,
      ([], { rawSelector }) => {
        const selector = e(rawSelector)
        return `
${selector}:before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 1px;
  background-color: var(--border-color);
  z-index: 3;
}
`
      }
    ],
    [
      /^layout-border__right$/,
      ([], { rawSelector }) => {
        const selector = e(rawSelector)
        return `
${selector}:after {
  content: "";
  position: absolute;
  top: 0;
  right: 0;
  width: 1px;
  height: 100%;
  background-color: var(--border-color);
  z-index: 3;
}
`
      }
    ],
    [
      /^layout-border__top$/,
      ([], { rawSelector }) => {
        const selector = e(rawSelector)
        return `
${selector}:before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 1px;
  background-color: var(--border-color);
  z-index: 3;
}
`
      }
    ],
    [
      /^layout-border__bottom$/,
      ([], { rawSelector }) => {
        const selector = e(rawSelector)
        return `
${selector}:after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 1px;
  background-color: var(--border-color);
  z-index: 3;
}
`
      }
    ]
  ],
  presets: [presetUno({ dark: 'class', attributify: false })],
  // transformers: [transformerVariantGroup()],
  shortcuts: {
    'wh-full': 'w-full h-full',
    'flex-center': 'flex items-center justify-center',
    'flex-between': 'flex items-center justify-between',
    'text-primary': 'text-[rgba(0,0,0,0.85)]',
    'text-regular': 'text-[rgba(0,0,0,0.65)]',
    'text-secondary': 'text-[rgba(0,0,0,0.45)]',
    'bg-primary': 'bg-[#0960bd]',
    'border-base': 'border-[#e5e7eb]',
    'border-light': 'border-[#f0f0f0]',
    'rounded-sm': 'rounded-[2px]',
    'rounded-base': 'rounded-[4px]',
    'rounded-lg': 'rounded-[8px]'
  },
  theme: {
    colors: {
      primary: '#0960bd',
      'primary-hover': '#1677ff',
      'primary-active': '#0748a3',
      success: '#52c41a',
      warning: '#faad14',
      danger: '#ff4d4f',
      info: '#909399',
      border: '#e5e7eb',
      'border-light': '#f0f0f0'
    },
    borderRadius: {
      sm: '2px',
      base: '4px',
      lg: '8px'
    }
  }
})
