import { PreParsingOrderList } from '@apis/orderAPI';
import { TurtleText } from '@components/element';
import { css } from '@emotion/react';
import { Col, Modal, Row, Typography } from 'antd';

interface Props {
  visible: boolean;
  closeModal: () => void;
  data: PreParsingOrderList;
}

function ExcelPreParsingModal({ visible, closeModal, data }: Props) {
  return (
    <Modal
      centered
      footer={false}
      visible={visible}
      onCancel={closeModal}
      width="50vw"
    >
      <Row css={wrapper}>
        <Col>
          <TurtleText css={$title}>발주서 재등록</TurtleText>
        </Col>
      </Row>
      <Row style={{ display: 'flex', justifyContent: 'center' }}>
        <Typography.Paragraph>
          2차 발주까지 완료된 쇼핑몰은 발주서 등록이 금일은 불가능합니다.
          {data.third_order.map((store) => `${store.rt_store_name} `)}
        </Typography.Paragraph>
      </Row>
    </Modal>
  );
}

const wrapper = css`
  padding: 12px 36px 12px 36px;
`;
const $title = css`
  font-size: 20px;
  font-weight: 500;
  color: #242934;
`;
export default ExcelPreParsingModal;
