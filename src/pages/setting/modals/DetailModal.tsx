import { t } from 'i18next';
import { useCallback, useEffect, useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { Col, Form, Radio, Row } from 'antd';
import { message } from '@utils/message';
import {
  AnswerButton,
  TurtleDivider,
  TurtleFormInput,
  TurtleFormSelect,
} from '@components/element';
import retailerStoreAPI, { StoreShow } from '@apis/retailerStoreAPI';
import { numPattern } from '@utils/pattern';
import { TextWithTooltip, TurtleContentModal } from '@components/combine';
import { css } from '@emotion/react';
import usePreset from '@hooks/usePreset';

interface Props {
  visible: boolean;
  closeModal: () => void;
  selectedRow?: StoreShow;
}

function DetailModal({ visible, closeModal, selectedRow }: Props) {
  const queryClient = useQueryClient();
  const [form] = Form.useForm();
  const { bankData } = usePreset();

  const [buttonsVisible, setButtonsVisible] = useState(false);

  const showButtons = () => {
    setButtonsVisible(true);
  };

  const hideButtons = () => {
    setButtonsVisible(false);
  };

  const updateMutation = useMutation(retailerStoreAPI.update, {
    onSuccess: () => {
      message.success(t('message.success update store'));
      queryClient.refetchQueries(['getStoreList']);
      closeModal();
    },
  });

  const handleAccountValidation = (_: unknown, value: string) => {
    if (!value) {
      return Promise.reject(new Error(t('please input account number')));
    }

    if (!numPattern.test(value)) {
      return Promise.reject(new Error(t('please input number only')));
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
      mobile: selectedRow?.store_phone[0].phone ?? '',
      bank: selectedRow?.store_account[0].bank ?? '',
      account_number: selectedRow?.store_account[0].account_number ?? '',
      account_holder: selectedRow?.store_account[0].account_holder ?? '',
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
      onClose={() => {
        closeModal();
        hideButtons();
      }}
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
        onFinish={(value) => {
          updateMutation.mutate({
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
            <Radio value={false}>{t('table.open')}</Radio>
            <Radio value={true}>{t('table.closed')}</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item
          name="name"
          rules={[{ required: true }]}
          label={t('table.retailerStoreName')}
        >
          <TurtleFormInput placeholder={t('placeholder.store')} />
        </Form.Item>

        <Form.Item
          name="store_url"
          rules={[{ required: true }]}
          label={t('table.retailerStoreURL')}
        >
          <TurtleFormInput placeholder={t('placeholder.storeUrl')} />
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
                placeholder={t('table.bank')}
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
              rules={[
                () => ({
                  validator: handleAccountValidation,
                }),
              ]}
              noStyle
            >
              <TurtleFormInput placeholder={t('placeholder.account number')} />
            </Form.Item>
            <Form.Item
              name="account_holder"
              noStyle
              rules={[{ required: true }]}
            >
              <TurtleFormInput
                placeholder={t('placeholder.account holder name')}
              />
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
              {t('type.supplyPriceOnly')}
            </Radio>
            <Radio disabled value={true}>
              {t('type.supplyPrice + vat price')}
            </Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item //
          name="inventory_type"
          label={t('table.inventory')}
          rules={[{ required: true }]}
        >
          <TurtleFormSelect
            disabled
            placeholder={t('placeholder.select inventory')}
            items={[
              { value: 'sellmate', name: t('type.sellmate') },
              { value: 'ezadmin', name: t('type.ezadmin') },
              { value: 'turtlechain', name: t('type.turtlechain') },
              { value: 'etc', name: t('type.etc') },
              { value: 'none', name: t('type.not used') },
            ]}
          />
        </Form.Item>

        <Form.Item label={t('table.inventory link key')}>
          <Row gutter={[4, 0]}>
            <Col span={11}>
              <Form.Item
                name="inventory_domain"
                noStyle
                label={t('table.domain')}
              >
                <TurtleFormInput
                  placeholder={t('placeholder.domain')}
                  disabled
                />
              </Form.Item>
            </Col>
            <Col span={13}>
              <Form.Item
                name="inventory_key"
                noStyle
                label={t('table.inventory key')}
              >
                <TurtleFormInput
                  placeholder={t('placeholder.invenyory key')}
                  disabled
                />
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
          <TurtleFormInput
            placeholder={t('placeholder.input transfer details received mail')}
          />
        </Form.Item>

        <Form.Item
          name="alimtalk_name"
          label={
            <TextWithTooltip
              tooltipContent={['거래처에게 보여지는 쇼핑몰명을 입력해주세요']}
            >
              {t('table.alimtalkName')}
            </TextWithTooltip>
          }
          required={false}
        >
          <TurtleFormInput placeholder={t('placeholder.alimtalk')} />
        </Form.Item>

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
              <AnswerButton
                type="YES"
                text="저장"
                htmlType="submit"
                loading={updateMutation.isLoading}
              />
            </Col>
          </Row>
        )}
      </Form>
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
