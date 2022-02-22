import { message, Modal, Space, Typography } from "antd";
import Upload, { RcFile } from "antd/lib/upload";
import { excelAPI } from "apis";
import { OrderItem } from "apis/excelAPI";
import { AxiosError } from "axios";
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

function CreateBulkOrderModal({ visible, closeModal }: Props) {
  const store = useRecoilValue(storeState);
  const [fileList, setFileList] = useState<Array<RcFile>>([]);
  const [successList, setSuccessList] = useState<Array<OrderItem>>();
  const [failList, setFailList] = useState<Array<OrderItem>>();

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
    setSuccessList([]);
    setFailList([]);
    setFileList([]);
  }, []);

  const onCloseModal = useCallback(() => {
    closeModal();
    resetField();
  }, []);

  return (
    <Modal
      centered
      width="80%"
      maskClosable={false}
      title={
        <>
          <span style={{ fontSize: "18px" }}>{t("order.upload")}</span>
          <TurtleInfo>대량 업로드 파일은 .CSV .XLS 또는 .XLSX만 사용할 수 있습니다.</TurtleInfo>
        </>
      }
      visible={visible}
      onCancel={onCloseModal}
      footer={false}
      bodyStyle={{ height: "800px", overflowY: "auto" }}
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
    </Modal>
  );
}

export default CreateBulkOrderModal;
