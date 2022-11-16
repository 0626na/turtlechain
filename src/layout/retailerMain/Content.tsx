import { css } from '@emotion/react';
import useStore from '@hooks/useStore';

import { Layout } from 'antd';
import { useLocation } from 'react-router-dom';

interface Props {
  children?: React.ReactNode;
}

function Content({ children }: Props) {
  const location = useLocation();
  const { isStoreEmpty } = useStore();

  // store가 비어있거나, setting 페이지가 아니면 disabled한다.
  const isPageDisabled =
    isStoreEmpty && !location.pathname.includes('/setting');

  return (
    <Layout.Content css={[content, isPageDisabled && disabled]}>
      {children}
    </Layout.Content>
  );
}

const content = css`
  background-color: #fff;
  display: flex;
  flex-direction: column;
`;

const disabled = css`
  opacity: 0.3;
  pointer-events: none;
`;

export default Content;
