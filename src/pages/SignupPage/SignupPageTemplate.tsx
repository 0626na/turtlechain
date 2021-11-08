import styled from "styled-components";

interface Props {
  children?: React.ReactNode;
}

const SignupPageTemplate = function ({ children }: Props) {
  return <Container>{children}</Container>;
};

const Container = styled.div`
  width: 800px;
  margin: 0 auto;
`;

export default SignupPageTemplate;
