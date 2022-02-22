import { Button, Form, Input, message, Select, Switch } from "antd";
import { DeleteFilled, PlusOutlined } from "@ant-design/icons";
import { basicDataAPI } from "apis";
import { AxiosError } from "axios";
import { useQuery } from "react-query";
import { Dispatch, SetStateAction, useCallback, useEffect, useState } from "react";
import { StoreAccountView } from "apis/bucketListAPI";
import { t } from "i18next";

interface Props {
  accountList: Array<StoreAccountView>;
  setAccountList: Dispatch<SetStateAction<StoreAccountView[]>>;
}

function AccountSelect({ accountList, setAccountList }: Props) {
  const getBankQuery = useQuery("getBank", basicDataAPI.getBank, {
    onError: (error: AxiosError) => {
      message.error(error.response?.data?.msg);
    },
  });

  const bankList = getBankQuery.data?.data.code_set.code_list;

  const setBank = useCallback(
    (value: string, index: number) => {
      setAccountList(
        accountList.map((account, i) => (i === index ? { ...account, bank: value } : account)),
      );
    },
    [accountList],
  );

  const setAccountNumber = useCallback(
    (value: React.ChangeEvent<HTMLInputElement>, index: number) => {
      setAccountList(
        accountList.map((account, i) =>
          i === index ? { ...account, account_number: value.currentTarget.value } : account,
        ),
      );
    },
    [accountList],
  );

  const setAccountHolder = useCallback(
    (value: React.ChangeEvent<HTMLInputElement>, index: number) => {
      setAccountList(
        accountList.map((account, i) =>
          i === index ? { ...account, account_holder: value.currentTarget.value } : account,
        ),
      );
    },
    [accountList],
  );

  const setMainAccount = useCallback(
    (index: number) => {
      setAccountList(
        accountList.map((account, i) =>
          i === index ? { ...account, is_main: true } : { ...account, is_main: false },
        ),
      );
    },
    [accountList],
  );

  const addAccount = useCallback(() => {
    setAccountList([
      ...accountList,
      { bank: "", account_number: "", account_holder: "", is_main: false },
    ]);
  }, [accountList]);

  const deleteAccount = useCallback(
    (index) => {
      setAccountList(accountList.filter((_, i) => i !== index));
    },
    [accountList],
  );

  return (
    <>
      {accountList.map((account, index) => (
        <Form.Item
          label={index === 0 ? t("vendor.account") : ""}
          required={true}
          rules={[
            {
              required: true,
              message: "계좌정보 입력해 주세요",
            },
          ]}
          wrapperCol={{ span: 13, offset: 1 }}
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
                value={account.bank}
                placeholder="은행명"
                style={{ width: "25%" }}
                onChange={(value) => {
                  setBank(value, index);
                }}
              >
                {bankList &&
                  Object.values(bankList).map((bank: any) => (
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
                value={account.account_number}
                placeholder="계좌번호"
                style={{ width: "32%" }}
                onChange={(value) => {
                  setAccountNumber(value, index);
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
                value={account.account_holder}
                placeholder="예금주명"
                style={{ width: "20%" }}
                onChange={(value) => {
                  setAccountHolder(value, index);
                }}
              />
            </Form.Item>
            <Form.Item style={{ marginLeft: "10px" }}>
              <Switch //
                checkedChildren="주계좌"
                style={{ width: "66px" }}
                checked={account.is_main}
                onClick={() => {
                  setMainAccount(index);
                }}
              />
              {!account.is_main && (
                <DeleteFilled
                  style={{ color: "red", cursor: "pointer", padding: "10px" }}
                  onClick={() => {
                    deleteAccount(index);
                  }}
                />
              )}
            </Form.Item>
          </Input.Group>
        </Form.Item>
      ))}

      <Form.Item wrapperCol={{ span: 10, offset: 1 }}>
        <Button
          type="dashed"
          onClick={addAccount}
          style={{ width: "100%" }}
          icon={<PlusOutlined />}
        >
          {t("button.add account")}
        </Button>
      </Form.Item>
    </>
  );
}

export default AccountSelect;
