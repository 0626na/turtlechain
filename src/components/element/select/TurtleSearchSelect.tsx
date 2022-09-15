import { Select } from 'antd';

import styled from '@emotion/styled';
import { ReactComponent as ArrowDown } from '@icons/arrowDown.svg';
import React from 'react';

interface Props {
  value: string;
  onChange: (value: unknown) => void;
  items: { value: string; name: string; icon?: React.ReactNode }[];
}

function TurtleSearchSelect({ items, onChange, value }: Props) {
  return (
    <StyledSelect
      bordered={false}
      value={value}
      suffixIcon={<ArrowDown />}
      onChange={onChange}
      dropdownStyle={{
        background: '#fff',
        boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.2)',
        borderRadius: 8,
      }}
    >
      {items?.map((item, idx) => (
        <Select.Option
          style={{
            padding: '8px 10px',
          }}
          key={idx}
          value={item.value}
        >
          {item.name}
        </Select.Option>
      ))}
    </StyledSelect>
  );
}

const StyledSelect = styled(Select)`
  background-color: #f5f6f7;
  border-radius: 6px;

  // 셀렉터 인풋 style
  &.ant-select-single .ant-select-selector .ant-select-selection-item {
    line-height: 26px;
  }
  &.ant-select-single:not(.ant-select-customize-input) .ant-select-selector {
    width: 100px;
    height: 28px;
    font-size: 13px;
    color: #5b5d63;
  }
  &.ant-select-single:not(.ant-select-customize-input) .ant-select-selector {
    padding: 0px 10px;
  }
`;

export default TurtleSearchSelect;
