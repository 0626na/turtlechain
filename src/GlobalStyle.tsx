import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`



h1.ant-typography {
  margin : 0;
  line-height: normal;
}



.ant-btn > .anticon + span {
  margin-left  : 0px;
}

  /* form label 왼쪽 정렬 */
  /* .ant-form-item-label {
    text-align: left;        
  } */

  /* table header padding 제거 */
  /* .ant-table-title {
    padding: 8px 0px !important;
  } */

  /* message 색상 변경 */
  /* .ant-message {
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
  .ant-message-success .anticon {
    color: #FFFFFF !important;
  } */

  /* badge status 마진값 제거 */
  /* .ant-badge-status-text {
    margin-left: 4px;
    color: #5B5D63;
  } */



  

  button {
    /* line-height: 1; */
  background : transparent;
  border: none;
  cursor: pointer;
  padding : 0px;
  margin : 0px;
  }

`;

export default GlobalStyle;
