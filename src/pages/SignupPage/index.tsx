import { useState } from "react";
import { Helmet } from "react-helmet";
import {
  BUSINESS_INFORMATION,
  ADMIN_ACCOUNT,
  SIGN_UP_SUCCESS,
} from "constant/string";
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

  return (
    <SignupPageTemplate>
      <Helmet title="터틀체인 - 서비스 가입신청" />
      <SignupSteps
        steps={[BUSINESS_INFORMATION, ADMIN_ACCOUNT, SIGN_UP_SUCCESS]}
        current={currentStep}
      />
      {currentStep === 0 && (
        <CompanyForm //
          onNextStep={handleNextStep}
        />
      )}
      {currentStep === 1 && (
        <AdminForm //
          onPrevStep={handlePrevStep}
          onNextStep={handleNextStep}
        />
      )}
      {currentStep === 2 && (
        <SignupResult //
        />
      )}
    </SignupPageTemplate>
  );
};

export default SignupPage;
