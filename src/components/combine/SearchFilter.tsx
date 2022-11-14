import { TurtleSearchInput } from '@components/element';
import { useEffect, useState } from 'react';

interface Props {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  searchQuery: any; // state
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setSearchQuery: any; // setState
  placeholder?: string;
}

function SearchFilter({
  searchQuery,
  setSearchQuery,
  placeholder = '검색어를 입력하세요',
}: Props) {
  const [value, setValue] = useState('');

  const handleValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  useEffect(() => {
    setValue(searchQuery.search_string);
  }, [searchQuery]);

  return (
    <TurtleSearchInput
      placeholder={placeholder}
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
