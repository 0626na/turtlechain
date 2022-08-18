import { t } from 'i18next';
import { useCallback, useEffect, useState } from 'react';
import {
  Form,
  Input,
  message,
  Popconfirm,
  Row,
  Select,
  Tooltip,
  Upload,
} from 'antd';
import { useRecoilValue } from 'recoil';
import { VendorShow } from '@apis/vendorAPI';
import {
  TurtleButton,
  TurtleButtonSub,
  TurtleInput,
  TurtleModal,
} from '@components/common';
import { useMutation, useQuery } from 'react-query';
import { storeState } from '@store/storeState';
import bucketListAPI from '@apis/bucketListAPI';
import presetAPI from '@apis/presetAPI';
import { AxiosError } from 'axios';

interface Props {
  visible: boolean;
  onCloseModal: () => void;
  selectedRow: VendorShow;
}

function UpdateVendorInfoModal({ visible, onCloseModal, selectedRow }: Props) {
  const [form] = Form.useForm();
  const store = useRecoilValue(storeState);
  const [address, setAddress] = useState({ building: '', floor: '' });

  const getBuildingQuery = useQuery('getAdress', presetAPI.getBuilding, {
    enabled: visible,
  });

  const getBankQuery = useQuery('getBank', presetAPI.getBank, {
    enabled: visible,
  });

  const createQuery = useMutation('createBucketList', bucketListAPI.create, {
    onSuccess: () => {
      message.success('성공적으로 등록하였습니다.');
      resetStates();
      onCloseModal();
    },
    onError: (error: AxiosError) => {
      message.warn(error.response?.data.msg);
    },
  });

  const resetStates = useCallback(() => {
    form.setFieldsValue({
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
      ws_store_id: selectedRow?.ws_store_info.id,
      rt_store_id: store.id!,
      file: undefined,
    });
    setAddress({
      building: selectedRow?.ws_store_info.building ?? '',
      floor: selectedRow?.ws_store_info.floor ?? '',
    });
  }, [form, selectedRow, store.id]);

  useEffect(() => {
    resetStates();
  }, [visible, resetStates]);

  const normFile = (e: any) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };

  return (
    <TurtleModal
      centered
      width="520px"
      title={t('vendor.request update')}
      visible={visible}
      onCancel={onCloseModal}
      footer={false}
      forceRender
    >
      <Form //
        layout="horizontal"
        form={form}
        colon={false}
        labelCol={{ span: 7 }}
        wrapperCol={{ span: 16 }}
      >
        <Form.Item name="ws_store_id" hidden>
          <Input hidden />
        </Form.Item>
        <Form.Item name="rt_store_id" hidden>
          <Input hidden />
        </Form.Item>
        <TurtleInput // 거래처명 검색 Input
          name="name"
          label={t('vendor.name')}
          placeholder={t('placeholder.vendor name')}
          required={true}
          disabled
        />
        <Form.Item // 거래처 매장번호 Input
          name="tel"
          label={t('vendor.phone')}
          required={true}
        >
          <Input placeholder={t('placeholder.phone')} disabled />
        </Form.Item>
        <TurtleInput // 거래처 휴대번호 Input
          name="mobile"
          label={t('vendor.store phone')}
          placeholder={t('placeholder.store phone')}
          required={true}
        />

        <Form.Item label={t('vendor.address')} required={true}>
          <Input.Group compact>
            <Form.Item
              name="building"
              label="상가명"
              noStyle
              rules={[{ required: true }]}
            >
              <Select
                placeholder="상가명"
                style={{ width: '40%' }}
                loading={getBuildingQuery.isLoading}
                onChange={(building) => {
                  setAddress({ building, floor: '' });
                  form.setFieldsValue({
                    ...form.getFieldsValue(),
                    floor: undefined,
                    colLoc: undefined,
                  });
                }}
              >
                {Object.keys(getBuildingQuery.data?.data ?? []).map(
                  (building) => (
                    <Select.Option key={building} value={building}>
                      {building}
                    </Select.Option>
                  ),
                )}
              </Select>
            </Form.Item>
            <Form.Item
              name="floor"
              label="층"
              noStyle
              rules={[{ required: true }]}
            >
              <Select
                placeholder="층"
                style={{ width: '25%' }}
                onChange={(floor) => {
                  setAddress((address) => ({ ...address, floor }));
                  form.setFieldsValue({
                    ...form.getFieldsValue(),
                    colLoc: undefined,
                  });
                }}
              >
                {Object.keys(
                  getBuildingQuery.data?.data[address.building] ?? [],
                ).map((floor: string) => (
                  <Select.Option key={floor} value={floor}>
                    {floor}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              name="colLoc"
              noStyle
              label="열/호"
              rules={[{ required: true }]}
            >
              <Select placeholder="열/호" style={{ width: '35%' }}>
                {(
                  getBuildingQuery.data?.data[address.building]?.[
                    address.floor
                  ] ?? []
                ).map((colLoc: string) => {
                  const [col, loc] = colLoc.split(' ');
                  return (
                    <Select.Option key={colLoc} value={colLoc}>
                      {`${col} ${loc}`}
                    </Select.Option>
                  );
                })}
              </Select>
            </Form.Item>
          </Input.Group>
        </Form.Item>

        <TurtleInput // 기타 주소 Input
          name="ext"
          label=" "
          placeholder={t('placeholder.ext')}
          required={false}
        />

        <Form.Item label="계좌정보" required={true}>
          <Input.Group compact>
            <Form.Item
              name={['banks', 'bank']}
              noStyle
              rules={[{ required: true }]}
              label="은행"
            >
              <Select
                style={{ width: '30%' }}
                placeholder="은행"
                loading={getBankQuery.isLoading}
              >
                {Object.values(getBankQuery.data?.data ?? []).map(
                  (bank: any) => (
                    <Select.Option key={bank} value={bank}>
                      {bank}
                    </Select.Option>
                  ),
                )}
              </Select>
            </Form.Item>
            <Form.Item
              name={['banks', 'account_number']}
              noStyle
              rules={[{ required: true }]}
              label="계좌번호"
            >
              <Input style={{ width: '40%' }} placeholder="계좌번호" />
            </Form.Item>
            <Form.Item
              name={['banks', 'account_holder']}
              noStyle
              rules={[{ required: true }]}
              label="예금주명"
            >
              <Input style={{ width: '30%' }} placeholder="예금주명" />
            </Form.Item>
          </Input.Group>
        </Form.Item>

        <Tooltip title="전자영수증은 꼭 전체모습이 나오게 찍어주세요.">
          <Form.Item
            name="file"
            label="전자영수증 사진첨부"
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
              <TurtleButtonSub size="small">파일 선택하기</TurtleButtonSub>
            </Upload>
          </Form.Item>
        </Tooltip>

        <Row justify="end">
          <Popconfirm
            title={t('description.really register')}
            okText={t('yes')}
            cancelText={t('no')}
            onConfirm={() => {
              form.validateFields().then(() => {
                const [col, loc] = form.getFieldValue('colLoc').split(' ');
                createQuery.mutate({
                  ...form.getFieldsValue(),
                  type: 'update',
                  banks: [form.getFieldValue('banks')],
                  col,
                  loc,
                  ext: form.getFieldValue('ext') ?? '',
                  file: form.getFieldValue('file')[0].originFileObj,
                });
              });
            }}
          >
            <TurtleButton // 등록 요청하기 Button
              type="default"
              htmlType="submit"
              loading={createQuery.isLoading}
            >
              {t('button.request update')}
            </TurtleButton>
          </Popconfirm>
        </Row>
      </Form>
    </TurtleModal>
  );
}

export default UpdateVendorInfoModal;
