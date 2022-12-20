import { t } from 'i18next';
import { useCallback, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { Col, Form, Popconfirm, Radio, Row } from 'antd';
import {
  SpecialButton,
  TurtleDivider,
  TurtleFormInput,
  TurtleFormSelect,
} from '@components/element';
import retailerStoreAPI from '@apis/retailerStoreAPI';
import { numPattern } from '@utils/pattern';
import { TextWithTooltip, TurtleContentModal } from '@components/combine';
import { css } from '@emotion/react';
import { message } from '@utils/message';
import usePreset from '@hooks/usePreset';

interface Props {
  visible: boolean;
  closeModal: () => void;
}

function StoreCreateModal({ visible, closeModal }: Props) {
  const [form] = Form.useForm();
  const queryClient = useQueryClient();
  const { bankData } = usePreset();

  const createMutation = useMutation(retailerStoreAPI.create, {
    onSuccess: () => {
      message.success(t('message.success create store'));
      queryClient.refetchQueries(['getStoreList']);
      closeModal();
    },
  });

  const resetFields = useCallback(() => {
    form.resetFields();
  }, [form]);

  const handleAccountValidation = (_: unknown, value: string) => {
    if (!value) {
      return Promise.reject(
        new Error(t('message.please input account number')),
      );
    }

    if (!numPattern.test(value)) {
      return Promise.reject(new Error(t('message.please input number only')));
    }

    return Promise.resolve();
  };

  const handleNumberValidation = (_: unknown, value: string) => {
    if (!numPattern.test(value)) {
      return Promise.reject(new Error(t('message.please input number only')));
    }

    return Promise.resolve();
  };

  useEffect(() => {
    if (!visible) return;
    resetFields();
  }, [visible, resetFields]);

  return (
    <TurtleContentModal
      title={t('store.create')}
      visible={visible}
      onClose={closeModal}
    >
      <Form
        layout="horizontal"
        form={form}
        colon={false}
        labelCol={{ span: 7 }}
        wrapperCol={{ span: 17 }}
        onFinish={(value) => {
          form.validateFields().then((value) => {
            createMutation.mutate({
              ...value,
              inventory_domain: value.inventory_domain ?? '',
              inventory_key: value.inventory_key ?? '',
              email: value.email ?? '',
              alimtalk_name: value.alimtalk_name ?? '',
              store_mobile: {
                send_alimtalk: false,
                mobile: value.store_mobile.mobile,
                tag: '',
              },
            });
          });
        }}
      >
        <Form.Item name="store_id" hidden>
          <TurtleFormInput hidden />
        </Form.Item>

        <Form.Item
          name="name"
          rules={[{ required: true }]}
          label={t('table.retailerStoreName')}
        >
          <TurtleFormInput placeholder={t('placeholder.input store name')} />
        </Form.Item>

        <Form.Item
          name={['store_mobile', 'mobile']}
          label={t('table.store mobile number')}
          rules={[
            () => ({
              validator: handleNumberValidation,
            }),
            { required: true },
          ]}
        >
          <TurtleFormInput placeholder={t('placeholder.input mobile number')} />
        </Form.Item>

        <Form.Item
          name="store_url"
          rules={[{ required: true }]}
          label={t('store.url')}
        >
          <TurtleFormInput placeholder={t('placeholder.input store url')} />
        </Form.Item>

        <Form.Item label={t('table.accountInfo')} required>
          <div css={flexGap}>
            <Form.Item
              name={['store_account', 'bank']}
              rules={[{ required: true }]}
              noStyle
            >
              <TurtleFormSelect
                placeholder={t('placeholder.bank')}
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
              name={['store_account', 'account_number']}
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
              name={['store_account', 'account_holder']}
              noStyle
              rules={[
                { required: true, message: t('please input account holder') },
              ]}
            >
              <TurtleFormInput
                placeholder={t('placeholder.account holder name')}
              />
            </Form.Item>
          </div>
        </Form.Item>

        {/* 계좌 인증하기는 WP (웰컴페이먼츠) 가상계좌 적용시에 필요한 기능이니 당분간은 불필요 */}
        {/* <Row justify="end">
          <Col>
            <AddButton>계좌 인증하기</AddButton>
          </Col>
        </Row> */}

        <TurtleDivider marginTop={32} marginBottom={32} />

        <Form.Item
          name="inventory_is_vat_included"
          label={t('table.display the supply price')}
          required
          rules={[{ required: true }]}
        >
          <Radio.Group>
            <Radio value={false}>{t('type.supplyPriceOnly')}</Radio>
            <Radio value={true}>{t('type.supplyPrice + vat price')}</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item //
          name="inventory_type"
          label={t('table.inventory')}
          rules={[{ required: true }]}
        >
          <TurtleFormSelect
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
                  placeholder={t('placeholder.inventory key')}
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
              {t('table.alimtalk name')}
            </TextWithTooltip>
          }
          required={false}
        >
          <TurtleFormInput placeholder={t('placeholder.alimtalk')} />
        </Form.Item>

        <Form.Item noStyle shouldUpdate>
          {({ getFieldValue }) => (
            <Row css={{ marginTop: 40 }}>
              <SpecialButton // 수정하기 Button
                size="large"
                loading={createMutation.isLoading}
                htmlType="submit"
                disabled={
                  !getFieldValue('name') ||
                  !getFieldValue('store_url') ||
                  !getFieldValue('store_mobile')?.mobile ||
                  !getFieldValue('store_account')?.bank ||
                  !getFieldValue('store_account')?.account_number ||
                  !getFieldValue('store_account')?.account_holder ||
                  getFieldValue('inventory_is_vat_included') === undefined ||
                  !getFieldValue('inventory_type')
                }
              >
                {t('button.add')}
              </SpecialButton>
            </Row>
          )}
        </Form.Item>
      </Form>
    </TurtleContentModal>
  );
}

const flexGap = css`
  display: flex;
  gap: 4px;
`;

export default StoreCreateModal;
