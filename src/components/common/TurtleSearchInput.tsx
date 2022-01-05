import { Form, Input } from "antd";
import Search from "antd/lib/input/Search";
import React from "react";
import styled from "styled-components";

interface Props {
  name: string;
  label: string;
  placeholder: string;
}

function TurtleSearchInput({ name, label, placeholder }: Props) {
  return (
    <Form.Item name={name} label={label} rules={[{ required: true }]}>
      <Search placeholder={placeholder} onSearch={() => {}} enterButton />
    </Form.Item>
  );
}

export default TurtleSearchInput;
