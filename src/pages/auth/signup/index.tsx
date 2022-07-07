import { t } from 'i18next';
import { useState } from 'react';
import { Helmet } from 'react-helmet';
import { message } from 'antd';
import { SignupPageBody } from '@layout/login';
import userAPI from '@apis/userAPI';
import retailerCompanyAPI from '@apis/retailerCompanyAPI';
import SignupSteps from './SignupSteps';
import CompanyForm from './CompanyForm';
import UserForm from './UserForm';
import SignupResult from './SignupResult';

export interface Company {
  biz_type: 'personal' | 'entity' | 'simple';
  owner: string;
  name: string;
  biz_num: string;
  address_main: string;
  address_sub: string;
  biz_license_file: null | File;
  memo: string;
}

export interface User {
  name: string;
  email: string;
  mobile_phone: string;
  login_id: string;
  password: string;
}

function SignupPage() {
  const title = `${t('turtlechain')} - ${t('signup')}`;

  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const steps = [
    // <CompanyForm onNext={() => setCurrentStep(currentStep + 1)} />,
    // <UserForm
    //   isSubmitting={isSubmitting}
    //   onPrev={() => setCurrentStep(currentStep - 1)}
    // />,
    <SignupResult />,
  ];

  return (
    <>
      <Helmet title={title} />
      <SignupPageBody>
        <SignupSteps current={currentStep} />
        {steps[currentStep]}
      </SignupPageBody>
    </>
  );
}

export default SignupPage;
