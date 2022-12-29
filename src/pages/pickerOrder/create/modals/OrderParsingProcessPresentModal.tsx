import { CreateModal, TurtleContentModal } from '@components/combine';
import { TurtleConfirmModal, TurtleIcon } from '@components/element';
import { css } from '@emotion/react';
import { theme } from '@styles/theme';
import { Tooltip } from 'antd';
import { t } from 'i18next';
import React from 'react';

interface Props {
  visible: boolean;
  title: string;
  successCount: number;
  failCount: number;
  description: string[];
  messages: string[];
  onCancel: () => void;
  onOk: () => void;
  size?: 'small' | 'middle' | 'large';
}

/**
 * 발주서 파싱 결과 모달
 * @param visible 모달 표시 유무 boolean
 * @param title 모달 타이틀 데이터 파라미터
 * @param description 모달 설명문 데이터 파라미터
 * @param onCancel 모달 닫을때 이벤트 함수
 * @param onOK 모달에서 설명하는 내용을 실행시, 이벤트 함수
 * @param successCount 발주성공한 갯수
 * @param failCount 파싱 과정에서 어떤 이유로 발주를 할수 없는 발주갯수
 * @message 발주 실패한 이유
 * @size 모달 크기 파라미터
 */
function OrderParsingProcessPresentModal({
  visible,
  title,
  description,
  onCancel,
  onOk,
  successCount,
  failCount,
  messages,
  size,
}: Props) {
  return (
    <TurtleConfirmModal
      visible={visible}
      title={title}
      titleIcon={false}
      iconName="alertWarningRed"
      description={description}
      onCancel={onCancel}
      onOk={onOk}
      size={size}
    >
      <div
        css={css({ display: 'flex', flexDirection: 'column', marginTop: 40 })}
      >
        {/* 에러 발주서 갯수 */}
        <div
          css={css({
            display: 'flex',
            marginLeft: 2,
            color: '#434852',
            fontWeight: 500,
            fontSize: 14,
            letterSpacing: '0.005em',
          })}
        >
          <span>{t('errorOrder')} </span>
          <span css={css({ color: '#FA5252', marginLeft: 4, marginRight: 3 })}>
            {failCount}
          </span>
          <div
            css={css({
              display: 'flex',
              color: 'none',
              alignItems: 'center',
            })}
          >
            <span css={css({ marginRight: 4 })}>
              / {failCount + successCount}{' '}
            </span>
            {
              <Tooltip
                title={t(
                  'missing required header name, incorrect information entry or unregistered shopping mall is classified as an error order',
                )}
                trigger="click"
              >
                <TurtleIcon name="questioncircle" />
              </Tooltip>
            }
          </div>
        </div>

        {/* 발주서 에러 메세지 */}
        <div
          css={css({
            display: 'flex',
            flexDirection: 'column',
            marginTop: 17,
            padding: 14,
            backgroundColor: '#F0F3F6',
            borderRadius: 10,
            fontWeight: 500,
            fontSize: 14,
            lineHeight: '140%',
            letterSpacing: '-0.005em',
          })}
        >
          {messages.map((message, index) => {
            return (
              <div key={index}>
                <Tooltip title={message.split('_')[0]}>
                  <span css={css({ color: '#FA5252' })}>
                    {message.split(':')[0].slice(0, 5)}...:
                  </span>
                </Tooltip>
                <span>{message.split(':')[1]}</span>
              </div>
            );
          })}
        </div>

        {/* 예상 에러원인 */}
        <div
          css={css({
            display: 'flex',
            flexDirection: 'column',
            marginTop: 12,
            fontSize: 13,
            backgroundColor: '#383B43',
            color: theme.grey200,
            padding: '10px 14px',
            lineHeight: '160%',
            letterSpacing: '-0.005em',
            fontWeight: 400,
            fontFamily: 'Spoqa Han Sans Neo',
            borderRadius: 10,
          })}
        >
          <span>{t('please check to create file name is store name')}</span>
          <span>{t('please check essential header name')}</span>
          <span>
            {t('quantity and amount can only be numbers greater than zero')}
          </span>
        </div>
      </div>
    </TurtleConfirmModal>
  );
}

const modalMask = css`
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  z-index: 5;
  background: rgba(0, 0, 0, 0.45);
`;

const container = css({
  backgroundColor: '#ffffff',
  width: 400,
  heigth: 479,
  borderRadius: 12,
  boxShadow: '0px 8px 28px rgba(34,44,56,0.28)',
});

export default OrderParsingProcessPresentModal;
