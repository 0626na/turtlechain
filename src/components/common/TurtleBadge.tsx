import { Badge } from "antd";

interface Props {
  children: React.ReactNode;
  count: number;
}

function TurtleBadge({ count, children }: Props) {
  return (
    <Badge count={count === 1 ? 0 : count} offset={[10, 10]} color="green" size="small">
      {children}
    </Badge>
  );
}

export default TurtleBadge;
