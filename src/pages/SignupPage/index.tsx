import { useState } from "react";
import { Helmet } from "react-helmet";
import { retailerCompanyAPI, userAPI } from "apis";
import { message } from "antd";
import SignupPageTemplate from "./SignupPageTemplate";
import SignupSteps from "./SignupSteps";
import CompanyForm from "./CompanyForm";
import AdminForm from "./AdminForm";
import SignupResult from "./SignupResult";

export interface Company {
  biz_type: "personal" | "entity" | "simple";
  owner: string;
  name: string;
  biz_num: string;
  address: string;
  biz_license_file: null | File;
  memo: string;
}

export interface Admin {
  mobile_tel: string;
  name: string;
  email: string;
  login_id: string;
  password: string;
  confirmPassword: string;
}

const SignupPage = function () {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [company, setCompany] = useState<Company>({
    biz_type: "entity",
    owner: "",
    name: "",
    biz_num: "",
    address: "",
    biz_license_file: null,
    memo: "",
  });
  const [admin, setAdmin] = useState<Admin>({
    mobile_tel: "",
    name: "",
    email: "",
    login_id: "",
    password: "",
    confirmPassword: "",
  });

  const submit = async () => {
    try {
      setIsSubmitting(true);
      // 사업자 생성 요청
      const { company_id } = await retailerCompanyAPI.create({
        ...company,
        biz_license_file: company.biz_license_file as File,
      });
      // 유저 생성 요청
      await userAPI.create({ ...admin, company_id });
      setCurrentStep((prevStep) => prevStep + 1);
    } catch (error: any) {
      message.error(error.response?.data?.msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const steps = [
    <CompanyForm
      company={company}
      setCompany={setCompany}
      setCurrentStep={setCurrentStep}
    />,
    <AdminForm
      admin={admin}
      setAdmin={setAdmin}
      setCurrentStep={setCurrentStep}
      isSubmitting={isSubmitting}
      onSubmit={submit}
    />,
    <SignupResult />,
  ];

  return (
    <SignupPageTemplate>
      <Helmet title="터틀체인 - 서비스 가입신청" />
      <SignupSteps current={currentStep} />
      {steps[currentStep]}
    </SignupPageTemplate>
  );
};

export default SignupPage;
