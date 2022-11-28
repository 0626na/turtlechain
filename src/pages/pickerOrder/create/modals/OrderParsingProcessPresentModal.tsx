import { CreateModal, TurtleContentModal } from '@components/combine';
import { TurtleConfirmModal } from '@components/element';
import { css } from '@emotion/react';
import { theme } from '@styles/theme';
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
          <span>/ {failCount + successCount}</span>
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
                <span css={css({ color: '#FA5252' })}>
                  {message.split(':')[0]}:
                </span>
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

export default OrderParsingProcessPresentModal;
