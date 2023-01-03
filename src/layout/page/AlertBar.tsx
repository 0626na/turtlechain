import CreateNewVendorModal from '@components/combine/modal/CreateNewVendorModal';
import { AlertCloseIcon, SelectButton, TurtleIcon } from '@components/element';
import { css } from '@emotion/react';
import useModal from '@hooks/useModal';
import { theme } from '@styles/theme';
import { t } from 'i18next';
import React, { useState } from 'react';

function AlertBar() {
  const [modalVisible, modalOepn, modalClose] = useModal();
  const [visible, setVisible] = useState(true);

  const closeAlertBar = () => {
    setVisible(false);
  };

  return (
    <>
      {/*
       *  거래처 신규생성 모달
       */}
      <CreateNewVendorModal visible={modalVisible} closeModal={modalClose} />

      {visible && (
        <div css={alertBarCss.self}>
          <TurtleIcon name="exclamationMark" />
          <span css={alertBarCss.text}>
            {t('description.got new vendors today? Update my list')}
          </span>

          <SelectButton
            onClick={() => {
              modalOepn();
            }}
            icon={<TurtleIcon name="alertBarArrowRight" />}
          >
            {t('button.add new vendor')}
          </SelectButton>

          <div
            css={alertBarCss.closeIcon}
            onClick={() => {
              closeAlertBar();
            }}
          >
            <AlertCloseIcon value={theme.white} />
          </div>
        </div>
      )}
    </>
  );
}

const alertBarCss = {
  self: css({
    height: 48,
    color: theme.white,
    fontSize: 15,
    fontWeight: 500,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    backgroundColor: theme.bluegreen,
  }),

  text: css({
    marginLeft: 4,
    marginRight: 8,
  }),

  closeIcon: css({
    position: 'absolute',
    right: 18,
  }),
};

export default AlertBar;
