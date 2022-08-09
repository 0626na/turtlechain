import { Button, DatePicker, Form, Modal } from 'antd';
import moment from 'moment';
import { useEffect, useState } from 'react';

interface Props {
  title: string;
  buttonTitle: string;
  visible: boolean;
  closeModal: () => void;
  onClickButton: (date: string) => void;
  loading: boolean;
}

function UpdateVendorNameModal({
  title,
  buttonTitle,
  visible,
  closeModal,
  onClickButton,
  loading,
}: Props) {
  const [date, setDate] = useState(moment().format('YYYY-MM-DD'));

  useEffect(() => {
    if (visible) return;
    setDate(moment().format('YYYY-MM-DD'));
  }, [visible]);

  return (
    <Modal
      centered
      width={350}
      title={title}
      visible={visible}
      onCancel={loading ? () => {} : closeModal}
      footer={false}
    >
      <Form
        layout="vertical"
        onFinish={() => {
          onClickButton(date);
        }}
      >
        <Form.Item label={'날짜'} colon={false}>
          <DatePicker
            style={{ width: '100%' }}
            allowClear={false}
            disabledDate={(current) => current > moment()}
            disabled={loading}
            value={moment(date)}
            onChange={(_, date) => {
              setDate(date);
            }}
          />
        </Form.Item>
        <Form.Item>
          <Button
            style={{ width: '100%' }}
            type="primary"
            size="large"
            htmlType="submit"
            loading={loading}
          >
            {buttonTitle}
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default UpdateVendorNameModal;
