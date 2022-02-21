import { Form, Input, Select } from "antd";
import { BaseOptionType } from "antd/lib/select";

interface Props {
  required?: boolean;
  name?: Array<string> | string;
  label?: string;
  placeholder?: string;
  readOnly?: boolean;
  disabled?: boolean;
  value?: string;
  selectOptions?: Array<BaseOptionType> 
}

function TurtleInputSelect({
  required = true,
  name,
  label,
  placeholder,
  readOnly = false,
  disabled,
  // value,
  selectOptions
}: Props) {
  return (
    <Form.Item required={required} name={name} label={label} rules={[{ required: required }]}>
      <Select options={selectOptions}/>


      {/* </Select> */}
      {/* <Input placeholder={placeholder} readOnly={readOnly} disabled={disabled} value={value} /> */}
    </Form.Item>
  );
}

export default TurtleInputSelect;
