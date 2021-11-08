import { Steps } from "antd";

interface Props {
  steps: string[];
  current: number;
}

const SignupSteps = function ({ steps, current }: Props) {
  return (
    <Steps style={{ padding: "40px 0" }} current={current}>
      {steps.map((title, index) => {
        return <Steps.Step key={index} title={title} />;
      })}
    </Steps>
  );
};

export default SignupSteps;
