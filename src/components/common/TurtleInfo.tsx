import { Typography } from 'antd';
import { InfoCircleOutlined as InfoIcon } from '@ant-design/icons';

interface Props {
  children: React.ReactNode;
}

function TurtleInfo({ children }: Props) {
  return (
    <Typography.Text type="secondary" style={{ fontSize: '14px' }}>
      <InfoIcon /> {children}
    </Typography.Text>
  );
}

export default TurtleInfo;
