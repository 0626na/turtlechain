import { t } from "i18next";
import { Modal, Table, message, InputNumber, Button, Popconfirm, notification, Space } from "antd";
import { DeleteOutlined, SyncOutlined } from "@ant-design/icons";
import { useCallback, useEffect, useMemo, useState } from "react";
import { AxiosError } from "axios";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { warehousingAPI } from "apis";
import { WarehousingItemShow, WarehousingSheet } from "apis/warehousingAPI";
import { TurtleModal, TurtleStatistics, TurtleTableTitle } from "components/common";

interface Props {
  visible: boolean;
  onClose: () => void;
  sheet?: WarehousingSheet;
}

function DetailModal({ visible, onClose, sheet }: Props) {
  const queryClient = useQueryClient();
  const [itemList, setItemList] = useState<Array<WarehousingItemShow>>([]);
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

  // 필터된 리스트
  const filteredList = useMemo(() => itemList.filter((item) => !item.is_inactive), [itemList]);

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

  // 수량 변경
  const setCount = useCallback((record, count) => {
    setItemList((itemList) =>
      itemList.map((item) => (item.id === record.id ? { ...item, count } : item)),
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
                items: itemList.map(({ id, is_inactive, count }) => ({
                  id,
                  is_inactive,
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
        style={{ height: "60vh", paddingTop: 30 }}
        title={() => <TurtleTableTitle count={filteredList.length ?? 0}></TurtleTableTitle>}
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
                  setCount(record, value);
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
