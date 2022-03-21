import { Breadcrumb } from "antd";
import styled from "styled-components";

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
  padding: 0.4rem 1rem;
  border-radius: 100px;
  line-height: 1.4;

  .ant-breadcrumb {
    line-height: 1.4 !important;
  }
`;

export default TurtleBreadCrumb;
