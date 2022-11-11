import { t } from 'i18next';
import { Form, Upload } from 'antd';
import React, { useEffect } from 'react';
import { message } from '@utils/message';
import {
  AddButton,
  PrimaryButton,
  TurtleDivider,
  TurtleFormInput,
  TurtleFormSelect,
} from '@components/element';
import { TurtleContentModal } from '@components/combine';

import { css } from '@emotion/react';

import useStore from '@hooks/useStore';
import { useMutation } from 'react-query';

import bucketListAPI from '@apis/bucketListAPI';
import { RcFile } from 'antd/lib/upload';
import { phonePattern } from '@utils/pattern';
import usePreset from '@hooks/usePreset';

interface Props {
  closeModal: () => void;
  visible: boolean;
}

function CreateNewModal({ visible, closeModal }: Props) {
  const { store } = useStore();
  const [form] = Form.useForm();
  const { buildingData, bankData } = usePreset();

  const createMutation = useMutation(bucketListAPI.create, {
    onSuccess: () => {
      message.success(t('message.success create vendor request'));
      closeModal();
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

  const mobileValidator = (_: unknown, value: string) => {
    if (!value) {
      return Promise.reject(new Error('휴대전화 번호를 입력해주세요.'));
    }

    if (!phonePattern.test(value)) {
      return Promise.reject(new Error('유효하지 않은 형식 입니다.'));
    }

    return Promise.resolve();
  };

  const handleFloorList = (building: string) =>
    Object.keys(buildingData?.data[building] ?? {}).map((floor) => ({
      value: floor,
      name: floor,
    }));

  const handleColLocList = (building: string, floor: string) =>
    (buildingData?.data[building]?.[floor] ?? []).map((colLoc: string) => ({
      value: colLoc,
      name: colLoc,
    }));

  const bankList = Object.values(bankData?.data ?? []).map((bank) => ({
    value: String(bank),
    name: String(bank),
  }));

  const buildingList = Object.keys(buildingData?.data ?? {}).map(
    (building) => ({
      name: building,
      value: building,
    }),
  );

  useEffect(() => {
    if (!visible) form.resetFields();
  }, [visible]);

  return (
    <TurtleContentModal
      title={'신규거래처 요청'}
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
        onFinish={(value) => {
          createMutation.mutate({
            rt_store_id: store.selected?.id,
            type: 'create',
            name: value.name,
            tel: value.tel ?? '',
            mobile: value.mobile,
            banks: [value.banks],
            building: value.address.building,
            floor: value.address.floor ?? '',
            col: value.address.colLoc.split('')[0] ?? '',
            loc: value.address.colLoc.split('')[1] ?? '',
            ext: value.ext ?? '',
            biz_name: value.biz_name,
            biz_num: value.biz_num,
            biz_owner: value.biz_num,
            file: value.file[0].originFileObj,
          });
        }}
      >
        <Form.Item label={t('table.vendorName')} name="name" required>
          <TurtleFormInput placeholder="거래처명을 입력해주세요" />
        </Form.Item>

        <Form.Item name="tel" label={t('table.wsStoreNumber')}>
          <TurtleFormInput placeholder="매장번호를 입력해주세요" />
        </Form.Item>

        <Form.Item
          label={t('table.mobile')}
          name="mobile"
          validateTrigger="onBlur"
          rules={[{ required: true, validator: mobileValidator }]}
        >
          <TurtleFormInput placeholder="휴대전화 번호를 입력해주세요" />
        </Form.Item>

        <Form.Item label={t('table.vendorAddress')} required>
          <div css={flexGap}>
            <div css={{ flexBasis: '50%' }}>
              <Form.Item noStyle shouldUpdate>
                {({ getFieldValue, setFieldsValue, getFieldsValue }) => (
                  <Form.Item name={['address', 'building']} noStyle>
                    <TurtleFormSelect
                      onChange={() => {
                        setFieldsValue({
                          ...getFieldsValue,
                          address: {
                            ...getFieldValue('address'),
                            floor: undefined,
                            colLoc: undefined,
                          },
                        });
                      }}
                      items={buildingList}
                      placeholder="상가"
                      showSearch
                    />
                  </Form.Item>
                )}
              </Form.Item>
            </div>

            <div css={{ flexBasis: '20%' }}>
              <Form.Item noStyle shouldUpdate>
                {({ getFieldValue, getFieldsValue, setFieldsValue }) => (
                  <Form.Item name={['address', 'floor']} noStyle>
                    <TurtleFormSelect
                      onChange={() => {
                        setFieldsValue({
                          ...getFieldsValue,
                          address: {
                            ...getFieldValue('address'),
                            colLoc: undefined,
                          },
                        });
                      }}
                      items={handleFloorList(
                        getFieldValue('address')?.building,
                      )}
                      placeholder="층"
                      showSearch
                    />
                  </Form.Item>
                )}
              </Form.Item>
            </div>

            <div css={{ flexBasis: '30%' }}>
              <Form.Item noStyle shouldUpdate>
                {({ getFieldValue }) => (
                  <Form.Item name={['address', 'colLoc']} noStyle>
                    <TurtleFormSelect
                      items={handleColLocList(
                        getFieldValue('address')?.building,
                        getFieldValue('address')?.floor,
                      )}
                      placeholder="열/호"
                      showSearch
                    />
                  </Form.Item>
                )}
              </Form.Item>
            </div>
          </div>
        </Form.Item>

        <Form.Item
          name={['address', 'ext']}
          label={t('table.vendorEtcAddress')}
        >
          <TurtleFormInput placeholder="기타 주소를 입력해주세요" />
        </Form.Item>

        <Form.Item label={t('table.accountInfo')} required>
          <div css={flexGap}>
            <Form.Item name={['banks', 'bank']} noStyle>
              <TurtleFormSelect
                showSearch
                items={bankList}
                placeholder="은행"
              />
            </Form.Item>

            <Form.Item name={['banks', 'account_number']} noStyle>
              <TurtleFormInput placeholder="계좌번호" />
            </Form.Item>

            <Form.Item name={['banks', 'account_holder']} noStyle>
              <TurtleFormInput placeholder="예금주명" />
            </Form.Item>
          </div>
        </Form.Item>

        <Form.Item
          name="file"
          label={'전자영수증'}
          valuePropName="fileList"
          getValueFromEvent={normFile}
          required
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

        <TurtleDivider marginBottom={37} marginTop={32} />

        <Form.Item name="biz_name" label={t('table.wsStoreName')}>
          <TurtleFormInput placeholder="상호명을 입력해주세요" />
        </Form.Item>
        <Form.Item name="biz_num" label={t('table.wsCompanyNum')}>
          <TurtleFormInput placeholder="사업자 번호를 입력해주세요" />
        </Form.Item>
        <Form.Item name="biz_owner" label={t('table.wsOwner')}>
          <TurtleFormInput placeholder="대표자명을 입력해주세요" />
        </Form.Item>

        <Form.Item noStyle shouldUpdate>
          {({ getFieldValue }) => (
            <div css={marginTop}>
              <PrimaryButton
                size="large"
                htmlType="submit"
                disabled={
                  !getFieldValue('name') ||
                  !getFieldValue('mobile') ||
                  !getFieldValue('address')?.building ||
                  !getFieldValue('banks')?.bank ||
                  !getFieldValue('banks')?.account_number ||
                  !getFieldValue('banks')?.account_holder ||
                  !getFieldValue('file')
                }
              >
                {t('button.addVendorRequest')}
              </PrimaryButton>
            </div>
          )}
        </Form.Item>
      </Form>
    </TurtleContentModal>
  );
}

const $switch = css`
  min-width: 30px;
  width: 30px;
  height: 20px;

  &.ant-switch-checked {
    background-color: #1a66f9;
  }

  .ant-switch-handle {
    width: 14px;
    height: 14px;
  }
`;

const flexEnd = css`
  display: flex;
  justify-content: end;
`;

const flexGap = css`
  display: flex;
  gap: 4px;
`;

const marginTop = css`
  margin-top: 44px;
`;

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

export default CreateNewModal;
