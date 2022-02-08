import { message, Modal, Popover, Radio, Row, Space, Table, Tooltip } from "antd";
import { vendorAPI } from "apis";
import { RequestSearchVendor, VendorAccount, WholeSaleStore } from "apis/vendorAPI";
import { AxiosError } from "axios";
import TurtleBadge from "components/common/TurtleBadge";
import TurtleButton from "components/common/TurtleButton";
import TurtleButtonSub from "components/common/TurtleButtonSub";
import SearchFilter from "components/SearchFilter";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "react-query";

interface Props {
  visible: boolean;
  closeModal: () => void;
  selectRow: (wholeSaleStore: WholeSaleStore) => void;
}

function SearchVendorsModal({ visible, closeModal, selectRow }: Props) {
  const { t } = useTranslation();

  const [list, setList] = useState<Array<WholeSaleStore>>([]);

  const [searchQuery, setSearchQuery] = useState<RequestSearchVendor>({
    type: "all",
    search_query: "",
  });

  const searchVendorQuery = useQuery(
    ["searchVendor", searchQuery],
    () => vendorAPI.searchVendor(searchQuery),
    {
      onError: (error: AxiosError) => {
        message.error(error.response?.data?.msg);
      },
      onSuccess: (data) => {
        setList(data.data.vendor_list);
      },
    },
  );

  const onClickSelect = (record: WholeSaleStore) => {
    selectRow(record);
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
      bodyStyle={{ height: "600px", overflowY: "auto" }}
      forceRender
    >
      <Row>
        <SearchFilter
          onSearch={({ type, search_query }: RequestSearchVendor) => {
            setSearchQuery({ ...searchQuery, type, search_query });
          }}
        />
      </Row>

      <Table
        size="small"
        scroll={{ x: "auto" }}
        style={{ padding: "24px 0px" }}
        loading={searchVendorQuery.isLoading}
        dataSource={list}
        rowKey={(record) => record.id}
        pagination={false}
        columns={[
          {
            width: "10%",
            ellipsis: true,
            title: t("vendor.name"),
            dataIndex: "name",
            render: (name) => (
              <Tooltip placement="topLeft" title={name}>
                {name}
              </Tooltip>
            ),
          },
          {
            width: "20%",
            ellipsis: true,
            title: t("vendor.address"),
            dataIndex: "",
            render: ({ building, floor, col, loc, ext }) => {
              const address = `${building} ${floor}${floor ? "층" : ""} ${col}${
                col ? "열" : ""
              } ${loc}${floor ? "호" : ""} ${ext}`;
              return (
                <Tooltip placement="topLeft" title={address}>
                  {address}
                </Tooltip>
              );
            },
          },
          {
            width: "15%",
            ellipsis: true,
            title: t("vendor.store phone"),
            dataIndex: "",
            render: (_, record) => {
              const phones: Array<string> = [];
              record.store_phone.forEach(({ phone }) => {
                phones.push(phone);
              });

              if (record.store_phone.length === 1) {
                return record.store_phone[0].phone;
              }

              return (
                <TurtleBadge count={phones.length}>
                  <Popover
                    content={
                      <>
                        <p>이미 등록된 휴대번호</p>
                        <Radio.Group>
                          <Space direction="vertical">
                            {phones.map((phone) => (
                              <Radio
                                value={phone}
                                key={phone}
                                onClick={() => {
                                  const newList = list.map((vendor) =>
                                    vendor.id === record.id
                                      ? {
                                          ...vendor,
                                          store_phone: [
                                            {
                                              id: 0,
                                              phone: phone,
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
                    {phones[0]}
                  </Popover>
                </TurtleBadge>
              );
            },
          },
          {
            width: "15%",
            ellipsis: true,
            title: t("vendor.account"),
            dataIndex: "",
            render: (_, record) => {
              const accounts: Array<VendorAccount> = [];
              record.store_account.forEach(({ id, bank, account_holder, account_number }) => {
                accounts.push({ id, bank, account_holder, account_number });
              });

              const makeContent = (store_account?: VendorAccount) => {
                return `${store_account?.bank} ${store_account?.account_number} ${store_account?.account_holder}`;
              };

              if (accounts.length === 1) {
                return makeContent(accounts[0]);
              } else {
                return (
                  <TurtleBadge count={accounts.length}>
                    <Popover
                      content={
                        <div>
                          <p>이미 등록된 계좌번호</p>
                          <Radio.Group>
                            <Space direction="vertical">
                              {accounts.map((account) => (
                                <Radio
                                  key={account.id}
                                  value={account.account_number}
                                  onClick={() => {
                                    const newList = list.map((vendor) =>
                                      vendor.id === record.id
                                        ? {
                                            ...vendor,
                                            store_account: [
                                              {
                                                id: account.id,
                                                account_number: account.account_number,
                                                account_holder: account.account_holder,
                                                bank: account.bank,
                                              },
                                            ],
                                          }
                                        : vendor,
                                    );
                                    setList(newList);
                                  }}
                                >
                                  {makeContent(account)}
                                </Radio>
                              ))}
                            </Space>
                          </Radio.Group>
                        </div>
                      }
                    >
                      {makeContent(accounts[0])}
                    </Popover>
                  </TurtleBadge>
                );
              }
            },
          },
          {
            width: "10%",
            align: "center",
            title: "",
            dataIndex: "action",
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
    </Modal>
  );
}

export default SearchVendorsModal;
