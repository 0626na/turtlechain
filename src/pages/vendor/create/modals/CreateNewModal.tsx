import { t } from 'i18next';
import { Form, Input, Switch, Upload } from 'antd';
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
import { useMutation, useQuery } from 'react-query';
import useVendorCart from '@hooks/useVendorCart';
import bucketListAPI from '@apis/bucketListAPI';
import presetAPI from '@apis/presetAPI';

interface Props {
  visible: boolean;
  closeModal: () => void;
}

function CreateNewModal({ visible, closeModal }: Props) {
  const { store } = useStore();
  const [form] = Form.useForm();

  const createMutation = useMutation(bucketListAPI.create, {
    onSuccess: () => {
      message.success('성공적으로 등록하였습니다.');
      // resetStates();
      closeModal();
    },
  });

  const getBuildingQuery = useQuery('getAdress', presetAPI.getBuilding, {
    enabled: visible,
  });

  const getBankQuery = useQuery('getBank', presetAPI.getBank, {
    enabled: visible,
  });

  const normFile = (e: any) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };

  // const resetStates = useCallback(() => {
  //   form.resetFields();
  //   setAddress({ building: '', floor: '' });
  // }, [form]);

  // useEffect(() => {
  //   resetStates();
  // }, [visible, resetStates]);

  // 거래처 선택후 폼에 채워넣기
  // const HandleFieldFillin = (ws_store: Wholesale) => {
  //   form.setFieldsValue({
  //     ...form.getFieldsValue(),
  //     vendor_code: undefined,
  //     isVatIncluded: false,
  //     memo: undefined,
  //     ws_store_info: {
  //       id: ws_store.id,
  //       name: ws_store.name,
  //       phone: ws_store.phone,
  //       address: `${ws_store.building} ${ws_store.floor}${
  //         ws_store.floor ? '층' : ''
  //       } ${ws_store.col} ${ws_store.loc} ${ws_store.ext}`,
  //       store_phone: {
  //         id: ws_store.store_phone[0].id,
  //         phone: ws_store.store_phone[0].phone,
  //       },
  //       store_account: {
  //         id: ws_store.store_account[0].id,
  //         account_number: ws_store.store_account[0].account_number,
  //         account_holder: ws_store.store_account[0].account_holder,
  //         bank: ws_store.store_account[0].bank,
  //       },
  //       building: ws_store.building,
  //       floor: ws_store.floor,
  //       loc: ws_store.loc,
  //       col: ws_store.col,
  //       loc_col: `${ws_store.loc}/${ws_store.col}`,
  //       ext: ws_store.ext,
  //     },
  //     company: {
  //       name: ws_store.company[0]?.name,
  //       biz_num: ws_store.company[0]?.biz_num,
  //       owner: ws_store.company[0]?.owner,
  //     },
  //   });
  // };

  useEffect(() => {
    if (visible) return;
    form.resetFields();
  }, [visible, form]);

  return (
    <>
      <TurtleContentModal
        title={t('vendor.addSingle')}
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
          initialValues={{}}
          onFinish={(value) => {
            // createMutation.mutate({
            //   type: 'create',
            //   name: value.name,
            //   tel: value.tel,
            //   mobile: value.mobile,
            //   banks: [value.banks],
            //   building: value.address.building,
            //   floor: value.address.floor,
            //   col: value.address.col,
            //   loc: value.address.loc,
            //   colLoc: `${value.address.col}` + `${value.address.loc}`,
            //   ext: value.ext,
            //   biz_name: value.biz_name,
            //   biz_num: value.biz_num,
            //   biz_owner: value.biz_num,
            //   file: "",
            // });
          }}
        >
          <Form.Item
            label={t('table.vendorName')}
            name="name"
            rules={[{ required: true, message: '거래처명을 입력해주세요' }]}
          >
            <TurtleFormInput placeholder="거래처명을 입력해주세요" />
          </Form.Item>

          <Form.Item name="tel" label={t('table.wsStoreNumber')}>
            <TurtleFormInput placeholder="매장번호를 입력해주세요" />
          </Form.Item>

          <Form.Item
            label={t('table.mobile')}
            name="mobile"
            rules={[{ required: true, message: '거래처명을 입력해주세요' }]}
          >
            <TurtleFormInput placeholder="휴대전화번호를 입력해주세요" />
          </Form.Item>

          <Form.Item label={t('table.vendorAddress')} required>
            <div css={flexGap}>
              <div css={{ flexBasis: '50%' }}>
                <Form.Item name={['address', 'building']} noStyle>
                  <TurtleFormSelect placeholder="상가" />
                </Form.Item>
              </div>
              <div css={{ flexBasis: '20%' }}>
                <Form.Item name={['address', 'floor']} noStyle>
                  <TurtleFormInput placeholder="층" />
                </Form.Item>
              </div>
              <div css={{ flexBasis: '30%' }}>
                <Form.Item name={['address', 'col']} noStyle>
                  <TurtleFormInput placeholder="열" />
                </Form.Item>
              </div>
              <div css={{ flexBasis: '30%' }}>
                <Form.Item name={['address', 'loc']} noStyle>
                  <TurtleFormInput placeholder="호" />
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
                <TurtleFormSelect placeholder="은행" />
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
            name="company_biz_license_file"
            label={t('biz license')}
            valuePropName="fileList"
            getValueFromEvent={normFile}
            rules={[
              { required: true, message: '사업자 등록증 업로드해 주세요' },
            ]}
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
