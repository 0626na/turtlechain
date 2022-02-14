import { Form, Modal, Row } from "antd";
import AddressSelect from "components/AddressSelect";
import AccountSelect from "components/AccountSelect";
import TurtleInput from "components/common/TurtleInput";
import TurtleQuestionTooltip from "components/common/TurtleQuestionTooltip";
import TurtleText from "components/common/TurtleText";
import { Vendor } from "apis/vendorAPI";
import { useEffect, useState } from "react";
import TurtleButton from "components/common/TurtleButton";
import {
  RequestCreateBucketList,
  StoreAccount,
  StoreAccountView,
  StoreAddress,
} from "apis/bucketListAPI";
import { t } from "i18next";
import PhoneSelect from "components/PhoneSelect";

interface Props {
  visible: boolean;
  closeModal: () => void;
  selectedRow?: Vendor;
}

function VendorUpdateModal({ visible, closeModal }: Props) {
  const [form] = Form.useForm();

  const [selectedAddress, selectAddress] = useState<StoreAddress>({
    building: "",
    floor: "",
    col: "",
    loc: "",
  });

  const [accountList, setAccountList] = useState<Array<StoreAccountView>>([
    { bank: "", account_number: "", account_holder: "", is_main: true },
  ]);

  const [storePhoneList, setStorePhoneList] = useState<Array<string>>([""]);

  // 렌더링 시 form객체 selectedRow로 채운다.
  // useEffect(() => {
  //   const storePhones: Array<string> = [];
  //   selectedRow.ws_store_info.store_phone.forEach((store_phone) => {
  //     storePhones.push(store_phone.phone);
  //   });

  //   const storeAccounts: Array<StoreAccount> = [];
  //   selectedRow.ws_store_info.store_account.forEach(({ bank, account_number, account_holder }) => {
  //     storeAccounts.push({ bank, account_number, account_holder });
  //   });

  //   form.setFieldsValue({
  //     name: selectedRow.ws_store_info.name,
  //     phone: selectedRow.ws_store_info.phone,
  //     store_phone: storePhones,
  //     store_account: storeAccounts,
  //     building: selectedRow.ws_store_info.building,
  //     floor: selectedRow.ws_store_info.floor,
  //     col_loc: `${selectedRow.ws_store_info.col ? selectedRow.ws_store_info.col : ""} ${
  //       selectedRow.ws_store_info.loc
  //     }`,
  //     ext: selectedRow.ws_store_info.ext,
  //     type: "update",
  //     //ws_store_id: selectedRow.ws_store_id,
  //     memo: selectedRow.memo,
  //     //biz_name:
  //     //biz_num:
  //   });
  // }, [selectedRow]);

  return (
    <Modal
      centered
      width="80%"
      maskClosable={false}
      title={t("vendor.request update")}
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
        {/*
         *
         *
         * 거래처 기본 정보
         *
         *
         */}
        <TurtleText>{t("vendor.basic info")}</TurtleText>
        <TurtleInput // 거래처명 검색 Input
          name="name"
          label={t("vendor.name")}
          placeholder={t("placeholder.vendor name")}
          required={false}
        />
        <TurtleInput // 거래처 매장번호 Input
          name="phone"
          label={t("vendor.phone")}
          placeholder={t("placeholder.phone")}
          required={false}
        />
        <PhoneSelect phoneList={storePhoneList} setPhoneList={setStorePhoneList} />
        <AddressSelect selectedAddress={selectedAddress} selectAddress={selectAddress} />
        <TurtleInput // 기타 주소 Input
          name="ext"
          label={t("vendor.ext")}
          placeholder={t("placeholder.ext")}
          required={false}
        />
        {/*
         *
         *
         * 거래처 계좌 정보
         *
         *
         */}
        <TurtleText>
          {t("vendor.account info")}
          <TurtleQuestionTooltip content={t("tooltip.main account info")} />
        </TurtleText>
        <AccountSelect accountList={accountList} setAccountList={setAccountList} />
        <Row justify="center">
          <Form.Item>
            <TurtleButton
              onClick={() => {
                console.log(form.getFieldsValue());
              }}
              disabled={true}
            >
              {t("button.request update")}
            </TurtleButton>
          </Form.Item>
        </Row>
      </Form>
    </Modal>
  );
}

export default VendorUpdateModal;
