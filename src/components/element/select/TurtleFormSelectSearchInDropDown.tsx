import { Input, Select } from 'antd';
import { ReactComponent as ArrowDown } from '@icons/arrowDown.svg';
import React, { ChangeEvent, RefObject, useState } from 'react';
import { css } from '@emotion/react';
import { BaseSelectRef } from 'rc-select';
import { OptionProps } from 'antd/lib/select';
import TurtleIcon from '../icon/TurtleIcon';
import { theme } from '@styles/theme';
import { t } from 'i18next';

interface Props {
  value?: string;
  onChange?: (value: string) => void;
  items?: { value: string; name: string; icon?: React.ReactNode }[];
  disabled?: boolean;
  showSearch?: boolean;
  addStore?: (value: string) => void;
  onSearch?: (value: string) => void;
  placeholder?: string;
}

export function TurtleFormSelectSearchInDropDown({
  items,
  value,
  showSearch,
  onChange,
  onSearch,
  addStore,
  ...props
}: Props) {
  const [open, setOpen] = useState(false);
  return (
    <Select
      value={value}
      showSearch={showSearch}
      onChange={onChange}
      onSearch={onSearch}
      css={select}
      {...props}
      placeholder={t('placeholder.select store')}
      bordered={false}
      open={open}
      onDropdownVisibleChange={(visible) => setOpen(visible)}
      suffixIcon={<ArrowDown />}
      dropdownStyle={{
        background: '#fff',
        boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.2)',
        borderRadius: 8,
      }}
      dropdownRender={(menu) => (
        <>
          <Input
            placeholder={t('placeholder.input search query')}
            css={css({ width: 350, margin: '8px 6px', borderRadius: 5 })}
            onChange={(e) => {
              onChange && onChange(e.currentTarget.value);
            }}
          />
          {items?.length === 0 && (
            <div
              css={css({
                display: 'flex',
                alignItems: 'center',
                paddingLeft: 10,
                color: theme.skyblueTx,
                '&:hover': { cursor: 'pointer' },
              })}
              onClick={() => setOpen((prev) => !prev)}
            >
              <TurtleIcon name="menuplus" />{' '}
              <span css={css({ marginLeft: 3 })}>
                {`'${value}'`} {t('description.add new item')}
              </span>
            </div>
          )}
          {menu}
        </>
      )}
    >
      {items?.map((item, idx) => (
        <Select.Option
          style={{
            padding: '8px 10px',
          }}
          key={idx}
          value={item.value}
        >
          {
            <div
              css={css({ display: 'flex', justifyContent: 'space-between' })}
            >
              <span css={css({ paddingLeft: 4 })}>
                {item.name.split(' ')[0]}
              </span>{' '}
              <span css={css({ paddingRight: 4 })}>
                {item.name.split(' ')[1]}
              </span>
            </div>
          }
        </Select.Option>
      ))}
    </Select>
  );
}

const largeSelect = css`
  height: 44px;
  background-color: #fff;
  border-radius: 8px;

  border: 1px solid #cbccd1;
  box-shadow: 0px 1px 2px rgba(27, 62, 114, 0.1);
  color: #5b5d63;

  line-height: 40px;

  &.ant-select-single .ant-select-selector {
    .ant-select-selection-item,
    .ant-select-selection-placeholder {
      height: 44px;
      line-height: 40px;
    }
  }

  &.ant-select-single:not(.ant-select-customize-input) .ant-select-selector {
    height: 36px;
    font-size: 14px;
    padding: 0px 10px;
    border-radius: 8px;
  }
  &.ant-select-disabled {
    background-color: #f6f7f8;
  }
`;

const select = css`
  height: 36px;
  background-color: #fcfcfc;
  border-radius: 8px;
  border: 1px solid #cbccd1;
  box-shadow: 0px 1px 2px rgba(27, 62, 114, 0.1);
  color: #5b5d63;
  line-height: 1;

  &.ant-select-single .ant-select-selector {
    .ant-select-selection-item,
    .ant-select-selection-placeholder {
      line-height: 36px;
    }
  }

  &.ant-select-single:not(.ant-select-customize-input) .ant-select-selector {
    height: 36px;
    font-size: 14px;
    padding: 0px 10px;
    border-radius: 8px;
  }
  &.ant-select-disabled {
    background-color: #f6f7f8;
  }
`;
