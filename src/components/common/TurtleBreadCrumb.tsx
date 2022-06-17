import { Breadcrumb } from 'antd';
import styled from 'styled-components';

interface Props {
  list: Array<string>;
}

function TurtleBreadCrumb({ list }: Props) {
  return (
    <StyledBreadcrumb separator=">">
      {list.map((item) => (
        <Breadcrumb.Item key={item}>{item}</Breadcrumb.Item>
      ))}
    </StyledBreadcrumb>
  );
}

const StyledBreadcrumb = styled(Breadcrumb)`
  background-color: #f3f6f9;
  padding-right: 40px;
  border-radius: 100px;
  padding-top: 16px;
  padding-bottom: 1px;

  .ant-breadcrumb {
    line-height: 1.4 !important;
  }
`;

export default TurtleBreadCrumb;
