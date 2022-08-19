const CracoLessPlugin = require('craco-less');
const CracoAlias = require('craco-alias');

module.exports = {
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            modifyVars: {
              '@primary-color': '#2174F1',

              // font
              '@font-family': "'Spoqa Han Sans Neo', 'sans-serif'",

              // Input
              '@input-placeholder-color': '#CBCCD1',
              '@input-height-base': '36px',
              '@input-height-sm': '28px',

              // Form
              '@form-item-margin-bottom': '22px',

              // Switch
              '@switch-color': '#2174F1',

              // Layout
              '@layout-header-background': '#141720',
              '@layout-header-height': '60px',
              '@layout-header-padding': '0 40px',
              '@layout-header-color': '#FFFFFF',
              '@layout-body-background': '#F3F6F9',
              '@layout-sider-background': '#2B3140',

              // Menu
              '@menu-inline-toplevel-item-height': '36px',
              '@menu-item-height': '38px',
              '@menu-item-boundary-margin': '0px',
              '@menu-item-vertical-margin': '0px',
              '@menu-item-font-size': '14px',

              // Menu dark theme
              '@menu-dark-color': '#FFFFFF',
              '@menu-dark-bg': '#2B3140',
              '@menu-dark-inline-submenu-bg': '#2B3140',
              '@menu-dark-arrow-color': '#FFFFFF',
              '@menu-dark-item-hover-bg': 'rgba(20, 23, 32, 0.5)',
              '@menu-dark-item-active-bg': '#141720',

              // Buttons
              '@btn-height-base': '36px',
              '@btn-font-weight': '400',
              '@btn-border-radius-base': '4px',
              '@btn-border-radius-sm': '4px',
              '@btn-shadow': '0',
              '@btn-primary-shadow': '0',
              '@btn-text-shadow': '0',
              '@btn-primary-bg': '#2174F1',
              '@btn-disable-bg': '#C3C4C6',
              '@btn-disable-color': '#FFFFFF',

              '@btn-default-color': '#2174F1',
              '@btn-default-border': '#2174F1',

              '@btn-font-size-lg': '14px',
              '@btn-font-size-sm': '12px',

              // Radio
              '@radio-dot-color': '#00BB88',

              // Tabs
              '@tabs-title-font-size-lg': '15px',
              '@tabs-highlight-color': '#2174F1',
              '@tabs-active-color': '#2174F1',
              '@tabs-hover-color': '#2174F1',
              '@tabs-ink-bar-color': '#2174F1',

              '@tabs-horizontal-padding-lg': '30px 16px 8px 16px',
              '@tabs-horizontal-margin': '0 0 0 0',

              // Table
              '@table-header-bg': '#F7F8F9',
              '@table-footer-bg': '#FFFFFF',

              // Divider
              '@divider-color': '#CBCCD1',

              // Message
              '@message-notice-content-bg': '#090A0ED9',

              // Badge
              '@badge-status-size': '8px',

              // Tooltip
              '@tooltip-bg': '#30333B',
            },
            javascriptEnabled: true,
          },
        },
      },
    },
    {
      plugin: CracoAlias,
      options: {
        source: 'tsconfig',
        baseUrl: '.',
        tsConfigPath: 'tsconfig.paths.json',
      },
    },
  ],
};
