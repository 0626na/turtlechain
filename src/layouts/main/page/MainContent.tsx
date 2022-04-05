import { Row } from "antd";
import { TurtleInfo, TurtleText } from "components/common";

interface Props {
  children: React.ReactNode;
  title?: string;
  info?: string;
}

function MainContent({ title, info, children }: Props) {
  return (
    <Row style={{ paddingTop: 32, paddingBottom: 32 }}>
      <TurtleText>
        {title && title}
        {info && (
          <>
            <br />
            <TurtleInfo>{info}</TurtleInfo>
          </>
        )}
      </TurtleText>
      {children}
    </Row>
  );
}

export default MainContent;
