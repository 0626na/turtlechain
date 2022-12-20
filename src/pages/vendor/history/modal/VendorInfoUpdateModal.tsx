import { t } from 'i18next';
import { Form, Input, Upload } from 'antd';
import React, { useEffect } from 'react';

import {
  AddButton,
  PrimaryButton,
  TurtleFormInput,
  TurtleFormSearchInput,
  TurtleFormSelect,
} from '@components/element';
import { TurtleContentModal } from '@components/combine';

import vendorAPI, { Vendor } from '@apis/vendorAPI';

import { css } from '@emotion/react';

import useStore from '@hooks/useStore';

import { useMutation, useQuery } from 'react-query';
import bucketListAPI from '@apis/bucketListAPI';
import { AxiosError } from 'axios';
import { RcFile } from 'antd/lib/upload';
import { message } from '@utils/message';
import usePreset from '@hooks/usePreset';
import { phoneMasking } from '@utils/phone';
interface Props {
  visible: boolean;
  closeModal: () => void;
  selectedRow: Vendor;
}

function VendorInfoUpdateModal({ visible, closeModal, selectedRow }: Props) {
  const { store } = useStore();
  const [form] = Form.useForm();
  const { buildingData, bankData } = usePreset();

  // 거래처 정보수정
  const createVendorMutation = useMutation(bucketListAPI.create, {
    onSuccess: () => {
      message.success(t('message.success update vendor request'));
      closeModal();
    },
    onError: (error: AxiosError) => {
      message.warn(error.response?.data.msg);
    },
  });

  const getVendorQuery = useQuery(
    ['getVendorQuery', selectedRow?.id],
    () => vendorAPI.get({ id: selectedRow.id }),
    {
      enabled: !!selectedRow?.id && !!visible,
      onSuccess: (data) => {
        form.setFieldsValue({
          ws_store_id: data?.ws_store_info.id,
          rt_store_id: store.selected?.id as number,
          name: data?.vendor_name,
          tel: data?.ws_store_info.phone,
          mobile: phoneMasking(data?.vendor_phone.phone),
          building: data?.ws_store_info.building,
          floor: data?.ws_store_info.floor,
          col: data?.ws_store_info.col,
          loc: data?.ws_store_info.loc,
          colLoc: `${data?.ws_store_info.col} ${data?.ws_store_info.loc}`,
          ext: data?.ws_store_info.ext,

          bank: data?.vendor_account.bank,
          account_number: data?.vendor_account.account_number,
          account_holder: data?.vendor_account.account_holder,

          file: undefined,
        });
      },
    },
  );

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

  return (
    <>
      <TurtleContentModal
        title={t('request for information Update')}
        visible={visible}
        onClose={() => {
          form.resetFields();
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
          {/*  서버 전달용 데이터 */}
          <Form.Item name="rt_store_id" hidden>
            <Input hidden />
          </Form.Item>

          <Form.Item name="ws_store_id" hidden>
            <Input hidden />
          </Form.Item>

          {/*거래처명*/}
          <Form.Item label={t('table.vendorName')} name="name" required>
            <TurtleFormSearchInput disabled />
          </Form.Item>
          {/* 매장번호 */}
          <Form.Item name="tel" label={t('table.wsStoreNumber')}>
            <TurtleFormInput
              disabled
              placeholder={t('placeholder.input phone number')}
            />
          </Form.Item>
          {/* 휴대전화 번호 */}
          <Form.Item
            label={t('table.mobile')}
            name="mobile"
            rules={[
              { required: true, message: t('please input mobile number') },
            ]}
          >
            <TurtleFormInput
              placeholder={t('placeholder.input mobile number')}
            />
          </Form.Item>
          {/* 거래처 주소 */}
          <Form.Item label={t('table.vendorAddress')} required>
            <div css={flexGap}>
              <div
                css={css`
                  flex-basis: 46.05%;
                `}
              >
                {/* 빌딩 */}
                <Form.Item name="building" noStyle>
                  <TurtleFormSelect
                    items={Object.keys(buildingData?.data ?? []).map(
                      (building) => ({ value: building, name: building }),
                    )}
                    placeholder={t('placeholder.building')}
                    onChange={() => {
                      form.setFieldsValue({
                        ...form.getFieldsValue(),
                        floor: undefined,
                        colLoc: undefined,
                      });
                    }}
                  />
                </Form.Item>
              </div>
              <div
                css={css`
                  flex-basis: 30%;
                `}
              >
                {/* 층 */}
                <Form.Item
                  noStyle
                  shouldUpdate={(prevValues, curValues) =>
                    prevValues.additional !== curValues.additional
                  }
                >
                  {() => (
                    <Form.Item name="floor" noStyle>
                      <TurtleFormSelect
                        items={Object.keys(
                          buildingData?.data[form.getFieldValue('building')] ??
                            [],
                        ).map((floor: string) => ({
                          value: floor,
                          name: floor,
                        }))}
                        placeholder={t('placeholder.floor')}
                        onChange={() => {
                          form.setFieldsValue({
                            ...form.getFieldsValue(),
                            colLoc: undefined,
                          });
                        }}
                      />
                    </Form.Item>
                  )}
                </Form.Item>
              </div>

              <div
                css={css`
                  flex-basis: 30%;
                `}
              >
                {/* 열-호 */}
                <Form.Item
                  noStyle
                  shouldUpdate={(prevValues, curValues) =>
                    prevValues.additional !== curValues.additional
                  }
                >
                  {() => (
                    <Form.Item name="colLoc" noStyle>
                      <TurtleFormSelect
                        items={(
                          buildingData?.data[form.getFieldValue('building')]?.[
                            form.getFieldValue('floor')
                          ] ?? []
                        ).map((colLoc: string) => {
                          const [col, loc] = colLoc.split(' ');
                          return {
                            value: `${col} ${loc}`,
                            name: `${col} ${loc}`,
                          };
                        })}
                        placeholder={t('placeholder.col loc')}
                      />
                    </Form.Item>
                  )}
                </Form.Item>
              </div>
            </div>
          </Form.Item>
          {/*기타주소 */}
          <Form.Item name="ext" label={t('table.otherAddress')}>
            <TurtleFormInput
              placeholder={t('placeholder.input other address')}
            />
          </Form.Item>
          {/* 계좌정보 */}
          <Form.Item label={t('table.accountInfo')} required>
            <div css={flexGap}>
              {/* 은행 */}
              <Form.Item name="bank" noStyle>
                <TurtleFormSelect
                  placeholder={t('placeholder.bank')}
                  items={
                    Object.values(bankData?.data ?? []).map((bank) => ({
                      value: bank,
                      name: bank,
                    })) as {
                      value: string;
                      name: string;
                      icon?: React.ReactNode;
                    }[]
                  }
                />
              </Form.Item>
              {/* 계좌번호 */}
              <Form.Item
                name="account_number"
                rules={[
                  {
                    required: true,
                    message: t('please input bank account number'),
                  },
                ]}
                noStyle
              >
                <TurtleFormInput
                  placeholder={t('placeholder.account number')}
                />
              </Form.Item>
              {/* 예금주 */}
              <Form.Item
                name="account_holder"
                rules={[
                  { required: true, message: t('please input account holder') },
                ]}
                noStyle
              >
                <TurtleFormInput
                  placeholder={t('placeholder.account holder name')}
                />
              </Form.Item>
            </div>
          </Form.Item>

          <Form.Item
            name="file"
            label={t('table.receipt')}
            valuePropName="fileList"
            required={true}
            getValueFromEvent={normFile}
            rules={[
              { required: true, message: t('please attach your receipt') },
            ]}
          >
            <Upload
              css={upload}
              maxCount={1}
              accept=".jpg, .png, .jpeg, .pdf"
              beforeUpload={() => false}
            >
              <AddButton>
                {t('add a copy of your receipt or invoice')}
              </AddButton>
            </Upload>
          </Form.Item>

          <div css={marginTop}>
            <PrimaryButton
              size="large"
              htmlType="submit"
              onClick={() => {
                form.validateFields().then(() => {
                  const [col, loc] = (form.getFieldValue('colLoc') ?? '').split(
                    ' ',
                  );

                  createVendorMutation.mutate({
                    ...form.getFieldsValue(),
                    type: 'update',
                    banks: [
                      {
                        bank: form.getFieldValue('bank'),
                        account_number: form.getFieldValue('account_number'),
                        account_holder: form.getFieldValue('account_holder'),
                      },
                    ],
                    floor: form.getFieldValue('floor') ?? '',
                    col: col ?? '',
                    loc: loc ?? '',
                    ext: form.getFieldValue('ext') ?? '',
                    file: form.getFieldValue('file')[0].originFileObj,
                  });
                });
              }}
            >
              {t('button.updateVendor')}
            </PrimaryButton>
          </div>
        </Form>
      </TurtleContentModal>
    </>
  );
}

const marginTop = css`
  padding-top: 44px;
`;

const flexGap = css`
  display: flex;
  gap: 4px;
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

export default VendorInfoUpdateModal;
