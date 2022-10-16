import userAPI from '@apis/userAPI';
import { DaumPostcodeModal } from '@components/combine';
import { AddButton } from '@components/element';
import { css } from '@emotion/react';
import useModal from '@hooks/useModal';
import { Button, Form, Input, message, Radio, Row, Upload } from 'antd';

import { AxiosError } from 'axios';
import { t } from 'i18next';
import { useState } from 'react';
import { useMutation } from 'react-query';

interface Props {
  visible: boolean;
  onClickNext: () => void;
}

function CompanyStep({ visible, onClickNext }: Props) {
  const form = Form.useFormInstance();
  const [postcodeModalVisible, postcodeModalOpen, postcodeModalClose] =
    useModal();
  const [checkDuplicated, setCheckDuplicated] = useState(false);

  // 사업자번호 중복체크 요청
  const dupCheckMutation = useMutation(userAPI.dupCheck, {
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
  const bizNumValidation = (_: any, value: number) => {
    if (!value) {
      return Promise.reject(new Error('사업자 번호 입력해주세요'));
    }

    if (!checkDuplicated && form.getFieldValue('company_biz_num')) {
      return Promise.reject(new Error('사업자 번호 중복확인을 해주세요'));
    }

    return Promise.resolve();
  };

  // 사업자 주소 유효성 검사
  const bizAddressValidation = (_: any, value: string) => {
    if (!value) {
      return Promise.reject(new Error('사업자주소 입력해주세요'));
    }

    return Promise.resolve();
  };

  return (
    <div style={{ display: visible ? '' : 'none' }}>
      <DaumPostcodeModal
        visible={postcodeModalVisible}
        onClose={() => {
          postcodeModalClose();
        }}
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
        <Input css={input} placeholder="ex. (주)터틀샵" />
      </Form.Item>

      <Form.Item noStyle shouldUpdate>
        {({ getFieldError, getFieldValue }) => (
          <Form.Item
            label={t('biz num')}
            required
            name="company_biz_num"
            rules={[{ validator: bizNumValidation }]}
          >
            <Input
              onChange={() => {
                setCheckDuplicated(false);
              }}
              css={input}
              placeholder="ex. 123-45-67890"
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
                    dupCheckMutation.mutate({
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
          rules={[{ validator: bizAddressValidation }]}
        >
          <Input
            css={input}
            readOnly
            onClick={() => {
              postcodeModalOpen();
            }}
            placeholder="사업자 주소를 입력해주세요"
            suffix={
              <Button
                css={findAddressButton}
                type="link"
                onClick={() => postcodeModalOpen()}
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
        <Input css={input} placeholder="사업자 상세주소를 입력해주세요" />
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
        <Input css={input} placeholder="ex. www.turtleshop.com" />
      </Form.Item>

      <Form.Item noStyle shouldUpdate>
        {({ getFieldValue }) => (
          <Row css={marginTop}>
            <Button
              disabled={
                !getFieldValue('company_biz_type') ||
                !getFieldValue('company_name') ||
                !getFieldValue('company_biz_num') ||
                !getFieldValue('company_main_address') ||
                !getFieldValue('company_biz_license_file') ||
                !getFieldValue('company_store_url') ||
                !checkDuplicated
              }
              css={button}
              onClick={() => {
                onClickNext();
              }}
            >
              {t('next')}
            </Button>
          </Row>
        )}
      </Form.Item>
    </div>
  );
}

const input = css({
  height: 44,
  borderRadius: 8,
});

const findAddressButton = css({
  color: '#1A66F9',
  '&:hover': { color: '#1A66F9' },
});

const button = css({
  width: 352,
  height: 48,

  fontWeight: 700,
  border: 'none',
  borderRadius: 8,

  display: 'inlineFlex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#fff',

  backgroundColor: '#00b3be',

  '&:hover': {
    color: '#fff',
    backgroundColor: '#00b3be',
  },

  // active 상태
  '&.ant-btn:focus': {
    color: '#fff',
    backgroundColor: '#00b3be',
    borderColor: '#00b3be',
  },
});

const marginTop = css({
  marginTop: 40,
});

const upload = css({
  display: 'flex',

  '.ant-upload-list': {
    marginLeft: 12,
  },

  '.ant-upload-list-item-name': {
    color: '#a1a2a6',
    width: 200,
  },
});

export default CompanyStep;
