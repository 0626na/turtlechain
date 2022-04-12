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
`;

export default GlobalStyle;
