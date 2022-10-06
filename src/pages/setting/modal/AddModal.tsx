import { t } from 'i18next';
import { useCallback, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { Col, Form, message, Popconfirm, Radio, Row } from 'antd';
import {
  AddButton,
  SpecialButton,
  TurtleDivider,
  TurtleFormInput,
  TurtleFormSelect,
} from '@components/element';
import retailerStoreAPI from '@apis/retailerStoreAPI';
import presetAPI from '@apis/presetAPI';
import { numPattern } from '@utils/pattern';
import { TurtleContentModal } from '@components/combine';
import { css } from '@emotion/react';

interface Props {
  visible: boolean;
  closeModal: () => void;
}

function AddModal({ visible, closeModal }: Props) {
  const [form] = Form.useForm();
  const queryClient = useQueryClient();

  const getBankQuery = useQuery('getBank', presetAPI.getBank, {
    enabled: visible,
  });

  const createMutation = useMutation(retailerStoreAPI.create, {
    onSuccess: () => {
      message.success(t('message.success update mall'));
      queryClient.refetchQueries(['getStoreList']);
      closeModal();
    },
  });

  const resetFields = useCallback(() => {
    form.resetFields();
  }, [form]);

  const handleAccountValidation = (_: any, value: any) => {
    if (!value) {
      return Promise.reject(new Error('계좌번호를 입력해주세요'));
    }

    if (!numPattern.test(value)) {
      return Promise.reject(new Error('숫자만 입력해주세요'));
    }

    return Promise.resolve();
  };

  useEffect(() => {
    if (!visible) return;
    // resetFields();
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
      >
        <Form.Item name="store_id" hidden>
          <TurtleFormInput hidden />
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
          label={t('store.url')}
        >
          <TurtleFormInput placeholder={t('placeholder.store url')} />
        </Form.Item>

        <Form.Item
          name={['store_mobile', 'mobile']}
          rules={[{ required: true }]}
          label={t('store.phone')}
        >
          <TurtleFormInput placeholder={t('placeholder.mobile')} />
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
                items={Object.values(getBankQuery.data?.data ?? []).map(
                  (bank: any) => ({ value: bank, name: bank }),
                )}
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
              rules={[{ required: true }]}
            >
              <TurtleFormInput placeholder="예금주명" />
            </Form.Item>
          </div>
        </Form.Item>

        <Row justify="end">
          <Col>
            <AddButton>계좌 인증하기</AddButton>
          </Col>
        </Row>

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
          label={t('store.alimtalk name')}
          required={false}
        >
          <TurtleFormInput placeholder={t('placeholder.alimtalk')} />
        </Form.Item>
      </Form>

      <Row css={{ marginTop: 40 }}>
        <Popconfirm
          title={'정말 추가하시겠습니까?'}
          okText={t('yes')}
          cancelText={t('no')}
          onConfirm={() => {
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
          <SpecialButton // 수정하기 Button
            size="large"
            loading={createMutation.isLoading}
          >
            추가하기
          </SpecialButton>
          {/* <Form.Item shouldUpdate noStyle>
            {({ getFieldValue }) => (
              <div css={marginTop}>
                <PrimaryButton
                  size="large"
                  htmlType="submit"
                  disabled={
                    !getFieldValue('subtract_amount') ||
                    !getFieldValue('unpaid_amount') ||
                    !getFieldValue('vendor_name')
                  }
                >
                  {t('button.addTransaction')}
                </PrimaryButton>
              </div>
            )}
          </Form.Item> */}
        </Popconfirm>
      </Row>
    </TurtleContentModal>
  );
}

const flexGap = css`
  display: flex;
  gap: 4px;
`;

export default AddModal;
