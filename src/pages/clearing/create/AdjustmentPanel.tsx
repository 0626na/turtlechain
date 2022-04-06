import { t } from "i18next";
import { Collapse, CollapsePanelProps, Row, Table, Typography } from "antd";
import { TurtleButton } from "components/common";
import { clearingAPI } from "apis";

interface Props extends CollapsePanelProps {
  activeKey: string | string[];
  clickNext: () => void;
}

function AdjustmentPanel({ activeKey, clickNext, ...props }: Props) {
  // const getBalance = useQuery(["getBalance"], () => clearingAPI.getBalance({
  //   warehousing_sheet_id:
  // }))
  return (
    <Collapse.Panel
      {...props}
      extra={<Typography.Text style={{ color: "#5B5D63" }}>매입 총 금액: 0</Typography.Text>}
    >
      <Table
        size="small"
        pagination={false}
        //loading={}
        // dataSource={}
        //rowKey=""
        columns={[{}, {}]}
      />
      <Row justify="end" align="middle" style={{ marginTop: 16 }}>
        <TurtleButton //
          children={t("button.next step")}
          onClick={clickNext}
        />
      </Row>
    </Collapse.Panel>
  );
}

export default AdjustmentPanel;
