import { Card, CardProps } from "antd";

interface Props extends CardProps {}

function TurtleCardHome({ ...props }: Props) {
  return (
    <Card {...props} style={{ width: "100%", height: "100%", borderRadius: 8 }} bordered={false} />
  );
}

export default TurtleCardHome;
