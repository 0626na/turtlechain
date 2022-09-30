import { t } from 'i18next';
import { useCallback, useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { Col, Form, message, Popconfirm, Radio, Row } from 'antd';
import {
  AnswerButton,
  TurtleDivider,
  TurtleFormInput,
  TurtleFormSelect,
} from '@components/element';
import retailerStoreAPI, { StoreShow } from '@apis/retailerStoreAPI';
import presetAPI from '@apis/presetAPI';
import { numPattern } from '@utils/pattern';
import { TurtleContentModal } from '@components/combine';
import { css } from '@emotion/react';

interface Props {
  visible: boolean;
  closeModal: () => void;
  selectedRow?: StoreShow;
}

function DetailModal({ visible, closeModal, selectedRow }: Props) {
  const [form] = Form.useForm();
  const queryClient = useQueryClient();

  const [buttonsVisible, setButtonsVisible] = useState(false);

  const showButtons = () => {
    setButtonsVisible(true);
  };

  const hideButtons = () => {
    setButtonsVisible(false);
  };

  const getBankQuery = useQuery('getBank', presetAPI.getBank, {
    enabled: visible,
  });

  const updateQuery = useMutation(retailerStoreAPI.update, {
    onSuccess: () => {
      message.success(t('message.success update mall'));
      queryClient.refetchQueries(['getStoreList']);
      closeModal();
    },
  });

  const handleAccountValidation = (_: any, value: any) => {
    if (!value) {
      return Promise.reject(new Error('계좌번호를 입력해주세요'));
    }

    if (!numPattern.test(value)) {
      return Promise.reject(new Error('숫자만 입력해주세요'));
    }

    return Promise.resolve();
  };

  const resetStates = useCallback(() => {
    const {
      id,
      store_url,
      is_closed,
      name,
      inventory_type,
      inventory_is_vat_included,
      inventory_domain,
      inventory_key,
      email,
      alimtalk_name,
    } = selectedRow || {};

    form.setFieldsValue({
      store_id: id,
      is_closed,
      store_url,
      name,
      mobile: selectedRow?.store_phone[0].phone,
      bank: selectedRow?.store_account[0].bank,
      account_number: selectedRow?.store_account[0].account_number,
      account_holder: selectedRow?.store_account[0].account_holder,
      inventory_type,
      inventory_is_vat_included,
      inventory_domain,
      inventory_key,
      email,
      alimtalk_name,
    });
  }, [selectedRow, form]);

  useEffect(() => {
    if (!visible) return;
    resetStates();
  }, [visible, resetStates]);

  return (
    <TurtleContentModal
      title={t('store.info')}
      visible={visible}
      onClose={closeModal}
    >
      <Form
        layout="horizontal"
        form={form}
        colon={false}
        labelCol={{ span: 7 }}
        wrapperCol={{ span: 17 }}
        onValuesChange={() => {
          showButtons();
        }}
      >
        <Form.Item name="store_id" hidden>
          <TurtleFormInput hidden />
        </Form.Item>

        <Form.Item
          name="is_closed"
          label={t('table.operatorStatus')}
          required
          rules={[{ required: true }]}
        >
          <Radio.Group>
            <Radio value={false}>운영</Radio>
            <Radio value={true}>폐점</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item
          name="name"
          rules={[{ required: true }]}
          label={t('store.name')}
        >
          <TurtleFormInput placeholder={t('placeholder.store')} />
        </Form.Item>

        <Form.Item
          name="store_url"
          rules={[{ required: true }]}
          label={t('table.retailerStoreURL')}
        >
          <TurtleFormInput placeholder={t('placeholder.store url')} />
        </Form.Item>

        <Form.Item
          name="mobile"
          rules={[{ required: true }]}
          label={t('table.mobile')}
        >
          <TurtleFormInput placeholder={t('placeholder.mobile')} />
        </Form.Item>

        <Form.Item label={t('table.paymentAccountInfo')} required>
          <div css={flexGap}>
            <Form.Item name="bank" rules={[{ required: true }]} noStyle>
              <TurtleFormSelect
                placeholder="은행"
                items={Object.values(getBankQuery.data?.data ?? []).map(
                  (bank: any) => ({ value: bank, name: bank }),
                )}
              />
            </Form.Item>
            <Form.Item
              name="account_number"
              rules={[
                () => ({
                  validator: handleAccountValidation,
                }),
              ]}
              noStyle
            >
              <TurtleFormInput placeholder="계좌번호" />
            </Form.Item>
            <Form.Item
              name="account_holder"
              noStyle
              rules={[{ required: true }]}
            >
              <TurtleFormInput placeholder="예금주명" />
            </Form.Item>
          </div>
        </Form.Item>

        <TurtleDivider marginTop={32} marginBottom={32} />

        <Form.Item
          name="inventory_is_vat_included"
          label={t('table.supplyPriceRecord')}
        >
          <Radio.Group>
            <Radio disabled value={false}>
              공급가만
            </Radio>
            <Radio disabled value={true}>
              공급가 + 부가세 합산금액
            </Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item //
          name="inventory_type"
          label="재고관리 프로그램"
          rules={[{ required: true }]}
        >
          <TurtleFormSelect
            disabled
            placeholder="재고관리 프로그램을 선택하세요."
            items={[
              { value: 'sellmate', name: '셀메이트' },
              { value: 'ezadmin', name: '이지어드민' },
              { value: 'turtlechain', name: '터틀체인' },
              { value: 'etc', name: '기타' },
              { value: 'none', name: '사용안함' },
            ]}
          />
        </Form.Item>

        <Form.Item label="재고프로그램 연동키">
          <Row gutter={[4, 0]}>
            <Col span={11}>
              <Form.Item name="inventory_domain" noStyle label="도메인">
                <TurtleFormInput placeholder="도메인" disabled />
              </Form.Item>
            </Col>
            <Col span={13}>
              <Form.Item name="inventory_key" noStyle label="연동 key">
                <TurtleFormInput placeholder="연동키" disabled />
              </Form.Item>
            </Col>
          </Row>
        </Form.Item>

        <TurtleDivider marginTop={32} marginBottom={32} />

        <Form.Item
          name="email"
          label={t('table.transactionEmail')}
          required={false}
        >
          <TurtleFormInput placeholder="이체내역 수신 메일을 입력하세요." />
        </Form.Item>

        <Form.Item
          name="alimtalk_name"
          label={t('table.alimtalkName')}
          required={false}
        >
          <TurtleFormInput placeholder={t('placeholder.alimtalk')} />
        </Form.Item>
      </Form>

      {buttonsVisible && (
        <Row
          css={css`
            margin-top: 32px;
          `}
          justify="end"
          align="middle"
        >
          <Col>
            <AnswerButton
              type="NO"
              text="취소 "
              onClick={() => {
                // 취소를 누르면 최초 값으로 초기화.
                resetStates();
                hideButtons();
              }}
            />
          </Col>
          <Col css={marginleft}>
            <Popconfirm
              title={t('description.really update')}
              okText={t('yes')}
              cancelText={t('no')}
              onConfirm={() => {
                form.validateFields().then((value) => {
                  updateQuery.mutate({
                    store_id: value.store_id,
                    is_closed: value.is_closed,
                    name: value.name,
                    store_url: value.store_url,
                    store_mobile: {
                      mobile: value.mobile,
                    },
                    store_account: {
                      bank: value.bank,
                      account_number: value.account_number,
                      account_holder: value.account_holder,
                    },
                    inventory_type: value.inventory_type,
                    inventory_domain:
                      value.inventory_type === 2 ? '' : value.inventory_domain,
                    inventory_key: value.inventory_key,
                    inventory_is_vat_included: value.inventory_is_vat_included,
                    email: value.email,
                    alimtalk_name: value.alimtalk_name,
                  });
                });
              }}
            >
              <AnswerButton
                type="YES"
                text="저장"
                htmlType="submit"
                loading={updateQuery.isLoading}
              />
            </Popconfirm>
          </Col>
        </Row>
      )}
    </TurtleContentModal>
  );
}

const flexGap = css`
  display: flex;
  gap: 4px;
`;

const marginleft = css`
  margin-left: 8px;
`;

export default DetailModal;
