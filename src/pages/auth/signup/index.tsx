import { t } from 'i18next';
import { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Form, message, Steps } from 'antd';
import { SignupPageBody } from '@layout/login';
import CompanyStep from './CompanyStep';
import UserStep from './UserStep';
import ResultStep from './ResultStep';
import { useMutation } from 'react-query';
import userAPI from '@apis/userAPI';
import { AxiosError } from 'axios';

function SignupPage() {
  const title = `${t('turtlechain')} - ${t('signup')}`;
  const [form] = Form.useForm();
  const [currentStep, setCurrentStep] = useState(0);

  const createUserQuery = useMutation('createUser', userAPI.create, {
    onSuccess: () => {
      setCurrentStep(2);
    },
    onError: (error: AxiosError) => {
      message.warn(error.response?.data.msg);
    },
  });
  return (
    <>
      <Helmet title={title} />
      <SignupPageBody>
        <Steps style={{ marginBottom: 40 }} size="small" current={currentStep}>
          <Steps.Step key={0} title={t('biz info')} />
          <Steps.Step key={1} title={t('admin account')} />
          <Steps.Step key={2} title={t('signup completed')} />
        </Steps>
        <Form
          layout="vertical"
          form={form}
          onFinish={(value) => {
            createUserQuery.mutate({
              ...value,
              user_type: 'rt',
              company_biz_license_file:
                value.company_biz_license_file[0].originFileObj,
            });
          }}
        >
          <CompanyStep
            visible={currentStep === 0}
            onClickNext={() => {
              setCurrentStep((currentStep) => currentStep + 1);
            }}
          />
          <UserStep
            visible={currentStep === 1}
            onClickPrev={() => {
              setCurrentStep((currentStep) => currentStep - 1);
            }}
            loading={createUserQuery.isLoading}
          />
          <ResultStep visible={currentStep === 2} />
        </Form>
      </SignupPageBody>
    </>
  );
}

export default SignupPage;
