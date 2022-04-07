const CracoLessPlugin = require("craco-less");

module.exports = {
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            modifyVars: {
              "@primary-color": "#2174F1",

              // Input
              "@input-placeholder-color": "#CBCCD1",
              "@input-height-base": "36px",
              "@input-height-sm": "28px",

              // Form
              "@form-item-margin-bottom": "22px",

              // Switch
              "@switch-color": "#2174F1",

              // Layout
              "@layout-header-background": "#141720",
              "@layout-header-height": "60px",
              "@layout-header-padding": "0 40px",
              "@layout-header-color": "#FFFFFF",
              "@layout-body-background": "#F3F6F9",
              "@layout-sider-background": "#242934",

              // Menu
              "@menu-bg": "#2B3140",
              "@menu-popup-bg": "#2B3140",
              "@menu-item-color": "#FFFFFF",
              "@menu-inline-submenu-bg": "#1A1E28",
              "@menu-highlight-color": "#FFFFFF",
              "@menu-item-active-bg": "#00B594",
              "@border-radius-base": "4px",

              // Buttons
              "@btn-height-base": "36px",
              "@btn-font-weight": "400",
              "@btn-border-radius-base": "4px",
              "@btn-border-radius-sm": "4px",
              "@btn-shadow": "0",
              "@btn-primary-shadow": "0",
              "@btn-text-shadow": "0",
              "@btn-primary-bg": "#2174F1",

              "@btn-default-color": "#2174F1",
              "@btn-default-border": "#2174F1",

              "@btn-font-size-lg": "14px",
              "@btn-font-size-sm": "12px",

              // Radio
              "@radio-dot-color": "#00BB88",

              // Tabs
              "@tabs-title-font-size-lg": "15px",
              "@tabs-highlight-color": "#2174F1",
              "@tabs-active-color": "#2174F1",
              "@tabs-hover-color": "#2174F1",
              "@tabs-ink-bar-color": "#2174F1",

              "@tabs-horizontal-padding-lg": "30px 16px 8px 16px",
              "@tabs-horizontal-margin": "0 0 0 0",

              // Table
              "@item-active-bg": "#E3F4FC",
              "@table-header-bg": "#F6F9FD",
            },
            javascriptEnabled: true,
          },
        },
      },
    },
  ],
};
