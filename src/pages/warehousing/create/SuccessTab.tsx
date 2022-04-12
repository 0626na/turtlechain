import { t } from "i18next";
import { InputNumber, Table, TabPaneProps, Tabs } from "antd";
import { useCallback, useMemo } from "react";
import { useRecoilState } from "recoil";
import { warehousingCartState } from "store/warehousingCartState";
import { pricePattern } from "utils/pattern";
import { TurtleIcon } from "components/common";

interface Props extends TabPaneProps {
  loading: boolean;
}

function SuccessTab({ loading, ...props }: Props) {
  const [cart, setCart] = useRecoilState(warehousingCartState);

  // 상품 삭제
  const deleteItem = useCallback(
    (index) => {
      setCart((cart) => ({
        ...cart,
        successList: cart.successList?.filter((item) => item.index !== index),
      }));
    },
    [setCart],
  );

  // 입고 수량 합계 계산
  const totalProductCount = useMemo(
    () => cart.successList.reduce((acc, cur) => acc + cur.count, 0),
    [cart.successList],
  );

  // 공급가 합계 계산
  const totalProductPrice = useMemo(
    () => cart.successList.reduce((acc, cur) => acc + cur.count * cur.price, 0),
    [cart.successList],
  );

  // 장바구니의 successList 를 수정한다.
  const updateSuccessList = useCallback(
    (type: string, index, value) => {
      setCart((cart) => ({
        ...cart,
        successList: cart.successList.map((item) =>
          item.index === index ? { ...item, [type]: value } : item,
        ),
      }));
    },
    [setCart],
  );

  return (
    <Tabs.TabPane {...props}>
      <Table
        size="small"
        loading={loading}
        dataSource={cart.successList}
        rowKey={(record) => record.index!}
        pagination={{ position: ["bottomCenter"], showSizeChanger: false }}
        scroll={{ y: "auto" }}
        footer={() =>
          `입고수량 합계 : ${totalProductCount}개 | 공급가 합계 : ${totalProductPrice.toLocaleString()}원`
        }
        columns={[
          {
            ellipsis: true,
            width: "10%",
            title: t("vendor.name"),
            render: (_, record) => record.vendor_name,
          },
          {
            ellipsis: true,
            width: "12%",
            title: t("vendor.address"),
            render: (_, record) => record.vendor_address,
          },
          {
            ellipsis: true,
            title: t("product.name"),
            render: (_, record) => record.product_name,
          },
          {
            ellipsis: true,
            title: t("product.vendor product name"),
            render: (_, record) => record.vendor_product_name,
          },
          {
            ellipsis: true,
            width: "12%",
            title: t("product.code"),
            render: (_, record) => record.product_code,
          },
          {
            ellipsis: true,
            width: "12%",
            title: t("product.option"),
            render: (_, record) => record.product_option,
          },
          {
            ellipsis: true,
            width: "12%",
            title: t("product.price"),
            render: (_, record) => (
              <InputNumber
                size="small"
                step={1000}
                value={record.price}
                formatter={(value) => `${value}`.replace(pricePattern, ",")}
                min={0}
                onChange={(value) => {
                  updateSuccessList("price", record.index, value);
                }}
              />
            ),
          },
          {
            ellipsis: true,
            width: "12%",
            title: t("warehousing.count"),
            render: (_, record) => (
              <InputNumber
                size="small"
                min={1}
                value={record.count}
                onChange={(value) => {
                  updateSuccessList("count", record.index, value);
                }}
              />
            ),
          },
          {
            ellipsis: true,
            width: "8%",
            render: (_, record) => (
              <TurtleIcon
                type="delete"
                onClick={() => {
                  deleteItem(record.index);
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
