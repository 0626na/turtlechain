import styled from "styled-components";
import { Breadcrumb, Typography } from "antd";

interface Props {
  icon?: React.ReactNode;
  title?: string;
  breadcrumbList?: Array<string>;
}

const PageHeader = function ({ icon, title, breadcrumbList }: Props) {
  return (
    <Container>
      <TitleContainer>
        {icon}
        <Typography>{title}</Typography>
      </TitleContainer>
      {breadcrumbList && (
        <BreadcrumbContainer separator=">">
          {breadcrumbList.map((item) => (
            <Breadcrumb.Item key={item}>{item}</Breadcrumb.Item>
          ))}
        </BreadcrumbContainer>
      )}
    </Container>
  );
};

const Container = styled.div`
  height: 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #dee2e6;
`;

const TitleContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1.2rem;
  font-weight: bold;
  & > * + * {
    margin-left: 10px;
  }
`;

const BreadcrumbContainer = styled(Breadcrumb)`
  background-color: #f1f3f5;
  padding: 5px 10px;
  border-radius: 20px;
`;

export default PageHeader;
