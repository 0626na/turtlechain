import { Helmet } from "react-helmet";
import { useTranslation } from "react-i18next";
import PageHeader from "components/PageHeader";
import SvgIcon from "components/SvgIcon";
import AdjustmentSearchFilter from "./AdjustmentSearchFilter";
import AdjustmentList from "./AdjustmentList";
import Toolbar from "./Toolbar";
import adjustmentAPI, { AdjustmentItem, RequestGetAdjustmentList }  from "apis/adjustmentAPI";
import { useMemo, useState } from "react";
import { storeIdState } from "store/storeIdState";
import { useRecoilValue } from "recoil";
import { storeState } from "store/storeState";
import { useQuery } from "react-query";
import moment from "moment";

const AdjustmentListPage = function () {
  const { t } = useTranslation();
  const title = `${t("turtlechain")} - ${t("adjustment list")}`;

  const store = useRecoilValue(storeState);
  const [adjList, setAdjList] = useState<Array<AdjustmentItem>>([]);
  const [searchQuery, setSearchQuery] = useState<RequestGetAdjustmentList>({
    rt_store_id: store.id ?? -1,
    is_cleared:0,
    start_date: moment().subtract(1, "months").format("YYYY-MM-DD"),
    end_date: moment().format("YYYY-MM-DD"),
    page:1
  });


  const getAdjustmentListQuery= useQuery(
    ["getAdjustmentList", searchQuery],
    () => adjustmentAPI.getAdjustmentList(searchQuery),{
      enabled: !!store.id,
    }
  )
  const list = useMemo(
    () => (getAdjustmentListQuery.data ? getAdjustmentListQuery.data.ad : []),
    [getSheetQuery.data],


  );
  return (
    <>
      <Helmet title={title} />
      <PageHeader
        pageName="adjustment"
        title={t("adjustment list")}
        breadcrumbList={[t("adjustment management"), t("adjustment list")]}
      />
      <Toolbar/>
      <AdjustmentSearchFilter />
      <AdjustmentList />
    </>
  );
};

export default AdjustmentListPage;
