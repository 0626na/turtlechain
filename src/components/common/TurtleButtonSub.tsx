import { Button } from "antd";
import { TFunctionResult } from "i18next";
import { DownloadOutlined, FileOutlined } from "@ant-design/icons";

interface Props {
  children: TFunctionResult;
  icon?: "download" | "file";
  size?: "small" | "middle";
  color?: "skyblue" | "blue" | "red" | "green" | "grey";
  onClick?: () => void;
}

function TurtleButtonSub({ children, icon, size = "middle", color = "skyblue", onClick }: Props) {
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
    if (color === "grey") {
      return "#88898C";
    }
    return "";
  };

  return (
    <Button
      size={size}
      onClick={onClick}
      icon={icon === "download" ? <DownloadOutlined /> : icon === "file" ? <FileOutlined /> : ""}
      style={{
        borderRadius: 4,
        paddingTop: size === "small" ? "2.8px" : "",
        padding: "4px 10px",
        color: makeColor(),
        borderColor: makeColor(),
      }}
      ghost
    >
      {children}
    </Button>
  );
}

export default TurtleButtonSub;
