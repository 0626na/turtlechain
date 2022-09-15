import { Divider, DividerProps } from 'antd';

interface Props extends DividerProps {
  color?: string;
  marginTop?: number;
  marginBottom?: number;
}

function TurtleDivider({
  color = 'E3E6EA',
  marginTop = 0,
  marginBottom = 0,
  ...Props
}: Props) {
  const styles = {
    borderTopColor: color,
    marginTop,
    marginBottom,
  };

  return <Divider {...Props} style={styles} />;
}

export default TurtleDivider;
