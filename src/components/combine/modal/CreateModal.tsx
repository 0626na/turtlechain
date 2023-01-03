import { TurtleConfirmModal } from '@components/element';
import { css } from '@emotion/react';
import { t } from 'i18next';

import React from 'react';

interface Props {
  visible: boolean;
  title: string;
  description: string[];
  onClose: () => void;
  onOk: () => void;
  loading: boolean;
  okText?: string;
  items: { title: string; content: string }[];
}
/**
 * 다목적 모달. 제목:콘텐츠 형식으로 데이터를 모달에 표시할때 사용한다.
 *
 * ex)
 *
 * 쇼핑몰 갯수: 12개
 *
 * 거래처 갯수: 30개
 *
 * 발주수량: 50개
 * @param onClose 모달 닫을때 이벤트 함수
 * @param onOK  모달 실행할때 이벤트 함수
 * @param items 모달에 표시할 데이터 array
 * @param okText 실행버튼의 텍스트 설정 파라미터, 기본은 '요청'
 * @returns
 */
function CreateModal({
  onClose,
  onOk,
  items,
  okText = t('button.request'),
  ...props
}: Props) {
  return (
    <div>
      <TurtleConfirmModal
        onOk={onOk}
        onCancel={onClose}
        okText={okText}
        {...props}
      >
        <div css={contentCss.self}>
          {items.map((item, idx) => (
            <div key={idx}>
              <span
                css={{
                  color: '#434852',
                  display: 'inline-block',
                  minWidth: 80,
                  marginRight: 16,
                }}
              >
                {item.title}
              </span>
              <span
                css={{
                  color: '#242934',
                }}
              >
                {item.content}
              </span>
            </div>
          ))}
        </div>
      </TurtleConfirmModal>
    </div>
  );
}

const contentCss = {
  self: css({
    lineHeight: 1,
    marginTop: 40,
    marginBottom: 16,
    display: 'flex',
    flexDirection: 'column',
    gap: 24,
    zIndex: 1,
    position: 'relative',
  }),
};

export default CreateModal;
