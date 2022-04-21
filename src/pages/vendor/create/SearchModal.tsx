import { message, Pagination, Popover, Radio, Row, Space, Table } from "antd";
import { vendorAPI } from "apis";
import { RequestGetWholesale, VendorAccount, WholesaleShow } from "apis/vendorAPI";
import { AxiosError } from "axios";
import { useCallback, useState } from "react";
import { useQuery } from "react-query";
import { t } from "i18next";
import { phonePattern } from "utils/pattern";
import { TurtleBadge, TurtleButtonSub, TurtleModal, TurtleTableTitle } from "components/common";
import { NewSearchFilter } from "components/combine";

interface Props {
  visible: boolean;
  closeModal: () => void;
  selectRow: (wholeSaleStore: WholesaleShow) => void;
}

function SearchModal({ visible, closeModal, selectRow }: Props) {
  const [wholesaleList, setWholesaleList] = useState<Array<WholesaleShow>>([]);

  const [searchQuery, setSearchQuery] = useState<RequestGetWholesale>({
    page: 1,
    type: "all",
    search_string: "",
  });

  // master 도매 검색 요청
  const getWholesaleQuery = useQuery(
    ["getWholesale", searchQuery],
    () => vendorAPI.getWholesale(searchQuery),
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
    (record: WholesaleShow) => {
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
    <TurtleModal
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
        loading={getWholesaleQuery.isLoading}
        dataSource={wholesaleList}
        rowKey={(record) => record.id}
        pagination={false}
        scroll={{ y: "auto" }}
        title={() => (
          <TurtleTableTitle count={getWholesaleQuery.data?.data.total_count ?? 0}>
            <NewSearchFilter vendor searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
          </TurtleTableTitle>
        )}
        footer={() => (
          <Row justify="center">
            <Pagination
              size="small"
              total={getWholesaleQuery.data?.data.total_count}
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
    </TurtleModal>
  );
}

export default SearchModal;
