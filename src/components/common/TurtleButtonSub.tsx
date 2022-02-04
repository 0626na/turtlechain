import { Button } from "antd";
import { TFunctionResult } from "i18next";
import { DownloadOutlined, FileOutlined } from "@ant-design/icons";

interface Props {
  children: TFunctionResult;
  icon?: "download" | "file";
  size?: "small" | "middle";
  color?: "skyblue" | "blue" | "red" | "green";
  onClick?: () => void;
}

function TurtleButton({ children, icon, size = "middle", color = "skyblue", onClick }: Props) {
  const makeColor = () => {
    if (color === "skyblue") {
      return "#32ACDD";
    }
    if (color === "blue") {
      return "#2174F1";
    }
    if (color === "red") {
      return "#FF3E3E";
    }
    if (color === "green") {
      return "#00B594";
    }
    return "";
  };

  return (
    <Button
      size={size}
      onClick={onClick}
      icon={icon === "download" ? <DownloadOutlined /> : icon === "file" ? <FileOutlined /> : ""}
      style={{
        borderRadius: size === "small" ? "4px" : "",
        paddingTop: size === "small" ? "2.8px" : "",
        color: makeColor(),
        borderColor: makeColor(),
      }}
    >
      {children}
    </Button>
  );
}

export default TurtleButton;
