import { t } from "i18next";
import { Popconfirm } from "antd";
import styled from "styled-components";

interface Props {
  title: React.ReactNode;
  onConfirm: () => void;
  children: React.ReactNode;
}

function TurtlePopConfirm({ title, onConfirm, children }: Props) {
  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      <StyledPopconfirm
        title={<div style={{ paddingRight: 22 }}>{title}</div>}
        icon=""
        okText={t("button.ok")}
        cancelText={t("button.cancel")}
        onConfirm={onConfirm}
      >
        {children}
      </StyledPopconfirm>
    </div>
  );
}

const StyledPopconfirm = styled(Popconfirm)`
  .ant-popover-message-title {
    padding-left: 0px;
  }
`;

export default TurtlePopConfirm;
