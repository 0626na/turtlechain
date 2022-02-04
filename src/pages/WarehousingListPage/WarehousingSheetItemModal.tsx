import styled from "styled-components";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { AxiosError } from "axios";
import { useQuery, useMutation, useQueryClient } from "react-query";
import warehousingAPI, { WarehousingSheetItem } from "apis/warehousingAPI";
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

  type SearchType = "store_name" | "address" | "product_code" | "product_name";
  const [searchType, setSearchType] = useState<SearchType>("store_name");
  const [searchText, setSearchText] = useState("");
  const search_options = [
    {
      value: "store_name",
      label: t("client name"),
    },
    {
      value: "address",
      label: t("client address"),
    },
    {
      value: "product_code",
      label: t("product code"),
    },
    {
      value: "product_name",
      label: t("product name"),
    },
  ];

  const [list, setList] = useState<Array<WarehousingSheetItem>>([]);
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
    },
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
    },
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
    [list],
  );

  // 공급가 합계
  const totalItemPrice = useMemo(
    () =>
      list.reduce((acc, cur) => {
        if (!cur.is_deleted) {
          return acc + cur.count * cur.price;
        } else {
          return 0;
        }
      }, 0),
    [list],
  );

  // 필터된 리스트
  const filteredList = useMemo(
    () =>
      list.filter((item) =>
        item[searchType].toString().indexOf(searchText) !== -1 &&
        !item.is_deleted
          ? true
          : false,
      ),
    [list, searchType, searchText],
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
      title={`${mall_name} ${t("warehousing.detail list")}`}
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
              title={t("warehousing.date")}
              value={created_time}
            />
          </Card>
          <Card>
            <Statistic //
              title={t("warehousing.total count")}
              value={totalItemCount}
            />
          </Card>
          <Card>
            <Statistic //
              title={t("total supply price")}
              value={totalItemPrice}
            />
          </Card>
        </StatisticContainer>
        <Form layout="inline">
          <Form.Item>
            <Select
              style={{ width: 150 }}
              value={searchType}
              onChange={(value) => {
                setSearchType(value);
              }}
            >
              {search_options.map((item) => (
                <Select.Option key={item.value} value={item.value}>
                  {item.label}
                </Select.Option>
              ))}
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
              title: t("client name"),
              dataIndex: "store_name",
            },
            {
              title: t("client address"),
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
              title: t("warehousing.count"),
              dataIndex: "count",
              render: (_, record) => (
                <InputNumber //
                  size="small"
                  defaultValue={record.count}
                  onChange={(value) => {
                    const newList = list.map((item) =>
                      item.product_code === record.product_code
                        ? { ...item, count: value }
                        : item,
                    );
                    setList(newList);
                    setIsUpdated(true);
                  }}
                />
              ),
            },
            {
              align: "right",
              title: t("supply price"),
              render: (_, record) => record.price.toLocaleString(),
            },
            {
              width: 100,
              align: "center",
              title: "",
              dataIndex: "action",
              render: (_, record) => (
                <Button //
                  danger
                  size="small"
                  shape="round"
                  type="primary"
                  icon={<DeleteFilled />}
                  onClick={() => {
                    const newList = list.filter(
                      (item) => item.product_code !== record.product_code,
                    );
                    setList(newList);
                    setIsUpdated(true);
                  }}
                >
                  {t("delete")}
                </Button>
              ),
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
  & > * + * {
    margin-top: 20px;
  }
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
