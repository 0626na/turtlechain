import { TurtleSearchInput } from '@components/element';
import { useEffect, useState } from 'react';

interface Props {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  searchQuery: any; // state
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setSearchQuery: any; // setState
}

function SearchFilter({ searchQuery, setSearchQuery }: Props) {
  const [value, setValue] = useState('');

  const handleValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  useEffect(() => {
    setValue(searchQuery.search_string);
  }, [searchQuery]);

  return (
    <TurtleSearchInput
      placeholder="검색어를 입력하세요"
      value={value}
      onChange={handleValue}
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
