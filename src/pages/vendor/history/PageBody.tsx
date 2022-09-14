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
import { PageContent, PageTitle } from '@layout/page';
import { message, Pagination, Popconfirm, Row, Switch, Table } from 'antd';
import { t } from 'i18next';
import { useMutation, useQuery } from 'react-query';
import InputModal from '@components/combine/modal/InputModal';
import vendorAPI, { Vendor } from '@apis/vendorAPI';

import { css } from '@emotion/react';
import VendorInfoUpdateModal from './modal/VendorInfoUpdateModal';

function PageBody() {
  const [vendorList, setVendorList] = useState<Vendor[]>();
  const [selectedRow, setSelectedRow] = useState<Vendor>();
  const { store } = useStore();
  const [searchQuery, setSearchQuery] = useState<RequestGetList>({
    rt_store_id: -1,
    page: 1,
    search_string: '',
    type: 'name',
  });
  const [removeModalVisible, openRemoveModal, closeRemoveModal] = useModal();
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
      vendorAPI.get({
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
      message.success('수정이 완료되었습니다.');
      getVendorListQuery.refetch();
    },
  });

  // 거래처 삭제 요청
  const vendorRemoveMutation = useMutation(vendorAPI.remove, {
    onSuccess: () => {
      message.success('거래처가 삭제되었습니다.');
      getVendorListQuery.refetch();
    },
  });

  const loading =
    getVendorListQuery.isLoading ||
    vendorRemoveMutation.isLoading ||
    vendorUpdateMutation.isLoading;

  // 쇼핑몰 바뀔때 상품 리스트 재검색
  useEffect(() => {
    setSearchQuery((searchQuery) => ({
      ...searchQuery,
      rt_store_id: store.selected?.id,
      page: 1,
    }));
  }, [store.selected]);

  return (
    <>
      {/**
       * 메모 수정 모달
       */}
      <InputModal
        visible={memoModalVisible}
        loading={loading}
        onCancel={loading ? () => {} : closeMemoModal}
        defaultValue={selectedRow?.memo}
        onOk={(value) => {
          vendorUpdateMutation.mutate({
            id: selectedRow?.id as number,
            memo: value,
          });
        }}
        title="메모"
        description={[
          '해당 건과 관련해 중요한 내용을 기록해보세요.',
          '개인 메모로도 자유롭게 활용할 수 있어요👀',
        ]}
        placeholder="ex. 영수증 이중으로 확인 또 확인!"
      />
      {/*
       * 거래처명 수정 모달
       */}
      <InputModal
        visible={updateVendorNameModalVisible}
        onCancel={closeupdateVendorNameModal}
        defaultValue={selectedRow?.vendor_name}
        onOk={(value) => {
          vendorUpdateMutation.mutate({
            id: selectedRow?.id as number,
            vendor_name: value,
          });
          closeupdateVendorNameModal();
        }}
        title="거래처명 수정"
        description={[
          '선택한 거래처의 이름을 수정합니다.',
          '원하는 거래처명을 입력해주세요.',
        ]}
      />
      {/**
       * 삭제 confirm 모달
       */}
      <TurtleConfirmModal
        title="정말 삭제할까요?"
        description={['삭제 후에는 이전으로 되돌릴 수 없어요.']}
        okText="네"
        visible={removeModalVisible}
        loading={loading}
        onCancel={closeRemoveModal}
        onOk={() => {
          vendorRemoveMutation.mutate({
            id: selectedRow?.id as number,
            is_inactive: true,
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
      <PageTitle title="거래처 리스트" />
      <PageContent>
        <Table
          size="small"
          loading={loading}
          dataSource={vendorList}
          rowKey={(record) => record.id}
          pagination={false}
          scroll={{ y: 'auto', x: 1400 }}
          title={() => (
            <TurtleTableTitle
              totalCount={vendorList?.length ?? 0}
              rightContent={
                <SearchFilter
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
                total={vendorList?.length ?? 0}
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
              width: 100,
              title: t('table.vendorCode'),
              render: (_, record) => record.vendor_code,
            },
            {
              ellipsis: true,
              width: 150,
              title: t('table.vendorName'),
              render: (_, record) => record.vendor_name,
            },
            {
              ellipsis: true,
              width: 150,
              title: t('table.vendorAddress'),
              render: (_, record) => record.vendor_address,
            },
            {
              ellipsis: true,
              width: 200,
              title: t('table.mobile'),
              render: (_, record) => record.vendor_phone.phone,
            },
            {
              ellipsis: true,
              width: 120,
              align: 'center',
              title: t('table.vatIncluded'),
              render: (_, record) => (
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  <Popconfirm
                    title={t('description.update tax included')}
                    okText={t('yes')}
                    cancelText={t('no')}
                    onConfirm={() => {
                      vendorUpdateMutation.mutate({
                        id: record.id,
                        is_vat_included: !record.is_vat_included,
                      });
                    }}
                  >
                    <Switch
                      checkedChildren={t('button.include')}
                      checked={record.is_vat_included}
                      style={{ width: '52px' }}
                    />
                  </Popconfirm>
                </div>
              ),
            },
            {
              width: 70,
              align: 'center',
              title: t('table.memo'),
              render: (_, record) => (
                <MemoIcon
                  value={record.memo}
                  onClick={() => {
                    setSelectedRow(record);
                    openMemoModal();
                  }}
                />
              ),
            },
            {
              width: 45,
              title: '편집',
              align: 'center',
              render: (record) => (
                <TurtleDropdown
                  items={[
                    {
                      key: '1',
                      label: '거래처명 수정',
                      icon: <TurtleIcon name="updateVendorName" />,
                      onClick: () => {
                        openUpdateVendorNameModal();
                      },
                    },

                    {
                      key: '2',
                      label: '정보수정 요청',
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
                          삭제
                        </span>
                      ),
                      icon: <TurtleIcon name="delete" danger />,
                      onClick: () => {
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

export default PageBody;
