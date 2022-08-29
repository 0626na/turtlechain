import { InputProps } from 'antd';
import { Input } from 'antd';
import styled from 'styled-components';

interface Props extends InputProps {
  value?: string;
  onSearch?: (value: any) => void;
  placeholder?: string;
}

function TurtleFormSearchInput({ value, placeholder, onSearch }: Props) {
  return (
    <StyledSearch
      style={{ width: 360, marginTop: 10 }}
      placeholder={placeholder}
      value={value}
      onSearch={onSearch}
    />
  );
}

const StyledSearch = styled(Input.Search)`
  box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.1);
  border-radius: 8px;

  // 검색 인풋 style
  input {
    height: 36px;

    padding: 11px 0px 11px 12px;

    color: #242934;

    border: 1px solid #cbccd1;
    border-radius: 8px 0px 0px 8px;

    background-color: #fcfcfc;
  }

  // hover, focus시에도 default와 동일하게 맞춰준다.
  .ant-input:focus,
  .ant-input:hover {
    border: 1px solid #cbccd1;
    border-right: none;
  }

  // 검색 아이콘 버튼 style
  &.ant-input-search
    > .ant-input-group
    > .ant-input-group-addon:last-child
    .ant-input-search-button,
  .ant-input-group-addon {
    border: 1px solid #cbccd1;
    border-left: none;
    border-radius: 0px 8px 8px 0px;

    background-color: #fcfcfc;
  }
  .ant-input-search-button {
    height: 36px;
  }
  svg {
    color: #242934;
  }
`;

export default TurtleFormSearchInput;
