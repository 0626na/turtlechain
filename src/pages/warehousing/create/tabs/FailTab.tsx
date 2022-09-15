import { TabPaneProps } from 'antd';
import Tabs from 'rc-tabs';
import React from 'react';

interface Props extends TabPaneProps {
  loading: boolean;
}

function FailTab({ loading, ...props }: Props) {
  return <Tabs.TabPane {...props}></Tabs.TabPane>;
}

export default FailTab;
