import { Button } from "antd";
import { TFunctionResult } from "i18next";

interface Props {
  children: TFunctionResult;
  type?: "primary" | "secondary" | "default";
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
}

function TurtleButton({ children, type = "primary", disabled = false, loading, onClick }: Props) {
  return (
    <Button
      type={type === "default" ? "default" : "primary"}
      size="large"
      disabled={disabled}
      loading={loading}
      onClick={onClick}
      style={{
        width: "160px",
        backgroundColor: type === "secondary" ? "#13BC9E" : "",
        borderColor: type === "secondary" ? "#13BC9E" : "",
      }}
    >
      {children}
    </Button>
  );
}

export default TurtleButton;
