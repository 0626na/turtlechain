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

  const [company, setCompany] = useState<Company>({
    biz_type: 'entity',
    owner: '',
    name: '',
    biz_num: '',
    address_main: '',
    address_sub: '',
    biz_license_file: null,
    memo: '',
  });
  const [user, setUser] = useState<User>({
    name: '',
    email: '',
    mobile_phone: '',
    login_id: '',
    password: '',
  });

  // 서비스 가입 신청
  // 1. 사업자 생성 완료
  // 2. 유저 생성 완료
  // 3. 가입 신청 완료
  const submit = async () => {
    try {
      setIsSubmitting(true);
      const { company_id } = await retailerCompanyAPI.create({
        ...company,
        tax_type: '[]',
        service_usage: '[]',
        stores: '[]',
        biz_license_file: company.biz_license_file as File,
      });
      await userAPI.create({ ...user, type: 'rt', company_id });
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
      onNext={() => setCurrentStep(currentStep + 1)}
    />,
    <UserForm
      user={user}
      isSubmitting={isSubmitting}
      setUser={setUser}
      onPrev={() => setCurrentStep(currentStep - 1)}
      onSignup={submit}
    />,
    <SignupResult />,
  ];

  return (
    <SignupPageBody>
      <Helmet title={title} />
      <SignupSteps current={currentStep} />
      {steps[currentStep]}
    </SignupPageBody>
  );
}

export default SignupPage;
