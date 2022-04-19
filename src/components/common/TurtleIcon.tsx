import { DeleteOutlined, BellOutlined } from "@ant-design/icons";

interface Props {
  type: "delete" | "bell";
  onClick?: () => void;
}

function TurtleIcon({ type, onClick }: Props) {
  const style = { cursor: "pointer", color: "#A1A2A6", padding: 6 };
  const handleClick = (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
    e.stopPropagation();
    onClick && onClick();
  };

  if (type === "bell") {
    return <BellOutlined style={style} onClick={handleClick} />;
  } else {
    return <DeleteOutlined style={style} onClick={handleClick} />;
  }
}

export default TurtleIcon;
