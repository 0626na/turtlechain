import { Divider, DividerProps } from 'antd';

interface Props extends DividerProps {
  color?: string;
  marginTop?: number;
  marginBottom?: number;
  marginLeft?: number;
  marginRight?: number;
}

function TurtleDivider({
  marginTop = 0,
  marginBottom = 0,
  marginLeft = 8,
  marginRight = 8,
  type = 'horizontal',
  color = type === 'horizontal' ? '#E3E6EA' : '#DCE0E4',
  ...Props
}: Props) {
  return (
    <Divider
      {...Props}
      type={type}
      css={{
        marginTop,
        marginBottom,
        marginLeft,
        marginRight,
        borderTopColor: color, // horizontal 일때
        borderLeftColor: color, // vertical 일때
        height: type === 'horizontal' ? 1 : 16,
        width: type === 'horizontal' ? '100%' : 1,
      }}
    />
  );
}

export default TurtleDivider;
