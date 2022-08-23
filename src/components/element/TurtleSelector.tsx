import { Select, SelectProps } from 'antd';
import styled from 'styled-components';
import { ReactComponent as ArrowDown } from '@icons/arrowDown.svg';
import React from 'react';

const { Option } = Select;

interface Props extends SelectProps {
  defaultValue: string;
  items: { value: string; icon?: React.ReactNode }[];
  onChange?: (value: any) => void;
  style?: React.CSSProperties;
}

function TurtleSelector({ defaultValue, items, onChange, style }: Props) {
  return (
    <StyledSelect
      // defaultOpen={true}
      bordered={false}
      suffixIcon={<ArrowDown />}
      defaultValue={defaultValue}
      onChange={onChange}
      style={style}
      dropdownStyle={{
        background: '#fff',
        boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.2)',
        borderRadius: 8,
      }}
    >
      {items.map((item, idx) => (
        <Option
          style={{
            padding: '8px 10px',
          }}
          key={idx}
          value={item.value}
        >
          {item.value}
        </Option>
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

export default TurtleSelector;
