import { DeleteOutlined, BellOutlined, CheckOutlined } from '@ant-design/icons';

interface Props {
  type: 'delete' | 'bell' | 'check';
  onClick?: () => void;
}

function TurtleIcon({ type, onClick }: Props) {
  const style = { cursor: 'pointer', color: '#A1A2A6', padding: 6 };
  const handleClick = (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
    e.stopPropagation();
    onClick && onClick();
  };

  if (type === 'bell') {
    return <BellOutlined style={style} onClick={handleClick} />;
  } else if (type === 'check') {
    return <CheckOutlined style={style} onClick={handleClick} />;
  } else {
    return <DeleteOutlined style={style} onClick={handleClick} />;
  }
}

export default TurtleIcon;
