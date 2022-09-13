import React, { useEffect, useState } from 'react';
import { CloseOutlined } from '@ant-design/icons';
import { TurtleIcon, TurtleTableTitle } from '@components/element';
import TurtleInputPrice from '@components/element/input/TurtlePriceInput';
import useProductCart from '@hooks/useProductCart';
import {
  Button,
  Col,
  Popover,
  Row,
  Table,
  TabPaneProps,
  Tabs,
  Typography,
} from 'antd';
import { t } from 'i18next';

interface Props extends TabPaneProps {
  loading: boolean;
}
function SuccessTab({ loading, ...props }: Props) {
  const [messageVisible, setMessageVisible] = useState(false);
  const { cart, updatePrice, deleteProduct } = useProductCart();

  const needUpdateStyle = (needUpdate: boolean) => ({
    style: {
      backgroundColor: needUpdate ? '#F2F2F3' : 'transparent',
    },
  });

  useEffect(() => {
    cart.successList.forEach((store) => {
      store.need_update && setMessageVisible(true);
    });
    cart.successList.length === 0 && setMessageVisible(false);
  }, [cart]);

  return (
    <Tabs.TabPane {...props}>
      <Table
        size="small"
        loading={loading}
        dataSource={cart.successList}
        rowKey={(record) => record.product_code}
        pagination={{ position: ['bottomCenter'], showSizeChanger: false }}
        scroll={{ x: 1400, y: 'auto' }}
        style={{ height: cart.successList.length <= 5 ? '45vh' : '' }}
        title={() => <TurtleTableTitle totalCount={cart.successList.length} />}
        columns={[
          {
            ellipsis: true,
            width: 150,
            title: t('table.vendorName'),
            onCell: (record) => needUpdateStyle(record.need_update),
            render: (_, record) => record.vendor_name,
          },
          {
            ellipsis: true,
            width: 150,
            title: t('table.vendorAddress'),
            onCell: (record) => needUpdateStyle(record.need_update),
            render: (_, record) => record.vendor_address,
          },
          {
            ellipsis: true,
            width: 250,
            title: (
              <Popover
                title={
                  <Row justify="space-between" align="middle">
                    <Col>
                      <Typography.Text style={{ color: 'white' }}>
                        {t('message.product info different')}
                      </Typography.Text>
                    </Col>
                    <Col>
                      <CloseOutlined
                        style={{ color: 'white' }}
                        onClick={() => setMessageVisible(false)}
                      />
                    </Col>
                  </Row>
                }
                content={
                  <>
                    <Typography.Text style={{ color: 'white' }}>
                      {t('description.product info different')}
                    </Typography.Text>
                    <Row justify="end" style={{ marginTop: 10 }}>
                      <Button
                        style={{ color: '#65C1E5', border: '#65C1E5' }}
                        href="https://www.sellmate.co.kr/login"
                        target="_blank"
                      >
                        {t('button.click sellmate')}
                      </Button>
                    </Row>
                  </>
                }
                color="#65C1E5"
                visible={messageVisible}
              >
                {t('table.productName')}
              </Popover>
            ),
            onCell: (record) => needUpdateStyle(record.need_update),
            render: (_, record) => record.name,
          },
          {
            ellipsis: true,
            width: 250,
            title: t('table.vendorProductName'),
            onCell: (record) => needUpdateStyle(record.need_update),
            render: (_, record) => record.vendor_product_name,
          },
          {
            ellipsis: true,
            width: 150,
            title: t('table.productCode'),
            onCell: (record) => needUpdateStyle(record.need_update),
            render: (_, record) => record.product_code,
          },
          {
            ellipsis: true,
            width: 200,
            title: t('table.option'),
            onCell: (record) => needUpdateStyle(record.need_update),
            render: (_, record) => record.option,
          },
          {
            ellipsis: true,
            align: 'right',
            width: 120,
            title: t('table.price'),
            onCell: (record) => needUpdateStyle(record.need_update),
            render: (_, record) => (
              <TurtleInputPrice
                size="small"
                value={record.price}
                onChange={(value) => {
                  updatePrice(record, Number(value));
                }}
              />
            ),
          },
          {
            ellipsis: true,
            title: t('table.imageUrl'),
            width: 200,
            onCell: (record) => needUpdateStyle(record.need_update),
            render: (_, record) => (
              <Typography.Link href={record.image_url} target="_blank">
                {record.image_url}
              </Typography.Link>
            ),
          },
          {
            ellipsis: true,
            width: 50,
            title: t('table.memo'),
            onCell: (record) => needUpdateStyle(record.need_update),
            render: (_, record) => record.memo,
          },
          {
            ellipsis: true,
            width: 50,
            onCell: (record) => needUpdateStyle(record.need_update),
            render: (_, record) => (
              <TurtleIcon
                name="delete"
                onClick={() => {
                  deleteProduct(record);
                }}
              />
            ),
          },
        ]}
      />
    </Tabs.TabPane>
  );
}

export default SuccessTab;
