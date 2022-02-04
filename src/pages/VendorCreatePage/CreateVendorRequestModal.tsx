import { Form, Input, message, Modal, notification, Row } from "antd";
import AddressSelect from "components/AddressSelect";
import TurtleInput from "components/common/TurtleInput";
import TurtleQuestionTooltip from "components/common/TurtleQuestionTooltip";
import TurtleText from "components/common/TurtleText";
import { useTranslation } from "react-i18next";
import TurtleButton from "components/common/TurtleButton";
import BankSelect from "components/BankSelect";
import { bucketListAPI } from "apis";
import { AxiosError } from "axios";
import { useMutation } from "react-query";
import { useState } from "react";
import { StoreAccount, StoreAddress } from "apis/bucketListAPI";

interface Props {
  visible: boolean;
  closeModal: () => void;
}

function CreateVendorRequestModal({ visible, closeModal }: Props) {
  const { t } = useTranslation();
  const [form] = Form.useForm();

  const [selectedAddress, selectAddress] = useState<StoreAddress>({
    building: "",
    floor: "",
    col: "",
    loc: "",
  });

  const [banks, setBanks] = useState<Array<StoreAccount>>([
    { bank: "", account_number: "", account_holder: "" },
  ]);

  const createBucketList = useMutation("createBucketList", bucketListAPI.createBucketList, {
    onError: (error: AxiosError) => {
      message.error(error.response?.data?.msg);
    },
    onSuccess: () => {
      notification.open({
        type: "success",
        message: "성공적으로 등록하였습니다.",
      });
    },
  });

  const onClickCreate = () => {
    createBucketList.mutate({
      ...form.getFieldsValue(),
      type: "create",
      ws_store_id: 0,
      store_phone: [form.getFieldValue("store_phone")],
      building: selectedAddress.building,
      floor: selectedAddress.floor,
      col: selectedAddress.col,
      loc: selectedAddress.loc,
      banks: banks,
    });
    setBanks([{ bank: "", account_number: "", account_holder: "" }]);
    selectAddress({ building: "", floor: "", col: "", loc: "" });
    form.resetFields();
    closeModal();
  };

  return (
    <Modal
      centered
      width="80%"
      maskClosable={false}
      title={t("vendor.request create")}
      visible={visible}
      onCancel={closeModal}
      footer={false}
      getContainer={false}
      bodyStyle={{ height: "700px", overflowY: "auto" }}
      forceRender
    >
      <Form //
        layout="vertical"
        labelCol={{ span: 4, offset: 1 }}
        wrapperCol={{ span: 10, offset: 1 }}
        colon={false}
        form={form}
      >
        <TurtleText>{t("vendor.basic info")}</TurtleText>
        <TurtleInput // 거래처명 검색 Input
          name="name"
          label={t("vendor.name")}
          placeholder={t("placeholder.vendor name")}
          required={true}
        />
        <TurtleInput // 거래처 매장번호 Input
          name="phone"
          label={t("vendor.phone")}
          placeholder={t("placeholder.phone")}
          required={true}
        />
        <TurtleInput // 거래처 휴대번호 Input
          name="store_phone"
          label={t("vendor.store phone")}
          placeholder={t("placeholder.store phone")}
          required={true}
        />
        <AddressSelect selectedAddress={selectedAddress} selectAddress={selectAddress} />
        <TurtleInput // 기타 주소 Input
          name="ext"
          label={t("vendor.ext")}
          placeholder={t("placeholder.ext")}
          required={false}
        />
        <TurtleText>
          {t("vendor.account info")}
          <TurtleQuestionTooltip content={t("tooltip.main account info")} />
        </TurtleText>
        <BankSelect banks={banks} setBanks={setBanks} />
        <TurtleText>{t("vendor.biz info")}</TurtleText>
        <TurtleInput // 사업자 번호 Input
          name="biz_num"
          label={t("biz.num")}
          placeholder={t("placeholder.biz num")}
          required={false}
        />
        <TurtleInput // 상호명 Input
          name="biz_name"
          label={t("biz.name")}
          placeholder={t("placeholder.biz name")}
          required={false}
        />
        <TurtleInput // 대표자명 Input
          name="biz_owner"
          label={t("biz.owner")}
          placeholder={t("placeholder.biz owner")}
          required={false}
        />
        <Row justify="center">
          <Form.Item>
            <TurtleButton onClick={onClickCreate}>{t("button.request create")}</TurtleButton>
          </Form.Item>
        </Row>
      </Form>
    </Modal>
  );
}

export default CreateVendorRequestModal;
