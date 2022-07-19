import { UploadOutlined } from '@ant-design/icons';
import userAPI from '@apis/userAPI';
import { DaumPostcodeModal } from '@components/combine';
import {
  Button,
  Form,
  FormInstance,
  Input,
  message,
  Radio,
  Row,
  Space,
  Upload,
} from 'antd';
import { AxiosError } from 'axios';
import { t } from 'i18next';
import { useState } from 'react';
import { useMutation } from 'react-query';
import { useNavigate } from 'react-router-dom';

interface Props {
  visible: boolean;
  onClickNext: () => void;
  form: FormInstance;
}

function CompanyStep({ visible, onClickNext, form }: Props) {
  const navigate = useNavigate();

  const [postcodeModalVisible, setPostcodeModalVisible] = useState(false);
  const [checkDuplicated, setCheckDuplicated] = useState(false);

  const dupCheckQuery = useMutation(['dupCheck'], userAPI.dupCheck, {
    onSuccess: () => {
      message.success(t('message.no duplicate values'));
      setCheckDuplicated(true);
      form.setFields([
        {
          name: 'biz_num',
          errors: [],
        },
      ]);
    },
    onError: (data: AxiosError) => {
      message.warn(data.response?.data.msg);
      setCheckDuplicated(false);
    },
  });

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
      <Form.Item label={t('biz num')} required={true}>
        <Space>
          <Form.Item
            noStyle
            name="company_biz_num"
            rules={[
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value) {
                    return Promise.reject(
                      new Error('사업자 번호 입력해주세요'),
                    );
                  }

                  if (!checkDuplicated && getFieldValue('company_biz_num')) {
                    return Promise.reject(
                      new Error('사업자 번호 중복확인을 해주세요'),
                    );
                  }

                  return Promise.resolve();
                },
              }),
            ]}
          >
            <Input
              style={{ width: 400 }}
              onChange={() => {
                setCheckDuplicated(false);
              }}
            />
          </Form.Item>
          <Form.Item shouldUpdate noStyle>
            {({ getFieldError, getFieldValue }) => (
              <Button
                style={{ fontSize: 13 }}
                size="middle"
                type="primary"
                disabled={
                  !getFieldValue('company_biz_num') ||
                  getFieldError('company_biz_num').includes(
                    '사업자번호 입력해 주세요.',
                  ) ||
                  checkDuplicated
                }
                onClick={() => {
                  dupCheckQuery.mutate({
                    biz_num: getFieldValue('company_biz_num'),
                  });
                }}
              >
                {t('duplicate check')}
              </Button>
            )}
          </Form.Item>
        </Space>
      </Form.Item>

      <Form.Item label={t('biz address')} required={true}>
        <Space>
          <Form.Item
            noStyle
            name="company_main_address"
            rules={[
              () => ({
                validator(_, value) {
                  if (!value) {
                    return Promise.reject(new Error('사업자주소 입력해주세요'));
                  }

                  return Promise.resolve();
                },
              }),
            ]}
          >
            <Input
              style={{ width: 400 }}
              readOnly
              onClick={() => setPostcodeModalVisible(true)}
            />
          </Form.Item>
          <Button
            style={{ fontSize: 13 }}
            size="middle"
            type="primary"
            onClick={() => setPostcodeModalVisible(true)}
          >
            {t('find address')}
          </Button>
        </Space>
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
        rules={[{ required: true, message: '사업자 등록증 업로드해 주세요' }]}
      >
        <Upload listType="picture" maxCount={1} beforeUpload={() => false}>
          <Button type="primary" icon={<UploadOutlined />}>
            {t('biz license')}
          </Button>
        </Upload>
      </Form.Item>
      <Form.Item
        name="company_store_url"
        label={t('store.url')}
        rules={[{ required: true }]}
      >
        <Input placeholder="운영중인 쇼핑몰 url을 입력해주세요." />
      </Form.Item>

      <Row justify="space-between">
        <Button style={{ width: '48%' }} onClick={() => navigate('/')}>
          {t('prev')}
        </Button>
        <Button
          style={{ width: '48%' }}
          type="primary"
          onClick={async () => {
            try {
              await form.validateFields([
                'company_biz_type',
                'company_owner',
                'company_name',
                'company_biz_num',
                'company_main_address',
                'company_sub_address',
                'company_biz_license_file',
                'company_store_url',
              ]);
              onClickNext();
            } catch (error) {
              console.log(error);
              return;
            }
          }}
        >
          {t('next')}
        </Button>
      </Row>
    </div>
  );
}

export default CompanyStep;
