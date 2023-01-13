import React from 'react';
import { t } from 'i18next';
import { useCallback, useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { Button, Form, Row } from 'antd';
import { message } from '@utils/message';
import { SpecialButton, TurtleFormInput } from '@components/element';
import { TurtleContentModal } from '@components/combine';
import pickerAPI from '@apis/pickerAPI';
import retailerStoreAPI, { StoreShow } from '@apis/retailerStoreAPI';
import { TurtleFormSelectSearchInDropDown } from '@components/element/select/TurtleFormSelectSearchInDropDown';
import useUser from '@hooks/useUser';
import { css } from '@emotion/react';
import useModal from '@hooks/useModal';
import InputModal from '@components/combine/modal/InputModal';
import { notNumPattern } from '@utils/pattern';
interface Props {
  visible: boolean;
  closeModal: () => void;
}

/**
 * 터틀체인에 있는 모든 쇼핑몰 리스트 데이터 중에 이름, URL, 휴대전화 번호만 사용하도록 변경하기 위한 인터페이스
 */
interface IaddStore {
  id?: number;
  name: string;
  url: string;
  mobile: string;
}

/**
 * 쇼핑몰 정보page에 쇼핑몰을 추가하는 모달
 *
 * 기존에 있는 쇼핑몰, 신규쇼핑몰 둘다 추가 가능하다.
 */
function AddStoreForPickerModal({ visible, closeModal }: Props) {
  const [form] = Form.useForm();
  const { user } = useUser();
  const queryClient = useQueryClient();
  const [searchStore, setSearchStore] = useState<IaddStore>();
  const [addButtonDisabled, setAddButtonDisabled] = useState(false);
  const [inputDisabled, setInputDisabled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [entireStoreList, setEntireStoreList] = useState<IaddStore[]>([]);
  const [storeList, setStoreList] = useState<StoreShow[]>([]);

  const [modifiedModalVisible, openModifiedModal, closeModifiedModal] =
    useModal();

  /**
   * 쇼핑몰 등록 react-query
   */
  const { mutate, isLoading } = useMutation(pickerAPI.create, {
    onSuccess: () => {
      message.success(t('message.success create store'));
      queryClient.refetchQueries(['getStoreList']);
      closeModal();
    },
  });

  /**
   * picker 계정에 등록된 쇼핑몰 리스트를 가져오는 react-query
   */
  useQuery(['addedStoreListQuery', visible], pickerAPI.getList, {
    enabled: !!user,
    onSuccess: (data) => {
      setStoreList(data.data.store_list);
    },
  });

  /**
   * 터틀체인에 존재하는 모든 쇼핑몰 리스트를 가져오는 react-query
   */
  useQuery(
    ['getStoreListQuery', visible],
    () => retailerStoreAPI.getList({ page: 1, page_size: 700 }),
    {
      onSuccess: (data) =>
        setEntireStoreList(
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
  }, [form, visible]);

  useEffect(() => {
    if (!visible) return;
    resetFields();
    setSearchQuery('');
  }, [visible, resetFields]);

  useEffect(() => {
    if (searchStore === undefined) {
      form.setFieldsValue({
        store_id: '',
        store_url: '',
        mobile: '',
      });
      setInputDisabled(false);
      return;
    }

    form.setFieldsValue({
      store_id: searchStore.id,
      store_url: searchStore.url,
      mobile: searchStore.mobile,
    });
    setInputDisabled(true);
  }, [form, searchStore]);

  return (
    <>
      {/*선택한 쇼핑몰명이 이미 있는경우, 쇼핑몰명 수정 모달 */}
      <InputModal
        defaultValue={searchQuery}
        visible={modifiedModalVisible}
        onCancel={closeModifiedModal}
        title={t('title.store modification')}
        description={[
          t('description.currently, store is already registered'),
          t('description.input another store name'),
        ]}
        onOk={(value) => {
          if (storeList.find((store) => store.name === value)) {
            message.error(t('message.already added store'), 2);
            return;
          }
          setSearchQuery(value);
          setAddButtonDisabled(false);
          closeModifiedModal();
        }}
      />
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
          onFinish={() => {
            if (
              form.getFieldValue('mobile').slice(0, 3) !== '010' ||
              form.getFieldValue('mobile').length !== 11
            ) {
              message.warn(
                t(
                  'description.please enter a valid format for your mobile phone number',
                ),
              );
              return;
            }
            if (
              storeList.filter((store) => store.name === searchQuery).length !==
              0
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
          <Form.Item name="store_id" hidden>
            <TurtleFormInput hidden />
          </Form.Item>

          <Form.Item
            rules={[{ required: true }]}
            label={t('table.retailerStoreName')}
          >
            <Form.Item noStyle name="name">
              <TurtleFormSelectSearchInDropDown
                showSearch={false}
                value={searchQuery}
                onChange={(value) => {
                  setSearchQuery(value);
                  setSearchStore(
                    entireStoreList.find(
                      (store) =>
                        store.name === value.split('/')[0] &&
                        store.mobile === value.split('/')[1],
                    ),
                  );
                }}
                onSelect={(value) => {
                  setSearchQuery(value.split('/')[0]);
                  if (
                    storeList.find(
                      (store) => store.name === value.split('/')[0],
                    )
                  ) {
                    message.error(t('message.already added store'), 2);
                    setAddButtonDisabled(true);
                    return;
                  }
                  setAddButtonDisabled(false);
                }}
                items={entireStoreList
                  .filter((store) => store.name.includes(searchQuery))
                  .map((item) => ({
                    name: `${item.name}/${item.mobile}`,
                    value: `${item.name}/${item.mobile}`,
                  }))}
                removeDuplication={() => {
                  if (storeList.find((store) => store.name === searchQuery)) {
                    message.error(t('message.already added store'), 2);
                    setAddButtonDisabled(true);
                    return;
                  }

                  setAddButtonDisabled(false);
                }}
              />
              {addButtonDisabled && (
                <div css={css({ display: 'flex', justifyContent: 'right' })}>
                  <Button type="link" onClick={openModifiedModal}>
                    {t('button.modify store name')}
                  </Button>
                </div>
              )}
            </Form.Item>
          </Form.Item>
          <Form.Item
            name="store_url"
            rules={[{ required: true }]}
            label={t('table.retailerStoreURL')}
          >
            <TurtleFormInput
              placeholder={t('placeholder.ex. store url')}
              disabled={inputDisabled}
            />
          </Form.Item>

          <Form.Item
            name="mobile"
            rules={[{ required: true }]}
            label={t('table.store mobile number')}
          >
            <TurtleFormInput
              onInput={(e) => {
                e.currentTarget.value = e.currentTarget.value.replace(
                  notNumPattern,
                  '',
                );
              }}
              placeholder={t('placeholder.input mobile number')}
              maxLength={11}
              disabled={inputDisabled}
            />
          </Form.Item>
          <Form.Item wrapperCol={{ span: 24 }}>
            <Row>
              <SpecialButton // 수정하기 Button
                size="large"
                htmlType="submit"
                loading={isLoading}
                disabled={addButtonDisabled}
                onClick={() => {
                  form.setFieldsValue({ name: searchQuery });
                }}
              >
                {t('message.add')}
              </SpecialButton>
            </Row>
          </Form.Item>
        </Form>
      </TurtleContentModal>
    </>
  );
}

export default AddStoreForPickerModal;
