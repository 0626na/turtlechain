import { Form, Input, message, notification, Popconfirm, Row, Select } from "antd";
import { bucketListAPI } from "apis";
import { AxiosError } from "axios";
import { useMutation } from "react-query";
import { t } from "i18next";
import { TurtleButton, TurtleDivider, TurtleInput, TurtleModal } from "components/common";
import { RequestCreate } from "apis/bucketListAPI";

interface Props {
  visible: boolean;
  closeModal: () => void;
}

function RequestModal({ visible, closeModal }: Props) {
  const [form] = Form.useForm<RequestCreate>();

  const createQuery = useMutation("createBucketList", bucketListAPI.create, {
    onError: (error: AxiosError) => {
      message.error(error.response?.data?.msg);
    },
    onSuccess: () => {
      notification.open({
        type: "success",
        message: "성공적으로 등록하였습니다.",
      });
      form.resetFields();
      closeModal();
    },
  });

  return (
    <TurtleModal
      centered
      width="520px"
      title={t("vendor.request create")}
      visible={visible}
      onCancel={closeModal}
      footer={false}
    >
      <Form //
        layout="horizontal"
        form={form}
        colon={false}
        labelCol={{ span: 7 }}
        wrapperCol={{ span: 16 }}
      >
        <TurtleInput // 거래처명 검색 Input
          name="name"
          label={t("vendor.name")}
          placeholder={t("placeholder.vendor name")}
          required={true}
        />
        <TurtleInput // 거래처 매장번호 Input
          name="tel"
          label={t("vendor.phone")}
          placeholder={t("placeholder.phone")}
          required={true}
        />
        <TurtleInput // 거래처 휴대번호 Input
          name="mobile"
          label={t("vendor.store phone")}
          placeholder={t("placeholder.store phone")}
          required={true}
        />

        <Form.Item label={t("vendor.address")} required={true}>
          <Input.Group compact>
            <Form.Item noStyle>
              <Select style={{ width: "34%" }} />
            </Form.Item>
            <Form.Item noStyle>
              <Select style={{ width: "33%" }} />
            </Form.Item>
            <Form.Item noStyle>
              <Select style={{ width: "33%" }} />
            </Form.Item>
          </Input.Group>
        </Form.Item>

        <TurtleInput // 기타 주소 Input
          name="ext"
          label={t("vendor.ext")}
          placeholder={t("placeholder.ext")}
          required={false}
        />

        <TurtleDivider />

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
          <Popconfirm
            title={t("description.really register")}
            okText={t("yes")}
            cancelText={t("no")}
            onConfirm={() => {
              form.validateFields().then(() => {
                // createBucketList.mutate({
                //   ...form.getFieldsValue(),
                //   type: "create",
                //   ws_store_id: 0,
                //   store_phone: [form.getFieldValue("store_phone")],
                //   building: selectedAddress.building,
                //   floor: selectedAddress.floor,
                //   col: selectedAddress.col,
                //   loc: selectedAddress.loc,
                //   // banks: accountList,
                // });
              });
            }}
          >
            <TurtleButton // 등록 요청하기 Button
              type="default"
              htmlType="submit"
            >
              {t("button.request create")}
            </TurtleButton>
          </Popconfirm>
        </Row>
      </Form>
    </TurtleModal>
  );
}

export default RequestModal;
