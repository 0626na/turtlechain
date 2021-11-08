import styled from "styled-components";

interface Props {
  children?: React.ReactNode;
}

const SignupPageTemplate = function ({ children }: Props) {
  return <Container>{children}</Container>;
};

const Container = styled.div`
  width: 400px;
  margin: 0 auto;
  padding: 20px 0;
`;

export default SignupPageTemplate;
