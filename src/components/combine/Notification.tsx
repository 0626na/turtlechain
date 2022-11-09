import React, { useCallback } from 'react';
import moment from 'moment';
import { useRef, useState } from 'react';
import { Badge, Col, Divider, Popover, Row, Space, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery } from 'react-query';

import notificationAPI from '@apis/notificationAPI';
import { ReactComponent as BellIcon } from '@icons/bell.svg';
import { css } from '@emotion/react';

//TODO: 추후 notificationAPI로 이동 리팩토링 해야함
interface Noti {
  id: number;
  created_time: string;
  read_at?: string;
  type: string;
  content: {
    vendor_name: string;
    store_id: number;
    component: string;
    before: string;
    after: string;
    status: string;
    memo: string;
  };
}

function Notification() {
  const navigate = useNavigate();
  const [popoverVisible, setPopoverVisible] = useState(false);
  const popoverRef = useRef<HTMLDivElement>();

  const getNotificationQuery = useQuery(
    'getNotificationQuery',
    () => notificationAPI.get({ type: 'home' }),
    {
      // 1분마다 refetch
      refetchInterval: 60000,
      refetchIntervalInBackground: false,
      staleTime: 60000,
    },
  );

  const updateNotificationMutate = useMutation(notificationAPI.update, {
    onSuccess: () => {
      getNotificationQuery.refetch();
    },
  });

  const makeContent = useCallback((noti: Noti) => {
    let value = '';
    if (noti.type === 'internal_change') {
      value = `거래처 ${noti.content.vendor_name} 정보가 업데이트되었어요. (${noti.content.component} | ${noti.content.before} > ${noti.content.after}`;
    }
    if (noti.type === 'creation_request') {
      if (noti.content.status === 'reject') {
        value = `요청한 신규거래처 ${noti.content.vendor_name} 정보가 반려되었어요. ${noti.content.memo}`;
      } else {
        value = `요청한 신규거래처 ${noti.content.vendor_name} 정보가 승인되었어요. 이제 ${noti.content.vendor_name} 거래처를 추가할 수 있어요!`;
      }
    }
    if (noti.type === 'modification_request') {
      if (noti.content.status === 'reject') {
        value = `요청한 거래처 ${noti.content.vendor_name} 정보수정이 반려되었어요. ${noti.content.memo}`;
      } else {
        value = `요청한 거래처 ${noti.content.vendor_name} 정보수정이 승인되었어요. (${noti.content.component} | ${noti.content.before} > ${noti.content.after})`;
      }
    }

    return value;
  }, []);

  const needReadCount = getNotificationQuery.data?.notification_list.filter(
    (item) => !item.read_at,
  ).length;

  return (
    <Popover
      css={popover}
      getPopupContainer={(triggerNode) => triggerNode}
      placement="bottomRight"
      trigger="click"
      visible={popoverVisible}
      autoAdjustOverflow={false}
      ref={popoverRef}
      content={
        <>
          <div
            style={{
              maxHeight: 400,
              width: 400,
              overflow: 'auto',
            }}
          >
            {getNotificationQuery.data?.notification_list.length === 0 ? (
              <Row style={{ padding: '12px 20px' }}>알림이 없습니다.</Row>
            ) : (
              getNotificationQuery.data?.notification_list.map((noti) => (
                <div
                  style={{
                    backgroundColor: noti.read_at ? '#FFFFFF' : '#F4FEFC',
                  }}
                  key={noti.id}
                >
                  <Row
                    style={{
                      borderBottom: '1px solid #F0F0F1',
                      padding: '12px 20px',
                    }}
                  >
                    <Space direction="vertical">
                      <Col>{makeContent(noti)}</Col>
                      <Col>
                        <Typography.Text
                          style={{
                            color: '#00B594',
                            fontSize: 13,
                            cursor: 'pointer',
                          }}
                          onClick={() => {
                            navigate(
                              noti.type === 'creation_request'
                                ? 'vendor/create'
                                : 'vendor/list',
                            );
                            setPopoverVisible(false);
                            !noti.read_at &&
                              updateNotificationMutate.mutate({
                                id: noti.id,
                              });
                          }}
                        >
                          {noti.type === 'creation_request'
                            ? '거래처 등록하기'
                            : '거래처 정보 확인'}
                        </Typography.Text>
                        <Divider type="vertical" />
                        <Typography.Text
                          type="secondary"
                          style={{ fontSize: 13 }}
                        >
                          {moment(noti.created_time).format('YYYY-MM-DD HH:mm')}
                        </Typography.Text>
                      </Col>
                    </Space>
                  </Row>
                </div>
              ))
            )}
          </div>
          <Row
            style={{
              backgroundColor: '#F8F9FB',
              height: 40,
              cursor: 'pointer',
            }}
            justify="center"
            align="middle"
            onClick={() => {
              alert('준비중입니다.');
            }}
          >
            알림 전체보기
          </Row>
        </>
      }
    >
      <Badge
        size="small"
        overflowCount={9}
        count={needReadCount}
        style={{
          width: 18,
          height: 18,
          fontSize: 12,
          fontWeight: 500,
          borderRadius: 18,
          boxShadow: 'none',
          lineHeight: 1.4,
        }}
        offset={[-20, 7]}
      >
        <div
          css={iconContainer}
          onClick={() => {
            setPopoverVisible((visible) => !visible);
          }}
        >
          <BellIcon />
        </div>
      </Badge>
    </Popover>
  );
}

const popover = css`
  .ant-badge-count {
    padding: 1px !important;
  }
`;

const iconContainer = css`
  margin-right: 12px;
  cursor: pointer;
`;

export default Notification;
