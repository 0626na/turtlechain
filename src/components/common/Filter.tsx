import { Button, Col, Row, Space } from "antd";
import TurtleButton from "components/common/TurtleButton";
import StoreSelect from "components/StoreSelect";
import { useTranslation } from "react-i18next";
import { FilterButton } from "./FilterButtonType";
import TurtleButtonSub from "./TurtleButtonSub";

interface Props {
  filterButtons: FilterButton[];
  isGlobalState:boolean;
  onStoreSelected: () => void; 
}

const StoreFilter = function({
  filterButtons, isGlobalState, onStoreSelected
}: Props) {
  const { t } = useTranslation();
  
  
  return (
    <Row
      gutter={24}
      justify="space-between"
      style={{
        margin: "0",
        padding: "12px 12px",
        backgroundColor: "rgba(243,246,249, 0.4)",
      }}
    >
      <Col>
        <StoreSelect  />
      </Col>
      <Col>
        <Space>
        {filterButtons.map((btn:FilterButton)=>{
          return (
            <TurtleButtonSub >
              {btn.text}
            </TurtleButtonSub>
          )
        })}
        </Space>
      </Col>
    </Row>
  );
}

export default StoreFilter;
