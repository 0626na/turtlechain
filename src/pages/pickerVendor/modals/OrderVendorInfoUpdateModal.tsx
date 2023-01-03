import React from 'react';
import { t } from 'i18next';
import { Form, Input, Upload } from 'antd';
import {
  AddButton,
  PrimaryButton,
  TurtleFormInput,
  TurtleFormSelect,
} from '@components/element';
import { TurtleContentModal } from '@components/combine';
import { css } from '@emotion/react';
import { useMutation, useQuery } from 'react-query';
import bucketListAPI from '@apis/bucketListAPI';
import { AxiosError } from 'axios';
import { RcFile } from 'antd/lib/upload';
import { message } from '@utils/message';
import usePreset from '@hooks/usePreset';
import wholesalerAPI, { WholesalerStore } from '@apis/wholesalerAPI';

interface Props {
  visible: boolean;
  closeModal: () => void;
  selectedRow: WholesalerStore;
}

function OrderVendorInfoUpdateModal({
  visible,
  closeModal,
  selectedRow,
}: Props) {
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

  useQuery(
    ['getWholesalerQuery', selectedRow?.id],
    () => wholesalerAPI.get({ storeId: selectedRow.id }),
    {
      enabled: !!selectedRow?.id && !!visible,
      onSuccess: (data) => {
        form.setFieldsValue({
          ws_store_id: data?.data.id,
          name: data?.data.name,
          tel: data?.data.phone,
          mobile: '',
          building: data?.data.building,
          floor: data?.data.floor,
          col: data?.data.col,
          loc: data?.data.loc,
          colLoc: `${data?.data.col} ${data?.data.loc}`,
          ext: data.data.ext,

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
        title={t('vendor.updateInfo')}
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
          <Form.Item name="ws_store_id" hidden>
            <Input hidden />
          </Form.Item>

          <Form.Item label={t('table.vendorName')} name="name" required>
            <TurtleFormInput placeholder={t('placeholder.input store name')} />
          </Form.Item>

          <Form.Item name="tel" label={t('table.wsStoreNumber')}>
            <TurtleFormInput
              placeholder={t('placeholder.input phone number')}
            />
          </Form.Item>

          <Form.Item label={t('table.mobile')} name="mobile">
            <TurtleFormInput
              placeholder={t('placeholder.input mobile number')}
            />
          </Form.Item>

          <Form.Item label={t('table.vendorAddress')} required>
            <div css={flexGap}>
              <div
                css={css`
                  flex-basis: 46.05%;
                `}
              >
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

          <Form.Item name="ext" label={t('table.vendorEtcAddress')}>
            <TurtleFormInput
              placeholder={t('placeholder.input other address')}
            />
          </Form.Item>

          <Form.Item label={t('table.accountInfo')}>
            <div css={flexGap}>
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

              <Form.Item name="account_number" noStyle>
                <TurtleFormInput
                  placeholder={t('placeholder.account number')}
                />
              </Form.Item>

              <Form.Item name="account_holder" noStyle>
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
              { required: true, message: t('message.please attach receipt') },
            ]}
          >
            <Upload
              css={upload}
              maxCount={1}
              accept=".jpg, .png, .jpeg, .pdf"
              beforeUpload={() => false}
            >
              <AddButton>{t('button.attachPicture')}</AddButton>
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
                        bank: form.getFieldValue('bank') ?? '',
                        account_number:
                          form.getFieldValue('account_number') ?? '',
                        account_holder:
                          form.getFieldValue('account_holder') ?? '',
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

export default OrderVendorInfoUpdateModal;
