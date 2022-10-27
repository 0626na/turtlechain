import React from 'react';
import { StoreShow } from '@apis/retailerStoreAPI';
import { TurtleContentModal } from '@components/combine';
import { TurtleText } from '@components/element';
import { css } from '@emotion/react';

interface Props {
  visible: boolean;
  close: () => void;
  resultData: StoreShow | undefined;
}

function StoreSearchResultModal({ visible, close, resultData }: Props) {
  return (
    <div
      css={css`
        z-index: 3;
        position: relative;
      `}
    >
      <TurtleContentModal
        visible={visible}
        onClose={close}
        size="small"
        title="쇼핑몰 검색결과"
      >
        {resultData !== undefined ? (
          <TurtleText>{`등록되어 있는 쇼핑몰 입니다. ${resultData.name}`}</TurtleText>
        ) : (
          <TurtleText>신규 쇼핑몰 입니다.</TurtleText>
        )}
      </TurtleContentModal>
    </div>
  );
}

export default StoreSearchResultModal;
