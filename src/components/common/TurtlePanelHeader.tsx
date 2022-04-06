import { Badge, Typography } from "antd";

interface Props {
  count: number;
  activeKey: string | string[];
  title: React.ReactNode;
}

function TurtlePanelHeader({ count, activeKey, title }: Props) {
  return (
    <>
      <Badge
        count={count}
        style={{
          backgroundColor: Number(activeKey) >= count ? "#32ACDD" : "#E2E5E9",
          color: Number(activeKey) >= count ? "" : "#A1A2A6",
          fontWeight: 500,
        }}
      />
      <Typography.Text style={{ marginLeft: 8 }}>{title}</Typography.Text>
    </>
  );
}

export default TurtlePanelHeader;
