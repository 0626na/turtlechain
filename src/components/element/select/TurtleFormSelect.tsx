import { Select } from 'antd';

import styled from '@emotion/styled';
import { ReactComponent as ArrowDown } from '@icons/arrowDown.svg';
import React from 'react';

interface Props {
  value?: string;
  onChange?: (value: unknown) => void;
  items?: { value: string; name: string; icon?: React.ReactNode }[];
  disabled?: boolean;
  placeholder?: string;
}

function TurtleFormSelect({ items, ...props }: Props) {
  return (
    <StyledSelect
      {...props}
      bordered={false}
      suffixIcon={<ArrowDown />}
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
  height: 36px;
  background-color: #fcfcfc;
  border-radius: 8px;
  border: 1px solid #cbccd1;
  box-shadow: 0px 1px 2px rgba(27, 62, 114, 0.1);
  color: #5b5d63;
  line-height: 1;

  // 셀렉터 인풋 style
  &.ant-select-single .ant-select-selector {
    .ant-select-selection-item,
    .ant-select-selection-placeholder {
      line-height: 36px;
    }
  }

  &.ant-select-single:not(.ant-select-customize-input) .ant-select-selector {
    width: 152px;
    height: 36px;
    font-size: 14px;
    padding: 0px 10px;
  }
  &.ant-select-disabled {
    background-color: #f6f7f8;
  }
`;

export default TurtleFormSelect;
