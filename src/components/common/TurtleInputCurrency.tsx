import { Form, InputNumber } from "antd";

interface Props {
  name: string;
  label: string;
}

function TurtleInputCurrency({ name, label }: Props) {
  return (
    <Form.Item name={name} label={label} rules={[{ required: true }]}>
      <InputNumber<number> 
        style={{ width: "96%" }} 
        min={1}
        formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",").replace(/\.(?=\d{0,2}$)/g, ",")}
        parser={(value) =>  value ? Number(value.replace("%", "")) : 0}
                  />
    </Form.Item>
  );
}

const currencyFormatter = (val: number) => {
  if (!val) return 0;
  return `${val}`.replace(/\B(?=(\d{3})+(?!\d))/g, ".").replace(/\.(?=\d{0,9}$)/g, ",");
}

const currencyParser = (val: string) => {

  if (!val) return 0;
  return Number.parseFloat(val.replace(/\$\s?|(\.*)/g, "").replace(/(\,{1})/g, ".")).toFixed(0)
}

export default TurtleInputCurrency;
