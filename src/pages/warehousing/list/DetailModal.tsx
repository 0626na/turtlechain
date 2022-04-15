import { t } from "i18next";
import {
  Modal,
  Table,
  message,
  InputNumber,
  Button,
  Popconfirm,
  notification,
  Space,
  Checkbox,
} from "antd";
import { DeleteOutlined, SyncOutlined } from "@ant-design/icons";
import { useCallback, useEffect, useMemo, useState } from "react";
import { AxiosError } from "axios";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { warehousingAPI } from "apis";
import { WarehousingItemShow, WarehousingSheet } from "apis/warehousingAPI";
import { TurtleModal, TurtleStatistics, TurtleTableTitle } from "components/common";
import { NewSearchFilter } from "components/combine";

interface Props {
  visible: boolean;
  onClose: () => void;
  sheet?: WarehousingSheet;
}

function DetailModal({ visible, onClose, sheet }: Props) {
  const queryClient = useQueryClient();
  const [itemList, setItemList] = useState<Array<WarehousingItemShow>>([]);
  const [searchQuery, setSearchQuery] = useState({
    type: "all",
    search_string: "",
  });
  const [isUpdated, setIsUpdated] = useState(false);

  // 입고장 상세내역 리스트 요청
  const getItemQuery = useQuery(
    ["getWarehousingItem"],
    () => warehousingAPI.getItem({ sheet_id: sheet?.id! }),
    {
      enabled: visible && !!sheet?.id,
      onError: (error: AxiosError) => {
        message.error(error.response?.data?.msg);
      },
      onSuccess: (data) => {
        setItemList(data.data.item_list);
      },
    },
  );

  // 입고장 상세내역 수정 요청
  const updateItemQuery = useMutation(
    ["updateWarehousingItem"], //
    warehousingAPI.updateItem,
    {
      onError: (error: AxiosError) => {
        message.error(error.response?.data?.msg);
      },
      onSuccess: () => {
        notification.open({
          type: "success",
          message: t("message.success update warehousing detail list"),
        });
        queryClient.refetchQueries("getWarehousingSheet");
        onClose();
      },
    },
  );

  // 모달 열릴때마다 변경사항 여부 초기화
  useEffect(() => {
    setIsUpdated(false);
  }, [visible]);

  // 모달창 닫기
  const confirmClose = () => {
    if (!isUpdated) {
      onClose();
      return;
    }
    Modal.confirm({
      title: t("description.changed data"),
      cancelText: t("button.return"),
      okText: t("button.close"),
      onCancel: () => {},
      onOk: () => {
        onClose();
      },
    });
  };

  // itemList 값 수정
  const updateItemList = useCallback((type: string, index, value) => {
    setItemList((itemList) =>
      itemList.map((item) => (item.id === index ? { ...item, [type]: value } : item)),
    );
    setIsUpdated(true);
  }, []);

  // 상품 삭제
  const deleteProduct = useCallback((record) => {
    setItemList((itemList) =>
      itemList.map((item) => (item.id === record.id ? { ...item, is_inactive: true } : item)),
    );
    setIsUpdated(true);
  }, []);

  // 모달 열릴때 마다 검색조건 초기화
  useEffect(() => {
    setSearchQuery({
      type: "all",
      search_string: "",
    });
  }, [visible]);

  const filteredList = useMemo(
    () =>
      itemList
        .filter((item) => !item.is_inactive)
        .filter((item) => {
          const { type, search_string } = searchQuery;
          if (type === "name") {
            return item.product_info.name.includes(search_string);
          }
          if (type === "vendor_product_name") {
            return item.product_info.vendor_product_name.includes(search_string);
          }
          if (type === "vendor_name") {
            return item.vendor_info.vendor_name.includes(search_string);
          }
          return (
            item.product_info.name.includes(search_string) ||
            item.product_info.vendor_product_name.includes(search_string) ||
            item.vendor_info.vendor_name.includes(search_string)
          );
        }),
    [itemList, searchQuery],
  );

  return (
    <TurtleModal //
      centered
      width="90%"
      bodyStyle={{ height: "80vh", overflow: "auto" }}
      title={`${t("warehousing.detail list")}`}
      visible={visible}
      onCancel={confirmClose}
      footer={
        !sheet?.is_confirmed && [
          <Popconfirm
            title={t("description.really update")}
            okText={t("yes")}
            cancelText={t("no")}
            onConfirm={() => {
              updateItemQuery.mutate({
                sheet_id: sheet?.id!,
                items: itemList.map(({ id, is_inactive, is_reserved, count }) => ({
                  id,
                  is_inactive,
                  is_reserved,
                  count,
                })),
              });
            }}
          >
            <Button //
              type="primary"
              icon={<SyncOutlined />}
              loading={updateItemQuery.isLoading}
            >
              {t("reflect update")}
            </Button>
          </Popconfirm>,
        ]
      }
    >
      <TurtleStatistics
        value={[
          { title: t("warehousing.date"), value: `${sheet?.created_date}` },
          { title: t("warehousing.total count"), value: `${sheet?.total_item_count}건` },
          { title: t("total supply price"), value: `${sheet?.total_price.toLocaleString()}원` },
        ]}
      />

      <Table
        size="small"
        loading={getItemQuery.isLoading}
        pagination={false}
        dataSource={filteredList}
        rowKey={(item) => item.id}
        style={{ height: "60vh" }}
        title={() => (
          <TurtleTableTitle
            count={itemList.filter((item) => !item.is_inactive).length}
            searchCount={filteredList.length}
          >
            <NewSearchFilter searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
          </TurtleTableTitle>
        )}
        columns={[
          {
            ellipsis: true,
            title: t("vendor.name"),
            render: (_, record) => record.vendor_info.vendor_name,
          },
          {
            ellipsis: true,
            title: t("vendor.address"),
            render: (_, record) => record.vendor_info.vendor_address,
          },
          {
            ellipsis: true,
            title: t("product.code"),
            render: (_, record) => record.product_info.product_code,
          },
          {
            ellipsis: true,
            title: t("product.name"),
            render: (_, record) => record.product_info.name,
          },
          {
            ellipsis: true,
            title: t("product.vendor product name"),
            render: (_, record) => record.product_info.vendor_product_name,
          },
          {
            ellipsis: true,
            title: t("product.option"),
            render: (_, record) => record.product_info.option,
          },
          {
            ellipsis: true,
            title: t("product.price"),
            render: (_, record) => record.price.toLocaleString(),
          },
          {
            ellipsis: true,
            title: t("warehousing.count"),
            render: (_, record) => (
              <InputNumber //
                disabled={sheet?.is_confirmed}
                min={1}
                size="small"
                defaultValue={record.count}
                onChange={(value) => {
                  updateItemList("count", record.id, value);
                }}
              />
            ),
          },
          {
            ellipsis: true,
            title: t("warehousing.is reserved"),
            render: (_, record) => (
              <Checkbox
                checked={record.is_reserved}
                disabled={sheet?.is_confirmed}
                onChange={() => {
                  updateItemList("is_reserved", record.id, !record.is_reserved);
                }}
              />
            ),
          },
          {
            width: 100,
            align: "center",
            title: "",
            dataIndex: "action",
            render: (_, record) => (
              <Space>
                {!sheet?.is_confirmed && (
                  <DeleteOutlined
                    style={{ cursor: "pointer", color: "#A1A2A6" }}
                    onClick={() => {
                      deleteProduct(record);
                    }}
                  />
                )}
              </Space>
            ),
          },
        ]}
      />
    </TurtleModal>
  );
}

export default DetailModal;
