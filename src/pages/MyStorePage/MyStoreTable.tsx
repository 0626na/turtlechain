import styled from "styled-components";
import { useMemo, useState } from "react";
// async
import { AxiosError } from "axios";
import { useQuery, useQueryClient } from "react-query";
import retailerStoreAPI, { RequestGetStores } from "apis/retailerStoreAPI";
// lang
import { useTranslation } from "react-i18next";
// antd
import { PlusOutlined as PlusIcon } from "@ant-design/icons";
import { Table, Typography, Input, message, Button, Tag } from "antd";
// components
import CreateStoreModal from "./CreateStoreModal";
import UpdateStoreModal from "./UpdateStoreModal";
import SimplePagination from "components/SimplePagination";

const MyStoreTable = function () {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const [visibleCreateModal, setVisibleCreateModal] = useState(false);
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
  const getStoresQuery = useQuery(["getStores", query], () => retailerStoreAPI.getStores(query), {
    onError: (error: AxiosError) => {
      message.error(error.response?.data?.msg);
    },
  });

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

  // 상태 리셋
  const resetState = () => {
    queryClient.removeQueries(["getStores"]);
    selectRowID(undefined);
    setSearchText("");
    setCurrentPage(1);
    setQuery({
      offset: 100,
      last_id: -1,
      switch_type: "next",
      search_type: "",
      search_query: "",
    });
  };

  return (
    <>
      <CreateStoreModal
        visible={visibleCreateModal}
        onSuccess={resetState}
        onClose={() => {
          setVisibleCreateModal(false);
          selectRowID(undefined);
        }}
      />
      <UpdateStoreModal
        visible={visibleUpdateModal}
        store_id={selectedRowID}
        onSuccess={resetState}
        onClose={() => {
          setVisibleUpdateModal(false);
          selectRowID(undefined);
        }}
      />
      <Table
        bordered
        size="small"
        scroll={{ y: 400 }}
        pagination={false}
        loading={getStoresQuery.isLoading}
        columns={[
          {
            title: t("biz status"),
            dataIndex: "is_closed",
            width: 100,
            render: (text, record) => {
              const { is_closed } = record;
              const color = is_closed ? "red" : "green";
              const str = is_closed ? t("status.closed") : t("status.open");
              return <Tag color={color}>{str}</Tag>;
            },
          },
          {
            title: t("store.name"),
            dataIndex: "name",
          },
          {
            title: t("alimtalk name"),
            dataIndex: "alimtalk_name",
          },
          {
            title: t("store.url"),
            dataIndex: "mall_url",
          },
          {
            title: t("store.phone"),
            dataIndex: "phone",
          },
          {
            title: "재고관리 프로그램",
            dataIndex: "order_formats",
            render: (order_formats) =>
              order_formats === 1 ? "셀메이트" : order_formats === 2 ? "이지어드민" : "터틀체인",
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
                {t("button.details")}
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
              onClick={() => setVisibleCreateModal(true)}
            >
              {t("button.add")}
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
