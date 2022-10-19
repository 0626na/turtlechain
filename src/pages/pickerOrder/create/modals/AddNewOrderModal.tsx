import React, { useState } from 'react';
import { TurtleContentModal } from '@components/combine';
import {
  PrimaryButton,
  TurtleDivider,
  TurtleFormInput,
  TurtleFormSelect,
} from '@components/element';
import { css } from '@emotion/react';
import { Form, message, Radio, Row } from 'antd';
import { t } from 'i18next';
import { useQuery } from 'react-query';
import orderAPI, { PickerStore } from '@apis/orderAPI';
import presetAPI from '@apis/presetAPI';
import useOrderCart from '@hooks/useOrderCart';
import { notNumPattern } from '@utils/pattern';
interface Props {
  visible: boolean;
  close: () => void;
}
/**
 *
 * @param {boolean} visible 모달 표시/비표시
 * @param {() => void} close 모달 닫는 함수
 *
 * @returns 단건추가 모달
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
  const { updateSuccess } = useOrderCart();
  const [floor, setFloor] = useState('');

  //사입삼촌에 등록된 쇼핑몰 목록
  const getPickerStoresQuery = useQuery(
    'getPickerStores',
    orderAPI.getPickerStores,
    {
      enabled: visible,
    },
  );

  const getBuildingQuery = useQuery('getBuildingQuery', presetAPI.getBuilding);

  return (
    <>
      <TurtleContentModal
        title="발주 단건추가"
        visible={visible}
        onClose={() => {
          form.resetFields();
          close();
        }}
      >
        <Form
          layout="horizontal"
          form={form}
          colon={false}
          labelCol={{ span: 7 }}
          wrapperCol={{ span: 17 }}
          onFinish={(values) => {
            updateSuccess({
              rt_store_id: selectStore.id,
              rt_store_name: selectStore.name,
              orders: [
                {
                  vendor_name: values.vendor_name,
                  vendor_address:
                    values.vendor_address_building !== undefined
                      ? `${values.vendor_address_building} ${values.vendor_address_floor}층 ${values.vendor_address_col}`
                      : values.vendor_address_ext,
                  vendor_mobile: '',
                  mobile: values.mobile,
                  product_name: values.vendor_product_name,
                  product_option: values.option,
                  product_count: values.count,
                  product_price: values.price,
                  order_type: values.type,
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
            label="쇼핑몰명"
            name="store_name"
            rules={[{ required: true, message: '쇼핑몰을 입력해주세요' }]}
          >
            <TurtleFormSelect
              showSearch
              placeholder="쇼핑몰을 입력해주세요"
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
            rules={[{ required: true, message: '거래처명을 입력해주세요' }]}
          >
            <TurtleFormInput placeholder="거래처명을 입력해주세요" />
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
                    placeholder="상가"
                    onChange={(value) => setFloor(value)}
                    items={
                      getBuildingQuery.data &&
                      Object.keys(getBuildingQuery.data.data).map((name) => {
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
                    placeholder="층"
                    items={
                      floor !== ''
                        ? Object.keys(getBuildingQuery.data.data[floor]).map(
                            (building) => {
                              return {
                                value: building,
                                name: building,
                              };
                            },
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
                  <TurtleFormInput placeholder="열-호" />
                </Form.Item>
              </div>
            </div>
          </Form.Item>
          {/* 기타주소 */}
          <Form.Item
            name="vendor_address_ext"
            label={t('table.vendorEtcAddress')}
          >
            <TurtleFormInput placeholder="기타 주소를 입력해주세요" />
          </Form.Item>
          {/* 휴대번호 */}
          <Form.Item label={t('table.mobile')} name="mobile" required>
            <TurtleFormInput
              placeholder="휴대전화번호를 입력해주세요"
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
            rules={[{ required: true, message: '상품명을 입력해주세요' }]}
          >
            <TurtleFormInput placeholder="거래처 상품명을 입력하세요" />
          </Form.Item>
          {/* 옵션  */}
          <Form.Item
            label={t('table.option')}
            name="option"
            rules={[{ required: true, message: '옵션을 입력해주세요' }]}
          >
            <TurtleFormInput placeholder="옵션을 입력해주세요" />
          </Form.Item>
          {/* 분류 */}
          <Form.Item
            label={t('table.type')}
            name="type"
            rules={[{ required: true, message: '분류를 선택해주세요' }]}
          >
            <Radio.Group>
              <Radio value="발주">발주</Radio>
              <Radio value="미송">미송</Radio>
              <Radio value="반품">반품</Radio>
              <Radio value="교환">교환</Radio>
              <Radio value="샘플">샘플</Radio>
              <Radio value="픽업">픽업</Radio>
              <Radio value="기타">기타</Radio>
            </Radio.Group>
          </Form.Item>

          {/* 가격 */}
          <Form.Item label={t('table.price')} name="price">
            <TurtleFormInput
              placeholder="ex 7,000"
              onInput={(e) => {
                e.currentTarget.value = e.currentTarget.value.replaceAll(
                  notNumPattern,
                  '',
                );
              }}
            />
          </Form.Item>
          {/* 수량 */}
          <Form.Item label={t('table.count')} name="count">
            <TurtleFormInput
              placeholder="ex 20"
              onInput={(e) => {
                e.currentTarget.value = e.currentTarget.value.replaceAll(
                  notNumPattern,
                  '',
                );
              }}
            />
          </Form.Item>
          {/* 메모 */}
          <Form.Item label={t('table.memo')} name="memo">
            <TurtleFormInput placeholder="ex 7,000" />
          </Form.Item>
          <Form.Item noStyle>
            <Row justify="end">
              <PrimaryButton htmlType="submit">발주 추가하기</PrimaryButton>
            </Row>
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
