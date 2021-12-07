import { Helmet } from "react-helmet";
import { useTranslation } from "react-i18next";

import PageHeader from "components/PageHeader";
import SvgIcon from "components/SvgIcon";

import AdjustmentSearchFilter from "./AdjustmentSearchFilter";
import AdjustmentList from "./AdjustmentList";

// 목 리스트
const mock_list = [
  {
    is_confirmed: false,
    mall_name: "스타일날까",
    created_time: new Date(),
    adjustment_type: "주문",
    store_name: "세기모자",
    account_info: "기업 01050221059 테스트",
    price: 20000,
  },
  {
    is_confirmed: true,
    mall_name: "스타일날까",
    created_time: new Date(),
    adjustment_type: "미송",
    store_name: "세기모자",
    account_info: "기업 01050221059 테스트",
    price: 30000,
  },
];

const AdjustmentListPage = function () {
  const { t } = useTranslation();
  const title = `${t("turtlechain")} - ${t("adjustment list")}`;
  return (
    <>
      <Helmet title={title} />
      <PageHeader
        icon={
          <SvgIcon
            filled={false}
            src={`${process.env.PUBLIC_URL}/assets/svg/check-list.svg`}
            alt="adjustment"
          />
        }
        title={t("adjustment list")}
        breadcrumbList={[t("adjustment management"), t("adjustment list")]}
      />
      <AdjustmentSearchFilter />
      <AdjustmentList
        isLoading={false}
        list={mock_list}
        totalCount={mock_list.length}
        currentPage={1}
        pageSize={100}
        // 이전 페이지
        onPrev={() => {}}
        // 다음 페이지
        onNext={() => {}}
        // 행 선택
        onSelectRow={() => {}}
        // 삭제
        onDelete={() => {}}
        // 마감
        onConfirm={() => {}}
      />
    </>
  );
};

export default AdjustmentListPage;
