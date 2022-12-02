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
      return Promise.reject(new Error('계좌번호를 입력해주세요'));
    }

    if (!numPattern.test(value)) {
      return Promise.reject(new Error('숫자만 입력해주세요'));
    }

    return Promise.resolve();
  };

  const handleNumberValidation = (_: unknown, value: string) => {
    if (!numPattern.test(value)) {
      return Promise.reject(new Error('숫자만 입력해주세요'));
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
          label={t('store.name')}
        >
          <TurtleFormInput placeholder={t('please input store name')} />
        </Form.Item>

        <Form.Item
          name={['store_mobile', 'mobile']}
          label={t('store.phone')}
          rules={[
            () => ({
              validator: handleNumberValidation,
            }),
            { required: true },
          ]}
        >
          <TurtleFormInput placeholder={t('please input phone number')} />
        </Form.Item>

        <Form.Item
          name="store_url"
          rules={[{ required: true }]}
          label={t('store.url')}
        >
          <TurtleFormInput placeholder={t('please input store url')} />
        </Form.Item>

        <Form.Item label={t('table.accountInfo')} required>
          <div css={flexGap}>
            <Form.Item
              name={['store_account', 'bank']}
              rules={[{ required: true }]}
              noStyle
            >
              <TurtleFormSelect
                placeholder="은행"
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
              <TurtleFormInput placeholder="계좌번호" />
            </Form.Item>
            <Form.Item
              name={['store_account', 'account_holder']}
              noStyle
              rules={[{ required: true, message: '예금주명을 입력해주세요' }]}
            >
              <TurtleFormInput placeholder="예금주명" />
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
          label="공급가 표시방법"
          required
          rules={[{ required: true }]}
        >
          <Radio.Group>
            <Radio value={false}>공급가만</Radio>
            <Radio value={true}>공급가 + 부가세 합산금액</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item //
          name="inventory_type"
          label="재고관리 프로그램"
          rules={[{ required: true }]}
        >
          <TurtleFormSelect
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

        <Form.Item name="email" label="이체내역 수신메일" required={false}>
          <TurtleFormInput placeholder="이체내역 수신 메일을 입력하세요." />
        </Form.Item>

        <Form.Item
          name="alimtalk_name"
          label={
            <TextWithTooltip
              tooltipContent={['거래처에게 보여지는 쇼핑몰명을 입력해주세요']}
            >
              {t('store.alimtalk name')}
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
                추가하기
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
