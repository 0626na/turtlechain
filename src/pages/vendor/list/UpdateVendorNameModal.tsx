import vendorAPI, { VendorShow } from '@apis/vendorAPI';
import { Button, Form, Input, message, Modal } from 'antd';
import { useForm } from 'antd/lib/form/Form';

import { t } from 'i18next';

import { useEffect } from 'react';
import { useMutation } from 'react-query';

interface Props {
  title: string;
  buttonTitle: string;
  visible: boolean;
  onCloseModal: () => void;
  selectedRow: VendorShow;
}

function UpdateVendorNameModal({
  title,
  buttonTitle,
  visible,
  onCloseModal,
  selectedRow,
}: Props) {
  const [form] = useForm();
  const vendorNameUpdateMutation = useMutation(vendorAPI.update, {
    onSuccess: () => {
      message.success('수정이 완료되었습니다.');
      onCloseModal();
      form.resetFields();
    },
  });

  useEffect(() => {
    if (visible) return;
  }, [visible]);

  return (
    <Modal
      centered
      width={350}
      title={title}
      visible={visible}
      onCancel={onCloseModal}
      footer={false}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={(value) => {
          vendorNameUpdateMutation.mutate({
            id: Number(selectedRow.id),
            vendor_name: value.vendor_name,
          });
        }}
      >
        <Form.Item label={t('vendor.name')} name="vendor_name" colon={false}>
          <Input autoFocus placeholder={selectedRow?.vendor_name} />
        </Form.Item>
        <Form.Item>
          <Button
            htmlType="submit"
            style={{ width: '100%' }}
            type="primary"
            size="large"
            loading={vendorNameUpdateMutation.isLoading}
          >
            {buttonTitle}
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default UpdateVendorNameModal;
