// antd
import { Steps } from "antd";
// lang
import { t } from "i18next";

interface Props {
  current: number;
}

function SignupSteps({ current }: Props) {
  const steps = [t("biz info"), t("admin account"), t("signup completed")];

  return (
    <Steps style={{ marginBottom: 40 }} size="small" current={current}>
      {steps.map((step) => {
        return <Steps.Step key={step} title={step} />;
      })}
    </Steps>
  );
}

export default SignupSteps;
