import { Helmet } from "react-helmet";
import PageHeader from "components/PageHeader";
import WarehousingSheetList from "./WarehousingSheetList";
import { t } from "i18next";

const WarehousingListPage = function () {
  const title = `${t("turtlechain")} - ${t("warehousing list")}`;

  return (
    <>
      <Helmet title={title} />
      <PageHeader
        title={t("warehousing list")}
        breadcrumbList={[t("warehousing management"), t("warehousing list")]}
      />

      <WarehousingSheetList
      // isLoading={
      //   getSheetQuery.isLoading || deleteSheetQuery.isLoading || confirmSheetQuery.isLoading
      // }
      // list={list}
      // totalCount={totalCount}
      // currentPage={currentPage}
      // // 이전 페이지
      // onPrev={() => {
      //   const switch_type = "prev";
      //   const last_id = list[0].id;
      //   setSearchQuery({ ...searchQuery });
      //   setCurrentPage(currentPage - 1);
      // }}
      // // 다음 페이지
      // onNext={() => {
      //   const switch_type = "next";
      //   const last_id = list[list.length - 1].id;
      //   setSearchQuery({ ...searchQuery });
      //   setCurrentPage(currentPage + 1);
      // }}
      // // 행 선택
      // onSelectRow={(row) => {
      //   setVisibleDetailModal(true);
      //   selectRow({
      //     sheet_id: row.id,
      //     created_time: moment(row.created_time).format("YYYY-MM-DD"),
      //     rt_store_id: store.id!,
      //     is_confirmed: row.is_confirmed ? 1 : 0,
      //   });
      // }}
      // // 삭제
      // onDelete={(row) => {
      //   deleteSheetQuery.mutate({
      //     ...row,
      //     sheet_id: row.id,
      //     is_inactive: true,
      //   });
      // }}
      // // 마감
      // onConfirm={(row) => {
      //   confirmSheetQuery.mutate({
      //     ...row,
      //     sheet_id: row.id,
      //     is_confirmed: true,
      //   });
      // }}
      />
    </>
  );
};

export default WarehousingListPage;
