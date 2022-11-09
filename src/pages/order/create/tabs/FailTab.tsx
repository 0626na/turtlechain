import {
  TurtleSearchInput,
  TurtleSearchSelect,
  TurtleTableTitle,
} from '@components/element';
import { css } from '@emotion/react';
import useOrderCart from '@hooks/useOrderCart';
import { Col, Row, Table, TabPaneProps, Tabs } from 'antd';
import { useMemo, useState } from 'react';
import { options } from './SucceessTab';

interface Props extends TabPaneProps {
  loading: boolean;
}

function FailTab({ loading, ...props }: Props) {
  const { cart } = useOrderCart();
  const [searchQuery, setSearchQuery] = useState({
    type: 'vendor_name',
    search_string: '',
  });
  const filterdList = useMemo(() => {
    if (cart.failList.length !== 0) {
      if (searchQuery.type === 'vendor_name')
        return cart.failList[0].orders.filter((item) =>
          item.vendor_name.includes(searchQuery.search_string),
        );
      if (searchQuery.type === 'vendor_address')
        return cart.failList[0].orders.filter((order) =>
          order.vendor_address.includes(searchQuery.search_string),
        );

      if (searchQuery.type === 'mobile')
        return cart.failList[0].orders.filter((order) =>
          order.mobile.includes(searchQuery.search_string),
        );
    }

    return [];
  }, [cart.failList, searchQuery]);

  return (
    <Tabs.TabPane {...props}>
      <Table
        scroll={{ x: 1400, y: 'auto', scrollToFirstRowOnChange: true }}
        loading={loading}
        size="small"
        dataSource={filterdList}
        rowKey={(record) => String(record.order_id)}
        pagination={{
          position: ['bottomCenter'],
          showSizeChanger: false,
        }}
        title={() => (
          <TurtleTableTitle
            totalCount={cart.failList.length ?? 0}
            rightContent={
              <Row>
                <Col css={css({ marginRight: 6 })}>
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
                    onChange={(e) =>
                      setSearchQuery({
                        ...searchQuery,
                        search_string: e.currentTarget.value,
                      })
                    }
                  />
                </Col>
              </Row>
            }
          />
        )}
        columns={[
          {
            title: '거래처명',
            width: 196,
            render: (_, record) => record.vendor_name,
          },
          {
            title: '거래처 주소',
            width: 196,
            render: (_, record) => record.vendor_address,
          },
          {
            title: '휴대전화 번호',
            width: 176,
            render: (_, record) => record.mobile,
          },
          {
            title: '거래처 상품명',
            width: 196,
            render: (_, record) => record.product_name,
          },
          {
            title: '옵션',
            width: 136,
            render: (_, record) => record.product_option,
          },
          {
            title: '분류',
            width: 136,
            render: (_, record) => record.order_type,
          },
          {
            title: '요청 수량',
            width: 136,
            align: 'right',
            render: (_, record) => record.product_count,
          },
          {
            title: '가격',
            width: 136,
            align: 'right',
            render: (_, record) => record.product_price.toLocaleString(),
          },
          {
            title: '메모',
          },
        ]}
      />
    </Tabs.TabPane>
  );
}

export default FailTab;
