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
              '@primary-color': '#00AAB5',

              // font
              '@font-family': "'Spoqa Han Sans Neo'",
              '@font-size-base': '14px',
              '@text-color': '#434852',

              //Outline
              '@outline-width': '0px',
              // '@outline-blur-size': '0',
              // '@outline-color': '#fff', // No use anymore
              // '@outline-fade': 'none',

              // Input
              '@input-placeholder-color': '#CBCCD1',
              // '@input-border-color': 'none',
              // '@input-hover-border-color': 'none',

              // '@input-height-base': '36px',
              // '@input-height-base': '28px',
              // '@input-height-sm': '28px',

              // Form
              // '@form-item-margin-bottom': '22px',

              // Switch
              // '@switch-color': '#2174F1',

              // Layout
              '@layout-header-background': '#141720',
              '@layout-header-height': '60px',
              '@layout-header-padding': '0 40px',
              '@layout-header-color': '#FFFFFF',
              '@layout-body-background': '#F3F6F9',
              '@layout-sider-background': '#242934',

              // Menu
              // '@menu-inline-toplevel-item-height': '36px',
              // '@menu-item-height': '38px',
              '@menu-item-boundary-margin': '0px',
              '@menu-item-vertical-margin': '0px',
              '@menu-item-font-size': '14px',
              // '@menu-item-padding-horizontal': '10px',

              // Menu dark theme
              '@menu-dark-color': '#FFFFFF',
              '@menu-dark-bg': '#242934',
              '@menu-dark-inline-submenu-bg': '#242934',
              '@menu-dark-arrow-color': '#FFFFFF',
              '@menu-dark-item-hover-bg': 'rgba(20, 23, 32, 0.5)',
              '@menu-dark-item-active-bg': '#141720',

              //Select
              '@select-item-active-bg': '#F3F6F9', // hovers

              '@select-item-selected-bg': 'rgba(19, 180, 190, 0.1)',
              '@select-item-selected-font-weight': '400',
              '@select-item-selected-color': '#00AAB5',

              '@select-dropdown-font-size': '13px',
              '@select-dropdown-height': '29px',
              '@select-dropdown-line-height': '1',

              // Buttons

              // '@btn-border-radius-base': '8px',
              '@btn-shadow': 'none',
              '@btn-text-shadow': 'none',

              //modal
              '@modal-header-padding-vertical': '0px',
              '@modal-header-padding-horizontal': '0px',
              '@modal-body-padding': '0px',

              // '@btn-height-base': '36px',
              // '@btn-font-weight': '700',
              // '@btn-primary-shadow': 'none',
              // '@btn-primary-bg': '#2174F1',
              // '@btn-disable-bg': '#C3C4C6',
              // '@btn-disable-color': '#FFFFFF',
              // '@btn-default-color': '#FFFFFF',
              // '@btn-default-border': '#2174F1',
              // '@btn-font-size-lg': '14px',
              // '@btn-font-size-sm': '12px',

              //DatePicker

              // 날짜 선택할때
              // '@picker-basic-cell-hover-color': '#00AAB5',
              // // 이미 선택된 날짜들 range 배경
              // '@picker-basic-cell-active-with-range-color':
              //   'rgba(19, 180, 190, 0.1)',
              // // 날짜 재선택할때 range 배경
              // '@picker-basic-cell-hover-with-range-color':
              //   'rgba(19, 180, 190, 0.2)',

              // // '@calendar-item-active-bg': 'red',
              // // '@calendar-border-color': 'red',
              // '@calendar-column-active-bg': 'red',

              // '@picker-basic-cell-active-with-range-color':
              //   'rgba(19, 180, 190, 0.1)',
              // '@picker-basic-cell-hover-with-range-color': '#00AAB5',

              // '@picker-date-hover-range-border-color': '#00AAB5',
              // // '@picker-date-hover-range-color': 'rgba(19, 180, 190, 0.1);',
              // // @picker-date-hover-range-border-color: lighten(@primary-color, 20%);

              // '@calendar-item-active-bg': '#00AAB5',
              // '@calendar-column-active-bg': '#00AAB5',

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
              // '@divider-color': '#434852',

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
