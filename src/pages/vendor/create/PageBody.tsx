import React, { useCallback, useMemo, useState } from 'react';

import { storeState } from '@store/storeState';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import vendorAPI, { ParesdResult, ParsedVendor } from '@apis/vendorAPI';
import { useMutation, useQuery } from 'react-query';
import { t } from 'i18next';
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
  TurtleSecondaryRangePicker,
  TurtleTooltip,
} from '@components/element';
import { TurtleText } from '@components/element';

//icon
import { ReactComponent as ListIcon } from '@icons/list.svg';
import { ReactComponent as ExelIcon } from '@icons/exel.svg';
import { ReactComponent as SingleIcon } from '@icons/single.svg';

import {
  parsedVendorCountsState,
  parsedVendorListsState,
} from '@store/vendorState';
import SuccessTab from './Tabs/SuccessTab';
import { TurtleAnswerModal } from '@components/combine';

import moment from 'moment';

function PageBody() {
  const [searchParams, setSearchParams] = useSearchParams();

  const store = useRecoilValue(storeState);

  const setParsedVendorLists = useSetRecoilState(parsedVendorListsState);
  const [parsedVendorCounts, setParsedVendorCounts] = useRecoilState(
    parsedVendorCountsState,
  );

  const [searchDate, setSearchDate] = useState({
    startDate: moment().format('YYY-MM-DD'),
    endDate: moment().format('YYY-MM-DD'),
  });

  // 모달 제어
  const [modalVisible, setModalVisible] = useState(false);

  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  // 재고프로그램 연동
  const vendorInventoryMutation = useMutation(vendorAPI.vendorInventory, {
    onError: () => {
      // resetField();
    },
    onSuccess: (data) => {
      // if (data.data.error) {
      //   message.error(data.data.error);
      //   // resetField();
      //   return;
      // }

      // message.info(
      //   `이미 등록된 거래처가 ${data.data.count.duplicated_count}개 있습니다.`,
      // );

      setParsedVendorLists({
        successList: data.data.success.map((vendor) => ({
          ...vendor,
          memo: '',
          is_vat_included: false,
          use_vendor_name: vendor.name,
        })),

        pendingList: data.data.suggest.map((vendor) => ({
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

        failList: data.data.fail,
      });

      setParsedVendorCounts(data.data.count);
    },
  });

  // 엑셀 연동

  return (
    <>
      {/*
       *
       *  재고프로그램 연동 모달
       *
       */}
      <TurtleAnswerModal
        visible={modalVisible}
        title={'재고프로그램 연동'}
        description={
          <span>
            선택한 기간의 재고 정보를 불러옵니다. <br /> 정보의 양에따라 최대
            1분 정도 걸릴 수 있어요.
          </span>
        }
        children={
          <div css={ModalRangePickerContainer}>
            <TurtleSecondaryRangePicker
              onChange={(value) => {
                const startDate = moment(value[0]).format('YYYY-MM-DD');
                const endDate = moment(value[1]).format('YYYY-MM-DD');

                setSearchDate({
                  startDate,
                  endDate,
                });
              }}
            />
          </div>
        }
        onCancel={() => {
          closeModal();
        }}
        onOk={() => {
          vendorInventoryMutation.mutate({
            rt_store_id: store.id!,
            start_date: searchDate.startDate,
            end_date: searchDate.endDate,
          });

          closeModal();
        }}
      />

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
              openModal();

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
          <Tabs.TabPane
            tab={`성공(${parsedVendorCounts?.success_count})`}
            key="success"
          >
            <SuccessTab isLoading={vendorInventoryMutation.isLoading} />
          </Tabs.TabPane>
          {/* <Tabs.TabPane
            tab={`보류(${parsedVendorCounts.suggest_count})`}
            key="pending"
          ></Tabs.TabPane>
          <Tabs.TabPane
            tab={`실패(${parsedVendorCounts.fail_count})`}
            key="fail"
          ></Tabs.TabPane> */}
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

const ModalRangePickerContainer = css`
  margin-top: 24px;
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
