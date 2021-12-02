import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { AxiosError } from "axios";
import { useQuery, useQueryClient } from "react-query";
import warehousingAPI, { SheetItemList } from "apis/warehousingAPI";

import { Modal, Form, Select, Table, message, Input, InputNumber } from "antd";

type SearchType = "store_name" | "product_code" | "product_name";

interface Props {
  visible?: boolean;
  sheet_id?: number;
  mall_name?: string;
  created_time?: string;
  onClose?: () => void;
}

const WarehousingSheetItemModal = function ({
  visible = false,
  sheet_id = -1,
  mall_name = "",
  created_time = "",
  onClose,
}: Props) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const [searchType, setSearchType] = useState<SearchType>("store_name");
  const [searchText, setSearchText] = useState("");
  const [dataSource, setDataSource] = useState<SheetItemList>([]);

  // 입고장 상세내역 리스트 요청
  const getSheetItemQuery = useQuery(
    ["getSheetItem"],
    () => warehousingAPI.getSheetItem(sheet_id),
    {
      enabled: visible && sheet_id > 0 ? true : false,
      onError: (error: AxiosError) => {
        message.error(error.response?.data?.msg);
      },
      onSuccess: (data) => {
        setDataSource(data.data);
      },
    }
  );

  // 데이터 리셋
  useEffect(() => {
    if (!visible) {
      return () => {
        setDataSource([]);
        queryClient.removeQueries(["getSheetItem"]);
      };
    }
  }, [visible, queryClient]);

  return (
    <Modal //
      width="90%"
      maskClosable={false}
      visible={visible}
      onCancel={onClose}
      title={`${mall_name} ${t("warehousing detail list")}`}
      footer={[]}
    >
      <Form //
        style={{ margin: "10px 0" }}
        layout="inline"
      >
        <Form.Item>
          <Select
            value={searchType}
            onChange={(value) => {
              setSearchType(value);
            }}
          >
            <Select.Option value="store_name">
              {t("wholesaler name")}
            </Select.Option>
            <Select.Option value="address">
              {t("wholesaler address")}
            </Select.Option>
            <Select.Option value="product_code">
              {t("product code")}
            </Select.Option>
            <Select.Option value="product_name">
              {t("product name")}
            </Select.Option>
          </Select>
        </Form.Item>
        <Form.Item>
          <Input
            value={searchText}
            placeholder={t("search text")}
            onChange={(e) => {
              setSearchText(e.target.value);
            }}
          />
        </Form.Item>
      </Form>
      <Table
        size="small"
        loading={getSheetItemQuery.isLoading}
        pagination={false}
        dataSource={dataSource.filter((item) => {
          if (item[searchType].toString().indexOf(searchText) !== -1) {
            return true;
          } else {
            return false;
          }
        })}
        columns={[
          {
            title: t("wholesaler name"),
            dataIndex: "store_name",
            render: (_, record) => {
              return (
                <Input //
                  size="small"
                  defaultValue={record.store_name}
                  onChange={(e) => {
                    const { value } = e.target;
                    const newDataSource = dataSource.map((item) => {
                      if (item.id === record.id) {
                        return { ...item, store_name: value };
                      } else {
                        return item;
                      }
                    });
                    setDataSource(newDataSource);
                  }}
                />
              );
            },
          },
          {
            title: t("wholesaler address"),
            dataIndex: "address",
            render: (_, record) => {
              return (
                <Input //
                  size="small"
                  defaultValue={record.address}
                  onChange={(e) => {
                    const { value } = e.target;
                    const newDataSource = dataSource.map((item) => {
                      if (item.id === record.id) {
                        return { ...item, address: value };
                      } else {
                        return item;
                      }
                    });
                    setDataSource(newDataSource);
                  }}
                />
              );
            },
          },
          {
            title: t("product code"),
            dataIndex: "product_code",
            render: (_, record) => {
              return (
                <InputNumber //
                  size="small"
                  value={record.product_code}
                  onChange={(value) => {
                    const newDataSource = dataSource.map((item) => {
                      if (item.id === record.id) {
                        return { ...item, product_code: value };
                      } else {
                        return item;
                      }
                    });
                    setDataSource(newDataSource);
                  }}
                />
              );
            },
          },
          {
            title: t("product name"),
            dataIndex: "product_name",
            render: (_, record) => {
              return (
                <Input //
                  size="small"
                  defaultValue={record.product_name}
                  onChange={(e) => {
                    const { value } = e.target;
                    const newDataSource = dataSource.map((item) => {
                      if (item.id === record.id) {
                        return { ...item, product_name: value };
                      } else {
                        return item;
                      }
                    });
                    setDataSource(newDataSource);
                  }}
                />
              );
            },
          },
          {
            title: t("size"),
            dataIndex: "size",
          },
          {
            title: t("color"),
            dataIndex: "color",
          },
          {
            title: t("warehousing quantity"),
            dataIndex: "count",
            render: (_, record) => {
              return (
                <InputNumber //
                  size="small"
                  value={record.count}
                  onChange={(value) => {
                    const newDataSource = dataSource.map((item) => {
                      if (item.id === record.id) {
                        return { ...item, count: value };
                      } else {
                        return item;
                      }
                    });
                    setDataSource(newDataSource);
                  }}
                />
              );
            },
          },
          {
            title: t("product price"),
            dataIndex: "price",
            render: (_, record) => {
              return (
                <InputNumber //
                  size="small"
                  defaultValue={record.price}
                  onChange={(value) => {
                    const newDataSource = dataSource.map((item) => {
                      if (item.id === record.id) {
                        return { ...item, price: value };
                      } else {
                        return item;
                      }
                    });
                    setDataSource(newDataSource);
                  }}
                />
              );
            },
          },
        ]}
      />
    </Modal>
  );
};

export default WarehousingSheetItemModal;
