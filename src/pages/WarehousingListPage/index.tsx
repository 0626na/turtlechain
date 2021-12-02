import moment from "moment";
import { useState } from "react";
import { Helmet } from "react-helmet";
import { useTranslation } from "react-i18next";
import { RequestGetSheet } from "apis/warehousingAPI";

import SvgIcon from "components/SvgIcon";
import PageHeader from "components/PageHeader";

import WarehousingSearchFilter from "./WarehousingSearchFilter";
import WarehousingSheetItemModal from "./WarehousingSheetItemModal";
import WarehousingSheetList from "./WarehousingSheetList";

const WarehousingListPage = function () {
  const { t } = useTranslation();
  const title = `${t("turtlechain")} - ${t("warehousing list")}`;

  const [visibleSheetItemModal, setVisibleSheetItemModal] = useState(false);
  const [selectedRow, selectRow] = useState({
    sheet_id: -1,
    mall_name: "",
    created_time: "",
  });

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
        onChangeStore={(mall_id) => {
          setSearchQuery({ ...searchQuery, mall_id });
        }}
        onChangeDate={(start_date, end_date) => {
          setSearchQuery({ ...searchQuery, start_date, end_date });
        }}
        onChangeConfirmed={(is_confirmed) => {
          setSearchQuery({ ...searchQuery, is_confirmed });
        }}
      />
      <WarehousingSheetItemModal //
        visible={visibleSheetItemModal}
        sheet_id={selectedRow.sheet_id}
        mall_name={selectedRow.mall_name}
        created_time={selectedRow.created_time}
        onClose={() => {
          selectRow({ sheet_id: -1, mall_name: "", created_time: "" });
          setVisibleSheetItemModal(false);
        }}
      />
      <WarehousingSheetList
        searchQuery={searchQuery}
        currentPage={currentPage}
        pageSize={searchQuery.offset}
        onClickRow={({ sheet_id, mall_name, created_time }) => {
          selectRow({ sheet_id, mall_name, created_time });
          setVisibleSheetItemModal(true);
        }}
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
