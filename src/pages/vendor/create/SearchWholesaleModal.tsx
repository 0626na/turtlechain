import { message, Modal, Pagination, Popover, Radio, Row, Space, Table } from "antd";
import { vendorAPI } from "apis";
import { RequestSearchWholesale, VendorAccount, Wholesale } from "apis/vendorAPI";
import { AxiosError } from "axios";
import { useCallback, useState } from "react";
import { useQuery } from "react-query";
import { t } from "i18next";
import { phonePattern } from "utils/pattern";
import styled from "styled-components";
import { TurtleBadge, TurtleButtonSub } from "components/common";
import { SearchFilter } from "components/combine";

interface Props {
  visible: boolean;
  closeModal: () => void;
  selectRow: (wholeSaleStore: Wholesale) => void;
}

function SearchWholesaleModal({ visible, closeModal, selectRow }: Props) {
  const [wholesaleList, setWholesaleList] = useState<Array<Wholesale>>([]);

  const [searchQuery, setSearchQuery] = useState<RequestSearchWholesale>({
    page: 1,
    type: "all",
    search_string: "",
  });

  // master 도매 검색 요청
  const searchWholesaleQuery = useQuery(
    ["searchWholesale", searchQuery],
    () => vendorAPI.searchWholesale(searchQuery),
    {
      onError: (error: AxiosError) => {
        message.error(error.response?.data?.msg);
      },
      onSuccess: (data) => {
        setWholesaleList(data.data.vendor_list);
      },
    },
  );

  const onClickSelect = useCallback(
    (record: Wholesale) => {
      if (record.store_phone.length !== 1) {
        message.warning("휴대번호를 선택해주세요");
        return;
      }
      if (record.store_account.length !== 1) {
        message.warning("계좌번호를 선택해주세요");
        return;
      }
      selectRow(record);
      setSearchQuery({
        page: 1,
        type: "all",
        search_string: "",
      });
    },
    [selectRow],
  );

  const selectPage = useCallback(
    (page: number) => {
      setSearchQuery({ ...searchQuery, page });
    },
    [searchQuery],
  );

  const searchWholesale = useCallback(
    ({ type, search_string }: { type: string; search_string: string }) => {
      setSearchQuery({ page: 1, type, search_string });
    },
    [],
  );

  const selectStorePhone = useCallback(
    (record, storePhone) => {
      setWholesaleList(
        wholesaleList.map((vendor) =>
          vendor.id === record.id
            ? {
                ...vendor,
                store_phone: [storePhone],
              }
            : vendor,
        ),
      );
    },
    [wholesaleList],
  );

  const selectStoreAccount = useCallback(
    (record, storeAccount) => {
      setWholesaleList(
        wholesaleList.map((vendor) =>
          vendor.id === record.id
            ? {
                ...vendor,
                store_account: [storeAccount],
              }
            : vendor,
        ),
      );
    },
    [wholesaleList],
  );

  return (
    <StyledModal
      centered
      width="60%"
      maskClosable={false}
      title={t("vendor.search")}
      visible={visible}
      onCancel={closeModal}
      footer={false}
      bodyStyle={{ height: "75vh", overflowY: "auto" }}
    >
      <Table
        size="small"
        loading={searchWholesaleQuery.isLoading}
        dataSource={wholesaleList}
        rowKey={(record) => record.id}
        pagination={false}
        scroll={{ y: "auto" }}
        title={() => (
          <Row justify="space-between">
            {`총 ${searchWholesaleQuery.data?.data.total_count ?? 0}개`}
            <SearchFilter type="vendor" onSearch={searchWholesale} />
          </Row>
        )}
        footer={() => (
          <Row justify="center">
            <Pagination
              size="small"
              total={searchWholesaleQuery.data?.data.total_count}
              showSizeChanger={false}
              current={searchQuery.page}
              onChange={selectPage}
            />
          </Row>
        )}
        columns={[
          {
            ellipsis: true,
            width: "20%",
            title: t("vendor.name"),
            render: (_, record) => record.name,
          },
          {
            ellipsis: true,
            width: "20%",
            title: t("vendor.address"),
            render: (_, record) => {
              return `${record.building} ${record.floor && record.floor + "층"} ${
                record.col && record.col + "열"
              } ${record.loc && record.loc + "호"} ${record.ext}`;
            },
          },
          {
            ellipsis: true,
            width: "20%",
            title: t("vendor.store phone"),
            render: (_, record) => {
              if (record.store_phone.length === 1) {
                return record.store_phone[0].phone.replace(phonePattern, `$1-$2-$3`);
              }

              return (
                <TurtleBadge count={record.store_phone.length}>
                  <Popover
                    content={
                      <>
                        <Radio.Group>
                          <Space direction="vertical">
                            {record.store_phone.map((storePhone) => (
                              <Radio
                                value={storePhone.phone}
                                key={storePhone.id}
                                onClick={() => {
                                  selectStorePhone(record, storePhone);
                                }}
                              >
                                {storePhone.phone.replace(phonePattern, `$1-$2-$3`)}
                              </Radio>
                            ))}
                          </Space>
                        </Radio.Group>
                      </>
                    }
                  >
                    <span style={{ color: "red", cursor: "pointer" }}>
                      {record.store_phone[0]?.phone.replace(phonePattern, `$1-$2-$3`)}
                    </span>
                  </Popover>
                </TurtleBadge>
              );
            },
          },
          {
            ellipsis: true,
            title: t("vendor.account"),
            render: (_, record) => {
              const makeAddress = ({ bank, account_number, account_holder }: VendorAccount) => {
                return `${bank} ${account_number} ${account_holder}`;
              };

              if (record.store_account.length === 0) {
                return;
              }
              if (record.store_account.length === 1) {
                return makeAddress(record.store_account[0]);
              }

              return (
                <TurtleBadge count={record.store_account.length}>
                  <Popover
                    content={
                      <>
                        <Radio.Group>
                          <Space direction="vertical">
                            {record.store_account.map((storeAccount) => (
                              <Radio
                                key={storeAccount.id}
                                value={storeAccount.account_number}
                                onClick={() => {
                                  selectStoreAccount(record, storeAccount);
                                }}
                              >
                                {makeAddress(storeAccount)}
                              </Radio>
                            ))}
                          </Space>
                        </Radio.Group>
                      </>
                    }
                  >
                    <span style={{ color: "red", cursor: "pointer" }}>
                      {makeAddress(record.store_account[0])}
                    </span>
                  </Popover>
                </TurtleBadge>
              );
            },
          },
          {
            width: 100,
            align: "center",
            title: "",
            render: (_, record) => (
              <TurtleButtonSub //
                size="small"
                color="green"
                onClick={() => onClickSelect(record)}
              >
                {t("button.select")}
              </TurtleButtonSub>
            ),
          },
        ]}
      />
    </StyledModal>
  );
}

const StyledModal = styled(Modal)`
  .ant-modal-header {
    background-color: #f3f6f9;
  }
`;

export default SearchWholesaleModal;
