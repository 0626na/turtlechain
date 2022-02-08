import { Button, Form, Input, message, Select, Switch } from "antd";
import { useTranslation } from "react-i18next";
import { DeleteFilled, PlusOutlined } from "@ant-design/icons";
import { basicDataAPI } from "apis";
import { AxiosError } from "axios";
import { useQuery } from "react-query";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { StoreAccount } from "apis/bucketListAPI";

interface Props {
  banks: Array<StoreAccount>;
  setBanks: Dispatch<SetStateAction<StoreAccount[]>>;
}

function BankSelect({ banks, setBanks }: Props) {
  const [t] = useTranslation();

  const getBankQuery = useQuery("getBank", basicDataAPI.getBank, {
    onError: (error: AxiosError) => {
      message.error(error.response?.data?.msg);
    },
  });

  const bankName = getBankQuery.data?.data.code_set.code_list;

  return (
    <>
      {banks.map((bank, index) => (
        <Form.Item
          label={index === 0 ? t("vendor.account") : ""}
          required={true}
          wrapperCol={{ span: 24, offset: 1 }}
          key={index}
          style={{ marginBottom: "0" }}
        >
          <Input.Group compact>
            <Form.Item
              rules={[
                {
                  required: true,
                  whitespace: true,
                  message: "은행명 입력해 주세요",
                },
              ]}
              noStyle
            >
              <Select
                value={banks[index].bank}
                placeholder="은행명"
                style={{ width: "15%" }}
                onChange={(value) => {
                  const newBanks = banks.map((bank, i) =>
                    i === index ? { ...bank, bank: value } : bank,
                  );
                  setBanks(newBanks);
                }}
              >
                {bankName &&
                  Object.values(bankName).map((bank: any) => (
                    <Select.Option key={bank} value={bank}>
                      {bank}
                    </Select.Option>
                  ))}
              </Select>
            </Form.Item>
            <Form.Item
              rules={[
                {
                  required: true,
                  whitespace: true,
                  message: "계좌번호 입력해 주세요",
                },
              ]}
              noStyle
            >
              <Input
                value={banks[index].account_number}
                placeholder="계좌번호"
                style={{ width: "20%" }}
                onChange={(value) => {
                  const newBanks = banks.map((bank, i) =>
                    i === index ? { ...bank, account_number: value.currentTarget.value } : bank,
                  );
                  setBanks(newBanks);
                }}
              />
            </Form.Item>
            <Form.Item
              validateTrigger={["onChange", "onBlur"]}
              rules={[
                {
                  required: true,
                  whitespace: true,
                  message: "예금주명 입력해 주세요",
                },
              ]}
              noStyle
            >
              <Input
                value={banks[index].account_holder}
                placeholder="예금주명"
                style={{ width: "20%" }}
                onChange={(value) => {
                  const newBanks = banks.map((bank, i) =>
                    i === index ? { ...bank, account_holder: value.currentTarget.value } : bank,
                  );
                  setBanks(newBanks);
                }}
              />
            </Form.Item>
            <Form.Item style={{ marginLeft: "10px" }}>
              <Switch //
                checkedChildren="주계좌"
                style={{ width: "64px" }}
                checked={index === 0}
                onClick={() => {
                  const newBanks = banks.filter((_, i) => i !== index);
                  newBanks.unshift(bank);
                  setBanks(newBanks);
                }}
              />
              <DeleteFilled
                style={{ color: "red", cursor: "pointer", padding: "10px" }}
                onClick={() => {
                  const newBanks = banks.filter((_, i) => i !== index);
                  setBanks(newBanks);
                }}
              />
            </Form.Item>
          </Input.Group>
        </Form.Item>
      ))}

      <Form.Item wrapperCol={{ span: 14, offset: 1 }}>
        <Button
          type="dashed"
          onClick={() => {
            setBanks([...banks, { bank: "", account_number: "", account_holder: "" }]);
          }}
          style={{ width: "90%" }}
          icon={<PlusOutlined />}
        >
          {t("button.add account")}
        </Button>
      </Form.Item>
    </>
  );
}

export default BankSelect;
