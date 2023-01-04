import {
  TurtleSearchInput,
  TurtleSearchSelect,
  TurtleTableTitle,
} from '@components/element';
import TurtleTablePhoneNumberInput from '@components/element/input/TurtleTablePhoneNumberInput';
import { css } from '@emotion/react';
import useOrderCart from '@hooks/useOrderCart';
import { Col, Row, Table, TabPaneProps, Tabs } from 'antd';
import { t } from 'i18next';
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
    return (
      <TurtleTablePhoneNumberInput
        placeholder={t('table.mobile')}
        maxLength={13}
      />
    );
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
                    placeholder={t(
                      'placeholder.search by store name, product name, mobile',
                    )}
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
            title: t('table.vendorName'),
            width: 130,
            render: (_, record) => record.vendor_name,
          },
          {
            title: t('table.vendorAddress'),
            width: 140,
            render: (_, record) => record.vendor_address,
          },
          {
            title: t('table.mobile'),
            width: 140,
            render: (_, record) => PhoneNumberInput(),
          },
          {
            title: t('table.vendorProductName'),
            width: 240,
            render: (_, record) => record.product_name,
          },
          {
            title: t('table.option'),
            width: 150,
            render: (_, record) => record.product_option,
          },
          {
            title: t('table.type'),
            width: 80,
            render: (_, record) =>
              category.find((item) => item.value === record.order_type)?.name,
          },
          {
            title: t('table.count'),
            width: 120,
            align: 'right',
            render: (_, record) => record.product_count,
          },
          {
            title: t('table.price'),
            width: 120,
            align: 'right',
            render: (_, record) => record.product_price.toLocaleString(),
          },
          {
            title: t('table.memo'),
            width: 100,
          },
        ]}
      />
    </Tabs.TabPane>
  );
}

export default FailTab;
