import React, { useMemo, useRef } from 'react';
import { t } from 'i18next';
import { useCallback, useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { Form, Popconfirm, Row, Select } from 'antd';
import { message } from '@utils/message';
import { BaseSelectRef } from 'rc-select';
import {
  SpecialButton,
  TurtleFormInput,
  TurtleFormSearchInput,
  TurtleFormSelect,
  TurtleIcon,
  TurtleSearchSelect,
} from '@components/element';
import { TurtleContentModal } from '@components/combine';
import pickerAPI from '@apis/pickerAPI';
import retailerStoreAPI, { StoreShow } from '@apis/retailerStoreAPI';
import { TurtleFormSelectSearchInDropDown } from '@components/element/select/TurtleFormSelectSearchInDropDown';
import useUser from '@hooks/useUser';

interface Props {
  visible: boolean;
  closeModal: () => void;
}

interface IaddStore {
  id?: number;
  name: string;
  url: string;
  mobile: string;
}

function AddPickerModal({ visible, closeModal }: Props) {
  const [form] = Form.useForm();
  const { user } = useUser();
  const queryClient = useQueryClient();
  const [searchStore, setSearchStore] = useState<IaddStore>();
  const [searched, setSearched] = useState(false);
  const [keep, setKeep] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [storeList, setStoreList] = useState<IaddStore[]>([]);
  const { mutate, isLoading } = useMutation(pickerAPI.create, {
    onSuccess: () => {
      message.success(t('message.success create store'));
      queryClient.refetchQueries(['getStoreList']);
      closeModal();
    },
  });

  const { data: addedStoreList } = useQuery(
    'addedStoreListQuery',
    pickerAPI.getList,
    {
      enabled: !!user,
    },
  );

  const { data } = useQuery(
    ['getStoreListQuery'],
    () => retailerStoreAPI.getList({ page: 1, page_size: 700 }),
    {
      onSuccess: (data) =>
        setStoreList(
          data.store_list.map((store) => ({
            id: store.id,
            name: store.name,
            url: store.store_url,
            mobile:
              store.store_phone.length !== 0 ? store.store_phone[0].phone : '',
          })),
        ),
    },
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
      form.setFieldsValue({
        store_id: '',
        store_url: '',
        mobile: '',
      });
      return;
    }

    form.setFieldsValue({
      store_id: searchStore.id,
      store_url: searchStore.url,
      mobile: searchStore.mobile,
    });
  }, [form, searchStore, searched, keep]);

  return (
    <>
      <TurtleContentModal
        title={t('title.add store')}
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
            label={t('table.retailerStoreName')}
          >
            <TurtleFormSelectSearchInDropDown
              showSearch={false}
              value={searchQuery}
              onChange={(value) => {
                setSearchQuery(value);
                setSearchStore(storeList.find((store) => store.name === value));
                setSearched(true);
                setKeep(() => !keep);
              }}
              items={storeList
                .filter((store) => store.name.includes(searchQuery))
                .map((item) => ({
                  name: `${item.name} ${item.mobile}`,
                  value: item.name,
                }))}
            />
          </Form.Item>

          <Form.Item
            name="store_url"
            rules={[{ required: true }]}
            label={t('table.retailerStoreURL')}
          >
            <TurtleFormInput placeholder={t('placeholder.ex. store url')} />
          </Form.Item>

          <Form.Item
            name="mobile"
            rules={[{ required: true }]}
            label={t('table.store mobile number')}
          >
            <TurtleFormInput
              placeholder={t('placeholder.input mobile number')}
            />
          </Form.Item>
        </Form>

        <Row css={{ marginTop: 40 }}>
          <Popconfirm
            title={t('message.add it')}
            okText={t('button.yes')}
            cancelText={t('button.no')}
            onConfirm={() => {
              if (
                addedStoreList?.data.store_list.filter(
                  (store) => store.name === searchQuery,
                ).length !== 0
              ) {
                message.error(t('message.already added store'), 2);
                return;
              }
              form.validateFields().then((value) => {
                mutate({
                  name: value.name,
                  store_url: value.store_url,
                  rt_store_id: value.store_id,
                  store_mobile: {
                    send_alimtalk: false,
                    mobile: value.mobile,
                    tag: '',
                  },
                });
              });
            }}
          >
            <SpecialButton // 수정하기 Button
              size="large"
              loading={isLoading}
            >
              {t('message.add')}
            </SpecialButton>
          </Popconfirm>
        </Row>
      </TurtleContentModal>
    </>
  );
}

export default AddPickerModal;
