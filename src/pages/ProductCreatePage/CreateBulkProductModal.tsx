import { Button, message, notification, Row, Space, Table, Tabs, Typography, Upload } from "antd";
import Modal from "antd/lib/modal/Modal";
import { RcFile } from "antd/lib/upload";
import { excelAPI } from "apis";
import { Product, ProductShow } from "apis/excelAPI";
import productAPI, { RequestCreateProduct } from "apis/productAPI";
import { AxiosError } from "axios";
import TurtleButton from "components/common/TurtleButton";
import TurtleButtonSub from "components/common/TurtleButtonSub";
import TurtleInfo from "components/common/TurtleInfo";
import { t } from "i18next";
import { useCallback, useState } from "react";
import { useMutation } from "react-query";
import { useRecoilValue } from "recoil";
import { storeState } from "store/storeState";

interface Props {
  visible: boolean;
  closeModal: () => void;
}

function CreateBulkProductModal({ visible, closeModal }: Props) {
  const store = useRecoilValue(storeState);
  const [fileList, setFileList] = useState<Array<RcFile>>([]);
  const [successList, setSuccessList] = useState<Array<ProductShow>>();
  const [failList, setFailList] = useState<Array<Product>>();

  const parseProductQuery = useMutation("parseProduct", excelAPI.parseProduct, {
    onError: (error: AxiosError) => {
      message.error(error.response?.data?.msg);
    },
    onSuccess: (data) => {
      if (data.data.error) {
        message.error(data.data.error);
        resetField();
        return;
      }
      setSuccessList(
        data.data.success.map((product) => ({
          ...product,
          memo_value: product.memo,
          memo_active: !!product.memo,
        })),
      );
      setFailList(data.data.fail);
    },
  });

  const createProductQuery = useMutation(
    ["createProduct"], //
    productAPI.createProduct,
    {
      onError: (error: AxiosError) => {
        message.error(error.response?.data?.msg);
      },
      onSuccess: (data) => {
        notification.open({
          type: "success",
          message: `성공적으로 등록하였습니다. 성공 : ${data.data.success} 중복된 상품 : ${data.data.fail}`,
        });
        onCloseModal();
      },
    },
  );

  const resetField = useCallback(() => {
    setSuccessList([]);
    setFailList([]);
    setFileList([]);
  }, []);

  const onCloseModal = useCallback(() => {
    closeModal();
    resetField();
  }, []);

  const loadFile = (file: RcFile) => {
    const form = new FormData();
    form.append("files", file);
    form.append("rt_store_id", store.id?.toString() ?? "");
    parseProductQuery.mutate(form);
  };

  const onClickCreate = useCallback(() => {
    if (!store.id) {
      message.warning("거래처를 먼저 선택해 주세요");
      return;
    }

    const resultList: Array<RequestCreateProduct> = [];
    successList?.forEach((product) => {
      resultList.push({
        ...product,
        rt_store_id: store.id ?? -1,
        vendor_id: parseInt(product.vendor_id),
        price: parseInt(product.price),
      });
    });
    createProductQuery.mutate(resultList);
  }, [successList, store.id]);

  return (
    <Modal
      centered
      width="80%"
      title={
        <>
          <span style={{ fontSize: "18px" }}>{t("product.bulk create")}</span>
          <TurtleInfo>대량 업로드 파일은 .CSV .XLS또는 .XLXS만 사용할 수 있습니다.</TurtleInfo>
        </>
      }
      visible={visible}
      onCancel={onCloseModal}
      footer={false}
      bodyStyle={{ height: "800px" }}
    >
      <Space>
        <Typography.Text>상품 목록 업로드 | </Typography.Text>
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
      <Tabs defaultActiveKey="1" size="large">
        {/**
         *
         *
         *
         *
         * 성공 탭
         *
         *
         *
         *
         */}
        <Tabs.TabPane tab="성공" key="1">
          상품 대량 등록 미리보기{" "}
          <span style={{ color: "#00BB88", textDecoration: "underline" }}>
            {successList?.length}
          </span>
          건
          <Table
            size="small"
            loading={parseProductQuery.isLoading}
            dataSource={successList}
            rowKey={(record) => record.product_code}
            pagination={{ position: ["bottomCenter"], showSizeChanger: false }}
            columns={[
              {
                ellipsis: true,
                title: "거래처 코드",
                render: (_, record) => record.vendor_code,
              },
              {
                ellipsis: true,
                title: "거래처명",
                render: (_, record) => record.vendor_name,
              },
              {
                ellipsis: true,
                title: "거래처 주소",
                render: (_, record) => record.vendor_address,
              },
              {
                ellipsis: true,
                title: "상품명",
                render: (_, record) => record.name,
              },
              {
                ellipsis: true,
                title: "거래처 상품명",
                render: (_, record) => record.vendor_product_name,
              },
              {
                ellipsis: true,
                title: "상품 바코드번호",
                render: (_, record) => record.product_code,
              },
              {
                ellipsis: true,
                title: "옵션",
                render: (_, record) => record.option,
              },
              {
                ellipsis: true,
                title: "공급가",
                render: (_, record) => record.price,
              },
              {
                ellipsis: true,
                title: "메모",
                render: (_, record) => record.memo,
              },
              {
                ellipsis: true,
                title: "상품 이미지URL",
                render: (_, record) => record.image_url,
              },
            ]}
          />
        </Tabs.TabPane>
        {/**
         *
         *
         *
         *
         * 실패 탭
         *
         *
         *
         *
         */}
        <Tabs.TabPane tab="실패" key="2">
          상품 대량 등록 미리보기{" "}
          <span style={{ color: "red", textDecoration: "underline" }}>{failList?.length}</span>
          건
          <Table
            size="small"
            loading={parseProductQuery.isLoading}
            dataSource={failList}
            rowKey={(record) => record.product_code}
            pagination={{ position: ["bottomCenter"], showSizeChanger: false }}
            columns={[
              {
                ellipsis: true,
                title: "거래처 코드",
                render: (_, record) => (
                  <span style={{ color: record.vendor_code ? "red" : "#DCE0E4" }}>
                    {record.vendor_code || "(정보없음)"}
                  </span>
                ),
              },
              {
                ellipsis: true,
                title: "거래처명",
                render: (_, record) => (
                  <span style={{ color: record.vendor_code ? "red" : "#DCE0E4" }}>
                    {record.vendor_name || "(정보없음)"}
                  </span>
                ),
              },
              {
                ellipsis: true,
                title: "거래처주소",
                render: (_, record) => (
                  <span style={{ color: record.vendor_code ? "red" : "#DCE0E4" }}>
                    {record.vendor_address || "(정보없음)"}
                  </span>
                ),
              },
              {
                ellipsis: true,
                title: "상품명",
                render: (_, record) => (
                  <span style={{ color: record.vendor_code && "red" }}>{record.name}</span>
                ),
              },
              {
                ellipsis: true,
                title: "거래처 상품명",
                render: (_, record) => (
                  <span style={{ color: record.vendor_code && "red" }}>
                    {record.vendor_product_name}
                  </span>
                ),
              },
              {
                ellipsis: true,
                title: "상품 바코드",
                render: (_, record) => (
                  <span style={{ color: record.vendor_code && "red" }}>{record.product_code}</span>
                ),
              },
              {
                ellipsis: true,
                title: "옵션",
                render: (_, record) => (
                  <span style={{ color: record.vendor_code && "red" }}>{record.option}</span>
                ),
              },
              {
                ellipsis: true,
                title: "공급가",
                render: (_, record) => (
                  <span style={{ color: record.vendor_code && "red" }}>{record.price}</span>
                ),
              },
              {
                ellipsis: true,
                title: "메모",
                render: (_, record) => (
                  <span style={{ color: record.vendor_code && "red" }}>{record.memo}</span>
                ),
              },
              {
                ellipsis: true,
                title: "상품 이미지 URL",
                render: (_, record) => (
                  <span style={{ color: record.vendor_code && "red" }}>{record.image_url}</span>
                ),
              },
            ]}
          />
        </Tabs.TabPane>
      </Tabs>
      <Row justify="end" style={{ padding: "1rem 0px" }}>
        <TurtleButton
          type="primary"
          //disabled={}
          loading={createProductQuery.isLoading}
          onClick={onClickCreate}
        >
          {t("product.create")}
        </TurtleButton>
      </Row>
    </Modal>
  );
}

export default CreateBulkProductModal;
