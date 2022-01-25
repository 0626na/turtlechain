const CracoLessPlugin = require("craco-less");

module.exports = {
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            modifyVars: {
              "@primary-color": "#13BC9E",
              // Layout
              "@layout-header-background": "#141720",
              "@layout-header-height": "60px",
              "@layout-header-padding": "0 40px",
              "@layout-header-color": "#FFFFFF",
              "@layout-body-background": "#F3F6F9",
              "@layout-sider-background": "#242934",
              // Menu
              "@menu-bg": "#242934",
              "@menu-popup-bg": "#242934",
              "@menu-item-color": "#FFFFFF",
              "@menu-inline-submenu-bg": "#242934",
              "@menu-highlight-color": "#FFFFFF",
              "@menu-item-active-bg": "@primary-color",
              "@border-radius-base": "4px",
              "@btn-default-color": "@primary-color",
              "@radio-dot-color": "#00BB88",
            },
            javascriptEnabled: true,
          },
        },
      },
    },
  ],
};
