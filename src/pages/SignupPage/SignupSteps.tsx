import { Steps } from "antd";
import {
  BUSINESS_INFORMATION,
  ADMIN_ACCOUNT,
  SIGN_UP_SUCCESS,
} from "constant/string";

interface Props {
  current: number;
}

const SignupSteps = function ({ current }: Props) {
  const steps = [BUSINESS_INFORMATION, ADMIN_ACCOUNT, SIGN_UP_SUCCESS];
  return (
    <Steps style={{ marginBottom: 40 }} size="small" current={current}>
      {steps.map((step) => {
        return <Steps.Step key={step} title={step} />;
      })}
    </Steps>
  );
};

export default SignupSteps;
