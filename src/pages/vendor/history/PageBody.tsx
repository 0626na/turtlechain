import React, { useEffect, useState } from 'react';
import { RequestGetList } from '@apis/productAPI';
import SearchFilter from '@components/combine/SearchFilter';
import {
  MemoIcon,
  TurtleConfirmModal,
  TurtleDropdown,
  TurtleIcon,
  TurtleTableTitle,
} from '@components/element';
import useModal from '@hooks/useModal';
import useStore from '@hooks/useStore';
import { PageContent } from '@layout/page';
import { Pagination, Row, Switch, Table } from 'antd';
import { t } from 'i18next';
import { useMutation, useQuery } from 'react-query';
import InputModal from '@components/combine/modal/InputModal';
import vendorAPI, { Vendor, VendorAccount } from '@apis/vendorAPI';
import { message } from '@utils/message';
import { css } from '@emotion/react';
import VendorInfoUpdateModal from './modal/VendorInfoUpdateModal';
import { TextWithTooltip } from '@components/combine';
import { phoneMasking } from '@utils/phone';

function PageBody() {
  const [vendorList, setVendorList] = useState<Vendor[]>();
  const [selectedRow, setSelectedRow] = useState<Vendor>();
  const { store } = useStore();
  const [searchQuery, setSearchQuery] = useState<RequestGetList>({
    rt_store_id: -1,
    page: 1,
    search_string: '',
  });
  const [removeModalVisible, openRemoveModal, closeRemoveModal] = useModal();
  const [vatIncludedModalVisible, openVatIncludedModal, closeVatIncludedModal] =
    useModal();
  const [memoModalVisible, openMemoModal, closeMemoModal] = useModal();
  const [
    updateVendorInfoModalVisible,
    openUpdateVendorInfoModal,
    closeUpdateVendorInfoModal,
  ] = useModal();

  const [
    updateVendorNameModalVisible,
    openUpdateVendorNameModal,
    closeupdateVendorNameModal,
  ] = useModal();
  // 거래처 리스트 불러오기 요청
  const getVendorListQuery = useQuery(
    ['getVendorListQuery', searchQuery],
    () =>
      vendorAPI.getList({
        ...searchQuery,
        rt_store_id: store.selected?.id as number,
      }),
    {
      enabled: (store.selected?.id as number) !== undefined,
      onSuccess: (data) => {
        setVendorList(
          data.data.vendor_list.map((vendor) => ({
            ...vendor,
            memo_active: !vendor.memo,
            memo_value: vendor.memo,
          })),
        );
      },
    },
  );

  // 거래처 부가세,메모,거래처이름 수정 요청
  const vendorUpdateMutation = useMutation(vendorAPI.update, {
    onSuccess: () => {
      message.success(t('message.update is complete'));
      closeMemoModal();
      closeVatIncludedModal();
      closeUpdateVendorInfoModal();
      getVendorListQuery.refetch();
    },
  });

  // 거래처 삭제 요청
  const vendorRemoveMutation = useMutation(vendorAPI.remove, {
    onSuccess: () => {
      message.success(t('message.vendor is deleted'));
      closeRemoveModal();
      getVendorListQuery.refetch();
    },
  });

  // 쇼핑몰 바뀔때 상품 리스트 재검색
  useEffect(() => {
    setSearchQuery((searchQuery) => ({
      ...searchQuery,
      rt_store_id: store.selected?.id,
      page: 1,
    }));
  }, [store.selected]);

  const totalCount = getVendorListQuery.data?.data.total_count;

  return (
    <>
      {/**
       * 메모 수정 모달
       */}
      <InputModal
        visible={memoModalVisible}
        loading={vendorUpdateMutation.isLoading}
        onCancel={vendorUpdateMutation.isLoading ? () => {} : closeMemoModal}
        defaultValue={selectedRow?.memo}
        onOk={(value) => {
          vendorUpdateMutation.mutate({
            id: selectedRow?.id as number,
            memo: value,
          });
        }}
        title={t('table.memo')}
        description={[
          t('description.input important memo'),
          t('description.make use of memo'),
        ]}
        placeholder={t('placeholder.ex, double check its invoices!')}
      />
      {/*
       * 거래처명 수정 모달
       */}
      <InputModal
        visible={updateVendorNameModalVisible}
        loading={vendorUpdateMutation.isLoading}
        onCancel={
          vendorUpdateMutation.isLoading ? () => {} : closeupdateVendorNameModal
        }
        defaultValue={selectedRow?.vendor_name}
        okText={t('button.check')}
        onOk={(value) => {
          vendorUpdateMutation.mutate({
            id: selectedRow?.id as number,
            vendor_name: value,
          });
          closeupdateVendorNameModal();
        }}
        title={t('title.update vendor name')}
        description={[
          t('description.update select vendor'),
          t('description.input vendor name'),
        ]}
      />
      {/**
       * 삭제 confirm 모달
       */}
      <TurtleConfirmModal
        title={t('title.really delete')}
        description={[t('description.cannot reset')]}
        okText={t('button.delete')}
        visible={removeModalVisible}
        loading={vendorUpdateMutation.isLoading}
        onCancel={vendorUpdateMutation.isLoading ? () => {} : closeRemoveModal}
        onOk={() => {
          vendorRemoveMutation.mutate({
            id: selectedRow?.id as number,
            is_inactive: true,
          });
        }}
      />
      {/*
       * 부가세 바로전달 confirm 모달
       */}
      <TurtleConfirmModal
        title={t('title.really update')}
        description={[t('description.apply update info')]}
        okText={t('button.change')}
        visible={vatIncludedModalVisible}
        loading={vendorUpdateMutation.isLoading}
        onCancel={
          vendorUpdateMutation.isLoading ? () => {} : closeVatIncludedModal
        }
        onOk={() => {
          vendorUpdateMutation.mutate({
            id: selectedRow?.id as number,
            is_vat_included: !selectedRow?.is_vat_included,
          });
        }}
      />
      {/*
       * 거래처 정보수정 모달
       */}
      <VendorInfoUpdateModal
        selectedRow={selectedRow as Vendor}
        visible={updateVendorInfoModalVisible}
        closeModal={closeUpdateVendorInfoModal}
      />
      <PageContent>
        <Table
          size="small"
          loading={getVendorListQuery.isLoading}
          dataSource={vendorList}
          rowKey={(record) => record.id}
          pagination={false}
          scroll={{ y: 'auto', x: 950 }}
          title={() => (
            <TurtleTableTitle
              totalCount={totalCount ?? 0}
              rightContent={
                <SearchFilter
                  placeholder={t(
                    'placeholder.search by vendor name, mobile, account number',
                  )}
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                />
              }
            />
          )}
          footer={() => (
            <Row justify="center">
              <Pagination
                size="small"
                total={totalCount ?? 0}
                showSizeChanger={false}
                current={searchQuery.page}
                onChange={(page) => {
                  setSearchQuery({ ...searchQuery, page });
                }}
              />
            </Row>
          )}
          columns={[
            {
              ellipsis: true,
              width: 90,
              title: t('table.vendorCode'),
              render: (_, record) => record.vendor_code,
            },
            {
              ellipsis: true,
              title: t('table.vendorName'),
              render: (_, record) => record.vendor_name,
            },
            {
              ellipsis: true,
              title: t('table.vendorAddress'),
              render: (_, record) => record.vendor_address,
            },
            {
              ellipsis: true,
              width: 150,
              title: t('table.mobile'),
              render: (_, record) => phoneMasking(record.vendor_phone.phone),
            },
            {
              ellipsis: true,
              title: t('table.accountInfo'),
              render: (_, record) => {
                const makeAccount = (account: VendorAccount) =>
                  `${account?.bank} ${account?.account_number} ${account?.account_holder}`;

                return makeAccount(record.vendor_account);
              },
            },
            {
              ellipsis: true,
              width: 130,
              align: 'center',
              title: (
                <TextWithTooltip
                  tooltipContent={[
                    t('description.payment today'),
                    t('description.check vendor'),
                  ]}
                >
                  {t('table.vatIncluded')}
                </TextWithTooltip>
              ),
              render: (_, record) => (
                <Switch
                  size="small"
                  css={$switch}
                  onClick={() => {
                    setSelectedRow(record);
                    openVatIncludedModal();
                  }}
                  checked={record.is_vat_included}
                />
              ),
            },
            {
              width: 100,
              align: 'center',
              title: t('table.memo'),
              onCell: (record) => ({
                style: { cursor: 'pointer' },
                onClick: (e) => {
                  e.stopPropagation();
                  setSelectedRow(record);
                  openMemoModal();
                },
              }),
              render: (_, record) => <MemoIcon value={record.memo} />,
            },
            {
              width: 30,
              align: 'center',
              render: (record) => (
                <TurtleDropdown
                  items={[
                    {
                      key: '1',
                      label: t('table.edit vendor name'),
                      icon: <TurtleIcon name="updateVendorName" />,
                      onClick: () => {
                        setSelectedRow(record);
                        openUpdateVendorNameModal();
                      },
                    },

                    {
                      key: '2',
                      label: t('table.information update'),
                      icon: <TurtleIcon name="updateVendorInfo" />,
                      onClick: () => {
                        setSelectedRow(record);
                        openUpdateVendorInfoModal();
                      },
                    },

                    {
                      key: '3',
                      type: 'divider',
                    },

                    {
                      key: '4',
                      label: (
                        <span
                          css={css`
                            color: red;
                          `}
                        >
                          {t('table.delete')}
                        </span>
                      ),
                      icon: <TurtleIcon name="delete" danger />,
                      onClick: () => {
                        setSelectedRow(record);
                        openRemoveModal();
                      },
                    },
                  ]}
                  triggerButton={<TurtleIcon name="more" />}
                />
              ),
            },
          ]}
        />
      </PageContent>
    </>
  );
}

const $switch = css({
  width: '30px',
  height: '20px',

  '.ant-switch-checked': {
    backgroundColor: '#1a66f9',
  },

  '.ant-switch-handle::before': {
    width: 14,
    height: 14,
    marginTop: 0.5,
  },
});

export default PageBody;
