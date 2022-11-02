import { t } from 'i18next';
import { Form, Input, Switch } from 'antd';
import React, { useEffect } from 'react';
import { message } from '@utils/message';
import {
  AddButton,
  PrimaryButton,
  TurtleDivider,
  TurtleFormInput,
  TurtleFormSearchInput,
  TurtleFormSelect,
} from '@components/element';
import { TurtleContentModal } from '@components/combine';

import vendorAPI, { Wholesale } from '@apis/vendorAPI';
import useModal from '@hooks/useModal';
import { css } from '@emotion/react';
import SearchWsStoreModal from './SearchWsStoreModal';
import useStore from '@hooks/useStore';
import { useQuery } from 'react-query';
import useVendorCart from '@hooks/useVendorCart';

interface Props {
  visible: boolean;
  closeModal: () => void;
}

function AddSingleModal({ visible, closeModal }: Props) {
  const { store } = useStore();
  const { addSingleVendor } = useVendorCart();
  const { isStoreSelected } = useStore();

  const [form] = Form.useForm();
  const [vendorModalVisible, openVendorModal, closeVendorModal] = useModal();

  //거래처코드 생성
  const getVendorCodeQuery = useQuery(
    'getVendorCode',
    () =>
      vendorAPI.getCode({
        rt_store_id: store.selected?.id as number,
        ws_store_id: form.getFieldValue('ws_store_info')?.id,
      }),
    {
      enabled: false,
      onSuccess: (data) => {
        form.setFieldsValue({
          ...form.getFieldsValue(),
          vendor_code: data.data,
        });
      },
    },
  );

  // 거래처 선택후 폼에 채워넣기
  const HandleFieldFillin = (ws_store: Wholesale) => {
    form.setFieldsValue({
      ...form.getFieldsValue(),
      vendor_code: undefined,
      isVatIncluded: false,
      memo: undefined,
      ws_store_info: {
        id: ws_store.id,
        name: ws_store.name,
        phone: ws_store.phone,
        address: `${ws_store.building} ${ws_store.floor}${
          ws_store.floor ? '층' : ''
        } ${ws_store.col} ${ws_store.loc} ${ws_store.ext}`,
        store_phone: {
          id: ws_store.store_phone[0].id,
          phone: ws_store.store_phone[0].phone,
        },
        store_account: {
          id: ws_store.store_account[0].id,
          account_number: ws_store.store_account[0].account_number,
          account_holder: ws_store.store_account[0].account_holder,
          bank: ws_store.store_account[0].bank,
        },
        building: ws_store.building,
        floor: ws_store.floor,
        loc: ws_store.loc,
        col: ws_store.col,
        loc_col: `${ws_store.loc}/${ws_store.col}`,
        ext: ws_store.ext,
      },
      company: {
        name: ws_store.company[0]?.name,
        biz_num: ws_store.company[0]?.biz_num,
        owner: ws_store.company[0]?.owner,
      },
    });
  };

  // 코드 만들기 Button 클릭
  const clickCreateVendorCode = () => {
    if (!isStoreSelected()) {
      return;
    }

    if (!form.getFieldValue('ws_store_info')?.name) {
      message.warn('거래처를 선택해 주세요');
      return;
    }

    getVendorCodeQuery.refetch();
  };

  useEffect(() => {
    if (!visible) form.resetFields();
  }, [visible]);

  return (
    <>
      {/*
       * 거래처 검색 모달
       */}
      <SearchWsStoreModal
        visible={vendorModalVisible}
        closeModal={closeVendorModal}
        onFieldFillin={HandleFieldFillin}
      />

      <TurtleContentModal
        title={t('vendor.addSingle')}
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
            addSingleVendor({
              vendor_code: value.vendor_code,
              name: value.ws_store_info.name,
              address: value.ws_store_info.address,
              match_type: 'success',
              ws_store_info: [
                {
                  ...value.ws_store_info,
                  store_account: [{ ...value.ws_store_info.store_account }],
                  store_phone: [{ ...value.ws_store_info.store_phone }],
                },
              ],
              memo: value.memo,
              useVendorName: value.ws_store_info.name,
              isVatIncluded: value.isVatIncluded,
            }) && closeModal();
          }}
        >
          <Form.Item name={['ws_store_info', 'id']} hidden>
            <TurtleFormSearchInput />
          </Form.Item>
          <Form.Item
            label={t('table.vendorName')}
            name={['ws_store_info', 'name']}
            rules={[{ required: true, message: '거래처명을 입력해주세요' }]}
          >
            <TurtleFormSearchInput
              readOnly
              onClick={openVendorModal}
              onSearch={openVendorModal}
              placeholder="거래처명을 입력해주세요"
            />
          </Form.Item>
          <Form.Item
            name={['ws_store_info', 'phone']}
            label={t('table.wsStoreNumber')}
          >
            <TurtleFormInput disabled placeholder="매장번호를 입력해주세요" />
          </Form.Item>
          <Form.Item name={['ws_store_info', 'store_phone', 'id']} hidden>
            <TurtleFormInput />
          </Form.Item>
          <Form.Item
            label={t('table.mobile')}
            name={['ws_store_info', 'store_phone', 'phone']}
            required
          >
            <TurtleFormInput
              disabled
              placeholder="휴대전화번호를 입력해주세요"
            />
          </Form.Item>
          <Form.Item label={t('table.vendorAddress')} required>
            <div css={flexGap}>
              <div css={{ flexBasis: '50%' }}>
                <Form.Item name={['ws_store_info', 'address']} hidden>
                  <TurtleFormSelect />
                </Form.Item>
                <Form.Item name={['ws_store_info', 'building']} noStyle>
                  <TurtleFormSelect placeholder="상가" disabled />
                </Form.Item>
              </div>
              <div css={{ flexBasis: '20%' }}>
                <Form.Item name={['ws_store_info', 'floor']} noStyle>
                  <TurtleFormInput placeholder="층" disabled />
                </Form.Item>
              </div>
              <div css={{ flexBasis: '30%' }}>
                <Form.Item name={['ws_store_info', 'loc_col']} noStyle>
                  <TurtleFormInput placeholder="열/호" disabled />
                </Form.Item>
              </div>
            </div>
          </Form.Item>
          <Form.Item
            name={['ws_store_info', 'ext']}
            label={t('table.vendorEtcAddress')}
          >
            <TurtleFormInput placeholder="기타 주소를 입력해주세요" disabled />
          </Form.Item>
          <Form.Item label={t('table.accountInfo')} required>
            <div css={flexGap}>
              <Form.Item name={['ws_store_info', 'store_account', 'id']} hidden>
                <TurtleFormSelect />
              </Form.Item>
              <Form.Item
                name={['ws_store_info', 'store_account', 'bank']}
                noStyle
              >
                <TurtleFormSelect placeholder="은행" disabled />
              </Form.Item>

              <Form.Item
                name={['ws_store_info', 'store_account', 'account_number']}
                noStyle
              >
                <TurtleFormInput placeholder="계좌번호" disabled />
              </Form.Item>

              <Form.Item
                name={['ws_store_info', 'store_account', 'account_holder']}
                noStyle
              >
                <TurtleFormInput placeholder="예금주명" disabled />
              </Form.Item>
            </div>
          </Form.Item>
          <Form.Item
            label={t('table.vendorCode')}
            name="vendor_code"
            rules={[{ required: true, message: '거래처코드를 입력해주세요' }]}
          >
            <TurtleFormInput placeholder="거래처코드를 입력해주세요" disabled />
          </Form.Item>
          <div css={flexEnd}>
            <AddButton
              disabled={
                !!form.getFieldValue('vendor_code') ||
                !form.getFieldValue('ws_store_info')?.name
              }
              onClick={clickCreateVendorCode}
            >
              코드만들기
            </AddButton>
          </div>
          <TurtleDivider marginBottom={37} marginTop={32} />
          <Form.Item
            name="isVatIncluded"
            label={t('table.vatIncluded')}
            valuePropName="checked"
            required
          >
            <Switch css={$switch} />
          </Form.Item>

          <Form.Item name={['company', 'name']} label={t('table.wsStoreName')}>
            <TurtleFormInput placeholder="상호명을 입력해주세요" disabled />
          </Form.Item>
          <Form.Item
            name={['company', 'biz_num']}
            label={t('table.wsCompanyNum')}
          >
            <TurtleFormInput
              placeholder="사업자 번호를 입력해주세요"
              disabled
            />
          </Form.Item>
          <Form.Item name={['company', 'owner']} label={t('table.wsOwner')}>
            <TurtleFormInput placeholder="대표자명을 입력해주세요" disabled />
          </Form.Item>
          <Form.Item name="memo" label={t('table.memo')}>
            <TurtleFormInput placeholder="메모를 입력해주세요" />
          </Form.Item>

          <Form.Item noStyle shouldUpdate>
            {({ getFieldValue }) => (
              <div css={marginTop}>
                <PrimaryButton
                  size="large"
                  htmlType="submit"
                  disabled={
                    !getFieldValue('ws_store_info')?.name ||
                    !getFieldValue('vendor_code')
                  }
                >
                  {t('button.addVendor')}
                </PrimaryButton>
              </div>
            )}
          </Form.Item>
        </Form>
      </TurtleContentModal>
    </>
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

export default AddSingleModal;
