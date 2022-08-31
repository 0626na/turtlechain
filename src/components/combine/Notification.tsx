import React from 'react';
import styled from '@emotion/styled';
import moment from 'moment';
import { useRef, useState } from 'react';
import { Badge, Col, Divider, Popover, Row, Space, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery } from 'react-query';

import notificationAPI from '@apis/notificationAPI';

import { ReactComponent as BellIcon } from '@icons/bell.svg';

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
      refetchIntervalInBackground: true,
    },
  );

  const updateNotificationMutate = useMutation(notificationAPI.update, {
    onSuccess: () => {
      getNotificationQuery.refetch();
    },
  });

  return (
    <StyledPopover
      getPopupContainer={(triggerNode) => triggerNode}
      placement="bottomRight"
      trigger="click"
      visible={popoverVisible}
      autoAdjustOverflow={false}
      ref={popoverRef}
      content={
        <>
          <div style={{ maxHeight: 400, width: 400, overflow: 'auto' }}>
            {getNotificationQuery.data?.notification_list.length === 0 ? (
              <Row style={{ padding: '12px 20px' }}>알림이 없습니다.</Row>
            ) : (
              getNotificationQuery.data?.notification_list.map((noti) => {
                let mainContent = '';
                if (noti.type === 'internal_change') {
                  mainContent = `거래처 ${noti.content.vendor_name}의 ${noti.content.component}가 ${noti.content.after}(으로) 수정되었습니다.`;
                }
                if (noti.type === 'creation_request') {
                  if (noti.content.status === 'reject') {
                    mainContent = `요청하신 거래처 ${noti.content.vendor_name}의 거래처 등록이 반려되었습니다. 반려사유: ${noti.content.memo}`;
                  } else {
                    mainContent = `거래처 ${noti.content.vendor_name}가 신규 등록되었습니다.`;
                  }
                }
                if (noti.type === 'modification_request') {
                  if (noti.content.status === 'reject') {
                    mainContent = `요청하신 거래처 ${noti.content.vendor_name}의 정보 수정이 반려되었습니다. 반려사유: ${noti.content.memo}`;
                  } else {
                    mainContent = `거래처 ${noti.content.vendor_name}의 ${noti.content.component}가 ${noti.content.after}(으로) 수정되었습니다.`;
                  }
                }
                return (
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
                        <Col>{mainContent}</Col>
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
                            {moment(noti.created_time).format(
                              'YYYY-MM-DD HH:mm',
                            )}
                          </Typography.Text>
                        </Col>
                      </Space>
                    </Row>
                  </div>
                );
              })
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
        count={
          1
          // getNotificationQuery.data?.notification_list.filter(
          //   (item) => !item.read_at,
          // ).length
        }
        style={{
          paddingBottom: 1,
          paddingTop: 1,
          paddingLeft: 4,
          paddingRight: 5,
        }}
        offset={[-20, 7]}
      >
        <IconContainer
          onClick={() => {
            setPopoverVisible((visible) => !visible);
          }}
        >
          <BellIcon />
        </IconContainer>
      </Badge>
    </StyledPopover>
  );
}

const StyledPopover = styled(Popover)`
  .ant-popover-inner-content {
    padding: 0px;
  }
`;

const IconContainer = styled.div`
  /* width: 36px;
  height: 36px; */
  margin-right: 12px;
  cursor: pointer;
`;

export default Notification;
