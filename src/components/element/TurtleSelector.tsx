import { Select, SelectProps } from 'antd';
import styled from 'styled-components';
import { ReactComponent as ArrowDown } from '@icons/arrowDown.svg';

interface Props extends SelectProps {
  defaultValue: string;
  children: React.ReactNode;
  onChange?: (value: any) => void;
  style?: React.CSSProperties;
}

function TurtleSelector({ defaultValue, onChange, style, children }: Props) {
  return (
    <StyledSelect
      defaultOpen={true}
      size="small"
      bordered={false}
      suffixIcon={<ArrowDown />}
      defaultValue={defaultValue}
      onChange={onChange}
      style={{ color: 'red', ...style }}
      dropdownStyle={{
        background: '#fff',
        boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.2)',
        color: 'red',
      }}
    >
      {children}
    </StyledSelect>
  );
}

const StyledSelect = styled(Select)`
  width: 96px;

  color: #5b5d63;
  font-size: 13px;
  font-weight: 400;

  border-radius: 6px;
  background-color: #f5f6f7;
  /* class="ant-select-item-option-content" */
  /* &.ant-select-item-option-content {
    color: #434852 !important;
  } */

  // 셀렉터 내부 패딩값
  &.ant-select-single.ant-select-sm:not(.ant-select-customize-input)
    .ant-select-selector {
    padding: 0px 10px;
  }
`;

export default TurtleSelector;
