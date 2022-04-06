import { t } from "i18next";
import { Collapse, CollapsePanelProps } from "antd";

interface Props extends CollapsePanelProps {
  activeKey: string | string[];
}

function ClearingPanel({ activeKey, ...props }: Props) {
  return <Collapse.Panel {...props}></Collapse.Panel>;
}

export default ClearingPanel;
