import { Tooltip } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';

interface Props {
  content: string;
}

function TurtleQuestionTooltip({ content }: Props) {
  return (
    <Tooltip title={content} placement="topRight">
      <QuestionCircleOutlined style={{ marginLeft: '0.5rem' }} />
    </Tooltip>
  );
}

export default TurtleQuestionTooltip;
