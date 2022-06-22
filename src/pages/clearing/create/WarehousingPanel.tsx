import { t } from 'i18next';
import {
  Collapse,
  Row,
  Table,
  Typography,
  CollapsePanelProps,
  Space,
} from 'antd';
import { useMemo, useState } from 'react';
import { useQuery } from 'react-query';
import { useRecoilState, useRecoilValue } from 'recoil';
import {
  TurtleButton,
  TurtleButtonSub,
  TurtleInputPrice,
  TurtleTableTitle,
} from '@components/common';
import { storeState } from '@store/storeState';
import { clearingCartState } from '@store/clearingCartState';
import clearingAPI from '@apis/clearingAPI';
import { NewSearchFilter } from '@components/combine';
import useClearingCart from '@hooks/useClearingCart';

interface Props extends CollapsePanelProps {
  activeKey: string | string[];
  clickNext: () => void;
}

function WarehousingPanel({ activeKey, clickNext, ...props }: Props) {
  const store = useRecoilValue(storeState);
  const [cart, setCart] = useRecoilState(clearingCartState);
  const { warehousingAmount } = useClearingCart();
  const [searchQuery, setSearchQuery] = useState({
    search_string: '',
  });

  const getWarehousingBalanceQuery = useQuery(
    ['getWarehousingBalance', store.id],
    () =>
      clearingAPI.getWarehousingBalance({
        rt_store_id: store.id!,
        tab: 'unpaid_vendor',
      }),
    {
      enabled: !!store.id,
      onSuccess: (data) => {
        setCart({
          warehousingBalanceList: data.item_list,
          adjustmentBalanceList: [],
          reserveSubtractList: data.item_list.filter(
            (item) => item.reserve_amount > 0,
          ),
          reserveBalanceList: [],
        });
      },
    },
  );

  const filteredList = useMemo(
    () =>
      cart.warehousingBalanceList.filter((item) =>
        item.vendor_info.vendor_name.includes(searchQuery.search_string),
      ),
    [cart.warehousingBalanceList, searchQuery],
  );

  return (
    <Collapse.Panel
      {...props}
      extra={
        <Typography.Text style={{ color: '#5B5D63' }}>
          {`거래처 총 결제금액 : ${warehousingAmount.toLocaleString()}원`}
        </Typography.Text>
      }
    >
      <Table
        size="small"
        scroll={{ x: 'auto', y: 490 }}
        loading={getWarehousingBalanceQuery.isLoading}
        dataSource={filteredList}
        pagination={false}
        rowKey={(record) => record.id}
        title={() => (
          <TurtleTableTitle
            count={getWarehousingBalanceQuery.data?.total_count ?? 0}
          >
            <Space size="large">
              <TurtleButtonSub
                size="small"
                type="primary"
                onClick={() => {
                  setCart((cart) => ({
                    ...cart,
                    warehousingBalanceList: cart.warehousingBalanceList.map(
                      (item) => ({
                        ...item,
                        clearing_amount:
                          item.unpaid_amount - item.reserve_amount,
                      }),
                    ),
                  }));
                }}
              >
                전액 결제하기
              </TurtleButtonSub>
              <NewSearchFilter
                select={false}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
              />
            </Space>
          </TurtleTableTitle>
        )}
        columns={[
          {
            ellipsis: true,
            title: t('warehousing.date'),
            render: (_, record) => record.created_time.substring(0, 10),
          },
          {
            ellipsis: true,
            title: t('vendor.name'),
            render: (_, record) => record.vendor_info.vendor_name,
          },
          {
            ellipsis: true,
            align: 'right',
            title: t('clearing.total amount'),
            render: (_, record) =>
              `${
                record.reserve_amount > 0
                  ? `(미송입고 ${record.reserve_amount.toLocaleString()}원 차감)`
                  : ``
              }
              ${(
                record.unpaid_amount - record.reserve_amount
              ).toLocaleString()} `,
          },
          {
            ellipsis: true,
            align: 'right',
            title: '당일 결제 금액',
            render: (_, record) => (
              <TurtleInputPrice
                size="small"
                placeholder="금액 입력"
                value={record.clearing_amount}
                max={record.unpaid_amount - record.reserve_amount}
                onChange={(value) => {
                  setCart((cart) => ({
                    ...cart,
                    warehousingBalanceList: cart.warehousingBalanceList.map(
                      (item) =>
                        item.id === record.id
                          ? { ...item, clearing_amount: Number(value) }
                          : item,
                    ),
                  }));
                }}
              />
            ),
          },
        ]}
      />
      <Row justify="end" align="middle" style={{ marginTop: 16 }}>
        <TurtleButton children={t('button.next step')} onClick={clickNext} />
      </Row>
    </Collapse.Panel>
  );
}

export default WarehousingPanel;
