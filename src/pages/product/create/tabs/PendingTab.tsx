import { TabPaneProps, Tabs } from 'antd';

interface Props extends TabPaneProps {
  loading: boolean;
}

function PendingTab({ loading, ...props }: Props) {
  return <Tabs.TabPane {...props}>pendingTab</Tabs.TabPane>;
}

export default PendingTab;
