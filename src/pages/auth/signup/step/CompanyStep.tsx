import userAPI from '@apis/userAPI';
import { DaumPostcodeModal } from '@components/combine';
import { AddButton } from '@components/element';
import { css } from '@emotion/react';
import {
  Button,
  Col,
  Form,
  FormInstance,
  Input,
  message,
  Radio,
  Row,
  Upload,
} from 'antd';
import { AxiosError } from 'axios';
import { t } from 'i18next';
import { useState } from 'react';
import { useMutation } from 'react-query';

interface Props {
  visible: boolean;
  onClickNext: () => void;
  form: FormInstance;
}

function CompanyStep({ visible, onClickNext, form }: Props) {
  const [postcodeModalVisible, setPostcodeModalVisible] = useState(false);
  const [checkDuplicated, setCheckDuplicated] = useState(false);

  // 사업자번호 중복체크 요청
  const dupCheckQuery = useMutation(['dupCheck'], userAPI.dupCheck, {
    onSuccess: (data) => {
      message.success(data.msg);
      setCheckDuplicated(true);
      form.setFields([
        {
          name: 'company_biz_num',
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

  // 사업자번호 유효성 검사
  const handleBizNumValidationCheck = (_: any, value: any) => {
    if (!value) {
      return Promise.reject(new Error('사업자 번호 입력해주세요'));
    }

    if (!checkDuplicated && form.getFieldValue('company_biz_num')) {
      return Promise.reject(new Error('사업자 번호 중복확인을 해주세요'));
    }

    return Promise.resolve();
  };

  // 사업자 주소 유효성 검사
  const handleBizAddressValidationCheck = (_: any, value: any) => {
    if (!value) {
      return Promise.reject(new Error('사업자주소 입력해주세요'));
    }

    return Promise.resolve();
  };

  return (
    <div css={{ display: visible ? '' : 'none' }}>
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
        name="company_name"
        label={t('biz name')}
        rules={[{ required: true }]}
      >
        <Input css={input} placeholder={t('auth.id')} />
      </Form.Item>

      <Form.Item noStyle shouldUpdate>
        {({ getFieldError, getFieldValue }) => (
          <Form.Item
            label={t('biz num')}
            required
            name="company_biz_num"
            rules={[{ validator: handleBizNumValidationCheck }]}
          >
            <Input
              onChange={() => {
                setCheckDuplicated(false);
              }}
              css={input}
              placeholder={t('auth.id')}
              suffix={
                <Button
                  css={{ color: '#1A66F9', '&:hover': { color: '#1A66F9' } }}
                  type="link"
                  disabled={
                    !getFieldValue('company_biz_num') ||
                    getFieldError('company_biz_num').includes(
                      '사업자번호 입력해 주세요.',
                    ) ||
                    checkDuplicated
                  }
                  onClick={() => {
                    dupCheckQuery.mutate({
                      biz_num: form.getFieldValue('company_biz_num'),
                    });
                  }}
                >
                  중복확인
                </Button>
              }
            />
          </Form.Item>
        )}
      </Form.Item>

      <Form.Item label={t('biz address')} required>
        <Form.Item
          noStyle
          name="company_main_address"
          rules={[{ validator: handleBizAddressValidationCheck }]}
        >
          <Input
            css={input}
            readOnly
            onClick={() => setPostcodeModalVisible(true)}
            suffix={
              <Button
                css={{ color: '#1A66F9', '&:hover': { color: '#1A66F9' } }}
                type="link"
                onClick={() => setPostcodeModalVisible(true)}
              >
                주소 찾기
              </Button>
            }
          />
        </Form.Item>
      </Form.Item>

      <Form.Item
        name="company_sub_address"
        label={t('biz detail address')}
        initialValue=""
      >
        <Input css={input} />
      </Form.Item>

      <Form.Item
        name="company_biz_license_file"
        label={t('biz license')}
        valuePropName="fileList"
        getValueFromEvent={normFile}
        rules={[{ required: true, message: '사업자 등록증 업로드해 주세요' }]}
      >
        <Upload
          css={upload}
          maxCount={1}
          accept=".jpg, .png, .jpeg, .pdf"
          beforeUpload={() => false}
        >
          <AddButton>파일 첨부하기</AddButton>
        </Upload>
      </Form.Item>

      <Form.Item
        name="company_store_url"
        label={t('store.url')}
        rules={[{ required: true }]}
      >
        <Input css={input} placeholder="운영중인 쇼핑몰 url을 입력해주세요." />
      </Form.Item>

      <Row css={{ marginTop: 40 }}>
        <Col span={24}>
          <Button
            css={button}
            onClick={async () => {
              try {
                await form.validateFields([
                  'company_biz_type',
                  'company_owner',
                  'company_name',
                  'company_biz_num',
                  'company_main_address',
                  'company_biz_license_file',
                  'company_store_url',
                ]);
                onClickNext();
              } catch (error) {
                return;
              }
            }}
          >
            {t('next')}
          </Button>
        </Col>
      </Row>
    </div>
  );
}

const input = css`
  height: 44px;
  border-radius: 8px;
`;

const button = css`
  width: 352px;
  height: 48px;

  font-weight: 700;
  border: none;
  border-radius: 8px;

  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #fff;

  background-color: #00b3be;

  &:hover {
    color: #fff;
    background-color: #00b3be;
  }

  // active 상태
  &.ant-btn:focus {
    color: #fff;
    background-color: #00b3be;
    border-color: #00b3be;
  }
`;

const upload = css`
  display: flex;

  .ant-upload-list {
    margin-left: 12px;
  }

  .ant-upload-list-item-name {
    color: #a1a2a6;
    width: 200px;
  }
`;

export default CompanyStep;
