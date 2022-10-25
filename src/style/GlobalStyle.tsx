import { Global, css } from '@emotion/react';

const GlobalStyle = () => (
  <Global
    styles={css`
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
        font-family: 'Spoqa Han Sans';
      }

      /* Typography */
      h1 {
        margin: 0;
      }

      p {
        margin: 0;
      }

      /* button */
      .ant-btn {
        border: none;
        border-radius: 8px;
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
        width: 250px;
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
    `}
  />
);

export default GlobalStyle;
