import {
  Button,
  message,
  Modal,
  notification,
  Popconfirm,
  Row,
  Space,
  Table,
  Typography,
  Upload,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import TurtleInfo from "components/common/TurtleInfo";
import { useMutation } from "react-query";
import { excelAPI } from "apis";
import { AxiosError } from "axios";
import { useCallback, useState } from "react";
import TurtleButton from "components/common/TurtleButton";
import { t } from "i18next";
import { useRecoilValue } from "recoil";
import warehousingAPI, { WarehousingSheetItem } from "apis/warehousingAPI";
import { storeState } from "store/storeState";
import moment from "moment";
import { RcFile } from "antd/lib/upload";
import SearchFilter from "components/SearchFilter";

interface Props {
  visible: boolean;
  closeModal: () => void;
}

function CreateBulkWhsModal({ visible, closeModal }: Props) {
  const store = useRecoilValue(storeState);
  const [fileList, setFileList] = useState<Array<RcFile>>([]);
  const [allList, setAllList] = useState<Array<WarehousingSheetItem>>([]);
  const [successList, setSuccessList] = useState<Array<WarehousingSheetItem>>([]);
  const [failList, setFailList] = useState<Array<WarehousingSheetItem>>([]);
  let i = 0;

  const parseWarehousingSheetQuery = useMutation(
    "parseWarehousingSheet",
    excelAPI.parseWarehousingSheetFile,
    {
      onError: (error: AxiosError) => {
        message.error(error.response?.data?.msg);
      },
      onSuccess: (data) => {
        if (data.data.error) {
          message.error(data.data.error);
          resetField();
          return;
        }
        setAllList(data.data.success);
        setSuccessList(data.data.success);
        setFailList(data.data.fail);
      },
    },
  );

  const createSheetQuery = useMutation(["createSheet"], warehousingAPI.createSheet, {
    onError: (error: AxiosError) => {
      message.error(error.response?.data?.msg);
    },
    onSuccess: (data) => {
      var itemList = successList!.map((item) => ({
        vendor_id: item.vendor_id,
        product_id: item.product_id,
        count: item.count,
        price: item.product_price,
      }));

      createSheetItemsQuery.mutate({
        sheet_id: data.data!,
        rt_store_id: store.id!,
        item_list: itemList,
      });
    },
  });

  const createSheetItemsQuery = useMutation(["createSheetItems"], warehousingAPI.createSheetItems, {
    onError: (error: AxiosError) => {
      message.error(error.response?.data?.msg);
    },
    onSuccess: () => {
      closeModal();
      notification.open({
        type: "success",
        message: t("message.success create warehousing"),
      });
    },
  });

  const loadFile = (file: RcFile) => {
    const form = new FormData();
    form.append("files", file);
    form.append("rt_store_id", store.id!.toString());
    parseWarehousingSheetQuery.mutate(form);
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
    ({ type, search_string }) => {
      setAllList(
        successList.filter((item) => {
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

  // 입고장 등록
  const onSubmit = useCallback(() => {
    if (successList?.length === 0) {
      message.warn("등록할 상품이 없습니다.");
    }
    createSheetQuery.mutate({
      created_date: moment().format("YYYY-MM-DD"),
      rt_store_id: store.id!,
    });
  }, [successList, store.id]);

  return (
    <Modal
      centered
      width="80%"
      title={
        <>
          <span style={{ fontSize: "18px" }}>{t("warehousing.detail list")}</span>
          <TurtleInfo>대량 업로드 파일은 .CSV .XLS또는 .XLSX만 사용할 수 있습니다.</TurtleInfo>
        </>
      }
      visible={visible}
      onCancel={onCloseModal}
      footer={false}
      bodyStyle={{ height: "750px", overflowY: "auto" }}
    >
      <Space>
        <Typography.Text>입고장 업로드 | </Typography.Text>
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
          <Button icon={<UploadOutlined />}>파일 선택하기</Button>
        </Upload>
      </Space>

      <Row style={{ padding: "1rem 0" }}>
        <SearchFilter type="product" onSearch={searchAllList} />
      </Row>

      <Row>
        <TurtleInfo>대량 업로드에서 누락된 상품은 개별등록을 통해 입고추가 해주세요.</TurtleInfo>
      </Row>
      <Table
        size="small"
        dataSource={allList}
        rowKey={(sheetItem) => i++}
        pagination={{ position: ["bottomCenter"], showSizeChanger: false }}
        style={{ height: "485px" }}
        columns={[
          {
            ellipsis: true,
            title: t("vendor.name"),
            render: (_, sheetItem) => sheetItem.vendor_name,
          },
          {
            ellipsis: true,
            width: "12%",
            title: t("vendor.address"),
            render: (_, sheetItem) => sheetItem.vendor_address,
          },
          {
            ellipsis: true,
            title: t("product.code"),
            render: (_, sheetItem) => sheetItem.product_code,
          },
          {
            ellipsis: true,
            title: t("product.name"),
            render: (_, sheetItem) => sheetItem.product_name,
          },
          {
            ellipsis: true,
            title: t("warehousing.count"),
            render: (_, sheetItem) => sheetItem.count,
          },
          {
            ellipsis: true,
            title: t("warehousing.price"),
            render: (_, sheetItem) => sheetItem.product_price,
          },
        ]}
      />

      <Row justify="end" style={{ padding: "1rem 0px" }}>
        <Popconfirm
          title={t("description.really register")}
          okText={t("yes")}
          cancelText={t("no")}
          onConfirm={onSubmit}
        >
          <TurtleButton
            type="primary"
            disabled={successList.length === 0}
            loading={createSheetItemsQuery.isLoading}
          >
            {t("warehousing.create")}
          </TurtleButton>
        </Popconfirm>
      </Row>
    </Modal>
  );
}

export default CreateBulkWhsModal;
