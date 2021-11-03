import styled from "styled-components";

interface Props {
  children?: React.ReactNode;
}

const FindIdPageTemplate = function ({ children }: Props) {
  return <Container>{children}</Container>;
};

const Container = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export default FindIdPageTemplate;
