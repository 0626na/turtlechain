import { Form, Input, message, Modal, notification, Popconfirm, Row } from "antd";
import AddressSelect from "components/AddressSelect";
import TurtleInput from "components/common/TurtleInput";
import TurtleQuestionTooltip from "components/common/TurtleQuestionTooltip";
import TurtleText from "components/common/TurtleText";
import { useTranslation } from "react-i18next";
import TurtleButton from "components/common/TurtleButton";
import { bucketListAPI } from "apis";
import { AxiosError } from "axios";
import { useMutation } from "react-query";
import { useState } from "react";
import { StoreAccountView, StoreAddress } from "apis/bucketListAPI";
import AccountSelect from "components/AccountSelect";

interface Props {
  visible: boolean;
  closeModal: () => void;
}

function CreateVendorRequestModal({ visible, closeModal }: Props) {
  const { t } = useTranslation();
  const [form] = Form.useForm();

  const [selectedAddress, selectAddress] = useState<StoreAddress>({
    building: undefined,
    floor: undefined,
    col: undefined,
    loc: undefined,
  });

  const [accountList, setAccountList] = useState<Array<StoreAccountView>>([
    { bank: "", account_number: "", account_holder: "", is_main: true },
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
      setAccountList([{ bank: "", account_number: "", account_holder: "", is_main: true }]);
      selectAddress({ building: "", floor: "", col: "", loc: "" });
      form.resetFields();
      closeModal();
    },
  });

  const onClickCreate = () => {
    if (accountList.length !== 1) {
      const filteredAccountList: Array<StoreAccountView> = accountList;
      const mainAccount: StoreAccountView | undefined = accountList.find(
        (account) => account.is_main,
      );
      filteredAccountList.filter((account) => !account.is_main);
      mainAccount && filteredAccountList.unshift(mainAccount);
      setAccountList(filteredAccountList);
    }

    form.validateFields().then(() => {
      createBucketList.mutate({
        ...form.getFieldsValue(),
        type: "create",
        ws_store_id: 0,
        store_phone: [form.getFieldValue("store_phone")],
        building: selectedAddress.building,
        floor: selectedAddress.floor,
        col: selectedAddress.col,
        loc: selectedAddress.loc,
        banks: accountList,
      });
    });
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
        <AccountSelect accountList={accountList} setAccountList={setAccountList} />
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
        <Row justify="end">
          <Form.Item>
            <Popconfirm
              title={t("description.really register")}
              okText={t("yes")}
              cancelText={t("no")}
              onConfirm={onClickCreate}
            >
              <TurtleButton // 등록 요청하기 Button
              >
                {t("button.request create")}
              </TurtleButton>
            </Popconfirm>
          </Form.Item>
        </Row>
      </Form>
    </Modal>
  );
}

export default CreateVendorRequestModal;
