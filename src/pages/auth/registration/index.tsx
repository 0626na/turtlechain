import { t } from 'i18next';
import { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Form, message, Steps } from 'antd';
import { SignupPageBody } from '@layout/login';
import CompanyStep from './CompanyStep';
import UserStep from './UserStep';
import ResultStep from './ResultStep';
import { useMutation, useQuery } from 'react-query';
import userAPI from '@apis/userAPI';
import { AxiosError } from 'axios';
import { useSearchParams } from 'react-router-dom';
import { phonePattern } from '@utils/pattern';

function RegistrationPage() {
  const title = `${t('turtlechain')} - ${t('signup')}`;
  const [form] = Form.useForm();

  const [searchParams] = useSearchParams();

  const [currentStep, setCurrentStep] = useState(0);

  const registrationQuery = useQuery(
    ['registrationQuery'],
    () => {
      return userAPI.getRegistration({
        encrypted_text: searchParams.get('encrypted_text')!,
      });
    },
    {
      onSuccess: (data) => {
        form.setFieldsValue({
          // 사업자 정보
          company_biz_type: data.data.registration_list[0].company_biz_type,
          company_owner: data.data.registration_list[0].company_owner,
          company_name: data.data.registration_list[0].company_name,
          company_biz_num: data.data.registration_list[0].company_biz_num,
          company_main_address:
            data.data.registration_list[0].company_main_address,
          company_sub_address:
            data.data.registration_list[0].company_sub_address,
          company_biz_license_file: [
            {
              uid: '1',
              name: data.data.registration_list[0].company_biz_license_path
                .split('/')
                .pop(),
              status: 'done',
              url: data.data.registration_list[0].company_biz_license_path,
            },
          ],
          company_store_url: data.data.registration_list[0].company_store_url,

          // 관리자 계정
          user_name: data.data.registration_list[0].user_name,
          user_email: data.data.registration_list[0].user_email,
          user_mobile: data.data.registration_list[0].user_mobile.replace(
            phonePattern,
            '$1-$2-$3',
          ),
          user_login_id: data.data.registration_list[0].user_login_id,
        });
      },
      onError: (error: AxiosError) => {
        message.warn(error.response?.data.msg);
      },
    },
  );

  const updateRegistrationMutate = useMutation(
    ['updateRegistrationMutate'],
    userAPI.updateRegistration,
    {
      onSuccess: () => {
        setCurrentStep(2);
      },
      onError: (error: AxiosError) => {
        message.warn(error.response?.data.msg);
      },
    },
  );

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
            updateRegistrationMutate.mutate({
              id: registrationQuery?.data?.data.registration_list[0].id!,
              data: {
                encrypted_text: searchParams.get('encrypted_text')!,
                ...value,
                company_biz_license_file:
                  value.company_biz_license_file[0].originFileObj,
              },
            });
          }}
        >
          <CompanyStep
            form={form}
            visible={currentStep === 0}
            onClickNext={() => {
              setCurrentStep((currentStep) => currentStep + 1);
            }}
          />
          <UserStep
            form={form}
            visible={currentStep === 1}
            onClickPrev={() => {
              setCurrentStep((currentStep) => currentStep - 1);
            }}
            loading={updateRegistrationMutate.isLoading}
          />
          <ResultStep visible={currentStep === 2} />
        </Form>
      </SignupPageBody>
    </>
  );
}

export default RegistrationPage;
