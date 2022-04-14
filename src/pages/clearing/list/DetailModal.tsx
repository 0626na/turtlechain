import { t } from "i18next";
import { message, Table } from "antd";
import { clearingAPI } from "apis";
import { ClearingSheetShow } from "apis/clearingAPI";
import { AxiosError } from "axios";
import { TurtleModal, TurtleStatistics, TurtleTableTitle } from "components/common";
import { useQuery } from "react-query";
import { NewSearchFilter } from "components/combine";
import { useEffect, useMemo, useRef, useState } from "react";

interface Props {
  visible: boolean;
  closeModal: () => void;
  sheet?: ClearingSheetShow;
}

function DetailModal({ visible, closeModal, sheet }: Props) {
  const [itemId, setItemId] = useState(-1);
  const [searchQuery, setSearchQuery] = useState({
    search_string: "",
  });
  const index = useRef(0);

  const getItemQuery = useQuery(
    ["getClearingItem"], //
    () =>
      clearingAPI.getItem({
        sheet_id: sheet?.id!,
        page_size: 100,
      }),
    {
      enabled: visible && !!sheet?.id,
      onError: (error: AxiosError) => {
        message.error(error.response?.data?.msg);
      },
    },
  );

  const getItemDetailQuery = useQuery(
    ["getClearingItemDetail", itemId],
    () => clearingAPI.getItemDetail({ item_id: itemId }),
    {
      enabled: visible && itemId !== -1,
      onError: (error: AxiosError) => {
        message.error(error.response?.data?.msg);
      },
      onSuccess: (data) => {},
    },
  );

  const filteredList = useMemo(
    () =>
      getItemQuery.data?.data.item_list.filter((item) =>
        item.vendor_name.includes(searchQuery.search_string),
      ),
    [getItemQuery.data, searchQuery],
  );

  useEffect(() => {
    setSearchQuery({ search_string: "" });
  }, [visible]);

  return (
    <TurtleModal
      centered
      width="90%"
      bodyStyle={{ height: "80vh", overflow: "auto" }}
      title={t("clearing.detail")}
      visible={visible}
      onCancel={closeModal}
      footer={false}
    >
      <TurtleStatistics
        value={[
          {
            title: t("clearing.status.default"),
            value: t(`clearing.status.${sheet?.status}`).toString(),
          },
          { title: t("clearing.request date"), value: `${sheet?.request_date}` },
          { title: t("clearing.complete date"), value: `${sheet?.complete_date ?? " "}` },
          { title: t("clearing.total price"), value: `${sheet?.clearing_total_price}` },
          { title: "총 거래처 수", value: `${getItemQuery.data?.data.total_count}개` },
        ]}
      />

      <Table
        size="small"
        loading={getItemQuery.isLoading}
        pagination={false}
        dataSource={filteredList}
        rowKey={(item) => item.id}
        title={() => (
          <TurtleTableTitle
            count={getItemQuery.data?.data.total_count ?? 0}
            searchCount={filteredList?.length ?? 0}
          >
            <NewSearchFilter
              select={false}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
            />
          </TurtleTableTitle>
        )}
        expandable={{
          expandRowByClick: true,
          expandedRowKeys: [itemId],
          onExpand: (onExpand, record) => {
            if (!onExpand) {
              setItemId(-1);
              return;
            }
            setItemId(record.id);
          },
          expandedRowRender: () => {
            return (
              <Table
                loading={getItemDetailQuery.isLoading}
                dataSource={getItemDetailQuery.data?.data.item_list}
                pagination={false}
                // showHeader={false}
                rowKey={() => index.current++}
                columns={[
                  // {
                  //   ellipsis: true,
                  //   title: t("vendor.name"),
                  //   render: (_, record) => record.vendor_name,
                  // },
                  // {
                  //   ellipsis: true,
                  //   title: t("vendor.address"),
                  //   render: (_, record) => record.vendor_address,
                  // },
                  // {
                  //   ellipsis: true,
                  //   title: t("vendor.account"),
                  //   render: (_, record) =>
                  //     `${record.bank} ${record.account_number} ${record.account_holder}`,
                  // },
                  {
                    ellipsis: true,
                    title: t("clearing.supply price"),
                    render: (_, record) => record.supply_price.toLocaleString(),
                  },
                  {
                    ellipsis: true,
                    title: t("clearing.vat"),
                    render: (_, record) => record.vat_price.toLocaleString(),
                  },
                  {
                    ellipsis: true,
                    title: t("clearing.price"),
                    render: (_, record) => record.deposit_price.toLocaleString(),
                  },
                  {
                    ellipsis: true,
                    title: "구분",
                    render: (_, record) => record.clearing_type,
                  },
                ]}
              />
            );
          },
        }}
        columns={[
          {
            ellipsis: true,
            title: t("vendor.name"),
            render: (_, record) => record.vendor_name,
          },
          {
            ellipsis: true,
            title: t("vendor.address"),
            render: (_, record) => record.vendor_address,
          },
          {
            ellipsis: true,
            title: t("vendor.account"),
            render: (_, record) =>
              `${record.bank} ${record.account_number} ${record.account_holder}`,
          },
          {
            ellipsis: true,
            title: t("clearing.supply price"),
            render: (_, record) => record.supply_price.toLocaleString(),
          },
          {
            ellipsis: true,
            title: t("clearing.vat"),
            render: (_, record) => record.vat_price.toLocaleString(),
          },
          {
            ellipsis: true,
            title: t("clearing.price"),
            render: (_, record) => record.deposit_price.toLocaleString(),
          },
        ]}
      />
    </TurtleModal>
  );
}

export default DetailModal;
