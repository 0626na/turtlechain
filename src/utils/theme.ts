interface Colors {
  white: string;
  black: string;
  grey_0: string;
  grey_1: string;
  grey_2: string;
  red: string;
  blue: string;
  purple: string;
}

const colors: Colors = {
  white: "#ffffff",
  black: "#000000",
  grey_0: "#e5e5e5",
  grey_1: "#d5d5d5",
  grey_2: "#a6a6a6",
  red: "#e84118",
  blue: "#3679fe",
  purple: "#571C73",
};

interface Theme {
  primary: string;
  background: string;
  text: string;
  inputBackground: string;
  inputText: string;
  grayLine: string;
}

export const theme: Theme = {
  primary: colors.purple,
  background: colors.white,
  text: colors.black,
  inputBackground: colors.grey_0,
  inputText: colors.white,
  grayLine: colors.grey_2,
};
