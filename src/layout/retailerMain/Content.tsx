import { css } from '@emotion/react';

import { Layout } from 'antd';

interface Props {
  children?: React.ReactNode;
}

function Content({ children }: Props) {
  return <Layout.Content css={content}>{children}</Layout.Content>;
}

const content = css`
  background-color: #fff;
  display: flex;
  flex-direction: column;
`;

export default Content;
