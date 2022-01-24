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
  background-color: ${({ theme }) => theme.breadcrumb};
  padding: 0.5rem 1rem;
  border-radius: 100px;
`;

export default TurtleBreadCrumb;
