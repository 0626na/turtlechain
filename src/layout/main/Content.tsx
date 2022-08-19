import { Layout } from 'antd';

interface Props {
  children?: React.ReactNode;
}

function Content({ children }: Props) {
  return (
    <Layout.Content
      style={{
        backgroundColor: '#fff',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {children}
    </Layout.Content>
  );
}

export default Content;
