import { css } from '@emotion/react';

interface Props {
  children?: React.ReactNode;
  gray?: boolean;
}

function PageContent({ children, gray = false }: Props) {
  return <div css={[inner, gray && grayBackground]}>{children}</div>;
}

const inner = css`
  flex-grow: 1;
  padding: 0px 36px;
`;

const grayBackground = css`
  background-color: #f9f9fa;
`;

export default PageContent;
