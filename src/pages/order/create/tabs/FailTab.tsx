import React from 'react';
import { useMemo, useState } from 'react';
import { StoreOrder } from '@apis/orderAPI';
import { TurtleSearchInput, TurtleTableTitle } from '@components/element';
import TurtleTablePhoneNumberInput from '@components/element/input/TurtleTablePhoneNumberInput';
import useModal from '@hooks/useModal';
import useOrderCart from '@hooks/useOrderCart';
import AddOrderFailtoSuccessModal from '@pages/pickerOrder/create/modals/AddOrderFailtoSuccessModal';
import { message } from '@utils/message';
import { notNumPattern } from '@utils/pattern';
import { Table, TabPaneProps, Tabs } from 'antd';

import { t } from 'i18next';
import { category } from './SucceessTab';

interface Props extends TabPaneProps {
  loading: boolean;
}

function FailTab({ loading, ...props }: Props) {
  const { cart, setCart } = useOrderCart();
  const [selectRowID, setSelectRowID] = useState(0);
  const [searchQuery, setSearchQuery] = useState({
    type: 'vendor_name',
    search_string: '',
  });

  const [
    failtoSuccessModailvisible,
    openFailToSuccessModal,
    closeFailToSuccessModal,
  ] = useModal();
  const filterdList = useMemo(() => {
    if (cart.failList.length !== 0) {
      return cart.failList[0].orders.filter(
        (order) =>
          order.vendor_name.includes(searchQuery.search_string) ||
          order.product_name.includes(searchQuery.search_string) ||
          order.mobile.includes(searchQuery.search_string),
      );
    }

    return [];
  }, [cart.failList, searchQuery]);

  const modalItems = [
    {
      title: t('table.vendor'),
      content:
        cart.failList.length !== 0
          ? cart.failList[0].orders.filter(
              (order) => Number(order.order_id) === selectRowID,
            )[0].vendor_name
          : '',
    },
    {
      title: t('table.address'),
      content:
        cart.failList.length !== 0
          ? cart.failList[0].orders.filter(
              (order) => Number(order.order_id) === selectRowID,
            )[0].vendor_address
          : '',
    },
    {
      title: t('table.mobile'),
      content:
        cart.failList.length !== 0
          ? cart.failList[0].orders.filter(
              (order) => Number(order.order_id) === selectRowID,
            )[0].mobile
          : '',
    },
  ];

  const inputMobileToFailList = (mobile: string, record: StoreOrder) => {
    setCart({
      ...cart,
      failList: cart.failList.map((item) => ({
        ...item,
        orders: item.orders.map((order) => ({
          ...order,
          mobile:
            order.vendor_name === record.vendor_name &&
            order.vendor_address === record.vendor_address
              ? mobile
              : order.mobile,
        })),
      })),
    });
  };

  const PhoneNumberInput = (record: StoreOrder) => {
    return (
      <TurtleTablePhoneNumberInput
        placeholder={t('table.mobile')}
        maxLength={11}
        value={
          cart.failList[0].orders.find(
            (order) => order.order_id === record.order_id,
          )?.mobile
        }
        onInput={(e) => {
          e.currentTarget.value = e.currentTarget.value.replace(
            notNumPattern,
            '',
          );

          inputMobileToFailList(e.currentTarget.value, record);

          if (e.currentTarget.value.length === 11) {
            setSelectRowID(Number(record.order_id));
            openFailToSuccessModal();
          }
        }}
        onBlur={(e) => {
          if (
            cart.failList[0].orders.find(
              (order) => order.order_id === record.order_id,
            )?.mobile.length !== 11
          )
            inputMobileToFailList('', record);
        }}
      />
    );
  };

  return (
    <>
      <AddOrderFailtoSuccessModal
        title={t('description.should I add it as account information?')}
        description={[
          t(
            'description.add the mobile phone number you entered as your account information',
          ),
          t(
            `description.after addition, the client's order is classified as successful`,
          ),
        ]}
        visible={failtoSuccessModailvisible}
        onCancel={() => {
          inputMobileToFailList(
            '',
            cart.failList[0].orders.filter(
              (order) => Number(order?.order_id) === selectRowID,
            )[0],
          );
          closeFailToSuccessModal();
        }}
        items={modalItems}
        onOk={() => {
          message.success(t('message.success update'));
          closeFailToSuccessModal();
        }}
      />
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
              render: (_, record) => {
                const vendorNameSameList: StoreOrder[] = [];
                cart.failList[0].orders.map((order) => {
                  if (order.vendor_name === record.vendor_name)
                    vendorNameSameList.push(order);
                });
                const firstTurnItem = vendorNameSameList.filter(
                  (order) =>
                    Number(order?.order_id) < Number(record?.order_id) &&
                    Number(order.order_id) !== Number(record.order_id),
                );

                if (firstTurnItem.length === 0) return PhoneNumberInput(record);

                return null;
              },
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
    </>
  );
}

export default FailTab;
