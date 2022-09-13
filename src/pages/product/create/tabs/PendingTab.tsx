import { TabPaneProps, Tabs } from 'antd';

interface Props extends TabPaneProps {
  loading: boolean;
}

function PendingTab({ loading, ...props }: Props) {
  return <Tabs.TabPane {...props}>구현중</Tabs.TabPane>;
}

export default PendingTab;
