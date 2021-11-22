import styled from "styled-components";
import { useState } from "react";
import { useHistory } from "react-router-dom";
import { Company } from "pages/SignupPage";
// antd
import { UploadOutlined } from "@ant-design/icons";
import { Button, Form, Input, Radio, Upload, RadioChangeEvent } from "antd";
// lang
import { useTranslation } from "react-i18next";
// constant
import { BIZ_TYPE_OPTIONS } from "constant";
// components
import PostcodeModal from "components/DaumPostcodeModal";

interface Props {
  company: Company;
  setCompany: React.Dispatch<React.SetStateAction<Company>>;
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
}

const CompanyForm = function ({ company, setCompany, setCurrentStep }: Props) {
  const { t } = useTranslation();
  const history = useHistory();

  const [visiblePostcodeModal, setVisiblePostcodeModal] = useState(false);

  // upload file props
  const uploadProps = {
    fileList: company.biz_license_file ? [company.biz_license_file as any] : [],
    onRemove: () => {
      setCompany({ ...company, biz_license_file: null });
    },
    beforeUpload: (file: File) => {
      setCompany({ ...company, biz_license_file: file });
      return false;
    },
  };

  // 주소 찾기 모달 열기
  const openPostcodeModal = () => {
    setVisiblePostcodeModal(true);
  };

  // 주소 찾기 모달 닫기
  const closePostcodeModal = () => {
    setVisiblePostcodeModal(false);
  };

  // 주소 얻기
  const getAddress = (address: string) => {
    setCompany({ ...company, address });
  };

  // text change 이벤트
  const handleTextChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setCompany({ ...company, [name]: value });
  };

  // radio change 이벤트
  const handleRadioChange = (e: RadioChangeEvent) => {
    const { name, value } = e.target;
    setCompany({ ...company, [name as string]: value });
  };

  // 이전 단계
  const handlePrev = () => {
    history.push("/");
  };

  // 다음 단계
  const handleNext = () => {
    setCurrentStep((prevStep) => prevStep + 1);
  };

  return (
    <>
      <PostcodeModal
        visible={visiblePostcodeModal}
        onClose={closePostcodeModal}
        onGetAddress={getAddress}
      />
      <Form layout="vertical">
        <Form.Item label={t("biz type")}>
          <Radio.Group
            name="biz_type"
            value={company.biz_type}
            onChange={handleRadioChange}
          >
            {BIZ_TYPE_OPTIONS.map((option) => {
              const label = t(`biz ${option}`);
              return (
                <Radio key={option} value={option}>
                  {label}
                </Radio>
              );
            })}
          </Radio.Group>
        </Form.Item>
        <Form.Item label={t("owner")}>
          <Input
            name="owner"
            value={company.owner}
            onChange={handleTextChange}
          />
        </Form.Item>
        <Form.Item label={t("biz name")}>
          <Input //
            name="name"
            value={company.name}
            onChange={handleTextChange}
          />
        </Form.Item>
        <Form.Item label={t("biz num")}>
          <Input //
            name="biz_num"
            value={company.biz_num}
            onChange={handleTextChange}
          />
        </Form.Item>
        <Form.Item label={t("biz address")}>
          <Input
            readOnly
            disabled
            name="address"
            value={company.address}
            suffix={
              <Button type="link" onClick={openPostcodeModal}>
                {t("find address")}
              </Button>
            }
          />
        </Form.Item>
        <Form.Item label={t("biz license")}>
          <Upload listType="picture" {...uploadProps}>
            <Button
              type="primary"
              disabled={company.biz_license_file !== null}
              icon={<UploadOutlined />}
            >
              {t("biz license")}
            </Button>
          </Upload>
        </Form.Item>
        <Form.Item label={t("etc")}>
          <Input.TextArea
            style={{ height: 150 }}
            name="memo"
            value={company.memo}
            onChange={handleTextChange}
          />
        </Form.Item>
        <ButtonContainer>
          <Button block onClick={handlePrev}>
            {t("prev")}
          </Button>
          <Button block type="primary" onClick={handleNext}>
            {t("next")}
          </Button>
        </ButtonContainer>
      </Form>
    </>
  );
};

const ButtonContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  & > * + * {
    margin-left: 20px;
  }
`;

export default CompanyForm;
