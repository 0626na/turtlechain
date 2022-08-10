import moment from 'moment';
import { useEffect, useState } from 'react';
import { Button, DatePicker, Form, Modal } from 'antd';

interface Date {
  start_date: string;
  end_date: string;
}

interface Props {
  title: string;
  buttonTitle: string;
  visible: boolean;
  closeModal: () => void;
  onClickButton: (date: Date) => void;
  loading: boolean;
  inThreeMonth?: boolean;
}

function SelectRangeDateModal({
  title,
  buttonTitle,
  visible,
  closeModal,
  onClickButton,
  loading,
  inThreeMonth,
}: Props) {
  const [date, setDate] = useState<Date>({
    start_date: moment().format('YYYY-MM-DD'),
    end_date: moment().format('YYYY-MM-DD'),
  });

  useEffect(() => {
    if (visible) return;
    setDate({
      start_date: moment().format('YYYY-MM-DD'),
      end_date: moment().format('YYYY-MM-DD'),
    });
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
          <DatePicker.RangePicker
            style={{ width: '100%' }}
            allowClear={false}
            disabledDate={(current) =>
              inThreeMonth
                ? current > moment() || current < moment().subtract(3, 'months')
                : current > moment()
            }
            disabled={loading}
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
            {buttonTitle}
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default SelectRangeDateModal;
