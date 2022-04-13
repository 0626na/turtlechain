import { Row } from "antd";

interface Props {
  children: React.ReactNode;
}

function BottomBar({ children }: Props) {
  return (
    <Row justify="end" style={{ paddingTop: 20, paddingBottom: 20, backgroundColor: "#F8F9FB" }}>
      {children}
    </Row>
  );
}

export default BottomBar;
