import { useState } from "react";
import { Helmet } from "react-helmet";
import SignupPageTemplate from "./SignupPageTemplate";
import SignupSteps from "./SignupSteps";
import CompanyForm from "./CompanyForm";
import AdminForm from "./AdminForm";
import SignupResult from "./SignupResult";

export interface Company {
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
  const [company, setCompany] = useState<Company>({
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
