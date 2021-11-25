import styled from "styled-components";
import { useMemo, useState } from "react";
// async
import { AxiosError } from "axios";
import { useQuery } from "react-query";
import retailerStoreAPI, { RequestGetStores } from "apis/retailerStoreAPI";
// lang
import { useTranslation } from "react-i18next";
// antd
import { PlusOutlined as PlusIcon } from "@ant-design/icons";
import { Table, Typography, Input, message, Button } from "antd";
// components
import SimplePagination from "components/SimplePagination";

const MyStoreTable = function () {
  const { t } = useTranslation();

  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [query, setQuery] = useState<RequestGetStores>({
    offset: 100,
    last_id: -1,
    switch_type: "next",
    search_type: "",
    search_query: "",
  });

  // 쇼핑몰 리스트 요청
  const getStoresQuery = useQuery(
    ["getStores", query],
    () => retailerStoreAPI.getStores(query),
    {
      onError: (error: AxiosError) => {
        message.error(error.response?.data?.msg);
      },
    }
  );

  // 리스트 컬럼
  const columns = [
    {
      title: t("mall name"),
      dataIndex: "name",
      width: "35%",
    },
    {
      title: t("mall url"),
      dataIndex: "mall_url",
      width: "35%",
    },
    {
      title: t("mall phone"),
      dataIndex: "phone",
      width: "15%",
    },
    {
      title: t("created time"),
      dataIndex: "created_time",
      width: "15%",
    },
  ];

  // 쇼핑몰 리스트
  const dataSource = useMemo(() => {
    if (getStoresQuery.data) {
      return getStoresQuery.data.data.data;
    } else {
      return [];
    }
  }, [getStoresQuery.data]);

  // 쇼핑몰 수
  const totalCount = useMemo(() => {
    if (getStoresQuery.data) {
      return getStoresQuery.data.data.total_count;
    } else {
      return 1;
    }
  }, [getStoresQuery.data]);

  // 이전 페이지
  const handlePrev = () => {
    const switch_type = "prev";
    const last_id = dataSource[0].id;
    setQuery({ ...query, switch_type, last_id });
    setCurrentPage(currentPage - 1);
  };

  // 다음 페이지
  const handleNext = () => {
    const switch_type = "next";
    const last_id = dataSource[dataSource.length - 1].id;
    setQuery({ ...query, switch_type, last_id });
    setCurrentPage(currentPage + 1);
  };

  // 검색
  const handleSearch = () => {
    const search_query = searchText;
    const switch_type = "next";
    const last_id = -1;
    setQuery({ ...query, switch_type, search_query, last_id });
    setCurrentPage(1);
  };

  return (
    <Table
      bordered
      size="small"
      scroll={{ y: 400 }}
      pagination={false}
      loading={getStoresQuery.isLoading}
      columns={columns}
      dataSource={dataSource}
      title={() => (
        <Header>
          <Input.Search
            enterButton
            style={{ width: 400 }}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onSearch={handleSearch}
          />
          <Button //
            type="primary"
            icon={<PlusIcon />}
          >
            {t("add mall")}
          </Button>
        </Header>
      )}
      footer={() => (
        <Footer>
          <Typography.Text strong>{`Total : ${totalCount}`}</Typography.Text>
          <SimplePagination
            currentPage={currentPage}
            pageSize={query.offset}
            totalCount={totalCount}
            isLoading={getStoresQuery.isLoading}
            onPrev={handlePrev}
            onNext={handleNext}
          />
        </Footer>
      )}
    />
  );
};

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Footer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export default MyStoreTable;
