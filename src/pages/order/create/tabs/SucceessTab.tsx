import {
  TurtleSearchInput,
  TurtleSearchSelect,
  TurtleTableTitle,
} from '@components/element';
import { css } from '@emotion/react';
import useOrderCart from '@hooks/useOrderCart';
import { Col, Row, Table, TabPaneProps, Tabs } from 'antd';
import { useState } from 'react';

interface Props extends TabPaneProps {
  loading: boolean;
}

function SuccessTab({ loading, ...props }: Props) {
  const options = [
    {
      name: '쇼핑몰명',
      value: 'name',
    },
    {
      name: '거래처명',
      value: 'vendor_name',
    },
    {
      name: '휴대번호',
      value: 'mobile',
    },
  ];
  const { cart } = useOrderCart();

  const [searchQuery, setSearchQuery] = useState({
    type: 'name',
    search_string: '',
  });

  // const filteredList = useMemo(
  //   () =>
  //     cart.successList.filter((item) => {
  //       const { type, search_string } = searchQuery;
  //       if (type === 'name') {
  //         return item.rt_store_name.toLowerCase().includes(search_string);
  //       }
  //       if (type === 'vendor_name') {
  //         return item.orders.filter((item) => {
  //           return item.vendor_name.toLowerCase().includes(search_string);
  //         });
  //       }
  //       if (type === 'mobile') {
  //         return item.orders.filter((item) => {
  //           return item.vendor_mobile.toLowerCase().includes(search_string);
  //         });
  //       }
  //       return true;
  //     }),
  //   [searchQuery, cart.successList],
  //);

  return (
    <Tabs.TabPane {...props}>
      <Table
        scroll={{ x: 1400, y: 'auto', scrollToFirstRowOnChange: true }}
        dataSource={
          cart.successList.length !== 0 ? cart.successList[0].orders : []
        }
        loading={loading}
        size="small"
        rowKey={(record) => record.order_id!}
        pagination={{
          position: ['bottomCenter'],
          showSizeChanger: false,
        }}
        title={() => (
          <TurtleTableTitle
            totalCount={cart.successList.length ?? 0}
            rightContent={
              <Row>
                <Col css={marginRight}>
                  <TurtleSearchSelect
                    value={searchQuery.type}
                    onChange={(value) => {
                      setSearchQuery({
                        ...searchQuery,
                        type: value,
                      });
                    }}
                    items={options}
                  />
                </Col>

                <Col>
                  <TurtleSearchInput
                    placeholder="검색어를 입력하세요"
                    value={searchQuery.search_string}
                    onChange={(e) => {
                      setSearchQuery({
                        ...searchQuery,
                        search_string: e.currentTarget.value,
                      });
                    }}
                  />
                </Col>
              </Row>
            }
          />
        )}
        columns={[
          {
            title: '거래처명',
            render: (_, record) => record.vendor_name,
          },
          {
            title: '거래처 주소',
            width: 200,
            render: (_, record) => record.vendor_address,
          },
          {
            title: '휴대전화번호',
            width: 200,
            render: (_, record) =>
              record.vendor_mobile === ''
                ? record.ws_store_info.length !== 0 &&
                  record.ws_store_info[0].mobiles[0].phone
                : record.vendor_mobile,
          },
          {
            title: '거래처 상품명',
            render: (_, record) => record.product_name,
          },
          {
            title: '옵션',
            render: (_, record) => record.product_option,
          },
          {
            title: '분류',
            width: 100,
            render: (_, record) => record.order_type,
          },
          {
            title: '수량',
            width: 100,
            render: (_, record) => record.product_count,
          },
          {
            title: '공급가',
            width: 100,
            render: (_, record) =>
              Number(record.product_price).toLocaleString(),
          },
        ]}
      />
    </Tabs.TabPane>
  );
}

const marginRight = css`
  margin-right: 6px;
`;

export default SuccessTab;
