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

import vendorAPI, { Vendor } from '@apis/vendorAPI';

import { css } from '@emotion/react';

import useStore from '@hooks/useStore';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery } from 'react-query';
import presetAPI from '@apis/presetAPI';

interface Props {
  visible: boolean;
  closeModal: () => void;
  selectedRow: Vendor;
}

function VendorInfoUpdateModal({ visible, closeModal, selectedRow }: Props) {
  const navigate = useNavigate();
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

  // 거래처 등록
  const createVendorMutation = useMutation(vendorAPI.create, {
    onSuccess: (data) => {
      if (data.data.fail_count > 0) {
        message.error('이미 등록된 거래처입니다.');
        return;
      }
      message.success('성공적으로 등록하였습니다.');
      form.resetFields();
      navigate('/vendor/list');
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

    // console.log(form.getFieldsValue());
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

  const handleColFilter = () => {
    // 불러온 col중에서 중복col을 제거하는 함수.
    const set = new Set<string>();
    (
      getBuildingQuery.data?.data[form.getFieldValue('building')]?.[
        form.getFieldValue('floor')
      ] ?? []
    ).forEach((colLoc: string) => {
      const [col] = colLoc.split(' ');
      set.add(col);
    });

    console.log(
      [...set].map((item) => ({
        value: item,
        name: item,
      })),
    );
    return [...set].map((item) => ({
      value: item,
      name: item,
    }));
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

          <Form.Item label={t('table.mobile')} name="mobile" required>
            <TurtleFormInput placeholder="휴대전화번호를 입력해주세요" />
          </Form.Item>

          <Form.Item label={t('table.vendorAddress')} required>
            <div css={flexGap}>
              <div
                css={css`
                  flex-basis: 40%;
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
                <Form.Item name="floor" noStyle>
                  <TurtleFormSelect
                    items={Object.keys(
                      getBuildingQuery.data?.data[
                        form.getFieldValue('building')
                      ] ?? [],
                    ).map((floor: string) => ({ value: floor, name: floor }))}
                    placeholder="층"
                    onChange={(floor) => {
                      form.setFieldsValue({
                        ...form.getFieldsValue(),
                        colLoc: undefined,
                        col: undefined,
                        loc: undefined,
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
                <Form.Item name="col" noStyle>
                  <TurtleFormSelect
                    items={handleColFilter()}
                    placeholder="열"
                    onChange={(col) => {
                      form.setFieldsValue({
                        ...form.getFieldsValue(),
                        colLoc: `${col} ${form.getFieldValue('loc')}`,
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
                <Form.Item name="loc" noStyle>
                  <TurtleFormSelect
                    items={(
                      getBuildingQuery.data?.data[
                        form.getFieldValue('building')
                      ]?.[form.getFieldValue('floor')] ?? []
                    ).map((colLoc: string) => {
                      const [, loc] = colLoc.split(' ');
                      return { value: loc, name: loc };
                    })}
                    placeholder="호"
                    onChange={(loc) => {
                      form.setFieldsValue({
                        ...form.getFieldsValue(),
                        colLoc: `${form.getFieldValue('col')} ${loc}`,
                      });
                    }}
                  />
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
            label="전자영수증"
            valuePropName="fileList"
            required={true}
            getValueFromEvent={normFile}
            rules={[
              { required: true, message: '전자영수증 사진을 첨부해주세요.' },
            ]}
          >
            <Upload
              listType="picture"
              maxCount={1}
              accept=".jpg, .png, .jpeg, .pdf"
              beforeUpload={() => false}
            >
              <Button size="small">파일 선택하기</Button>
            </Upload>
          </Form.Item>

          <div css={marginTop}>
            <PrimaryButton
              size="large"
              htmlType="submit"
              onClick={() => {
                form.validateFields().then(() => {
                  createVendorMutation.mutate({
                    ...form.getFieldsValue(),
                    type: 'update', //
                    banks: [form.getFieldValue('banks')],
                    floor: form.getFieldValue('floor') ?? '',
                    col: form.getFieldValue('col') ?? '', //
                    loc: form.getFieldValue('loc') ?? '', //
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

const flexGap = css`
  display: flex;
  gap: 4px;
`;

const marginTop = css`
  margin-top: 44px;
`;

export default VendorInfoUpdateModal;
