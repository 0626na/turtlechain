import { Form, Input, message, notification, Popconfirm, Row, Select, Upload } from "antd";
import { basicDataAPI, bucketListAPI } from "apis";
import { AxiosError } from "axios";
import { useMutation, useQuery } from "react-query";
import { t } from "i18next";
import {
  TurtleButton,
  TurtleButtonSub,
  TurtleDivider,
  TurtleInput,
  TurtleModal,
} from "components/common";
import { RequestCreate } from "apis/bucketListAPI";
import { useCallback, useEffect, useState } from "react";

interface Props {
  visible: boolean;
  closeModal: () => void;
}

function RequestModal({ visible, closeModal }: Props) {
  const [form] = Form.useForm<RequestCreate>();
  const [address, setAddress] = useState({ building: "", floor: "" });

  const createQuery = useMutation("createBucketList", bucketListAPI.create, {
    onError: (error: AxiosError) => {
      message.error(error.response?.data?.msg);
    },
    onSuccess: () => {
      notification.open({
        type: "success",
        message: "성공적으로 등록하였습니다.",
      });
      resetStates();
      closeModal();
    },
  });

  const getAddressQuery = useQuery("getAdress", basicDataAPI.getAddress, {
    enabled: visible,
    onError: (error: AxiosError) => {
      message.error(error.response?.data?.msg);
    },
  });

  const getBankQuery = useQuery("getBank", basicDataAPI.getBank, {
    enabled: visible,
    onError: (error: AxiosError) => {
      message.error(error.response?.data?.msg);
    },
  });

  const resetStates = useCallback(() => {
    form.resetFields();
    setAddress({ building: "", floor: "" });
  }, [form]);

  useEffect(() => {
    resetStates();
  }, [visible, resetStates]);

  return (
    <TurtleModal
      centered
      width="520px"
      title={t("vendor.request create")}
      visible={visible}
      onCancel={closeModal}
      footer={false}
      forceRender
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
            <Form.Item name="building" label="상가명" noStyle rules={[{ required: true }]}>
              <Select
                placeholder="상가명"
                style={{ width: "40%" }}
                loading={getAddressQuery.isLoading}
                onChange={(building) => {
                  setAddress({ building, floor: "" });
                  form.setFieldsValue({
                    ...form.getFieldsValue(),
                    floor: undefined,
                    colLoc: undefined,
                  });
                }}
              >
                {Object.keys(getAddressQuery.data?.data ?? []).map((building) => (
                  <Select.Option key={building} value={building}>
                    {building}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item name="floor" label="층" noStyle rules={[{ required: true }]}>
              <Select
                placeholder="층"
                style={{ width: "25%" }}
                onChange={(floor) => {
                  setAddress((address) => ({ ...address, floor }));
                  form.setFieldsValue({
                    ...form.getFieldsValue(),
                    colLoc: undefined,
                  });
                }}
              >
                {Object.keys(getAddressQuery.data?.data[address.building] ?? []).map(
                  (floor: string) => (
                    <Select.Option key={floor} value={floor}>
                      {floor}층
                    </Select.Option>
                  ),
                )}
              </Select>
            </Form.Item>
            <Form.Item name="colLoc" noStyle label="열/호" rules={[{ required: true }]}>
              <Select placeholder="열/호" style={{ width: "35%" }}>
                {(getAddressQuery.data?.data[address.building]?.[address.floor] ?? []).map(
                  (colLoc: string) => {
                    const [col, loc] = colLoc.split(" ");
                    return (
                      <Select.Option key={colLoc} value={colLoc}>
                        {col ? `${col}열 ${loc}호` : `${loc}호`}
                      </Select.Option>
                    );
                  },
                )}
              </Select>
            </Form.Item>
          </Input.Group>
        </Form.Item>

        <TurtleInput // 기타 주소 Input
          name="ext"
          label=" "
          placeholder={t("placeholder.ext")}
          required={false}
        />

        <TurtleDivider />

        <Form.Item label="계좌정보" required={true}>
          <Input.Group compact>
            <Form.Item name={["banks", "bank"]} noStyle rules={[{ required: true }]} label="은행">
              <Select style={{ width: "30%" }} placeholder="은행" loading={getBankQuery.isLoading}>
                {Object.values(getBankQuery.data?.data.code_set.code_list ?? []).map(
                  (bank: any) => (
                    <Select.Option key={bank} value={bank}>
                      {bank}
                    </Select.Option>
                  ),
                )}
              </Select>
            </Form.Item>
            <Form.Item
              name={["banks", "account_number"]}
              noStyle
              rules={[{ required: true }]}
              label="계좌번호"
            >
              <Input style={{ width: "40%" }} placeholder="계좌번호" />
            </Form.Item>
            <Form.Item
              name={["banks", "account_holder"]}
              noStyle
              rules={[{ required: true }]}
              label="예금주명"
            >
              <Input style={{ width: "30%" }} placeholder="예금주명" />
            </Form.Item>
          </Input.Group>
        </Form.Item>

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
        <TurtleDivider />
        <Form.Item
          name="file"
          label="전자영수증 사진첨부"
          required={true}
          rules={[{ required: true }]}
        >
          <Upload
            listType="picture"
            maxCount={1}
            accept=".jpg, .png, .jpeg, .pdf"
            beforeUpload={() => false}
            fileList={form.getFieldValue("file")?.fileList}
          >
            <TurtleButtonSub size="small">파일 선택하기</TurtleButtonSub>
          </Upload>
        </Form.Item>
        <Row justify="end">
          <Popconfirm
            title={t("description.really register")}
            okText={t("yes")}
            cancelText={t("no")}
            onConfirm={() => {
              form.validateFields().then(() => {
                const [col, loc] = form.getFieldValue("colLoc").split(" ");
                createQuery.mutate({
                  ...form.getFieldsValue(),
                  type: "create",
                  banks: [form.getFieldValue("banks")],
                  col,
                  loc,
                  file: form.getFieldValue("file").fileList[0].originFileObj,
                });
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
