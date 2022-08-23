import { InputProps } from 'antd';
import { Input } from 'antd';
import styled from 'styled-components';

interface Props extends InputProps {
  name?: string;
  value?: string;
  label?: string;
  placeholder?: string;
  onSearch?: (value: any) => void;
}

function TurtleSearchInput({ value, placeholder, onSearch }: Props) {
  return (
    <StyledSearch
      style={{ width: 220 }}
      placeholder={placeholder}
      value={value}
      onSearch={onSearch}
    />
  );
}

const StyledSearch = styled(Input.Search)`
  // 검색 인풋 style
  input {
    height: 28px;
    background: #f5f6f7;
    padding: 7.5px 10px;

    color: #242934;
    font-size: 13px;

    border: none;
    border-radius: 6px 0px 0px 6px;
  }

  // 검색 아이콘 버튼 style
  &.ant-input-search
    > .ant-input-group
    > .ant-input-group-addon:last-child
    .ant-input-search-button,
  .ant-input-group-addon {
    border-radius: 0px 6px 6px 0px;
  }

  .ant-input-search-button {
    background: #f5f6f7;
    height: 28px;
  }

  svg {
    color: #242934;
  }
`;

export default TurtleSearchInput;
