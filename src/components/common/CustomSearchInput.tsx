import { Form, Input } from "antd";
import Search from "antd/lib/input/Search";
import React from "react";
import styled from "styled-components";

interface Props {
  name: string;
  label: string;
  rules: Array<any>;
  placeholder: string;
}

function CustomSearchInput({ name, label, rules, placeholder }: Props) {
  return (
    <Form.Item name={name} label={label} rules={rules}>
      <StyledSearch
        placeholder={placeholder}
        onSearch={() => {}}
        enterButton
        style={{ borderRadius: "2rem" }}
      />
    </Form.Item>
  );
}

const StyledSearch = styled(Search)`
  .ant-input {
    border-radius: 0.4rem 0 0 0.4rem;
  }
  .ant-input-search-button {
    border-radius: 0 0.4rem 0.4rem 0 !important;
    background-color: ${({ theme }) => theme.greyButton};
    border-color: ${({ theme }) => theme.border};
    &:hover {
      border-color: ${({ theme }) => theme.primary};
    }
  }
  /*
  돋보기 버튼 흰색이 더 나은 것 같아서 보류
  .anticon-search {
    color: ${({ theme }) => theme.text};
  }
  */
`;

export default CustomSearchInput;
