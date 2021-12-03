import moment from "moment";
import { useState, useMemo } from "react";
import { Helmet } from "react-helmet";
import { useTranslation } from "react-i18next";

import { AxiosError } from "axios";
import { useQuery } from "react-query";
import warehousingAPI, { RequestGetSheet } from "apis/warehousingAPI";

import { message } from "antd";

import SvgIcon from "components/SvgIcon";
import PageHeader from "components/PageHeader";

import WarehousingSearchFilter from "./WarehousingSearchFilter";
import WarehousingSheetList from "./WarehousingSheetList";

const WarehousingListPage = function () {
  const { t } = useTranslation();
  const title = `${t("turtlechain")} - ${t("warehousing list")}`;

  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState<RequestGetSheet>({
    mall_id: "",
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
    }
  );

  // 입고장 리스트
  const list = useMemo(() => {
    if (getSheetQuery.data) {
      return getSheetQuery.data.data;
    } else {
      return [];
    }
  }, [getSheetQuery.data]);

  // 전체 데이터 수
  const totalCount = useMemo(() => {
    if (getSheetQuery.data) {
      return getSheetQuery.data.total_count;
    } else {
      return 0;
    }
  }, [getSheetQuery.data]);

  // 이전 페이지
  const onPrev = () => {
    const switch_type = "prev";
    const last_id = list[0].id;
    setSearchQuery({ ...searchQuery, switch_type, last_id });
    setCurrentPage(currentPage - 1);
  };

  // 다음 페이지
  const onNext = () => {
    const switch_type = "next";
    const last_id = list[list.length - 1].id;
    setSearchQuery({ ...searchQuery, switch_type, last_id });
    setCurrentPage(currentPage + 1);
  };

  return (
    <>
      <Helmet title={title} />
      <PageHeader
        icon={
          <SvgIcon
            filled={false}
            src={`${process.env.PUBLIC_URL}/assets/svg/warehousing.svg`}
            alt="warehousing"
          />
        }
        title={t("warehousing list")}
        breadcrumbList={[t("warehousing management"), t("warehousing list")]}
      />
      <WarehousingSearchFilter
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
      <WarehousingSheetList
        isFetching={getSheetQuery.isLoading}
        list={list}
        totalCount={totalCount}
        currentPage={currentPage}
        pageSize={searchQuery.offset}
        onPrev={onPrev}
        onNext={onNext}
      />
    </>
  );
};

export default WarehousingListPage;
