import moment from "moment";
import { useState } from "react";
import { Helmet } from "react-helmet";
import { useTranslation } from "react-i18next";
import { RequestGetSheet } from "apis/warehousingAPI";

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
        searchQuery={searchQuery}
        currentPage={currentPage}
        pageSize={searchQuery.offset}
        onPrev={(last_id) => {
          const switch_type = "prev";
          setSearchQuery({ ...searchQuery, switch_type, last_id });
          setCurrentPage(currentPage - 1);
        }}
        onNext={(last_id) => {
          const switch_type = "next";
          setSearchQuery({ ...searchQuery, switch_type, last_id });
          setCurrentPage(currentPage + 1);
        }}
      />
    </>
  );
};

export default WarehousingListPage;
