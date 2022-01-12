import { Select, Space, Typography } from "antd";
import { SelectValue } from "antd/lib/select";

interface Props {
  label?: string;
  options?: Array<{ name: string; id: number }>;
  loading?: boolean;
  placeholder?: string;
  width?: "long" | "short";
}

function TurtleSelect({ label, options, loading, placeholder, width = "long" }: Props) {
  const handleChange = (value: SelectValue) => {
    console.log(`selected ${value}`);
  };

  return (
    <Space size="large">
      <Typography.Text>{label}</Typography.Text>
      <Select
        placeholder={placeholder}
        loading={loading}
        onChange={handleChange}
        style={{ width: width === "long" ? "16rem" : "8rem" }}
      >
        {options?.map(({ name, id }) => {
          return (
            <Select.Option key={id} value={id}>
              {name}
            </Select.Option>
          );
        })}
      </Select>
    </Space>
  );
}

export default TurtleSelect;
