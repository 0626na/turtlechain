// antd
import { Steps } from "antd";
// lang
import { useTranslation } from "react-i18next";

interface Props {
  current: number;
}

const SignupSteps = function ({ current }: Props) {
  const { t } = useTranslation();
  const steps = [t("biz info"), t("admin account"), t("signup completed")];

  return (
    <Steps style={{ marginBottom: 40 }} size="small" current={current}>
      {steps.map((step) => {
        return <Steps.Step key={step} title={step} />;
      })}
    </Steps>
  );
};

export default SignupSteps;
