import React from 'react';
import { Select } from 'antd';
import TurtleIcon from '../icon/TurtleIcon';
import { css } from '@emotion/react';

interface Props {
  value?: string;
  onChange?: (value: any) => void;
  items?: { value: string; name: string; icon?: React.ReactNode }[];
  disabled?: boolean;
  showSearch?: boolean;
  placeholder?: string;
}

function TurtleTableSelect({ items, ...props }: Props) {
  return (
    <Select
      css={select}
      {...props}
      bordered={false}
      suffixIcon={<TurtleIcon name="arrowDown" />}
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
  height: 24px;
  width: 100%;
  //padding: 0px;
  border-radius: 4px;
  border: 1px solid #d6d7da;
  //box-shadow: 0px 1px 2px rgba(27, 62, 114, 0.1);
  line-height: 1;

  // 셀렉터 인풋 style
  &.ant-select-single .ant-select-selector {
    .ant-select-selection-item,
    .ant-select-selection-placeholder {
      line-height: 22px;
    }
  }

  &.ant-select-single:not(.ant-select-customize-input) .ant-select-selector {
    height: 36px;
    font-size: 14px;
    padding-left: 10px;

    //padding: 0px 10px;
  }
  &.ant-select-disabled {
    background-color: #f6f7f8;
  }
`;

export default TurtleTableSelect;
