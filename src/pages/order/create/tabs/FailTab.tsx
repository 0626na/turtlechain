import {
  TurtleSearchInput,
  TurtleSearchSelect,
  TurtleTableTitle,
} from '@components/element';
import TurtleTablePhoneNumberInput from '@components/element/input/TurtleTablePhoneNumberInput';
import { css } from '@emotion/react';
import useOrderCart from '@hooks/useOrderCart';
import { Col, Row, Table, TabPaneProps, Tabs } from 'antd';
import { useMemo, useState } from 'react';
import { category, options } from './SucceessTab';

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

  const PhoneNumberInput = () => {
    return <TurtleTablePhoneNumberInput />;
  };

  return (
    <Tabs.TabPane {...props}>
      <Table
        scroll={{ x: 'auto', y: 400, scrollToFirstRowOnChange: true }}
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
            width: 130,
            render: (_, record) => record.vendor_name,
          },
          {
            title: '거래처 주소',
            width: 140,
            render: (_, record) => record.vendor_address,
          },
          {
            title: '휴대전화 번호',
            width: 140,
            render: (_, record) => PhoneNumberInput(),
          },
          {
            title: '거래처 상품명',
            width: 240,
            render: (_, record) => record.product_name,
          },
          {
            title: '옵션',
            width: 150,
            render: (_, record) => record.product_option,
          },
          {
            title: '분류',
            width: 80,
            render: (_, record) =>
              category.find((item) => item.value === record.order_type)?.name,
          },
          {
            title: '요청 수량',
            width: 120,
            align: 'right',
            render: (_, record) => record.product_count,
          },
          {
            title: '가격',
            width: 120,
            align: 'right',
            render: (_, record) => record.product_price.toLocaleString(),
          },
          {
            title: '메모',
            width: 100,
          },
        ]}
      />
    </Tabs.TabPane>
  );
}

export default FailTab;
