import { t } from "i18next";
import { Input, InputNumber, Select, Table, TabPaneProps, Tabs } from "antd";
import { useCallback, useMemo } from "react";
import { useRecoilState } from "recoil";
import { adjustmentCartState } from "store/adjustmentCartState";
import { FileTextOutlined } from "@ant-design/icons";
import { pricePattern } from "utils/pattern";
import { TurtleIcon } from "components/common";

interface Props extends TabPaneProps {}

function SuccessTab({ ...props }: Props) {
  const [cart, setCart] = useRecoilState(adjustmentCartState);

  // 장바구니의 successList를 업데이트한다.
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

  // 상품 삭제
  const deleteItem = useCallback(
    (index) => {
      setCart((cart) => ({
        ...cart,
        successList: cart.successList.filter((item) => item.index !== index),
      }));
    },
    [setCart],
  );

  // 매입조정 합계
  const totalPrice = useMemo(
    () => cart.successList.reduce((acc, cur) => acc + cur.product_count * cur.product_price, 0),
    [cart.successList],
  );

  return (
    <Tabs.TabPane {...props}>
      <Table
        size="small"
        dataSource={cart.successList}
        rowKey={(record) => record.index!}
        pagination={{ position: ["bottomCenter"], showSizeChanger: false }}
        scroll={{ y: "auto" }}
        footer={() => `공급가 합계 : ${totalPrice.toLocaleString()}원`}
        expandable={{
          columnWidth: 25,
          expandIcon: ({ expanded, onExpand, record }) => (
            <FileTextOutlined
              style={record.memo ? {} : { opacity: "0.4" }}
              onClick={(e) => onExpand(record, e)}
            />
          ),
          expandedRowRender: (record) => (
            <Input
              value={record.memo}
              onChange={(e) => {
                updateSuccessList("memo", record.index, e.target.value);
              }}
            />
          ),
        }}
        columns={[
          {
            ellipsis: true,
            title: t("vendor.name"),
            render: (_, record) => record.vendor_name,
          },
          {
            ellipsis: true,
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
            title: t("product.code"),
            render: (_, record) => record.product_code,
          },
          {
            ellipsis: true,
            title: t("product.option"),
            render: (_, record) => record.product_option,
          },
          {
            ellipsis: true,
            width: 110,
            title: t("product.price"),
            render: (_, record) => (
              <InputNumber
                size="small"
                step={1000}
                value={record.product_price}
                formatter={(value) => `${value}`.replace(pricePattern, ",")}
                min={0}
                onChange={(value) => {
                  updateSuccessList("product_price", record.index, value);
                }}
              />
            ),
          },
          {
            ellipsis: true,
            width: 110,
            title: t("adjustment.count"),
            render: (_, record) => (
              <InputNumber
                size="small"
                status={record.product_count === 0 ? "error" : ""}
                min={1}
                max={record.product_count_max}
                value={record.product_count}
                onChange={(value) => {
                  updateSuccessList("product_count", record.index, value);
                }}
              />
            ),
          },
          {
            ellipsis: true,
            width: 100,
            title: t("adjustment.type."),
            render: (_, record) =>
              record.type === "reserve" ? (
                <Select
                  size="small"
                  style={{ width: 70 }}
                  value={record.type}
                  onSelect={(value: string) => {
                    updateSuccessList("type", record.index, value);
                  }}
                >
                  {["reserve"].map((option) => (
                    <Select.Option key={option} value={option}>
                      {t(`adjustment.type.${option}`)}
                    </Select.Option>
                  ))}
                </Select>
              ) : (
                <Select
                  size="small"
                  status={record.type === "" ? "error" : ""}
                  style={{ width: 70 }}
                  value={record.type}
                  onSelect={(value: string) => {
                    updateSuccessList("type", record.index, value);
                  }}
                >
                  {["takeback", "exchange"].map((option) => (
                    <Select.Option key={option} value={option}>
                      {t(`adjustment.type.${option}`)}
                    </Select.Option>
                  ))}
                </Select>
              ),
          },
          Table.EXPAND_COLUMN,
          {
            ellipsis: true,
            width: 30,
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
