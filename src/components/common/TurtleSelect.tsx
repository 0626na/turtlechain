import { Select, Space, Typography } from "antd";
import { SelectValue } from "antd/lib/select";

interface Props {
  label?: string;
  options?: Array<{ name: string; value: number | string }>;
  loading?: boolean;
  placeholder?: string;
  width?: "long" | "short";
  value: string;
  onSelect: (value: string) => void;
}

function TurtleSelect({
  label,
  options,
  loading,
  placeholder,
  width = "long",
  value,
  onSelect,
}: Props) {
  return (
    <Space size="large">
      <Typography.Text>{label}</Typography.Text>
      <Select
        placeholder={placeholder}
        loading={loading}
        style={{ width: width === "long" ? "16rem" : "8rem" }}
        value={value}
        onSelect={onSelect}
      >
        {options?.map(({ name, value }) => {
          return (
            <Select.Option key={value} value={value}>
              {name}
            </Select.Option>
          );
        })}
      </Select>
    </Space>
  );
}

export default TurtleSelect;
