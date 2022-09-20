import { Select } from 'antd';

import React from 'react';
import { css } from '@emotion/react';
import TurtleIcon from '../icon/TurtleIcon';

interface Props {
  value: string;
  onChange: (value: unknown) => void;
  items: { value: string; name: string; icon?: React.ReactNode }[];
}

function TurtleSearchSelect({ items, onChange, value }: Props) {
  return (
    <Select
      css={select}
      bordered={false}
      value={value}
      suffixIcon={<TurtleIcon name="arrowDown" />}
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
    </Select>
  );
}

const select = css`
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
