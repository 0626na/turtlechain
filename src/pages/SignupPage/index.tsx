import { useState } from "react";
import { Helmet } from "react-helmet";
// async
import { retailerCompanyAPI, userAPI } from "apis";
// antd
import { message } from "antd";
// lang
import { useTranslation } from "react-i18next";
// components
import SignupPageTemplate from "./SignupPageTemplate";
import SignupSteps from "./SignupSteps";
import CompanyForm from "./CompanyForm";
import UserForm from "./UserForm";
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

export interface User {
  mobile_tel: string;
  name: string;
  email: string;
  login_id: string;
  password: string;
  confirmPassword: string;
}

const SignupPage = function () {
  const { t } = useTranslation();
  const title = `${t("turtlechain")} - ${t("signup")}`;

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
  const [user, setUser] = useState<User>({
    mobile_tel: "",
    name: "",
    email: "",
    login_id: "",
    password: "",
    confirmPassword: "",
  });

  // 서비스 가입 요청
  const submit = async () => {
    try {
      setIsSubmitting(true);
      // 사업자 생성 요청
      const { company_id } = await retailerCompanyAPI.create({
        ...company,
        biz_license_file: company.biz_license_file as File,
      });
      // 유저 생성 요청
      await userAPI.create({ ...user, company_id });
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
    <UserForm
      user={user}
      setUser={setUser}
      setCurrentStep={setCurrentStep}
      isSubmitting={isSubmitting}
      onSubmit={submit}
    />,
    <SignupResult />,
  ];

  return (
    <SignupPageTemplate>
      <Helmet title={title} />
      <SignupSteps current={currentStep} />
      {steps[currentStep]}
    </SignupPageTemplate>
  );
};

export default SignupPage;
