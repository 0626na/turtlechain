import { css } from '@emotion/react';

export const reset = css`
  /* reset Css */
  html,
  body,
  div,
  span,
  applet,
  object,
  iframe,
  h1,
  h2,
  h3,
  h4,
  h5,
  h6,
  p,
  blockquote,
  pre,
  a,
  abbr,
  acronym,
  address,
  big,
  cite,
  code,
  del,
  dfn,
  em,
  img,
  ins,
  kbd,
  q,
  s,
  samp,
  small,
  strike,
  strong,
  sub,
  sup,
  tt,
  var,
  b,
  u,
  i,
  center,
  dl,
  dt,
  dd,
  ol,
  ul,
  li,
  fieldset,
  form,
  label,
  legend,
  table,
  caption,
  tbody,
  tfoot,
  thead,
  tr,
  th,
  td,
  article,
  aside,
  canvas,
  details,
  embed,
  figure,
  figcaption,
  footer,
  header,
  hgroup,
  menu,
  nav,
  output,
  ruby,
  section,
  summary,
  time,
  mark,
  audio,
  video {
    margin: 0;
    padding: 0;
    border: 0;
    font-size: 100%;
    font: inherit;
    vertical-align: baseline;
  }
  /* HTML5 display-role reset for older browsers */
  article,
  aside,
  details,
  figcaption,
  figure,
  footer,
  header,
  hgroup,
  menu,
  nav,
  section {
    display: block;
  }
  ol,
  ul {
    list-style: none;
  }
  blockquote,
  q {
    quotes: none;
  }
  blockquote:before,
  blockquote:after,
  q:before,
  q:after {
    content: ‘’;
    content: none;
  }
  table {
    border-collapse: collapse;
    border-spacing: 0;
  }
  /** font */

  @font-face {
    font-family: 'Spoqa Han Sans Neo';
    src: url(/assets/font/SpoqaHanSansNeo-Light.ttf) format('truetype');
    font-weight: 300;
  }
  @font-face {
    font-family: 'Spoqa Han Sans Neo';
    src: url(/assets/font/SpoqaHanSansNeo-Regular.ttf) format('truetype');
    font-weight: 400;
  }
  @font-face {
    font-family: 'Spoqa Han Sans Neo';
    src: url(/assets/font/SpoqaHanSansNeo-Medium.ttf) format('truetype');
    font-weight: 500;
  }
  @font-face {
    font-family: 'Spoqa Han Sans Neo';
    src: url(/assets/font/SpoqaHanSansNeo-Bold.ttf) format('truetype');
    font-weight: 700;
  }
  body {
    padding: 0;
    margin: 0;
    line-height: 1;
    font-family: 'Spoqa Han Sans Neo';
  }

  /* button */
  .ant-btn {
    border: none;
    border-radius: 8px;
  }

  .ant-tabs {
    line-height: 1;
  }

  // 인풋 suffix 버튼일시 오른쪽 패딩 제거
  .ant-input-suffix {
    .ant-btn {
      padding-right: 0px;
    }
  }

  /* dropdown */
  .ant-dropdown-menu-item:hover {
    background-color: #edeff1;
  }

  /* Table */
  .ant-table-title {
    padding: 0px !important;
  }

  /* form label 왼쪽 정렬 */
  .ant-form-item-label {
    text-align: left;
  }

  /* form item 기본 margin-bottom */
  .ant-form-item {
    margin-bottom: 16px;
  }

  /* message 색상 변경 */
  .ant-message {
    color: #ffffff !important;
  }

  .ant-message-notice {
    text-align: right;
    margin-right: 30px;
  }

  /* message 박스 크기 설정 */
  .ant-message-notice-content {
    border-radius: 12px;
    width: 360px;
    text-align: left;
  }

  .ant-tooltip-inner {
    font-size: 13px;
    font-weight: 400;
    border-radius: 12px;
    background-color: #30333b;
  }

  /* window에서도 스크롤바 mac처럼 둥글게 */
  /* total width */
  ::-webkit-scrollbar {
    background-color: #fff;
    width: 16px;
  }

  /* background of the scrollbar except button or resizer */
  ::-webkit-scrollbar-track {
    background-color: #fff;
  }

  /* scrollbar itself */
  ::-webkit-scrollbar-thumb {
    background-color: #babac0;
    border-radius: 16px;
    border: 4px solid #fff;
  }

  /* set button(top and bottom of the scrollbar) */
  ::-webkit-scrollbar-button {
    display: none;
  }
`;
