import { Card, CardProps } from 'antd';
import styled from 'styled-components';

interface Props extends CardProps {}

function TurtleCardSetting({ ...props }: Props) {
  return (
    <StyledCard
      {...props}
      type="inner"
      headStyle={{ backgroundColor: '#F7F8F9', minHeight: 40, height: 40 }}
      style={{ width: '100%', ...props.style }}
    />
  );
}

const StyledCard = styled(Card)`
  .ant-card-head-wrapper {
    height: 40px;
  }
`;
export default TurtleCardSetting;
