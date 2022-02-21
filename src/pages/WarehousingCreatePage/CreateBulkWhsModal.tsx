import {
  Button,
  Col,
  Input,
  message,
  Modal,
  notification,
  Popover,
  Radio,
  Row,
  Space,
  Switch,
  Table,
  Tabs,
  Typography,
  Upload,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import TurtleInfo from "components/common/TurtleInfo";
import { useMutation } from "react-query";
import { excelAPI, vendorAPI } from "apis";
import { AxiosError } from "axios";
import { useCallback, useMemo, useState } from "react";
import { MasterVendor, ParseCount, SheetShow, Vendor, VendorShow } from "apis/excelAPI";
import TurtleButtonSub from "components/common/TurtleButtonSub";
import TurtleBadge from "components/common/TurtleBadge";
import { FileTextOutlined } from "@ant-design/icons";
import TurtleText from "components/common/TurtleText";
import TurtleButton from "components/common/TurtleButton";
import { RequestCreateVendor, VendorAccount } from "apis/vendorAPI";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import { t } from "i18next";
import { useRecoilState, useRecoilValue } from "recoil";
import { storeIdState } from "store/storeIdState";
import warehousingAPI, { CreateSheetItems, RequestCreateSheet, RequestCreateSheetItems, WarehousingSheet, WarehousingSheetItem } from "apis/warehousingAPI";
import { storeState } from "store/storeState";
import moment from "moment";

interface Props {
  visible: boolean;
  closeModal: () => void;
}

function CreateBulkWhsModal({ visible, closeModal }: Props) {
  // const storeId = useRecoilValue(storeIdState);
  const store = useRecoilValue(storeState);
  const form = new FormData();
  const [list, setList] = useState<Array<WarehousingSheetItem>>();
  const [failList, setFailList] = useState<Array<WarehousingSheetItem>>();
  const [count, setCount] = useState<ParseCount>();

  const parseWarehousingSheetQuery = useMutation("parseWarehousingSheet", excelAPI.parseWarehousingSheetFile, {
    onError: (error: AxiosError) => {
      message.error(error.response?.data?.msg);
    },
    onSuccess: (data) => {
      setList(data.data.success)
    },
  });
  const createSheetQuery = useMutation(["createSheet"], warehousingAPI.createSheet, {
    onError: (error: AxiosError) => {
      message.error(error.response?.data?.msg);
    },
    onSuccess: (data) => {

      var itemList = list!.map((item) => ({
        vendor_id: item.vendor_id,
        product_id: item.product_id,
        count: item.count,
        price: item.product_price
      }))

      createSheetItemsQuery.mutate({
        sheet_id: data.data!,
        rt_store_id: store.id!,
        item_list: itemList
      });
    },
   
  });

    // 입고장 등록
  const onSubmit = () => {
    createSheetQuery.mutate({
      created_date: moment().format("YYYY-MM-DD"),
      rt_store_id:store.id!,
    });
    closeModal();
  };

  const createSheetItemsQuery = useMutation(["createSheetItems"], warehousingAPI.createSheetItems, {
    onError: (error: AxiosError) => {
      message.error(error.response?.data?.msg);
    },
    onSuccess: () => {
      setList([]);
      notification.open({
        type: "success",
        message: t("message.success create warehousing"),
      });
    },
  });


  return (
    <Modal
      centered
      width="80%"
      maskClosable={false}
      title={
        <>
          <span style={{ fontSize: "18px" }}>{t("warehousing.detail list")}</span>

          <TurtleInfo>대량 업로드 파일은 .CSV .XLS또는 .XLSX만 사용할 수 있습니다.</TurtleInfo>
        </>
      }
      visible={visible}
      onCancel={closeModal}
      footer={false}
      bodyStyle={{ height: "800px", overflowY: "auto" }}
    >
      <Space>
        <Typography.Text>{t("warehousing.upload sheet")} </Typography.Text>
        <Upload //
          maxCount={1}
          accept=".csv, .xls, .xlsx"
          customRequest={({ file, onSuccess }) => {
            if (!store) return;
            form.append("files", file);
            form.append("rt_store_id", store.id!.toString());

            parseWarehousingSheetQuery.mutate(form);
          }}
        >
          <Button icon={<UploadOutlined />}>파일 선택하기</Button>
        </Upload>
      </Space>
   
        <Row style={{ marginTop: "4px" }}>
        <Space> 거래처 대량 등록 미리보기{" "}
 </Space>        <span style={{ color: "red", textDecoration: "underline" }}>0</span>건
        </Row>
        <Row>
          
          <Table
            size="small"
            dataSource={list}
            rowKey={(sheetItem) => sheetItem.sheet_id}
            pagination={{ position: ["bottomCenter"], showSizeChanger: false }}

            columns={[
              {
                ellipsis: true,
                title: t("vendor.name"),
                render: (_, sheetItem) => sheetItem.vendor_name,
              },
              {
                ellipsis: true,
                width: "12%",
                title:t("vendor.address") ,
                render: (_, sheetItem) => sheetItem.vendor_address,
              },
              {
                ellipsis: true,
                title: t("product barcode"),
                render: (_, sheetItem) => sheetItem.product_code,
              },
              {
                ellipsis: true,
                title: t("product name"),
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
        </Row>

        <Row justify="end" style={{ padding: "1rem 0px" }}>
        <TurtleButton
          type="primary"
          loading={false}
          onClick={onSubmit}
        >
          {t("warehousing.create")}
        </TurtleButton>
      </Row>
    </Modal>
  );
}

export default CreateBulkWhsModal;
