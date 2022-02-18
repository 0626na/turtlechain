import { Button } from "antd";
import { TFunctionResult } from "i18next";
import { DownloadOutlined, FileOutlined } from "@ant-design/icons";

interface Props {
  children: TFunctionResult;
  icon?: "download" | "file";
  size?: "small" | "middle";
  color?: "skyblue" | "blue" | "red" | "green" | "grey" | "gray";
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
}

function TurtleButtonSub({
  children,
  icon,
  size = "middle",
  disabled = false,
  loading,
  color = "skyblue",
  onClick,
}: Props) {
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
    if (color === "gray") {
      return "#A1A2A6";
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
        padding: "4px 10px",
        paddingTop: size === "small" ? "1.5px" : "4px",
        color: makeColor(),
        borderColor: makeColor(),
      }}
      disabled={disabled}
      loading={loading}
      ghost
    >
      {children}
    </Button>
  );
}

export default TurtleButtonSub;
