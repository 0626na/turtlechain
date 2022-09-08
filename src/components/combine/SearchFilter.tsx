import { css } from '@emotion/react';
import { Select, Space, Input } from 'antd';
import { t } from 'i18next';

interface Props {
  searchQuery: any; // state
  setSearchQuery: (searchQuery: any) => void; // setState
  select?: boolean;
  vendor?: boolean; // true이면 거래처 해당하는 options 출력
}

function NewSearchFilter({
  searchQuery,
  setSearchQuery,
  select = true,
  vendor = false,
}: Props) {
  const options = vendor
    ? [
        {
          name: t('vendor.name'),
          value: 'name',
        },
        {
          name: t('vendor.account'),
          value: 'account',
        },
        {
          name: t('vendor.store phone'),
          value: 'phone',
        },
      ]
    : [
        {
          name: t('vendor.name'),
          value: 'vendor_name',
        },
        {
          name: t('product.name'), //
          value: 'name',
        },
        {
          name: t('product.vendor product name'),
          value: 'vendor_product_name',
        },
      ];

  return (
    <Space>
      {select && (
        <Select
          style={{ width: 120 }}
          size="small"
          value={searchQuery.type}
          onChange={(value) => {
            setSearchQuery({ ...searchQuery, type: value, page: 1 });
          }}
        >
          {options.map(({ name, value }) => (
            <Select.Option key={value} value={value}>
              {name}
            </Select.Option>
          ))}
        </Select>
      )}
      <Input.Search
        css={search}
        size="small"
        placeholder={t('placeholder.search')}
        style={{ width: 200 }}
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

const search = css`
  .ant-input-search-button {
    border: 1px solid #d9d9d9;
    border-left: none;
  }
  svg {
    color: #5b5d63;
  }
`;
export default NewSearchFilter;
