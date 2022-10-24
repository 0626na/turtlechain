import { TurtleSearchInput, TurtleSearchSelect } from '@components/element';
import { css } from '@emotion/react';
import { Col, Row } from 'antd';
import { t } from 'i18next';

interface Props {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  searchQuery: any; // state
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setSearchQuery: any; // setState
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
          name: t('table.accountInfo'),
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
    <Row>
      {select && (
        <Col css={marginRight}>
          <TurtleSearchSelect
            value={searchQuery.type}
            onChange={(value) => {
              setSearchQuery({ ...searchQuery, type: value, page: 1 });
            }}
            items={options}
          />
        </Col>
      )}
      <Col>
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
      </Col>
    </Row>
  );
}

const marginRight = css`
  margin-right: 6px;
`;

export default SearchFilter;
