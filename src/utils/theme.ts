interface Colors {
  white: string;
  black: string;
  grey_0: string;
  grey_1: string;
  grey_2: string;
  grey_3: string;
  grey_4: string;
  grey_5: string;
  grey_10: string;
  navy: string;
  skyBlue: string;
  beige: string;
  mint: string;
  lightMint: string;
  pastelGreen: string;
  lightPastelGreen: string;
  pastelRed: string;
  pastelOrange: string;
  magenta: string;
  orange: string;
}

const colors: Colors = {
  white: "#ffffff",
  black: "#000000",
  grey_0: "#fdfdfe",
  grey_1: "#f7f8f9",
  grey_2: "#eef2f2",
  grey_3: "#e0e4e7",
  grey_4: "#ced4da",
  grey_5: "#0B133333",
  grey_10: "#d9d9d9",
  navy: "#033A88",
  skyBlue: "#017cff",
  beige: "#edece4",
  mint: "#00bb88",
  lightMint: "#66e2b8",
  pastelGreen: "#9ef2d4",
  lightPastelGreen: "#ccfeec",
  pastelRed: "#ffadc0",
  pastelOrange: "#ffdc99",
  magenta: "#fe3363",
  orange: "#ffa800",
};

interface Theme {
  primary: string;
  background: string;
  text: string;
  greyButton: string;
  skyBlueButton: string;
  border: string;
}

const theme: Theme = {
  primary: colors.navy,
  background: colors.white,
  text: colors.black,
  greyButton: colors.grey_5,
  skyBlueButton: colors.skyBlue,
  border: colors.grey_10,
};

export default theme;
