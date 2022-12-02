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

import { Vendor } from '@apis/vendorAPI';

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

  // 거래처 선택후 폼에 채워넣기
  const fieldsFillIn = () => {
    form.setFieldsValue({
      ws_store_id: selectedRow?.ws_store_info.id,
      rt_store_id: store.selected?.id as number,
      name: selectedRow?.vendor_name,
      tel: selectedRow?.ws_store_info.phone,
      mobile: phoneMasking(selectedRow?.vendor_phone.phone),
      building: selectedRow?.ws_store_info.building,
      floor: selectedRow?.ws_store_info.floor,
      col: selectedRow?.ws_store_info.col,
      loc: selectedRow?.ws_store_info.loc,
      colLoc: `${selectedRow?.ws_store_info.col} ${selectedRow?.ws_store_info.loc}`,
      ext: selectedRow?.ws_store_info.ext,

      bank: selectedRow?.vendor_account.bank,
      account_number: selectedRow?.vendor_account.account_number,
      account_holder: selectedRow?.vendor_account.account_holder,

      file: undefined,
    });
  };

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

  useEffect(() => {
    if (visible) fieldsFillIn();
  }, [visible]);

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
          onFinish={() => {}}
          form={form}
          colon={false}
          labelCol={{ span: 7 }}
          wrapperCol={{ span: 17 }}
          onValuesChange={(prev, cur) => {
            console.log('prev', prev);
            console.log('cur', cur);
          }}
        >
          {/*  서버 전달용 데이터 */}
          <Form.Item name="rt_store_id" hidden>
            <Input hidden />
          </Form.Item>

          <Form.Item name="ws_store_id" hidden>
            <Input hidden />
          </Form.Item>

          <Form.Item label={t('table.vendorName')} name="name" required>
            <TurtleFormSearchInput disabled />
          </Form.Item>

          <Form.Item name="tel" label={t('table.wsStoreNumber')}>
            <TurtleFormInput disabled placeholder="매장번호를 입력해주세요" />
          </Form.Item>

          <Form.Item
            label={t('table.mobile')}
            name="mobile"
            rules={[{ required: true, message: '휴대전화번호를 입력해주세요' }]}
          >
            <TurtleFormInput placeholder="휴대전화번호를 입력해주세요" />
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
                    placeholder="상가"
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
                        placeholder="층"
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
                        placeholder="열/호"
                      />
                    </Form.Item>
                  )}
                </Form.Item>
              </div>
            </div>
          </Form.Item>

          <Form.Item name="ext" label={t('table.vendorEtcAddress')}>
            <TurtleFormInput placeholder="기타 주소를 입력해주세요" />
          </Form.Item>

          <Form.Item label={t('table.accountInfo')} required>
            <div css={flexGap}>
              <Form.Item name="bank" noStyle>
                <TurtleFormSelect
                  placeholder="은행"
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

              <Form.Item
                name="account_number"
                rules={[{ required: true, message: '계좌번호를 입력해주세요' }]}
                noStyle
              >
                <TurtleFormInput placeholder="계좌번호" />
              </Form.Item>

              <Form.Item
                name="account_holder"
                rules={[{ required: true, message: '예금주를 입력해주세요' }]}
                noStyle
              >
                <TurtleFormInput placeholder="예금주명" />
              </Form.Item>
            </div>
          </Form.Item>

          <Form.Item
            name="file"
            label="전자영수증"
            valuePropName="fileList"
            required={true}
            getValueFromEvent={normFile}
            rules={[
              { required: true, message: '전자영수증 사진을 첨부해주세요.' },
            ]}
          >
            <Upload
              css={upload}
              maxCount={1}
              accept=".jpg, .png, .jpeg, .pdf"
              beforeUpload={() => false}
            >
              <AddButton>사진 첨부하기</AddButton>
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
