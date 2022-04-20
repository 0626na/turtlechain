import { Card, CardProps } from "antd";
import styled from "styled-components";

interface Props extends CardProps {}

function TurtleCardHome({ ...props }: Props) {
  return (
    <StyledCard
      {...props}
      style={{
        width: "100%",
        height: "100%",
        borderRadius: 8,
        boxShadow: "0px 3px 28px rgba(0, 0, 0, 0.05)",
      }}
      bordered={false}
    />
  );
}

const StyledCard = styled(Card)`
  .ant-card-body {
    padding: 20px 24px;
  }
`;

export default TurtleCardHome;
