import { Button, Form, Input, message, Row, Select, Typography, Upload } from "antd";
import { retailerCompanyAPI } from "apis";
import { AxiosError } from "axios";
import { DaumPostcodeModal } from "components/combine";
import { TurtleButton, TurtleButtonSub, TurtleCardSetting } from "components/common";
import { t } from "i18next";
import { useState } from "react";
import { useMutation, useQuery } from "react-query";
import { bizNumPattern } from "utils/pattern";

function PageBody() {
  const [form] = Form.useForm();
  const [isUpdateMode, setIsUpdateMode] = useState(false);
  const [postcodeModalVisible, setPostcodeModalVisible] = useState(false);

  const getQuery = useQuery("getCompany", () => retailerCompanyAPI.get(), {
    onError: (error: AxiosError) => {
      message.error(error.response?.data?.msg);
    },
  });

  const updateQuery = useMutation("updateCompany", retailerCompanyAPI.update, {
    onError: (error: AxiosError) => {
      message.error(error.response?.data?.msg);
    },
    onSuccess: (data) => {
      message.success(t("message.success update"));
      setIsUpdateMode(false);
      getQuery.refetch();
    },
  });

  return (
    <Row>
      <TurtleCardSetting
        title={t("company.info")}
        style={{ marginBottom: 24 }}
        extra={
          isUpdateMode ? (
            <Typography.Link
              type="secondary"
              onClick={() => {
                setIsUpdateMode(false);
              }}
            >
              닫기
            </Typography.Link>
          ) : (
            <Typography.Link
              type="secondary"
              onClick={() => {
                setIsUpdateMode(true);
                form.resetFields();
                form.setFieldsValue({
                  company_id: getQuery.data?.id,
                  biz_type: getQuery.data?.biz_type,
                  name: getQuery.data?.name,
                  address_main: getQuery.data?.address.split("::")[0],
                  address_sub: getQuery.data?.address.split("::")[1],
                  email: getQuery.data?.email,
                  memo: getQuery.data?.memo,
                });
              }}
            >
              수정하기
            </Typography.Link>
          )
        }
      >
        <Form
          layout="horizontal"
          form={form}
          colon={false}
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 7 }}
          onFinish={(value) => {
            updateQuery.mutate({
              ...value,
              biz_license_file: form.getFieldValue("biz_license_file")?.fileList[0].originFileObj,
              address_sub: form.getFieldValue("address_sub") ?? "",
            });
          }}
        >
          <Form.Item name="company_id" hidden>
            <Input hidden />
          </Form.Item>

          <Form.Item label={t("company.type.")} name="biz_type">
            {isUpdateMode ? (
              <Select>
                <Select.Option value="personal">{t(`company.type.personal`)}</Select.Option>
                <Select.Option value="entity">{t(`company.type.entity`)}</Select.Option>
                <Select.Option value="simple">{t(`company.type.simple`)}</Select.Option>
              </Select>
            ) : (
              t(`company.type.${getQuery.data?.biz_type}`)
            )}
          </Form.Item>
          <Form.Item label="사업자 번호">
            {getQuery.data?.biz_num.replace(bizNumPattern, "$1-$2-$3")}
          </Form.Item>
          <Form.Item label="사업자명" name="name">
            {isUpdateMode ? <Input /> : getQuery.data?.name}
          </Form.Item>
          <Form.Item label="사업자 주소" name="address_main">
            {isUpdateMode ? (
              <Input
                readOnly
                suffix={
                  <Button
                    size="small"
                    type="link"
                    style={{ fontSize: 13 }}
                    onClick={() => setPostcodeModalVisible(true)}
                  >
                    {t("find address")}
                  </Button>
                }
              />
            ) : (
              getQuery.data?.address
            )}
          </Form.Item>
          <DaumPostcodeModal
            visible={postcodeModalVisible}
            onClose={() => setPostcodeModalVisible(false)}
            onGetAddress={(address_main) => {
              form.setFieldsValue({ ...form.getFieldsValue, address_main });
            }}
          />
          {isUpdateMode && (
            <Form.Item label="상세주소" name="address_sub">
              <Input />
            </Form.Item>
          )}
          <Form.Item label="세금계산서 발행메일" name="email">
            {isUpdateMode ? <Input /> : getQuery.data?.email}
          </Form.Item>
          <Form.Item label="메모" name="memo">
            {isUpdateMode ? <Input /> : getQuery.data?.memo}
          </Form.Item>
          <Form.Item label="사업자등록증" name="biz_license_file">
            {isUpdateMode ? (
              <Upload
                listType="picture"
                maxCount={1}
                accept=".jpg, .png, .jpeg, .pdf"
                beforeUpload={() => false}
                onRemove={() => false}
                defaultFileList={[
                  {
                    uid: "1",
                    name: getQuery.data?.biz_license_path.split("/").pop()!,
                    status: "done",
                    url: getQuery.data?.biz_license_path,
                  },
                ]}
              >
                <TurtleButtonSub size="small">파일 선택하기</TurtleButtonSub>
              </Upload>
            ) : (
              <Typography.Link target="_self" href={getQuery.data?.biz_license_path}>
                {getQuery.data?.biz_license_path.split("/").pop()}
              </Typography.Link>
            )}
          </Form.Item>
          <Row justify="end">
            {isUpdateMode && (
              <TurtleButton htmlType="submit" type="default">
                수정하기
              </TurtleButton>
            )}
          </Row>
        </Form>
      </TurtleCardSetting>
    </Row>
  );
}

export default PageBody;
