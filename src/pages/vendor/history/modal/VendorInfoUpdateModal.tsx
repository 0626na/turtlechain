import { t } from 'i18next';
import { Button, Form, Input, message, Upload } from 'antd';
import React, { useEffect } from 'react';

import {
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
import presetAPI from '@apis/presetAPI';
import bucketListAPI from '@apis/bucketListAPI';
import { AxiosError } from 'axios';

interface Props {
  visible: boolean;
  closeModal: () => void;
  selectedRow: Vendor;
}

function VendorInfoUpdateModal({ visible, closeModal, selectedRow }: Props) {
  const { store } = useStore();
  // const { isStoreSelected } = useStore();

  const [form] = Form.useForm();

  // 선택된 거래처

  // 건물정보 불러오기
  const getBuildingQuery = useQuery('getAdress', presetAPI.getBuilding, {
    enabled: !!visible,
    onSuccess: (data) => {
      console.log(data);
    },
  });

  // 은행정보 불러오기
  const getBankQuery = useQuery('getBank', presetAPI.getBank, {
    enabled: !!visible,
    onSuccess: (data) => {
      console.log(data);
    },
  });

  // 거래처 정보수정
  const createVendorMutation = useMutation(bucketListAPI.create, {
    onSuccess: () => {
      message.success('성공적으로 등록하였습니다.');
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
      mobile: selectedRow?.vendor_phone.phone,
      building: selectedRow?.ws_store_info.building,
      floor: selectedRow?.ws_store_info.floor,
      col: selectedRow?.ws_store_info.col,
      loc: selectedRow?.ws_store_info.loc,
      colLoc: `${selectedRow?.ws_store_info.col} ${selectedRow?.ws_store_info.loc}`,
      ext: selectedRow?.ws_store_info.ext,

      banks: {
        bank: selectedRow?.vendor_account.bank,
        account_number: selectedRow?.vendor_account.account_number,
        account_holder: selectedRow?.vendor_account.account_holder,
      },

      file: undefined,
    });
  };

  const normFile = (e: any) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };

  useEffect(() => {
    if (visible) fieldsFillIn();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
          css={formItemMarginBottom}
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
                    items={Object.keys(getBuildingQuery.data?.data ?? []).map(
                      (building) => ({ value: building, name: building }),
                    )}
                    placeholder="상가"
                    onChange={(building) => {
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
                  {() => {
                    return (
                      <Form.Item name="floor" noStyle>
                        <TurtleFormSelect
                          items={Object.keys(
                            getBuildingQuery.data?.data[
                              form.getFieldValue('building')
                            ] ?? [],
                          ).map((floor: string) => ({
                            value: floor,
                            name: floor,
                          }))}
                          placeholder="층"
                          onChange={(floor) => {
                            form.setFieldsValue({
                              ...form.getFieldsValue(),
                              colLoc: undefined,
                            });
                          }}
                        />
                      </Form.Item>
                    );
                  }}
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
                  {() => {
                    return (
                      <Form.Item name="colLoc" noStyle>
                        <TurtleFormSelect
                          items={(
                            getBuildingQuery.data?.data[
                              form.getFieldValue('building')
                            ]?.[form.getFieldValue('floor')] ?? []
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
                    );
                  }}
                </Form.Item>
              </div>
            </div>
          </Form.Item>

          <Form.Item name="ext" label={t('table.vendorEtcAddress')}>
            <TurtleFormInput placeholder="기타 주소를 입력해주세요" />
          </Form.Item>

          <Form.Item label={t('table.accountInfo')} required>
            <div css={flexGap}>
              <Form.Item name={['banks', 'bank']} noStyle>
                <TurtleFormSelect
                  placeholder="은행"
                  items={Object.values(getBankQuery.data?.data ?? []).map(
                    (bank: any) => ({ value: bank, name: bank }),
                  )}
                />
              </Form.Item>

              <Form.Item
                name={['banks', 'account_number']}
                rules={[{ required: true, message: '계좌번호를 입력해주세요' }]}
                noStyle
              >
                <TurtleFormInput placeholder="계좌번호" />
              </Form.Item>

              <Form.Item
                name={['banks', 'account_holder']}
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
              <Button css={createCodeButton}>
                <span css={createCodeFont}>사진 첨부하기</span>
              </Button>
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
                    banks: [form.getFieldValue('banks')],
                    floor: form.getFieldValue('floor') ?? '',
                    col: col ?? '',
                    loc: loc ?? '',
                    ext: form.getFieldValue('ext') ?? '',
                    file: form.getFieldValue('file')[0].originFileObj,
                  });
                });
              }}
            >
              {t('button.addVendor')}
            </PrimaryButton>
          </div>
        </Form>
      </TurtleContentModal>
    </>
  );
}

const formItemMarginBottom = css`
  .ant-form-item {
    margin-bottom: 16px;
  }
`;
const marginTop = css`
  padding-top: 44px;
`;

const flexGap = css`
  display: flex;
  gap: 4px;
`;

const createCodeButton = css`
  width: 113px;
  height: 36px;
  background: #f0f3f6;

  &:hover {
    background-color: #f0f3f6;
    color: #6b6d73;
  }

  &.ant-btn:focus {
    background-color: #f0f3f6;
    border-color: #f0f3f6;
  }
`;

const createCodeFont = css`
  font-weight: 700;
  color: #6b6d73;
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
