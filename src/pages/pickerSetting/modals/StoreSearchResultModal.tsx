import React from 'react';
import { StoreShow } from '@apis/retailerStoreAPI';
import { TurtleContentModal } from '@components/combine';
import { TurtleText } from '@components/element';
import { css } from '@emotion/react';
import { t } from 'i18next';

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
        title={t('etc.pickerOrder.searchModalTitle')}
      >
        {resultData !== undefined ? (
          <TurtleText>
            {t('already exist store', { name: resultData.name })}
          </TurtleText>
        ) : (
          <TurtleText>{t('message.new store text')}</TurtleText>
        )}
      </TurtleContentModal>
    </div>
  );
}

export default StoreSearchResultModal;
