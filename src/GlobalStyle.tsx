import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
@font-face {
    font-family: "Spoqa Han Sans";
    font-weight: 300;
    src : url('${process.env.PUBLIC_URL}/assets/font/SpoqaHanSansNeo-Light.ttf')
  }
  @font-face {
    font-family: "Spoqa Han Sans";
    font-style: normal;
    font-weight: 400;
    src : url("${process.env.PUBLIC_URL}/assets/font/SpoqaHanSansNeo-Regular.ttf")
  }
  @font-face {
    font-family: "Spoqa Han Sans";
    font-weight: 500;
    src : url("${process.env.PUBLIC_URL}/assets/font/SpoqaHanSansNeo-Medium.ttf")
  }
  @font-face {
    font-family: "Spoqa Han Sans";
    font-weight: 700;
    src : url("${process.env.PUBLIC_URL}/assets/font/SpoqaHanSansNeo-Bold.ttf")
  }
  body {
        padding: 0;
        margin: 0;
        font-family: "Spoqa Han Sans";
  };

  /* form label 왼쪽 정렬 */
  .ant-form-item-label {
    text-align: left;        
  }

  /* table header padding 제거 */
  .ant-table-title {
    padding: 8px 0px !important;
  }

  /* message 색상 변경 */
  .ant-message {
    color: #FFFFFF !important;
  }
  .ant-message-error .anticon {
    color: #FFFFFF !important;
  }
  .ant-message-warning .anticon {
    color: #FFFFFF !important;
  }
  .ant-message-info .anticon {
    color: #FFFFFF !important;
  }

  /* badge status 마진값 제거 */
  .ant-badge-status-text {
    margin-left: 4px;
    color: #5B5D63;
  }

`;

export default GlobalStyle;
