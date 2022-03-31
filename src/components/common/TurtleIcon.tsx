import { DeleteOutlined } from "@ant-design/icons";

interface Props {
  type: "delete";
  onClick: () => void;
}

function TurtleIcon({ type, onClick }: Props) {
  const style = { cursor: "pointer", color: "#A1A2A6" };

  return (
    <DeleteOutlined //
      style={style}
      onClick={onClick}
    />
  );
}

export default TurtleIcon;
