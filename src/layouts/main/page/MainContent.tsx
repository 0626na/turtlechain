import { Row } from "antd";
import { TurtleInfo, TurtleText } from "components/common";

interface Props {
  children: React.ReactNode;
  title?: string;
  info?: string;
}

function MainContent({ title, info, children }: Props) {
  return (
    <>
      <Row style={{ padding: "32px 36px 0px 36px" }}>
        <TurtleText>{title && title}</TurtleText>
      </Row>
      <Row style={{ paddingTop: 4, paddingBottom: 32 }}>
        {info && <TurtleInfo>{info}</TurtleInfo>}
        {children}
      </Row>
    </>
  );
}

export default MainContent;
