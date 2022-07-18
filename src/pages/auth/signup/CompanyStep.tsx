import { UploadOutlined } from '@ant-design/icons';
import { DaumPostcodeModal } from '@components/combine';
import { Button, Form, Input, Radio, Row, Upload } from 'antd';
import { t } from 'i18next';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface Props {
  visible: boolean;
  onClickNext: () => void;
}

function CompanyStep({ visible, onClickNext }: Props) {
  const navigate = useNavigate();
  const form = Form.useFormInstance();
  const [postcodeModalVisible, setPostcodeModalVisible] = useState(false);

  const normFile = (e: any) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };

  return (
    <div style={{ display: visible ? '' : 'none' }}>
      <DaumPostcodeModal
        visible={postcodeModalVisible}
        onClose={() => setPostcodeModalVisible(false)}
        onGetAddress={(company_main_address) => {
          form.setFieldsValue({
            ...form.getFieldsValue(),
            company_main_address,
          });
        }}
      />

      <Form.Item
        name="company_biz_type"
        label={t('biz type')}
        rules={[{ required: true }]}
      >
        <Radio.Group>
          {['entity', 'personal', 'simple'].map((option) => (
            <Radio key={option} value={option}>
              {t(`biz ${option}`)}
            </Radio>
          ))}
        </Radio.Group>
      </Form.Item>

      <Form.Item
        name="company_owner"
        label={t('owner')}
        rules={[{ required: true }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="company_name"
        label={t('biz name')}
        rules={[{ required: true }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="company_biz_num"
        label={t('biz num')}
        rules={[{ required: true }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="company_main_address"
        label={t('biz address')}
        rules={[{ required: true }]}
      >
        <Input
          readOnly
          onClick={() => setPostcodeModalVisible(true)}
          suffix={
            <Button
              size="small"
              type="link"
              style={{ fontSize: 13 }}
              onClick={() => setPostcodeModalVisible(true)}
            >
              {t('find address')}
            </Button>
          }
        />
      </Form.Item>
      <Form.Item
        name="company_sub_address"
        label={t('biz detail address')}
        rules={[{ required: true }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="company_biz_license_file"
        label={t('biz license')}
        valuePropName="fileList"
        getValueFromEvent={normFile}
        rules={[{ required: true }]}
      >
        <Upload listType="picture" maxCount={1} beforeUpload={() => false}>
          <Button type="primary" icon={<UploadOutlined />}>
            {t('biz license')}
          </Button>
        </Upload>
      </Form.Item>
      <Form.Item
        name="company_store_url"
        label={t('etc')}
        rules={[{ required: true }]}
      >
        <Input.TextArea placeholder="운영중인 쇼핑몰 url을 입력해주세요." />
      </Form.Item>

      <Row justify="space-between">
        <Button style={{ width: '48%' }} onClick={() => navigate('/')}>
          {t('prev')}
        </Button>
        <Button
          style={{ width: '48%' }}
          type="primary"
          onClick={async () => {
            await form.validateFields();
            onClickNext();
          }}
        >
          {t('next')}
        </Button>
      </Row>
    </div>
  );
}

export default CompanyStep;
