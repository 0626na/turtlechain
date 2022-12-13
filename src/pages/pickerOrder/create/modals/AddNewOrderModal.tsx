import React, { useEffect, useState } from 'react';
import { TurtleContentModal } from '@components/combine';
import {
  PrimaryButton,
  TurtleDivider,
  TurtleFormInput,
  TurtleFormSelect,
} from '@components/element';
import { css } from '@emotion/react';
import { Form, Radio, Row } from 'antd';
import { message } from '@utils/message';
import { t } from 'i18next';
import { useQuery } from 'react-query';
import orderAPI, { PickerStore } from '@apis/orderAPI';
import useOrderCart from '@hooks/useOrderCart';
import { notNumPattern } from '@utils/pattern';
import usePreset from '@hooks/usePreset';
interface Props {
  visible: boolean;
  close: () => void;
}

/**
 * 단건 추가 모달
 */
function AddNewOrderModal({ visible, close }: Props) {
  const [form] = Form.useForm();
  const [selectStore, setSelectStore] = useState<PickerStore>({
    id: 0,
    name: '',
    store_phone: [
      {
        phone: '',
      },
    ],
  });
  const { addSingleOrder } = useOrderCart();
  const [building, setBuilding] = useState('');
  const [floor, setFloor] = useState('');
  const { buildingData } = usePreset();

  //사입삼촌에 등록된 쇼핑몰 목록
  const getPickerStoresQuery = useQuery(
    'getPickerStores',
    orderAPI.getPickerStores,
    {
      enabled: visible,
    },
  );

  /**
   * 모달창 닫으면 모달내의 데이터 리셋
   */
  useEffect(() => form.resetFields(), [form, visible]);

  return (
    <>
      <TurtleContentModal
        title={t('addSingleOrder')}
        visible={visible}
        onClose={() => close()}
      >
        <Form
          layout="horizontal"
          form={form}
          colon={false}
          labelCol={{ span: 7 }}
          wrapperCol={{ span: 17 }}
          onFinish={(values) => {
            addSingleOrder({
              rt_store_id: selectStore.id,
              rt_store_name: selectStore.name,
              type: 'single',
              orders: [
                {
                  vendor_name: values.vendor_name,
                  vendor_address: values.vendor_address_building
                    ? `${values.vendor_address_building} ${values.vendor_address_floor}층 ${values.vendor_address_col}`
                    : values.ext,
                  vendor_mobile: '',
                  mobile: values.mobile,
                  product_name: values.vendor_product_name,
                  product_option: values.option,
                  product_count: values.count ?? 0,
                  product_price: values.price ?? 0,
                  order_type: values.type ?? 'order',
                  creation_type: 'single',
                  memo: values.memo,
                  ws_store_info: [],
                },
              ],
            });

            message.success(t('message.successAddOrder'));
            close();
          }}
        >
          {/* 쇼핑몰 */}
          <Form.Item
            label={t('table.retailerStoreName')}
            name="store_name"
            rules={[{ required: true, message: t('message.input store') }]}
          >
            <TurtleFormSelect
              showSearch
              placeholder={t('please input store name')}
              items={getPickerStoresQuery.data?.data.store_list.map((store) => {
                return {
                  name: store.name,
                  value: store.name,
                };
              })}
              onChange={(store: string) => {
                setSelectStore(
                  getPickerStoresQuery.data?.data.store_list.find(
                    (fstore) => fstore.name === store,
                  ) ?? {
                    id: 0,
                    name: '',
                    store_phone: [
                      {
                        phone: '',
                      },
                    ],
                  },
                );
              }}
            />
          </Form.Item>
          {/* 거래처 */}
          <Form.Item
            label={t('table.vendorName')}
            name="vendor_name"
            rules={[{ required: true, message: t('please input vendor name') }]}
          >
            <TurtleFormInput placeholder={t('please input vendor name')} />
          </Form.Item>
          {/* 주소 */}
          <Form.Item label={t('table.vendorAddress')} required>
            <div css={flexGap}>
              <div
                css={css`
                  flex-basis: 33%;
                `}
              >
                <Form.Item name="vendor_address_building" noStyle>
                  <TurtleFormSelect
                    showSearch
                    placeholder={t('building')}
                    onChange={(value) => {
                      setBuilding(value);
                      form.resetFields(['vendor_address_floor']);
                      form.resetFields(['vendor_address_col']);
                    }}
                    items={
                      buildingData &&
                      Object.keys(buildingData.data).map((name) => {
                        return {
                          name,
                          value: name,
                        };
                      })
                    }
                  />
                </Form.Item>
              </div>
              <div
                css={css`
                  flex-basis: 33%;
                `}
              >
                <Form.Item name="vendor_address_floor" noStyle>
                  <TurtleFormSelect
                    showSearch
                    placeholder={t('floor')}
                    onChange={(value) => {
                      setFloor(value);
                      form.resetFields(['vendor_address_col']);
                    }}
                    items={
                      building !== ''
                        ? Object.keys(buildingData.data[building]).map(
                            (building) => ({
                              value: building,
                              name: building,
                            }),
                          )
                        : []
                    }
                  />
                </Form.Item>
              </div>
              <div
                css={css`
                  flex-basis: 33%;
                `}
              >
                <Form.Item name="vendor_address_col" noStyle>
                  <TurtleFormSelect
                    showSearch
                    placeholder={t('col and loc')}
                    items={
                      building !== '' && floor !== ''
                        ? buildingData.data[building][floor].map(
                            (col: string) => ({
                              value: col,
                              name: col,
                            }),
                          )
                        : []
                    }
                  />
                  {/* <TurtleFormInput placeholder={t('col and loc')} /> */}
                </Form.Item>
              </div>
            </div>
          </Form.Item>
          {/* 기타주소 */}
          <Form.Item
            name="vendor_address_ext"
            label={t('table.vendorEtcAddress')}
          >
            <TurtleFormInput
              placeholder={t('please input etc address')}
              disabled={building === t('etc.') ? false : true}
            />
          </Form.Item>
          {/* 휴대번호 */}
          <Form.Item label={t('table.mobile')} name="mobile" required>
            <TurtleFormInput
              placeholder={t('please input phone number')}
              maxLength={11}
              onInput={(e) => {
                e.currentTarget.value = e.currentTarget.value.replaceAll(
                  notNumPattern,
                  '',
                );
              }}
            />
          </Form.Item>

          <TurtleDivider marginBottom={37} marginTop={32} />
          {/* 거래처 상품명 */}
          <Form.Item
            label={t('table.vendorProductName')}
            name="vendor_product_name"
            rules={[
              { required: true, message: t('please input product name') },
            ]}
          >
            <TurtleFormInput
              placeholder={t('please input vendorProduct name')}
            />
          </Form.Item>
          {/* 옵션  */}
          <Form.Item
            label={t('table.option')}
            name="option"
            rules={[{ required: true, message: t('please input option') }]}
          >
            <TurtleFormInput placeholder={t('please input option')} />
          </Form.Item>
          {/* 분류 */}
          <Form.Item label={t('table.type')} name="type">
            <Radio.Group>
              <Radio value="order">{t('order.types.order')}</Radio>
              <Radio value="reserve">{t('order.types.reserve')}</Radio>
              <Radio value="takeback">{t('order.types.takeback')}</Radio>
              <Radio value={t('order.types.exchange')}>
                {t('order.types.exchange')}
              </Radio>
              <Radio value="sample">{t('order.types.sample')}</Radio>
              <Radio value="pickup">{t('order.types.pickup')}</Radio>
              <Radio value="extra">{t('order.types.extra')}</Radio>
            </Radio.Group>
          </Form.Item>

          {/* 가격 */}
          <Form.Item label={t('table.price')} name="price">
            <TurtleFormInput placeholder="ex 7,000" />
          </Form.Item>
          {/* 수량 */}
          <Form.Item
            label={t('table.count')}
            name="count"
            rules={[{ required: true, message: t('please input count') }]}
          >
            <TurtleFormInput placeholder="ex 20" />
          </Form.Item>
          {/* 메모 */}
          <Form.Item label={t('table.memo')} name="memo">
            <TurtleFormInput placeholder="ex 7,000" />
          </Form.Item>
          <Form.Item noStyle shouldUpdate>
            {(values) => {
              return (
                <Row justify="end">
                  <PrimaryButton
                    size="large"
                    htmlType="submit"
                    disabled={
                      !values.getFieldValue('store_name') ||
                      !values.getFieldValue('vendor_name') ||
                      !values.getFieldValue('vendor_address_building') ||
                      !values.getFieldValue('vendor_address_floor') ||
                      !values.getFieldValue('vendor_address_col') ||
                      !values.getFieldValue('mobile') ||
                      !values.getFieldValue('vendor_product_name') ||
                      !values.getFieldValue('option') ||
                      !values.getFieldValue('count')
                    }
                  >
                    {t('button.add single order')}
                  </PrimaryButton>
                </Row>
              );
            }}
          </Form.Item>
        </Form>
      </TurtleContentModal>
    </>
  );
}

const flexGap = css`
  display: flex;
  gap: 4px;
`;

export default AddNewOrderModal;
