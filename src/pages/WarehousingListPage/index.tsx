import moment from "moment";
import { useState, useMemo, useEffect } from "react";
import { Helmet } from "react-helmet";
import { useTranslation } from "react-i18next";
import { AxiosError } from "axios";
import { useQuery, useMutation } from "react-query";
import warehousingAPI, {WarehousingSheet, RequestGetSheet, WarehousingSheetItem } from "apis/warehousingAPI";
import { message, notification } from "antd";
import PageHeader from "components/PageHeader";
import WarehousingSheetItemModal from "./WarehousingSheetItemModal";
import WarehousingSearchFilter from "./WarehousingSearchFilter";
import WarehousingSheetList from "./WarehousingSheetList";
import { storeIdState } from "store/storeIdState";
import { useRecoilValue } from "recoil";
import { FilterButton } from "components/common/FilterButtonType";
import StoreFilter from "components/common/Filter";
import Toolbar from "./Toolbar";
import { storeState } from "store/storeState";
const WarehousingListPage = function () {
  const { t } = useTranslation();
  const title = `${t("turtlechain")} - ${t("warehousing list")}`;
  // 쇼핑몰 id
  const store = useRecoilValue(storeState);
  const [visibleDetailModal, setVisibleDetailModal] = useState(false);
  const [sheetItemList, setSheetItemList] = useState<Array<WarehousingSheetItem>>([]);

  type SearchType = "vendor_name" | "vendor_address" | "product_code" | "product_name";
  const [searchType, setSearchType] = useState<SearchType>("vendor_name");
  
  const [searchText, setSearchText] = useState("");
  const search_options = [
    {
      value: "vendor_name",
      label: t("vendor.name"),
    },
    {
      value: "vendor_address",
      label: t("vendor.address"),
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
  

  const [selectedRow, selectRow] = useState({
    sheet_id:-1, 
    rt_store_id: -1,
    created_time: "",
    is_confirmed: 0,
  });

  const filteredList = useMemo(
    () =>

      sheetItemList.filter((item) =>
      // item
        item![searchType].toString().indexOf(searchText) !== -1 
      ),
    [sheetItemList, searchType, searchText],
  );

  const [sheetList, setSheetList] = useState<Array<WarehousingSheet>>();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState<RequestGetSheet>({
    rt_store_id: store.id ?? -1,

    is_confirmed: "",
    start_date: moment().subtract(1, "months").format("YYYY-MM-DD"),
    end_date: moment().format("YYYY-MM-DD"),
    page:1
  });

  // 입고장 리스트 요청
  const getSheetQuery = useQuery(
    ["getSheet", searchQuery],
    () => warehousingAPI.getSheet(searchQuery), {
      enabled : !!store.id,
    }
  );

  const FilterButtons : FilterButton[] = [
    {type:"primary", status:true, text:t("whs.filter_button_list_download")},
    {type:"primary", status:true, text:t("whs.filter_button_list_forward")}
  ]

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
        setSearchQuery({ ...searchQuery  });
        // setSearchQuery({ ...searchQuery, last_id: -1, switch_type: "next" });
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
    () => (getSheetQuery.data ? getSheetQuery.data.sheet_list : []),
    [getSheetQuery.data],
  );

  // 전체 데이터 수
  const totalCount = useMemo(
    () => (getSheetQuery.data ? getSheetQuery.data.total_count : 0),
    [getSheetQuery.data],
  );

      // 입고장 상세내역 리스트 요청


  useEffect(() => {
    setSearchQuery({...searchQuery, rt_store_id: store.id ?? -1})
  }, [store.id])


  return (
    <>
      <Helmet title={title} />
      <PageHeader
        pageName="warehousing"
        title={t("warehousing list")}
        breadcrumbList={[t("warehousing management"), t("warehousing list")]}
      />
      <Toolbar/>
      <WarehousingSheetItemModal
        {...selectedRow}
        sheet_id={selectedRow.sheet_id}
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
        // 이전 페이지
        onPrev={() => {
          const switch_type = "prev";
          const last_id = list[0].id;
          setSearchQuery({ ...searchQuery });
          setCurrentPage(currentPage - 1);
        }}
        // 다음 페이지
        onNext={() => {
          const switch_type = "next";
          const last_id = list[list.length - 1].id;
          setSearchQuery({ ...searchQuery});
          setCurrentPage(currentPage + 1);
        }}
        // 행 선택
        onSelectRow={(row) => {
          setVisibleDetailModal(true);
          selectRow({
            sheet_id: row.id,
            created_time: moment(row.created_time).format("YYYY-MM-DD"),
            rt_store_id:store.id!,
            is_confirmed: (row.is_confirmed? 1 : 0),
          });
        }}
        // 삭제
        onDelete={(row) => {
          deleteSheetQuery.mutate({
            ...row,
            sheet_id: row.id,
            is_inactive: true,
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
