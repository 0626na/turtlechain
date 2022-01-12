const CracoLessPlugin = require("craco-less");

module.exports = {
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            modifyVars: {
              "@primary-color": "#033A88",
              "@border-radius-base": "0.4rem",
              "@layout-body-background": "#f7f8f9",
              "@btn-default-color": "@primary-color",
              "@btn-default-border": "@primary-color",
              "@radio-dot-color": "#00BB88",
            },
            javascriptEnabled: true,
          },
        },
      },
    },
  ],
};
