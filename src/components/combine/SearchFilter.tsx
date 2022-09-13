import { TurtleSearchInput, TurtleSearchSelect } from '@components/element';
import { Space } from 'antd';
import { t } from 'i18next';

interface Props {
  searchQuery: any; // state
  setSearchQuery: (searchQuery: any) => void; // setState
  select?: boolean;
  vendor?: boolean; // true이면 거래처 해당하는 options 출력
}

function SearchFilter({
  searchQuery,
  setSearchQuery,
  select = true,
  vendor = false,
}: Props) {
  const options = vendor
    ? [
        {
          name: t('table.vendorName'),
          value: 'name',
        },
        {
          name: t('table.vendorAccount'),
          value: 'account',
        },
        {
          name: t('table.mobile'),
          value: 'phone',
        },
      ]
    : [
        {
          name: t('table.productName'),
          value: 'name',
        },
        {
          name: t('table.vendorProductName'),
          value: 'vendor_product_name',
        },
        {
          name: t('table.vendorName'),
          value: 'vendor_name',
        },
      ];

  return (
    <Space>
      {select && (
        <TurtleSearchSelect
          value={searchQuery.type}
          onChange={(value) => {
            setSearchQuery({ ...searchQuery, type: value, page: 1 });
          }}
          items={options}
        />
      )}
      <TurtleSearchInput
        placeholder="검색어를 입력하세요"
        value={searchQuery.search_string}
        onChange={(e) => {
          setSearchQuery({
            ...searchQuery,
            search_string: e.currentTarget.value,
            page: 1,
          });
        }}
      />
    </Space>
  );
}

export default SearchFilter;
