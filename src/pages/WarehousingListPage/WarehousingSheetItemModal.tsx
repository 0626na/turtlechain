import { useEffect } from "react";
import { useTranslation } from "react-i18next";

import { AxiosError } from "axios";
import { useQuery, useQueryClient } from "react-query";
import warehousingAPI from "apis/warehousingAPI";

import { Modal, Table, message } from "antd";

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

  // 입고장 상세내역 리스트 요청
  const getSheetItemQuery = useQuery(
    ["getSheetItem"],
    () => warehousingAPI.getSheetItem(sheet_id),
    {
      enabled: visible && sheet_id > 0 ? true : false,
      onError: (error: AxiosError) => {
        message.error(error.response?.data?.msg);
      },
    }
  );

  useEffect(() => {
    if (!visible) {
      return () => {
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
      <Table
        size="small"
        pagination={false}
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
            title: t("product name"),
            dataIndex: "product_name",
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
          },
          {
            title: t("product price"),
            dataIndex: "price",
          },
        ]}
        dataSource={
          getSheetItemQuery.data?.data ? getSheetItemQuery.data?.data : []
        }
      />
    </Modal>
  );
};

export default WarehousingSheetItemModal;
