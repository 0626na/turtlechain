import { Row } from "antd";

interface Props {
  justify?: "space-between" | "end";
  children: React.ReactNode;
}

function BottomBar({ justify = "end", children }: Props) {
  return (
    <Row
      align="middle"
      justify={justify}
      style={{
        paddingTop: 20,
        paddingBottom: 20,
        backgroundColor: "#F8F9FB",
        borderRadius: "0 0 8px 8px",
      }}
    >
      {children}
    </Row>
  );
}

export default BottomBar;
