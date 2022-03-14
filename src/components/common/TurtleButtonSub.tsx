import { Button } from "antd";
import { DownloadOutlined, FileOutlined } from "@ant-design/icons";

interface Props {
  children: React.ReactNode;
  type?: "primary" | "default";
  shape?: "round" | "default";
  icon?: "download" | "file";
  size?: "small" | "middle" | "large";
  color?: "skyblue" | "blue" | "red" | "green" | "grey" | "gray";
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
}

function TurtleButtonSub({
  children,
  type = "default",
  shape = "default",
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
      type={type}
      shape={shape}
      size={size}
      onClick={onClick}
      icon={icon === "download" ? <DownloadOutlined /> : icon === "file" ? <FileOutlined /> : ""}
      style={{
        borderRadius: shape === "default" ? 2 : "",
        padding: "4px 10px",
        paddingTop: size === "small" ? "1.5px" : "4px",
        color: type === "default" ? makeColor() : "",
        backgroundColor: type === "primary" ? makeColor() : "",
        width: "140px",
        borderColor: makeColor(),
      }}
      loading={loading}
      disabled={disabled}
    >
      {children}
    </Button>
  );
}

export default TurtleButtonSub;
