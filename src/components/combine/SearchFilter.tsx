import { TurtleSearchInput, TurtleSearchSelect } from '@components/element';
import { css } from '@emotion/react';
import { Col, Row } from 'antd';
import { t } from 'i18next';

interface Props {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  searchQuery: any; // state
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setSearchQuery: any; // setState
}

function SearchFilter({ searchQuery, setSearchQuery }: Props) {
  return (
    <TurtleSearchInput
      placeholder="검색어를 입력하세요"
      defaultValue={searchQuery.search_string}
      onSearch={(value) => {
        setSearchQuery({
          ...searchQuery,
          search_string: value,
          page: 1,
        });
      }}
    />
  );
}

export default SearchFilter;
