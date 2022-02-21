import styled from "styled-components";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { AxiosError } from "axios";
import { useQuery, useMutation, useQueryClient } from "react-query";
import warehousingAPI, { BulkUpdateSheetItem, WarehousingItem2, WarehousingSheetItem } from "apis/warehousingAPI";
import { DeleteFilled, SyncOutlined } from "@ant-design/icons";
import {
  Modal,
  Form,
  Select,
  Table,
  message,
  Input,
  InputNumber,
  Button,
  Popconfirm,
  notification,
  Statistic,
  Card,
} from "antd";
import { createImportSpecifier } from "typescript";
import { warehousingItem2ToBulkUpdateItem, warehousingSheetItemToWarehousingItem2 } from "./util";

interface Props {
  visible: boolean;
  sheet_id: number;
  created_time: string;
  is_confirmed: number;
  onClose: () => void;
  onUpdated: () => void;
}

const WarehousingSheetItemModal = function ({
  visible,
  sheet_id,
  created_time,
  is_confirmed,
  onClose,
  onUpdated,
}: Props) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  type SearchType = "vendor_name" | "vendor_address" | "product_code" | "product_name";
  const [searchType, setSearchType] = useState<SearchType>("vendor_name");
  
  const [searchText, setSearchText] = useState("");
  const search_options = [
    {
      value: "vendor_name",
      label: t("vendor.name"),
    },
    {
      value: "vendor_address",
      label: t("vendor.address"),
    },
    {
      value: "product_code",
      label: t("product code"),
    },
    {
      value: "product_name",
      label: t("product name"),
    },
  ];
  

  const [list, setList] = useState<Array<WarehousingItem2>>([]);
  const [isUpdated, setIsUpdated] = useState(false);
  const [inactiveList, setInactiveList] = useState<Array<BulkUpdateSheetItem>>([]);

  // 입고장 상세내역 리스트 요청
  const getSheetItemQuery = useQuery(
    ["getSheetItem"],
    () => warehousingAPI.getSheetItem2(sheet_id),
    {
      enabled: visible && sheet_id !== -1 ? true : false,
      onError: (error: AxiosError) => {
        message.error(error.response?.data?.msg);
      },
      onSuccess: (data) => {
        setList(data.data.item_list);
      },
    },
  );

  // 입고장 상세내역 수정 요청
  const updateSheetQuery = useMutation(["updateSheet"], warehousingAPI.bulkUpdateSheetItem, {
    onError: (error: AxiosError) => {
      message.error(error.response?.data?.msg);
    },
    onSuccess: () => {
      notification.open({
        type: "success",
        message: t("message.success update warehousing detail list"),
      });
      onClose();
      onUpdated();
    },
  });

  const totalItemCount= useMemo(
    ()=>
    list.reduce((sum, current)=> sum+current.count, 0)
    , [list, searchType, searchText]
    );  
    
    const totalItemAmount= useMemo(
      () => list.reduce((sum, current)=> sum+(current.count* current.price), 0)
      , [list, searchType, searchText]    
      );   
    
  // 필터된 리스트
  const filteredList = useMemo(
    () =>
      list.filter((item) =>{
        if(searchType === "vendor_name"){
          return item.vendor_info["vendor_name"].toString().indexOf(searchText) !== -1 
        }
      }),
    [list, searchType, searchText],
  );

  const updateWarehousingSheetItems = () => {
    if(inactiveList && inactiveList.length){
      updateSheetQuery.mutateAsync({sheet_id, items: inactiveList.map((item) => {
          return {
            id: item.id,
            is_inactive:true,
            count:item.count
          }
      })})
      setInactiveList([])
    }
    if(isUpdated){
      updateSheetQuery.mutate({ sheet_id, items: list!.map((item)=>warehousingItem2ToBulkUpdateItem(item))});
    }

  }

  // 모달창 닫기 확인
  // 업데이트가 발새한 경우 실행
  const confirmClose = () => {
    Modal.confirm({
      title: t("description.changed data"),
      cancelText: t("close"),
      okText: t("reflect update"),
      onCancel: () => {
        onClose();
      },
      onOk: () => {
        updateWarehousingSheetItems()
      },
    });
  };

  // 데이터 리셋
  useEffect(() => {
    if (!visible) {
      return () => {
        setSearchType("vendor_name");
        setSearchText("");
        setList([]);
        setIsUpdated(false);
        queryClient.removeQueries(["getSheetItem"]);
      };
    }
  }, [visible, queryClient]);

  return (
    <Modal //
      centered
      width="90%"
      maskClosable={false}
      visible={visible}
      onCancel={() => {
        if (isUpdated && !is_confirmed) {
          confirmClose();
        } else {
          onClose();
        }
      }}
      title={`${t("warehousing.detail list")}`}
      footer={
        !is_confirmed && [
          <Popconfirm
            title={t("description.really update")}
            okText={t("yes")}
            cancelText={t("no")}
            onConfirm={() => {
              updateWarehousingSheetItems()
            }}
          >
            <Button type="primary" icon={<SyncOutlined />} loading={updateSheetQuery.isLoading}>
              {t("reflect update")}
            </Button>
          </Popconfirm>,
        ]
      }
    >
      <ModalInner>
        <StatisticContainer>
          <Card>
            <Statistic //
              title={t("warehousing.date")}
              value={created_time}
            />
          </Card>
          <Card>
            <Statistic //
              title={t("warehousing.total count")}
              value={totalItemCount}
            />
          </Card>
          <Card>
            <Statistic //
              title={t("total supply price")}
              value={totalItemAmount}
              
            />
          </Card>
        </StatisticContainer>
        <Form layout="inline">
          <Form.Item>
            <Select

              style={{ width: 150 }}
              value={searchType}
              onChange={(value) => {
                setSearchType(value);
              }}
            >
              {search_options.map((item) => (
                <Select.Option key={item.value} value={item.value}>
                  {item.label}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item>
            <Input
              value={searchText}
              placeholder={t("search text")}
              onChange={(e) => {
                setSearchText(e.target.value);
              }}
            />
          </Form.Item>
        </Form>
        <Table
          size="small"
          loading={getSheetItemQuery.isLoading}
          pagination={false}
          dataSource={filteredList}
          rowKey={(sheetItem) => sheetItem.id}
          
          columns={[
            {
              title: t("vendor.name"),
              render:(_, item) => item.vendor_info.vendor_name
            },
            {
              title: t("vendor.address"),
              render:(_, item) => item.vendor_info.vendor_address
            },
            {
              title: t("product.code"),
              render:(_, item) => item.product_info.product_code
            },
            {
              title: t("product.name"),
              render:(_, item) => item.product_info.name
            },
            {
              title: t("product.option"),
              render:(_, item) => item.product_info.option
            },
            {
              align: "right",
              title: t("warehousing.count"),
              dataIndex: "count",
              render: (_, record) => (
                <InputNumber //
                disabled={is_confirmed==1 ? true : false}  
                min={0}
                size="small"
                  defaultValue={record.count}
                  onChange={(value) => {
                    const newList = list.map((item) =>
                      item.product_info.product_code === record.product_info.product_code ? { ...item, count: value } : item,
                    );
                    setList(newList);
                    setIsUpdated(true);
                  }}
                />
              ),
            },
            {
              align: "right",
              title: t("supply price"),
              render: (_, item) => item.price.toLocaleString(),
            },
            {
              width: 100,
              align: "center",
              title: "",
              dataIndex: "action",
              render: (_, record) => (
                <Button //
                  danger
                  disabled={is_confirmed===1 ? true : false}
                  size="small"
                  shape="round"
                  type="primary"
                  icon={<DeleteFilled />}
                  onClick={() => {
                    let inactiveItem:BulkUpdateSheetItem = {
                      id : record.id,
                      is_inactive: true,
                      count: record.count
                    } 
                    setInactiveList([...inactiveList, inactiveItem])
                    const newList = list.filter(
                      (item) => item.id !== record.id
                    );
                    setList(newList);
                  }
                }
                >
                  {t("delete")}
                </Button>
              ),
            },
          ]}
        />
      </ModalInner>
    </Modal>
  );
};

const ModalInner = styled.div`
  height: 70vh;
  overflow: auto;
  & > * + * {
    margin-top: 20px;
  }
`;

const StatisticContainer = styled.div`
  display: flex;
  & > * + * {
    margin-left: 20px;
  }
  * {
    font-size: 1rem;
  }
`;

export default WarehousingSheetItemModal;
