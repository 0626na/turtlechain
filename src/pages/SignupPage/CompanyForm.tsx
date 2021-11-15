import styled from "styled-components";
import { useState } from "react";
import { useHistory } from "react-router-dom";
import { Company } from "pages/SignupPage";
// antd
import { UploadOutlined } from "@ant-design/icons";
import { Button, Form, Input, Radio, Upload, RadioChangeEvent } from "antd";
// constant
import { BUSINESS_TYPE_OPTIONS } from "constant/options";
import {
  BUSINESS_TYPE,
  OWNER_NAME,
  BUSINESS_NAME,
  BUSINESS_NUMBER,
  BUSINESS_ADDRESS,
  BUSINESS_LICENSE,
  FIND_ADDRESS,
  ETC,
  PREV,
  NEXT,
} from "constant/string";
// components
import PostcodeModal from "components/DaumPostcodeModal";

interface Props {
  company: Company;
  setCompany: React.Dispatch<React.SetStateAction<Company>>;
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
}

const CompanyForm = function ({ company, setCompany, setCurrentStep }: Props) {
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
        <Form.Item label={BUSINESS_TYPE}>
          <Radio.Group
            name="biz_type"
            value={company.biz_type}
            onChange={handleRadioChange}
          >
            {BUSINESS_TYPE_OPTIONS.map((option) => {
              const { value, label } = option;
              return (
                <Radio key={value} value={value}>
                  {label}
                </Radio>
              );
            })}
          </Radio.Group>
        </Form.Item>
        <Form.Item label={OWNER_NAME}>
          <Input
            name="owner"
            value={company.owner}
            onChange={handleTextChange}
          />
        </Form.Item>
        <Form.Item label={BUSINESS_NAME}>
          <Input //
            name="name"
            value={company.name}
            onChange={handleTextChange}
          />
        </Form.Item>
        <Form.Item label={BUSINESS_NUMBER}>
          <Input //
            name="biz_num"
            value={company.biz_num}
            onChange={handleTextChange}
          />
        </Form.Item>
        <Form.Item label={BUSINESS_ADDRESS}>
          <Input
            readOnly
            disabled
            name="address"
            value={company.address}
            suffix={
              <Button type="link" onClick={openPostcodeModal}>
                {FIND_ADDRESS}
              </Button>
            }
          />
        </Form.Item>
        <Form.Item label={BUSINESS_LICENSE}>
          <Upload listType="picture" {...uploadProps}>
            <Button
              type="primary"
              disabled={company.biz_license_file !== null}
              icon={<UploadOutlined />}
            >
              {BUSINESS_LICENSE}
            </Button>
          </Upload>
        </Form.Item>
        <Form.Item label={ETC}>
          <Input.TextArea
            style={{ height: 150 }}
            name="memo"
            value={company.memo}
            onChange={handleTextChange}
          />
        </Form.Item>
        <ButtonContainer>
          <Button block onClick={handlePrev}>
            {PREV}
          </Button>
          <Button block type="primary" onClick={handleNext}>
            {NEXT}
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
