import React from 'react';
import { t } from 'i18next';
import { TurtleText, TurtleTooltip } from '@components/element';
import {
  parsedVendorCountsState,
  parsedVendorListsState,
} from '@store/vendorState';
import { Input, Switch, Table } from 'antd';
import { useRecoilState, useSetRecoilState } from 'recoil';

import { ReactComponent as RemoveIcon } from '@icons/remove.svg';
import { ReactComponent as MemoIcon } from '@icons/memo.svg';

import { ParsedVendor } from '@apis/vendorAPI';
import { css } from '@emotion/react';

interface Props {
  isLoading: boolean;
}

function SuccessTab({ isLoading }: Props) {
  const [parsedVendorLists, setParsedVendorLists] = useRecoilState(
    parsedVendorListsState,
  );

  const setParsedVendorCounts = useSetRecoilState(parsedVendorCountsState);

  const handleVatIncludedUpdate = (targetVendor: ParsedVendor) => {
    setParsedVendorLists((parsedVendorLists) => ({
      ...parsedVendorLists,
      successList: parsedVendorLists.successList?.map((vendor) =>
        vendor.vendor_code === targetVendor.vendor_code
          ? {
              ...vendor,
              is_vat_included: !targetVendor.is_vat_included,
            }
          : vendor,
      ),
    }));
  };

  const handleUseVendorNameUpdate = (
    newVendorName: string,
    targetVendor: ParsedVendor,
  ) => {
    setParsedVendorLists((parsedVendorLists) => ({
      ...parsedVendorLists,
      successList: parsedVendorLists.successList?.map((vendor) =>
        vendor.vendor_code === targetVendor.vendor_code
          ? {
              ...vendor,
              use_vendor_name: newVendorName,
            }
          : vendor,
      ),
    }));
  };

  const handleVendorRemove = (targetVendorCode: string) => {
    setParsedVendorLists(() => ({
      ...parsedVendorLists,
      successList: parsedVendorLists.successList.filter(
        (vendor) => vendor.vendor_code === targetVendorCode,
      ),
    }));

    setParsedVendorCounts((counts) => ({
      ...counts,
      success_count: counts.success_count - 1,
    }));
  };

  return (
    <>
      <Table
        size="small"
        loading={isLoading}
        dataSource={parsedVendorLists.successList}
        rowKey={(record) => record.vendor_code}
        pagination={{
          position: ['bottomCenter'],
          showSizeChanger: false,
        }}
        scroll={{ y: 'auto', x: 1400 }}
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
                  handleUseVendorNameUpdate(e.currentTarget.value, record);
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
              return (
                <MemoIcon
                  css={css`
                    cursor: pointer;
                    color: ${record.memo && 'red'};
                  `}
                />
              );
            },
          },
          {
            ellipsis: true,
            align: 'center',
            width: '6%',
            render: (_, record) => (
              <RemoveIcon
                css={icon}
                onClick={() => {
                  handleVendorRemove(record.vendor_code);
                }}
              />
            ),
          },
        ]}
      />
    </>
  );
}

const icon = css`
  cursor: pointer;
`;

export default SuccessTab;
