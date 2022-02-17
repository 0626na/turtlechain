import { message, Modal, Pagination, Popover, Radio, Row, Space, Table, Tooltip } from "antd";
import { vendorAPI } from "apis";
import { RequestSearchWholesale, VendorAccount, Wholesale } from "apis/vendorAPI";
import { AxiosError } from "axios";
import TurtleBadge from "components/common/TurtleBadge";
import TurtleButtonSub from "components/common/TurtleButtonSub";
import SearchFilter from "components/SearchFilter";
import { useState } from "react";
import { useQuery } from "react-query";
import { t } from "i18next";

interface Props {
  visible: boolean;
  closeModal: () => void;
  selectRow: (wholeSaleStore: Wholesale) => void;
}

function SearchWholesaleModal({ visible, closeModal, selectRow }: Props) {
  const [list, setList] = useState<Array<Wholesale>>([]);

  const [searchQuery, setSearchQuery] = useState<RequestSearchWholesale>({
    page: 1,
    type: "all",
    search_string: "",
  });

  const searchWholesaleQuery = useQuery(
    ["searchWholesale", searchQuery],
    () => vendorAPI.searchWholesale(searchQuery),
    {
      onError: (error: AxiosError) => {
        message.error(error.response?.data?.msg);
      },
      onSuccess: (data) => {
        setList(data.data.vendor_list);
      },
    },
  );

  const onClickSelect = (record: Wholesale) => {
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
  };

  const selectPage = (page: number) => {
    setSearchQuery({ ...searchQuery, page });
  };

  const searchWholesale = ({ type, search_string }: { type: string; search_string: string }) => {
    setSearchQuery({ page: 1, type, search_string });
  };

  return (
    <Modal
      centered
      width="70%"
      maskClosable={false}
      title={t("vendor.search")}
      visible={visible}
      onCancel={closeModal}
      footer={false}
      getContainer={false}
      bodyStyle={{ height: "700px", overflowY: "auto" }}
    >
      <Row>
        <SearchFilter type="vendor" onSearch={searchWholesale} />
      </Row>

      <Table
        size="small"
        style={{ padding: "24px 0px" }}
        loading={searchWholesaleQuery.isLoading}
        dataSource={list}
        rowKey={(record) => record.id}
        pagination={false}
        columns={[
          {
            width: "20%",
            ellipsis: true,
            title: t("vendor.name"),
            render: (_, record) => record.name,
          },
          {
            width: "18%",
            ellipsis: true,
            title: t("vendor.address"),
            render: (_, record) => {
              const address = `${record.building} ${record.floor}${record.floor ? "층" : ""} ${
                record.col
              }${record.col ? "열" : ""} ${record.loc}${record.floor ? "호" : ""} ${record.ext}`;
              return (
                <Tooltip placement="topLeft" title={address}>
                  {address}
                </Tooltip>
              );
            },
          },
          {
            width: "16%",
            ellipsis: true,
            title: t("vendor.store phone"),
            render: (_, record) => {
              if (record.store_phone.length === 1) {
                return (
                  <Tooltip placement="topLeft" title={record.store_phone[0].phone}>
                    {record.store_phone[0].phone}
                  </Tooltip>
                );
              }

              return (
                <TurtleBadge count={record.store_phone.length}>
                  <Popover
                    content={
                      <>
                        <p>이미 등록된 휴대번호</p>
                        <Radio.Group>
                          <Space direction="vertical">
                            {record.store_phone.map(({ id, phone }) => (
                              <Radio
                                value={phone}
                                key={id}
                                onClick={() => {
                                  const newList = list.map((vendor) =>
                                    vendor.id === record.id
                                      ? {
                                          ...vendor,
                                          store_phone: [
                                            {
                                              id,
                                              phone,
                                              send_alimtalk: true,
                                            },
                                          ],
                                        }
                                      : vendor,
                                  );
                                  setList(newList);
                                }}
                              >
                                {phone}
                              </Radio>
                            ))}
                          </Space>
                        </Radio.Group>
                      </>
                    }
                  >
                    {record.store_phone[0]?.phone}
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
                return (
                  <Tooltip placement="topLeft" title={makeAddress(record.store_account[0])}>
                    {makeAddress(record.store_account[0])}
                  </Tooltip>
                );
              }

              return (
                <TurtleBadge count={record.store_account.length}>
                  <Popover
                    content={
                      <>
                        <p>이미 등록된 계좌번호</p>
                        <Radio.Group>
                          <Space direction="vertical">
                            {record.store_account.map(
                              ({ id, bank, account_number, account_holder }) => (
                                <Radio
                                  key={id}
                                  value={account_number}
                                  onClick={() => {
                                    const newList = list.map((vendor) =>
                                      vendor.id === record.id
                                        ? {
                                            ...vendor,
                                            store_account: [
                                              {
                                                id,
                                                account_number,
                                                account_holder,
                                                bank,
                                              },
                                            ],
                                          }
                                        : vendor,
                                    );
                                    setList(newList);
                                  }}
                                >
                                  {makeAddress({ id, bank, account_number, account_holder })}
                                </Radio>
                              ),
                            )}
                          </Space>
                        </Radio.Group>
                      </>
                    }
                  >
                    {makeAddress(record.store_account[0])}
                  </Popover>
                </TurtleBadge>
              );
            },
          },
          {
            width: "13%",
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
      />
    </Modal>
  );
}

export default SearchWholesaleModal;
