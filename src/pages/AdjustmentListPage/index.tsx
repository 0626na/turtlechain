import { Helmet } from "react-helmet";
import { useTranslation } from "react-i18next";
import PageHeader from "components/PageHeader";
import SvgIcon from "components/SvgIcon";
import AdjustmentSearchFilter from "./AdjustmentSearchFilter";
import AdjustmentList from "./AdjustmentList";
import Toolbar from "./Toolbar";
import adjustmentAPI, { AdjustmentItem, RequestGetAdjustmentList }  from "apis/adjustmentAPI";
import { useEffect, useMemo, useState } from "react";
import { storeIdState } from "store/storeIdState";
import { useRecoilValue } from "recoil";
import { storeState } from "store/storeState";
import { useMutation, useQuery } from "react-query";
import moment from "moment";
import { AxiosError } from "axios";
import { message, notification } from "antd";

const AdjustmentListPage = function () {
  const { t } = useTranslation();
  const title = `${t("turtlechain")} - ${t("adjustment list")}`;
  const [visibleDetailModal, setVisibleDetailModal] = useState(false);
  const store = useRecoilValue(storeState);
  const [currentPage, setCurrentPage] = useState(1);
  const [adjItemList, setAdjItemList] = useState<Array<AdjustmentItem>>([]);
  const [searchQuery, setSearchQuery] = useState<RequestGetAdjustmentList>({
    rt_store_id: store.id ?? -1,
    is_cleared:2,
    start_date: moment().subtract(1, "months").format("YYYY-MM-DD"),
    end_date: moment().format("YYYY-MM-DD"),
    page:1,
    type:"all"
  });
  const getAdjustmentListQuery= useQuery(
    ["getAdjustmentList", searchQuery],
    () => adjustmentAPI.getAdjustmentList(searchQuery),{
      enabled: !!store.id,
    }
  )

  const [selectedRow, selectRow] = useState({
    sheet_id:-1, 
    rt_store_id: -1,
    created_time: "",
    is_confirmed: 0,
  });


  // 입고장 삭제 요청
  const deleteAdjQuery = useMutation(["deleteAdj"], adjustmentAPI.updateAdjustment, {
    onError: (error: AxiosError) => {
      message.error(error.response?.data?.msg);
    },
    onSuccess: () => {
      if (currentPage === 1) {
        getAdjustmentListQuery.refetch();
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


    // 전체 데이터 수
    const totalCount = useMemo(
      () => (getAdjustmentListQuery.data ? getAdjustmentListQuery.data.data.total_count : 0),
      [getAdjustmentListQuery.data],
    );

  const list = useMemo(
    () => (getAdjustmentListQuery.data ? getAdjustmentListQuery.data.data.adjustment_list : []),
    [getAdjustmentListQuery.data],
  );
  
  useEffect(() => {
    setSearchQuery({...searchQuery, rt_store_id: store.id ?? -1})
  }, [store.id])
  
  return (
    <>
      <Helmet title={title} />
      <PageHeader
        pageName="adjustment"
        title={t("adjustment list")}
        breadcrumbList={[t("adjustment management"), t("adjustment list")]}
      />
      <Toolbar/>
      <AdjustmentSearchFilter searchQuery={searchQuery} setSearchQuery={setSearchQuery}/>
      <AdjustmentList
        isLoading={getAdjustmentListQuery.isLoading }
        list={list}
        totalCount={totalCount}
        currentPage={1}
        onSelectRow={(row)=>{
          setVisibleDetailModal(true);
        }}
        onDelete={()=>{}}
        onConfirm={()=>{}}/>
    </>
  );
};

export default AdjustmentListPage;
