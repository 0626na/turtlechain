import { t } from 'i18next';
import { Modal, Pagination, Row, Table } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { useRecoilValue } from 'recoil';
import { storeState } from '@store/storeState';
import { phonePattern } from '@utils/pattern';
import vendorAPI, { RequestGet } from '@apis/vendorAPI';
import { TurtleTableTitle } from '@components/element';
import SearchFilter from '../SearchFilter';
import { css } from '@emotion/react';

interface Props {
  visible: boolean;
  closeModal: () => void;
  onClickSelect: (
    vendor_id: number,
    vendor_name: string,
    vendor_address: string,
    vendor_phone: string,
    is_vat_included: boolean,
  ) => void;
}

function SearchVendorModal({ visible, closeModal, onClickSelect }: Props) {
  const store = useRecoilValue(storeState);

  // 거래처 목록 불러오기 query
  const [searchQuery, setSearchQuery] = useState<RequestGet>({
    page: 1,
    type: 'name',
    search_string: '',
    rt_store_id: store.id,
  });

  // 거래처 목록 불러오기 요청
  const getListQuery = useQuery(
    ['getVendor', searchQuery], //
    () => vendorAPI.get({ ...searchQuery, rt_store_id: store.id ?? -1 }),
    {
      enabled: visible && !!store.id,
    },
  );

  const selectPage = useCallback(
    (page: number) => {
      setSearchQuery({ ...searchQuery, page });
    },
    [searchQuery],
  );

  useEffect(() => {
    if (visible) return;
    setSearchQuery({
      page: 1,
      type: 'name',
      search_string: '',
      rt_store_id: store.id,
    });
  }, [visible, store.id]);

  return (
    <Modal
      css={modal}
      centered
      width="55%"
      title={t('vendor.search')}
      visible={visible}
      onCancel={closeModal}
      footer={false}
      bodyStyle={{ height: '60vh' }}
    >
      <Table
        size="small"
        scroll={{ y: 'auto' }}
        loading={getListQuery.isLoading}
        dataSource={getListQuery.data?.data.vendor_list}
        rowKey={(record) => record.id}
        pagination={false}
        title={() => (
          <TurtleTableTitle
            totalCount={getListQuery.data?.data.total_count ?? 0}
            rightContent={
              <SearchFilter
                vendor
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
              total={getListQuery.data?.data.total_count}
              showSizeChanger={false}
              current={searchQuery.page}
              onChange={selectPage}
            />
          </Row>
        )}
        onRow={(record) => {
          return {
            onClick: (event) => {
              onClickSelect(
                record.id,
                record.vendor_name,
                record.vendor_address,
                record.vendor_phone.phone,
                record.is_vat_included,
              );
            },
          };
        }}
        columns={[
          {
            ellipsis: true,
            width: '20%',
            title: t('vendor.name'),
            render: (_, record) => record.vendor_name,
          },
          {
            ellipsis: true,
            width: '20%',
            title: t('vendor.address'),
            render: (_, record) => record.vendor_address,
          },
          {
            ellipsis: true,
            width: '20%',
            title: t('vendor.store phone'),
            render: (_, record) =>
              record.vendor_phone.phone.replace(phonePattern, `$1-$2-$3`),
          },
          {
            ellipsis: true,
            title: t('vendor.account'),
            render: (_, record) =>
              `${record.vendor_account.bank} ${record.vendor_account.account_number} ${record.vendor_account.account_holder}`,
          },
        ]}
      />
    </Modal>
  );
}

const modal = css`
  .ant-modal-header {
    background-color: #f3f6f9;
  }
`;

export default SearchVendorModal;
