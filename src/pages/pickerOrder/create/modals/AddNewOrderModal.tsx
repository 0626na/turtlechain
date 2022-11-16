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
  const { buildingData } = usePreset();

  //사입삼촌에 등록된 쇼핑몰 목록
  const getPickerStoresQuery = useQuery(
    'getPickerStores',
    orderAPI.getPickerStores,
    {
      enabled: visible,
    },
  );

  useEffect(() => form.resetFields(), [form, visible]);

  return (
    <>
      <TurtleContentModal
        title={t('order.addSingleOrderTitle')}
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
                  product_count: values.count,
                  product_price: values.price,
                  order_type: values.type,
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
              placeholder={t('placeholder.store')}
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
            rules={[{ required: true, message: t('placeholder.vendorName') }]}
          >
            <TurtleFormInput placeholder={t('placeholder.vendorName')} />
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
                    placeholder={t('placeholder.building')}
                    onChange={(value) => setBuilding(value)}
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
                    placeholder={t('placeholder.floor')}
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
                  <TurtleFormInput placeholder={t('placeholder.col loc')} />
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
              placeholder={t('placeholder.etcAddress')}
              disabled={building === t('order.types.etc') ? false : true}
            />
          </Form.Item>
          {/* 휴대번호 */}
          <Form.Item label={t('table.mobile')} name="mobile" required>
            <TurtleFormInput
              placeholder={t('placeholder.mobile')}
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
            rules={[{ required: true, message: t('placeholder.product') }]}
          >
            <TurtleFormInput placeholder={t('placeholder.vendorProduct')} />
          </Form.Item>
          {/* 옵션  */}
          <Form.Item
            label={t('table.option')}
            name="option"
            rules={[{ required: true, message: t('placeholder.option') }]}
          >
            <TurtleFormInput placeholder={t('placeholder.option')} />
          </Form.Item>
          {/* 분류 */}
          <Form.Item
            label={t('table.type')}
            name="type"
            rules={[{ required: true, message: t('placeholder.type') }]}
          >
            <Radio.Group>
              <Radio value={t('order.types.order')}>
                {t('order.types.order')}
              </Radio>
              <Radio value={t('order.types.notDelivery')}>
                {t('order.types.notDelivery')}
              </Radio>
              <Radio value={t('order.types.return')}>
                {t('order.types.return')}
              </Radio>
              <Radio value={t('order.types.exchange')}>
                {t('order.types.exchange')}
              </Radio>
              <Radio value={t('order.types.sample')}>
                {t('order.types.sample')}
              </Radio>
              <Radio value={t('order.types.pickUp')}>
                {t('order.types.pickUp')}
              </Radio>
              <Radio value={t('order.types.etc')}>{t('order.types.etc')}</Radio>
            </Radio.Group>
          </Form.Item>

          {/* 가격 */}
          <Form.Item label={t('table.price')} name="price">
            <TurtleFormInput placeholder="ex 7,000" />
          </Form.Item>
          {/* 수량 */}
          <Form.Item label={t('table.count')} name="count">
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
                      !values.getFieldValue('type')
                    }
                  >
                    {t('button.addSingleOrder')}
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
