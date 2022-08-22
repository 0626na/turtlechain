import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
/* button */
.ant-btn {
    border : none;
    border-radius :8px;
  }

/* dropdown */
.ant-dropdown-menu-item:hover {
  background-color: #EDEFF1;
}


/* Table */ 
.ant-table-title {
    padding: 0px;
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





`;

export default GlobalStyle;
