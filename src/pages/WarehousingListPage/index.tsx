import moment from "moment";
import { useState, useMemo } from "react";
import { Helmet } from "react-helmet";
import { useTranslation } from "react-i18next";
import { AxiosError } from "axios";
import { useQuery, useMutation } from "react-query";
import warehousingAPI, { RequestGetSheet } from "apis/warehousingAPI";
import { message, notification } from "antd";
import PageHeader from "components/PageHeader";
import WarehousingSheetItemModal from "./WarehousingSheetItemModal";
import WarehousingSearchFilter from "./WarehousingSearchFilter";
import WarehousingSheetList from "./WarehousingSheetList";

const WarehousingListPage = function () {
  const { t } = useTranslation();
  const title = `${t("turtlechain")} - ${t("warehousing list")}`;

  const [visibleDetailModal, setVisibleDetailModal] = useState(false);
  const [selectedRow, selectRow] = useState({
    sheet_id: -1,
    mall_name: "",
    created_time: "",
    is_confirmed: false,
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState<RequestGetSheet>({
    rt_store_id: undefined,
    is_confirmed: "",
    start_date: moment().subtract(1, "months").format("YYYY-MM-DD"),
    end_date: moment().format("YYYY-MM-DD"),
    offset: 100,
    last_id: -1,
    switch_type: "next",
  });

  // 입고장 리스트 요청
  const getSheetQuery = useQuery(
    ["getSheet", searchQuery],
    () => warehousingAPI.getSheet(searchQuery),
    {
      onError: (error: AxiosError) => {
        message.error(error.response?.data?.msg);
      },
    },
  );

  // 입고장 삭제 요청
  const deleteSheetQuery = useMutation(["deleteSheet"], warehousingAPI.updateSheet, {
    onError: (error: AxiosError) => {
      message.error(error.response?.data?.msg);
    },
    onSuccess: () => {
      if (currentPage === 1) {
        getSheetQuery.refetch();
      } else {
        setCurrentPage(1);
        setSearchQuery({ ...searchQuery, last_id: -1, switch_type: "next" });
      }

      notification.open({
        type: "success",
        message: t("message.success delete warehousing"),
      });
    },
  });

  // 입고장 수정 요청
  const confirmSheetQuery = useMutation(["confirmSheet"], warehousingAPI.updateSheet, {
    onError: (error: AxiosError) => {
      message.error(error.response?.data?.msg);
    },
    onSuccess: () => {
      getSheetQuery.refetch();
      notification.open({
        type: "success",
        message: t("message.success confirm warehousing"),
      });
    },
  });

  // 입고장 리스트
  const list = useMemo(
    () => (getSheetQuery.data ? getSheetQuery.data.data : []),
    [getSheetQuery.data],
  );

  // 전체 데이터 수
  const totalCount = useMemo(
    () => (getSheetQuery.data ? getSheetQuery.data.total_count : 0),
    [getSheetQuery.data],
  );

  return (
    <>
      <Helmet title={title} />
      <PageHeader
        pageName="warehousing"
        title={t("warehousing list")}
        breadcrumbList={[t("warehousing management"), t("warehousing list")]}
      />
      <WarehousingSheetItemModal
        {...selectedRow}
        visible={visibleDetailModal}
        onClose={() => {
          setVisibleDetailModal(false);
        }}
        onUpdated={() => {
          getSheetQuery.refetch();
        }}
      />
      <WarehousingSearchFilter searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <WarehousingSheetList
        isLoading={
          getSheetQuery.isLoading || deleteSheetQuery.isLoading || confirmSheetQuery.isLoading
        }
        list={list}
        totalCount={totalCount}
        currentPage={currentPage}
        pageSize={searchQuery.offset}
        // 이전 페이지
        onPrev={() => {
          const switch_type = "prev";
          const last_id = list[0].id;
          setSearchQuery({ ...searchQuery, switch_type, last_id });
          setCurrentPage(currentPage - 1);
        }}
        // 다음 페이지
        onNext={() => {
          const switch_type = "next";
          const last_id = list[list.length - 1].id;
          setSearchQuery({ ...searchQuery, switch_type, last_id });
          setCurrentPage(currentPage + 1);
        }}
        // 행 선택
        onSelectRow={(row) => {
          setVisibleDetailModal(true);
          selectRow({
            sheet_id: row.id,
            mall_name: row.mall_name,
            created_time: moment(row.created_time).format("YYYY-MM-DD"),
            is_confirmed: row.is_confirmed,
          });
        }}
        // 삭제
        onDelete={(row) => {
          deleteSheetQuery.mutate({
            ...row,
            sheet_id: row.id,
            is_deleted: true,
          });
        }}
        // 마감
        onConfirm={(row) => {
          confirmSheetQuery.mutate({
            ...row,
            sheet_id: row.id,
            is_confirmed: true,
          });
        }}
      />
    </>
  );
};

export default WarehousingListPage;
