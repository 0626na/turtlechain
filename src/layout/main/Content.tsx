import { css } from '@emotion/react';
import useLogin from '@hooks/useLogin';
import { Layout } from 'antd';
import { Navigate } from 'react-router-dom';

interface Props {
  children?: React.ReactNode;
}

function Content({ children }: Props) {
  const { isLogin } = useLogin();

  if (!isLogin) {
    return <Navigate to="/" replace={true} />;
  }

  return <Layout.Content css={content}>{children}</Layout.Content>;
}

const content = css`
  background-color: #fff;
  display: flex;
  flex-direction: column;
`;

export default Content;
