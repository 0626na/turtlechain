import { useState } from "react";
import { Helmet } from "react-helmet";
import SignupPageTemplate from "./SignupPageTemplate";
import SignupSteps from "./SignupSteps";
import CompanyForm from "./CompanyForm";
import AdminForm from "./AdminForm";
import SignupResult from "./SignupResult";

const SignupPage = function () {
  const [currentStep, setCurrentStep] = useState(0);

  const handlePrevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleNextStep = () => {
    setCurrentStep(currentStep + 1);
  };

  const steps = [
    <CompanyForm onNextStep={handleNextStep} />,
    <AdminForm onPrevStep={handlePrevStep} onNextStep={handleNextStep} />,
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
