import moment from 'moment';
import { useEffect, useState } from 'react';
import { t } from 'i18next';
import { Button, DatePicker, Form, Modal } from 'antd';

interface Date {
  start_date: string;
  end_date: string;
}

interface Props {
  visible: boolean;
  closeModal: () => void;
  onClick: (date: Date) => void;
  loading: boolean;
}

function SelectDateModal({ visible, closeModal, onClick, loading }: Props) {
  const [date, setDate] = useState<Date>({
    start_date: moment().subtract(1, 'months').format('YYYY-MM-DD'),
    end_date: moment().format('YYYY-MM-DD'),
  });

  useEffect(() => {
    setDate({
      start_date: moment().subtract(1, 'months').format('YYYY-MM-DD'),
      end_date: moment().format('YYYY-MM-DD'),
    });
  }, [visible]);

  return (
    <Modal
      centered
      width={350}
      title={'엑셀 다운로드'}
      visible={visible}
      onCancel={loading ? () => {} : closeModal}
      footer={false}
    >
      <Form
        layout="vertical"
        onFinish={() => {
          onClick(date);
        }}
      >
        <Form.Item label={t('common.during')} colon={false}>
          <DatePicker.RangePicker
            style={{ width: '100%' }}
            allowClear={false}
            value={[moment(date.start_date), moment(date.end_date)]}
            onChange={(_, [start_date, end_date]) => {
              setDate({ start_date, end_date });
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
            {t('button.download')}
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default SelectDateModal;
