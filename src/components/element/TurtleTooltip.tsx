import { Tooltip } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';

interface Props {
  content: string;
  children?: React.ReactNode;
}

function TurtleTooltip({ content, children }: Props) {
  return (
    <Tooltip title={content} placement="topRight">
      <QuestionCircleOutlined style={{ marginLeft: '0.5rem' }} />
      {children}
    </Tooltip>
  );
}

export default TurtleTooltip;
