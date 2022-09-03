import React, { useCallback, useMemo, useState } from 'react';

import { css } from '@emotion/react';
import { useSearchParams } from 'react-router-dom';

import { Button, Input, message, Switch, Table, Tabs } from 'antd';
import {
  PageBottomBar,
  PageContent,
  PageHeader,
  PageTitle,
} from '@layout/page';

import {
  PrimaryButton,
  SecondaryButton,
  TeriaryButton,
  TurtleDropdown,
  TurtleTooltip,
} from '@components/element';
import { TurtleText } from '@components/element';

//icon
import { ReactComponent as ListIcon } from '@icons/list.svg';
import { ReactComponent as ExelIcon } from '@icons/exel.svg';
import { ReactComponent as SingleIcon } from '@icons/single.svg';

import { ReactComponent as RemoveIcon } from '@icons/remove.svg';
import { ReactComponent as MemoIcon } from '@icons/memo.svg';

import { storeState } from '@store/storeState';
import { useRecoilValue } from 'recoil';
import vendorAPI, { ParesdResult, ParsedVendor } from '@apis/vendorAPI';
import { useMutation } from 'react-query';
import { t } from 'i18next';

function PageBody() {
  const [searchParams, setSearchParams] = useSearchParams();

  const store = useRecoilValue(storeState);

  const [successList, setSuccessList] = useState<ParsedVendor[]>([]);
  const [pendingList, setPendingList] = useState<ParsedVendor[]>([]);
  const [failList, setFailList] = useState<ParsedVendor[]>([]);
  const [count, setCount] = useState<ParesdResult>({
    success_count: 0,
    suggest_count: 0,
    fail_count: 0,
    duplicated_count: 0,
  });

  const [searchDate, setSearchDate] = useState({});

  // 재고프로그램 연동
  const vendorInventoryMutation = useMutation(vendorAPI.vendorInventory, {
    // enabled: !!searchDate,
    onError: () => {
      // resetField();
    },
    onSuccess: (data) => {
      console.log(data);
      if (data.data.error) {
        message.error(data.data.error);
        // resetField();
        return;
      }

      message.info(
        `이미 등록된 거래처가 ${data.data.count.duplicated_count}개 있습니다.`,
      );

      setSuccessList(
        data.data.success.map((vendor) => ({
          ...vendor,
          memo: '',
          is_vat_included: false,
          use_vendor_name: vendor.name,
        })),
      );

      setPendingList(
        data.data.suggest.map((vendor) => ({
          ...vendor,
          memo: '',
          is_vat_included: false,
          use_vendor_name: vendor.name,
          use_vendor:
            vendor.ws_store_info.length === 1
              ? vendor.ws_store_info[0]
              : undefined,
          use_account:
            vendor.ws_store_info.length === 1 &&
            vendor.ws_store_info[0].store_account.length === 1
              ? vendor.ws_store_info[0].store_account[0]
              : undefined,
          check_account: false,
        })),
      );

      setFailList(data.data.fail);

      setCount(data.data.count);
    },
  });

  const handleVatIncludedUpdate = useCallback(
    (targetVendor) => {
      if (targetVendor.match_type === 'success') {
        setSuccessList(
          successList?.map((vendor) =>
            vendor.vendor_code === targetVendor.vendor_code
              ? {
                  ...vendor,
                  is_vat_included: !targetVendor.is_vat_included,
                }
              : vendor,
          ),
        );
      }

      setPendingList(
        pendingList?.map((vendor) =>
          vendor.vendor_code === targetVendor.vendor_code
            ? {
                ...vendor,
                is_vat_included: !targetVendor.is_vat_included,
              }
            : vendor,
        ),
      );
    },
    [successList, pendingList],
  );

  const handleUseVendorNameUpdate = useCallback(
    (newVendorName, targetVendor) => {
      if (targetVendor.match_type === 'success') {
        setSuccessList(
          successList?.map((vendor) =>
            vendor.vendor_code === targetVendor.vendro_code
              ? {
                  ...vendor,
                  use_vendor_name: newVendorName,
                }
              : vendor,
          ),
        );
      }

      setPendingList(
        pendingList?.map((vendor) =>
          vendor.vendor_code === targetVendor.vendro_code
            ? {
                ...vendor,
                use_vendor_name: newVendorName,
              }
            : vendor,
        ),
      );
    },
    [successList, pendingList],
  );

  return (
    <>
      <PageHeader
        title="거래처등록"
        Button={
          <Button css={button}>
            <ListIcon css={icon} />
            <TurtleText>거래처 목록</TurtleText>
          </Button>
        }
      />

      <PageTitle
        title="거래처등록 미리보기"
        Buttons={[
          <TeriaryButton
            text="재고프로그램 연동"
            onClick={() => {
              console.log(123);
              // vendorInventoryMutation()
            }}
          />,
          <TurtleDropdown
            items={[
              {
                key: '0',
                label: '엑셀 업로드',
                icon: <ExelIcon />,
                onClick(e) {
                  console.log(e);
                },
              },
              {
                key: '1',
                label: '단건추가',
                icon: <SingleIcon />,
                onClick(e) {
                  console.log(e);
                },
              },
            ]}
            triggerButton={<SecondaryButton text="거래처 추가하기" />}
          />,
        ]}
      />

      <PageContent>
        <Tabs
          css={tabContainer}
          size="large"
          activeKey={searchParams.get('tab') ?? 'success'}
          onChange={(newTab) => {
            setSearchParams({ tab: newTab });
          }}
        >
          <Tabs.TabPane tab={`성공(${count?.success_count}`} key="success">
            <Table
              size="small"
              loading={vendorInventoryMutation.isLoading}
              dataSource={successList}
              rowKey={(record) => record.vendor_code}
              pagination={{
                position: ['bottomCenter'],
                showSizeChanger: false,
              }}
              scroll={{ y: 'auto' }}
              columns={[
                {
                  ellipsis: true,
                  width: '8%',
                  title: '거래처 코드',
                  render: (_, record) => record.ws_store_info[0]?.id,
                },
                {
                  ellipsis: true,
                  width: '15%',
                  title: '쇼핑몰 입력 값',
                  render: (_, record) => {
                    return `${record.name}  ${record.address}`;
                  },
                },
                {
                  ellipsis: true,
                  title: '거래처 주소',
                  render: (_, record) => record.ws_store_info[0]?.address,
                },
                {
                  ellipsis: true,
                  title: '휴대번호',
                  width: '10%',
                  render: (_, record) =>
                    record.ws_store_info[0]?.store_phone[0]?.phone
                      .replace(/[^0-9]/, '')
                      .replace(/^(\d{2,3})(\d{3,4})(\d{4})$/, `$1-$2-$3`),
                },
                {
                  ellipsis: true,
                  title: '계좌정보',
                  render: (_, record) => {
                    const {
                      bank = '',
                      account_number = '',
                      account_holder = '',
                    } = record.ws_store_info[0]?.store_account[0] || {};
                    return `${bank} ${account_number} ${account_holder}`;
                  },
                },
                {
                  ellipsis: true,
                  title: t('table.column.vatIncluded'),
                  render: (_, record) => {
                    return (
                      <Switch
                        style={{ width: '52px' }}
                        // checkedChildren={t('table.column.VatIncluded')}
                        checked={record.is_vat_included}
                        onClick={() => {
                          handleVatIncludedUpdate(record);
                        }}
                      />
                    );
                  },
                },
                {
                  ellipsis: true,
                  title: '추천 거래처명',
                  render: (_, record) => record.ws_store_info[0]?.name,
                },
                {
                  ellipsis: true,
                  title: (
                    <>
                      <TurtleText>사용할 거래처명</TurtleText>
                      <TurtleTooltip content="추천하는 거래처명이 아닌 다른 거래처명으로 사용하고 싶은 경우, 자유롭게 입력해주세요." />
                    </>
                  ),
                  render: (_, record) => (
                    <Input
                      size="small"
                      value={record.use_vendor_name}
                      onChange={(e) => {
                        handleUseVendorNameUpdate(
                          e.currentTarget.value,
                          record,
                        );
                      }}
                    />
                  ),
                },
                {
                  ellipsis: true,
                  align: 'center',
                  width: '6%',
                  title: '메모',
                  render: (_, record) => {
                    if (
                      record.ws_store_info.length === 1 &&
                      record.ws_store_info[0]?.store_account.length === 1
                    ) {
                      return <MemoIcon style={{ color: 'green' }} />;
                    }
                    return <MemoIcon style={{ color: 'red' }} />;
                  },
                },
                {
                  ellipsis: true,
                  align: 'center',
                  width: '6%',
                  render: (_, record) => <RemoveIcon />,
                },
              ]}
            />
          </Tabs.TabPane>

          <Tabs.TabPane
            tab={`보류(${count.suggest_count})`}
            key="pending"
          ></Tabs.TabPane>
          <Tabs.TabPane tab={`실패(${count.fail_count})`} key="fail">
            {/* <UnMatchedTab/> */}
          </Tabs.TabPane>
        </Tabs>
      </PageContent>

      <PageBottomBar>
        <PrimaryButton text="거래처 등록하기" />
      </PageBottomBar>
    </>
  );
}

// PageHeader
const button = css`
  color: #fff;
  margin-left: 20px;

  border: none;
  background-color: #141720;

  display: flex;
  align-items: center;

  &:hover {
    background-color: #373a41;
  }

  // active 상태
  &.ant-btn:focus {
    background-color: #141720;
  }
`;

const icon = css`
  margin-right: 8px;
`;

// PageContent
const tabContainer = css`
  .ant-tabs-nav {
    margin-bottom: 18px; // antd 기본속성 제거

    .ant-tabs-tab {
      padding: 0px 0px 8px 0px;
      margin-left: 0px; // antd 기본속성 제거
      width: 80px;
      display: block;
      text-align: center;

      // 탭 비활성화 + hover
      .ant-tabs-tab-btn {
        color: #5b5d63;
        font-weight: 500;
        font-size: 15px;
        &:hover {
          color: #1a66f9;
        }
      }

      // 탭 활성화
      &.ant-tabs-tab-active {
        .ant-tabs-tab-btn {
          color: #1a66f9;
        }
      }
    }

    // status 바
    .ant-tabs-ink-bar {
      height: 4px;
      background-color: #1a66f9;
      border-radius: 2px;
    }
  }
`;

export default PageBody;
