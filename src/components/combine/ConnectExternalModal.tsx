import { Button, DatePicker, Form, Modal } from "antd";
import { t } from "i18next";
import moment from "moment";
import { useState } from "react";

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

function ConnectExternalModal({ visible, closeModal, onClick, loading }: Props) {
  const [date, setDate] = useState<Date>({
    start_date: moment().subtract(1, "months").format("YYYY-MM-DD"),
    end_date: moment().format("YYYY-MM-DD"),
  });

  return (
    <Modal
      centered
      width={350}
      title={t("common.connect external program")}
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
        <Form.Item label={t("common.during")} colon={false}>
          <DatePicker.RangePicker
            style={{ width: "100%" }}
            allowClear={false}
            value={[moment(date.start_date), moment(date.end_date)]}
            onChange={(_, dateStrings) => {
              const start_date = dateStrings[0];
              const end_date = dateStrings[1];
              setDate({ ...date, start_date, end_date });
            }}
          />
        </Form.Item>
        <Form.Item>
          <Button
            style={{ width: "100%" }}
            type="primary"
            size="large"
            htmlType="submit"
            loading={loading}
          >
            {t("button.connect")}
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default ConnectExternalModal;
