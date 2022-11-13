import userAPI from '@apis/userAPI';
import { DaumPostcodeModal } from '@components/combine';
import { AddButton, CheckDuplicatedButton } from '@components/element';
import { css } from '@emotion/react';
import useModal from '@hooks/useModal';
import { Button, Form, Input, Radio, Upload } from 'antd';
import { CheckboxValueType } from 'antd/lib/checkbox/Group';
import { RcFile } from 'antd/lib/upload';

import { AxiosError } from 'axios';
import { t } from 'i18next';
import { useState } from 'react';
import { useMutation } from 'react-query';
import AgreementCheckbox from '../../AgreementCheckbox';
import { message } from '@utils/message';
interface Props {
  visible: boolean;
  loading: boolean;
}

function CompanyStep({ visible, loading }: Props) {
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

  const normFile = (
    uploadFiles:
      | { file: RcFile; fileList: RcFile[] }
      | { file: RcFile; fileList: RcFile[] }[],
  ) => {
    if (Array.isArray(uploadFiles)) {
      return uploadFiles;
    }
    return uploadFiles && uploadFiles.fileList;
  };
  // 사업자번호 유효성 검사
  const bizNumValidator = (_: unknown, value: number) => {
    if (!value) {
      return Promise.reject(new Error('사업자 번호 입력해주세요'));
    }

    if (!checkDuplicated && form.getFieldValue('company_biz_num')) {
      return Promise.reject(new Error('사업자 번호 중복확인을 해주세요'));
    }

    return Promise.resolve();
  };

  //약관동의 유효성 검사
  const agreementValidator = (_: unknown, value: CheckboxValueType[] = []) => {
    if (
      !value.includes('service_use') ||
      !value.includes('personal_information')
    ) {
      return Promise.reject(new Error('필수항목을 체크해주세요.'));
    }

    return Promise.resolve();
  };
  return (
    <div style={{ display: visible ? 'block' : 'none' }}>
      {/*
       * 주소찾기 모달
       */}
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
        {({ getFieldValue }) => (
          <Form.Item
            label={t('biz num')}
            required
            name="company_biz_num"
            rules={[{ validator: bizNumValidator }]}
          >
            <Input
              onChange={() => {
                setCheckDuplicated(false);
              }}
              css={input}
              placeholder="ex. 123-45-67890"
              suffix={
                <CheckDuplicatedButton
                  onClick={() => {
                    dupCheckMutation.mutate({
                      biz_num: form.getFieldValue('company_biz_num'),
                    });
                  }}
                  isDuplicated={checkDuplicated}
                  isEmpty={!getFieldValue('company_biz_num')}
                >
                  {t('button.duplicatedCheck')}
                </CheckDuplicatedButton>
              }
            />
          </Form.Item>
        )}
      </Form.Item>

      <Form.Item
        rules={[{ required: true }]}
        label={t('biz address')}
        name="company_main_address"
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
              {t('button.findAddress')}
            </Button>
          }
        />
      </Form.Item>

      <Form.Item name="company_sub_address" label={t('biz detail address')}>
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
          <AddButton>{t('button.uploadFile')}</AddButton>
        </Upload>
      </Form.Item>

      <Form.Item
        name="company_store_url"
        label={t('store.url')}
        rules={[{ required: true }]}
      >
        <Input css={input} placeholder="ex. www.turtleshop.com" />
      </Form.Item>

      <Form.Item name="agreements" rules={[{ validator: agreementValidator }]}>
        <AgreementCheckbox
          onChange={(data: CheckboxValueType[]) => {
            form.setFieldsValue({
              ...form.getFieldsValue(),
              agreements: data,
            });
          }}
        />
      </Form.Item>

      <Form.Item noStyle shouldUpdate>
        {({ getFieldValue }) => (
          <Button
            htmlType="submit"
            disabled={
              !getFieldValue('company_biz_type') ||
              !getFieldValue('company_name') ||
              !getFieldValue('company_biz_num') ||
              !getFieldValue('company_main_address') ||
              !getFieldValue('company_biz_license_file') ||
              !getFieldValue('company_store_url') ||
              !(
                getFieldValue('agreements')?.includes('service_use') &&
                getFieldValue('agreements')?.includes('personal_information')
              ) ||
              !checkDuplicated
            }
            css={button}
            loading={loading}
          >
            {t('registration')}
          </Button>
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
  marginTop: 40,
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
