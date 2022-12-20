import { t } from 'i18next';
import { useCallback, useEffect } from 'react';
import { Form, Radio } from 'antd';
import { TurtleFormInput } from '@components/element';
import { StoreShow } from '@apis/retailerStoreAPI';
import { TurtleContentModal } from '@components/combine';

interface Props {
  visible: boolean;
  closeModal: () => void;
  selectedRow?: StoreShow;
}

function DetailPickerModal({ visible, closeModal, selectedRow }: Props) {
  const [form] = Form.useForm();

  const resetStates = useCallback(() => {
    const { id, store_url, is_closed, name } = selectedRow || {};

    form.setFieldsValue({
      store_id: id,
      is_closed,
      store_url,
      name,
      mobile:
        selectedRow?.store_phone.length !== 0
          ? selectedRow?.store_phone[0].phone
          : '',
    });
  }, [selectedRow, form]);

  useEffect(() => {
    if (!visible) return;
    resetStates();
  }, [visible, resetStates]);

  return (
    <TurtleContentModal
      title={t('table.store info')}
      visible={visible}
      onClose={() => {
        closeModal();
      }}
    >
      <Form
        layout="horizontal"
        form={form}
        colon={false}
        labelCol={{ span: 7 }}
        wrapperCol={{ span: 17 }}
      >
        <Form.Item name="store_id" hidden>
          <TurtleFormInput hidden />
        </Form.Item>

        <Form.Item
          name="is_closed"
          label={t('table.operatorStatus')}
          required
          rules={[{ required: true }]}
        >
          <Radio.Group disabled>
            <Radio value={false}>{t('button.operation')}</Radio>
            <Radio value={true}>{t('button.closed')}</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item
          name="name"
          rules={[{ required: true }]}
          label={t('table.retailerStoreName')}
        >
          <TurtleFormInput
            placeholder={t('placeholder.input store name')}
            disabled
          />
        </Form.Item>

        <Form.Item
          name="store_url"
          rules={[{ required: true }]}
          label={t('table.retailerStoreURL')}
        >
          <TurtleFormInput
            placeholder={t('placeholder.input store URL')}
            disabled
          />
        </Form.Item>

        <Form.Item
          name="mobile"
          rules={[{ required: true }]}
          label={t('table.mobile')}
        >
          <TurtleFormInput
            placeholder={t('placeholder.input mobile number')}
            disabled
          />
        </Form.Item>
      </Form>
    </TurtleContentModal>
  );
}

export default DetailPickerModal;
