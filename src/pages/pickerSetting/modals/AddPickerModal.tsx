import React from 'react';
import { t } from 'i18next';
import { useCallback, useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { Form, message, Popconfirm, Row } from 'antd';
import {
  SpecialButton,
  TurtleFormInput,
  TurtleFormSearchInput,
} from '@components/element';
import { TurtleContentModal } from '@components/combine';
import pickerAPI from '@apis/pickerAPI';
import retailerStoreAPI, { StoreShow } from '@apis/retailerStoreAPI';

interface Props {
  visible: boolean;
  closeModal: () => void;
}

function AddPickerModal({ visible, closeModal }: Props) {
  const [form] = Form.useForm();
  const queryClient = useQueryClient();
  const [searchStore, setSearchStore] = useState<StoreShow>();
  const [searched, setSearched] = useState(false);
  const [keep, setKeep] = useState(false);
  const createMutation = useMutation(pickerAPI.create, {
    onSuccess: () => {
      message.success(t('message.success update mall'));
      queryClient.refetchQueries(['getStoreList']);
      closeModal();
    },
  });

  const getStoreListQuery = useQuery(
    'getStoreListQuery',
    retailerStoreAPI.getList,
  );

  const resetFields = useCallback(() => {
    form.resetFields();
  }, [form]);

  useEffect(() => {
    if (!visible) return;
    resetFields();
  }, [visible, resetFields]);

  useEffect(() => {
    if (!searched) return;
    if (searchStore === undefined) {
      message.info('신규쇼핑몰입니다. 값을 입력해주세요');
      form.setFieldsValue({
        store_id: '',
        store_url: '',
        store_mobile: '',
      });
      return;
    }

    form.setFieldsValue({
      store_id: searchStore.id,
      store_url: searchStore.store_url,
      store_mobile: {
        mobile:
          searchStore.store_phone.length !== 0
            ? searchStore.store_phone[0].phone
            : '',
      },
    });
  }, [form, searchStore, searched, keep]);

  return (
    <>
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
            <TurtleFormSearchInput
              placeholder={t('placeholder.store')}
              onSearch={(value: string) => {
                setSearchStore(
                  getStoreListQuery.data?.store_list.find(
                    (store) => store.name === value,
                  ),
                );
                setSearched(true);
                setKeep(() => !keep);
              }}
            />
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
        </Form>

        <Row css={{ marginTop: 40 }}>
          <Popconfirm
            title={'정말 추가하시겠습니까?'}
            okText={t('yes')}
            cancelText={t('no')}
            onConfirm={() => {
              form.validateFields().then((value) => {
                createMutation.mutate({
                  name: value.name,
                  store_url: value.store_url,
                  rt_store_id: value.store_id,
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
          </Popconfirm>
        </Row>
      </TurtleContentModal>
    </>
  );
}

export default AddPickerModal;
