import { message, Modal, Popconfirm, Row, Space, Table, Typography } from "antd";
import Upload, { RcFile } from "antd/lib/upload";
import { excelAPI } from "apis";
import { OrderItem } from "apis/excelAPI";
import { OrderItemShow } from "apis/orderAPI";
import { AxiosError } from "axios";
import TurtleButton from "components/common/TurtleButton";
import TurtleButtonSub from "components/common/TurtleButtonSub";
import TurtleInfo from "components/common/TurtleInfo";
import SearchFilter from "components/SearchFilter";
import { t } from "i18next";
import { useCallback, useMemo, useState } from "react";
import { useMutation } from "react-query";
import { useRecoilValue } from "recoil";
import { storeState } from "store/storeState";

interface Props {
  visible: boolean;
  closeModal: () => void;
  addItem: (item: OrderItemShow) => void;
}

interface SearchState {
  type: string;
  search_string: string;
}

function CreateBulkOrderModal({ visible, closeModal, addItem }: Props) {
  const store = useRecoilValue(storeState);
  const [fileList, setFileList] = useState<Array<RcFile>>([]);
  const [allList, setAllList] = useState<Array<OrderItem>>([]);
  const [successList, setSuccessList] = useState<Array<OrderItem>>([]);
  const [failList, setFailList] = useState<Array<OrderItem>>([]);

  const parseOrderQuery = useMutation("parseOrder", excelAPI.parseOrder, {
    onError: (error: AxiosError) => {
      message.error(error.response?.data?.msg);
    },
    onSuccess: (data) => {
      if (data.data.error) {
        message.error(data.data.error);
        resetField();
        return;
      }
      setAllList([...data.data.success, ...data.data.fail]);
      setSuccessList(data.data.success);
      setFailList(data.data.fail);
    },
  });

  const loadFile = (file: RcFile) => {
    const form = new FormData();
    form.append("files", file);
    form.append("rt_store_id", store.id?.toString() ?? "");
    parseOrderQuery.mutate(form);
  };

  const resetField = useCallback(() => {
    setFileList([]);
    setAllList([]);
    setSuccessList([]);
    setFailList([]);
  }, []);

  const onCloseModal = useCallback(() => {
    resetField();
    closeModal();
  }, [resetField, closeModal]);

  const searchAllList = useCallback(
    ({ type, search_string }: SearchState) => {
      setAllList(
        [...successList, ...failList].filter((item) => {
          if (type === "name") {
            return item.product_name.includes(search_string);
          }
          if (type === "vendor_product_name") {
            return item.vendor_product_name.includes(search_string);
          }
          if (type === "vendor_name") {
            return item.vendor_name.includes(search_string);
          }
          return (
            item.product_name.includes(search_string) ||
            item.vendor_product_name.includes(search_string) ||
            item.vendor_name.includes(search_string)
          );
        }),
      );
    },
    [failList, successList],
  );

  const onClickAdd = useCallback(() => {
    if (successList.length === 0) {
      message.warn("추가할 상품이 없습니다.");
    }
    successList.forEach((item) => {
      addItem({
        vendor_id: item.vendor_id,
        product_id: item.product_id,
        vendor_name: item.vendor_name,
        vendor_address: item.vendor_address,
        vendor_phone: item.vendor_phone,
        product_name: item.product_name,
        product_code: item.product_code,
        product_option: item.option,
        count: item.count,
        price: item.order_price,
        type: item.type,
        image_url: item.image_url,
        memo: item.memo,
      });
    });
    onCloseModal();
  }, [successList, addItem, closeModal, resetField]);

  return (
    <Modal
      centered
      width="80%"
      title={
        <>
          <span style={{ fontSize: "18px" }}>{t("order.upload")}</span>
          <TurtleInfo>대량 업로드 파일은 .CSV .XLS 또는 .XLSX만 사용할 수 있습니다.</TurtleInfo>
        </>
      }
      visible={visible}
      onCancel={onCloseModal}
      footer={false}
      bodyStyle={{ height: "750px", overflowY: "auto" }}
    >
      <Space>
        <Typography.Text>주문서 업로드 | </Typography.Text>
        <Upload //
          maxCount={1}
          accept=".csv, .xls, .xlsx"
          beforeUpload={(file) => {
            setFileList([file]);
            loadFile(file);
            return false;
          }}
          onRemove={() => {
            resetField();
            return false;
          }}
          fileList={fileList}
        >
          <TurtleButtonSub>파일 선택하기</TurtleButtonSub>
        </Upload>
      </Space>
      <Row style={{ padding: "1rem 0" }}>
        <SearchFilter type="product" onSearch={searchAllList} />
      </Row>
      <Row>
        <TurtleInfo>
          붉은 색으로 표시된 "주문 불가" 상품은 등록되지 않은 상품으로 오늘 주문에서 제외됩니다.
        </TurtleInfo>
      </Row>
      <Table
        size="small"
        loading={parseOrderQuery.isLoading}
        dataSource={allList}
        rowKey={(record) => record.product_code}
        pagination={{ position: ["bottomCenter"], showSizeChanger: false }}
        style={{ height: "485px" }}
        columns={[
          {
            ellipsis: true,
            title: "거래처명",
            render: (_, record) => (
              <span style={record.product_id === 0 ? { color: "red" } : {}}>
                {record.vendor_name}
              </span>
            ),
          },
          {
            ellipsis: true,
            title: "거래처 주소",
            render: (_, record) => (
              <span style={record.product_id === 0 ? { color: "red" } : {}}>
                {record.vendor_address}
              </span>
            ),
          },
          {
            ellipsis: true,
            title: "휴대번호",
            render: (_, record) => (
              <span style={record.product_id === 0 ? { color: "red" } : {}}>
                {record.vendor_phone}
              </span>
            ),
          },
          {
            ellipsis: true,
            title: "상품 바코드",
            render: (_, record) => (
              <span style={record.product_id === 0 ? { color: "red" } : {}}>
                {record.product_code}
              </span>
            ),
          },
          {
            ellipsis: true,
            title: "상품명",
            render: (_, record) => (
              <span style={record.product_id === 0 ? { color: "red" } : {}}>
                {record.product_name}
              </span>
            ),
          },
          {
            ellipsis: true,
            title: "거래처 상품명",
            render: (_, record) => (
              <span style={record.product_id === 0 ? { color: "red" } : {}}>
                {record.vendor_product_name}
              </span>
            ),
          },
          {
            ellipsis: true,
            title: "옵션",
            render: (_, record) => (
              <span style={record.product_id === 0 ? { color: "red" } : {}}>{record.option}</span>
            ),
          },
          {
            ellipsis: true,
            title: "발주수량",
            render: (_, record) => (
              <span style={record.product_id === 0 ? { color: "red" } : {}}>{record.count}</span>
            ),
          },
          {
            ellipsis: true,
            title: "공급가",
            render: (_, record) => (
              <span style={record.product_id === 0 ? { color: "red" } : {}}>
                {record.product_price}
              </span>
            ),
          },
          {
            ellipsis: true,
            title: "주문종류",
            render: (_, record) => (
              <span style={record.product_id === 0 ? { color: "red" } : {}}>{record.type}</span>
            ),
          },
          {
            ellipsis: true,
            title: "메모",
            render: (_, record) => (
              <span style={record.product_id === 0 ? { color: "red" } : {}}>{record.memo}</span>
            ),
          },
        ]}
      />
      <Row justify="end" style={{ padding: "1rem 0px" }}>
        <Popconfirm
          title={t("description.really add")}
          okText={t("yes")}
          cancelText={t("no")}
          onConfirm={onClickAdd}
        >
          <TurtleButton type="primary" disabled={fileList.length === 0}>
            {t("button.add order")}
          </TurtleButton>
        </Popconfirm>
      </Row>
    </Modal>
  );
}

export default CreateBulkOrderModal;
