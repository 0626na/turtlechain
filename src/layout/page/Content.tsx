import styled from '@emotion/styled';

interface Props {
  children?: React.ReactNode;
}

function PageContent({ children }: Props) {
  return <ContentInner>{children}</ContentInner>;
}

const ContentInner = styled.div`
  flex-grow: 1;
  padding: 0px 36px;
`;

export default PageContent;
