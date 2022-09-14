import { Badge } from 'antd';

interface Props {
  children: React.ReactNode;
  count: number;
  color?: string;
}

function TurtleBadge({ count, children, color = 'green' }: Props) {
  return (
    <Badge count={count} offset={[10, 10]} color={color} size="small">
      {children}
    </Badge>
  );
}

export default TurtleBadge;
