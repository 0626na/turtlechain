import { Global, css } from '@emotion/react';

const GlobalStyle = () => (
  <Global
    styles={css`
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

      /* 
      .ant-message-error .anticon {
      color: #FFFFFF !important;
      }
      .ant-message-warning .anticon {
      color: #FFFFFF !important;
      }

      .ant-message-info .anticon {
      color: #FFFFFF !important;
      }
      .ant-message-success .anticon {
      color: #FFFFFF !important;
      } */

      /* badge status 마진값 제거 */
      /* .ant-badge-status-text {
      margin-left: 4px;
      color: #5B5D63;
      } */
    `}
  />
);

export default GlobalStyle;
