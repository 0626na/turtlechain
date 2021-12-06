import styled from "styled-components";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { AxiosError } from "axios";
import { useQuery, useMutation, useQueryClient } from "react-query";
import warehousingAPI, { SheetItem } from "apis/warehousingAPI";

import { DeleteFilled, SyncOutlined } from "@ant-design/icons";
import {
  Modal,
  Form,
  Select,
  Table,
  message,
  Input,
  InputNumber,
  Button,
  Popconfirm,
  notification,
  Statistic,
  Card,
} from "antd";

type SearchType = "store_name" | "address" | "product_code" | "product_name";

interface Props {
  visible: boolean;
  sheet_id: number;
  mall_name: string;
  created_time: string;
  is_confirmed: boolean;
  onClose: () => void;
  onUpdated: () => void;
}

const WarehousingSheetItemModal = function ({
  visible,
  sheet_id,
  mall_name,
  created_time,
  is_confirmed,
  onClose,
  onUpdated,
}: Props) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const [searchType, setSearchType] = useState<SearchType>("store_name");
  const [searchText, setSearchText] = useState("");
  const [list, setList] = useState<Array<SheetItem>>([]);
  const [isUpdated, setIsUpdated] = useState(false);

  // 입고장 상세내역 리스트 요청
  const getSheetItemQuery = useQuery(
    ["getSheetItem"],
    () => warehousingAPI.getSheetItem(sheet_id),
    {
      enabled: visible && sheet_id !== -1 ? true : false,
      onError: (error: AxiosError) => {
        message.error(error.response?.data?.msg);
      },
      onSuccess: (data) => {
        setList(data.data);
      },
    }
  );

  // 입고장 상세내역 수정 요청
  const updateSheetQuery = useMutation(
    ["updateSheet"],
    warehousingAPI.bulkUpdateSheetItem,
    {
      onError: (error: AxiosError) => {
        message.error(error.response?.data?.msg);
      },
      onSuccess: () => {
        notification.open({
          type: "success",
          message: t("message.success update warehousing detail list"),
        });
        onClose();
        onUpdated();
      },
    }
  );

  // 입고 수량 합계
  const totalItemCount = useMemo(
    () =>
      list.reduce((acc, cur) => {
        if (!cur.is_deleted) {
          return acc + cur.count;
        } else {
          return 0;
        }
      }, 0),
    [list]
  );

  // 입고 금액 합계
  const totalItemPrice = useMemo(
    () =>
      list.reduce((acc, cur) => {
        if (!cur.is_deleted) {
          return acc + cur.count * cur.price;
        } else {
          return 0;
        }
      }, 0),
    [list]
  );

  // 필터된 리스트
  const filteredList = useMemo(
    () =>
      list.filter((item) =>
        item[searchType].toString().indexOf(searchText) !== -1 &&
        !item.is_deleted
          ? true
          : false
      ),
    [list, searchType, searchText]
  );

  // 모달창 닫기 확인
  // 업데이트가 발새한 경우 실행
  const confirmClose = () => {
    Modal.confirm({
      title: t("description.changed data"),
      cancelText: t("close"),
      okText: t("reflect update"),
      onCancel: () => {
        onClose();
      },
      onOk: () => {
        updateSheetQuery.mutate({ sheet_id, items: list });
      },
    });
  };

  // 데이터 리셋
  useEffect(() => {
    if (!visible) {
      return () => {
        setSearchType("store_name");
        setSearchText("");
        setList([]);
        setIsUpdated(false);
        queryClient.removeQueries(["getSheetItem"]);
      };
    }
  }, [visible, queryClient]);

  return (
    <Modal //
      centered
      width="90%"
      maskClosable={false}
      visible={visible}
      onCancel={() => {
        if (isUpdated) {
          confirmClose();
        } else {
          onClose();
        }
      }}
      title={`${mall_name} ${t("warehousing detail list")}`}
      footer={
        !is_confirmed && [
          <Popconfirm
            title={t("description.really update")}
            okText={t("yes")}
            cancelText={t("no")}
            onConfirm={() => {
              updateSheetQuery.mutate({ sheet_id, items: list });
            }}
          >
            <Button
              type="primary"
              icon={<SyncOutlined />}
              loading={updateSheetQuery.isLoading}
            >
              {t("reflect update")}
            </Button>
          </Popconfirm>,
        ]
      }
    >
      <ModalInner>
        <StatisticContainer>
          <Card>
            <Statistic //
              title={t("warehousing time")}
              value={created_time}
            />
          </Card>
          <Card>
            <Statistic //
              title={t("warehousing total quantity")}
              value={totalItemCount}
            />
          </Card>
          <Card>
            <Statistic //
              title={t("warehousing total amount")}
              value={totalItemPrice}
            />
          </Card>
        </StatisticContainer>
        <Form //
          style={{ margin: "20px 0" }}
          layout="inline"
        >
          <Form.Item>
            <Select
              style={{ width: 150 }}
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
          dataSource={filteredList}
          rowKey={(record) => record.id}
          columns={[
            {
              title: t("wholesaler name"),
              dataIndex: "store_name",
            },
            {
              title: t("wholesaler address"),
              dataIndex: "address",
            },
            {
              title: t("product code"),
              dataIndex: "product_code",
            },
            {
              title: t("product name"),
              dataIndex: "product_name",
            },
            {
              title: t("option"),
              dataIndex: "option",
            },
            {
              align: "right",
              title: t("warehousing quantity"),
              dataIndex: "count",
              render: (_, record) => {
                return (
                  <InputNumber //
                    size="small"
                    value={record.count}
                    onChange={(value) => {
                      setIsUpdated(true);
                      setList(
                        list.map((item) =>
                          item.id === record.id
                            ? { ...item, count: value }
                            : item
                        )
                      );
                    }}
                  />
                );
              },
            },
            {
              align: "right",
              title: t("product price"),
              dataIndex: "price",
            },
            {
              title: "",
              dataIndex: "action",
              align: "center",
              render: (_, record) => {
                if (!is_confirmed) {
                  return (
                    <Button //
                      danger
                      icon={<DeleteFilled />}
                      size="small"
                      shape="round"
                      type="primary"
                      onClick={() => {
                        setIsUpdated(true);
                        setList(
                          list.map((item) =>
                            item.id === record.id
                              ? { ...item, is_deleted: true }
                              : item
                          )
                        );
                      }}
                    >
                      {t("delete")}
                    </Button>
                  );
                }
              },
            },
          ]}
        />
      </ModalInner>
    </Modal>
  );
};

const ModalInner = styled.div`
  height: 70vh;
  overflow: auto;
`;

const StatisticContainer = styled.div`
  display: flex;
  & > * + * {
    margin-left: 20px;
  }
  * {
    font-size: 1rem;
  }
`;

export default WarehousingSheetItemModal;
