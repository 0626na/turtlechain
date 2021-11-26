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
import StoreModal from "components/StoreModal";
import SimplePagination from "components/SimplePagination";

const MyStoreTable = function () {
  const { t } = useTranslation();

  const [visibleUpdateModal, setVisibleUpdateModal] = useState(false);
  const [selectedRowID, selectRowID] = useState<undefined | number>(undefined);
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

  // 로우 클릭
  const handleRowClick = (id: number) => {
    selectRowID(id);
    setVisibleUpdateModal(true);
  };

  return (
    <>
      <StoreModal
        type="update"
        visible={visibleUpdateModal}
        store_id={selectedRowID}
        onClose={() => setVisibleUpdateModal(false)}
      />
      <Table
        bordered
        size="small"
        scroll={{ y: 400 }}
        pagination={false}
        loading={getStoresQuery.isLoading}
        columns={[
          {
            title: t("mall name"),
            dataIndex: "name",
          },
          {
            title: t("alimtalk name"),
            dataIndex: "alimtalk_name",
          },
          {
            title: t("mall url"),
            dataIndex: "mall_url",
          },
          {
            title: t("mall phone"),
            dataIndex: "phone",
          },
          {
            title: "",
            dataIndex: "action",
            render: (text, record) => (
              <Button
                size="small"
                type="primary"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRowClick(record.id);
                }}
              >
                {t("view details")}
              </Button>
            ),
          },
        ]}
        dataSource={dataSource}
        rowKey={(record) => record.id}
        onRow={(record) => {
          return {
            onClick: () => handleRowClick(record.id),
          };
        }}
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
              {t("create mall")}
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
    </>
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
