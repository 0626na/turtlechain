import React, { useEffect } from 'react';
import { css } from '@emotion/react';
import { TurtleIcon } from '@components/element';
import { ClearingInfo } from '@apis/clearingAPI';
import { theme } from '@styles/theme';
import useClearingCart from '@hooks/useClearingCart';
import { t } from 'i18next';
import backgroundImg from '../img/receiptBackground.svg';

interface Props {
  visible: boolean;
  onClose: () => void;
  selectedRow: ClearingInfo;
}

function DetailModal({
  visible = false,
  onClose,

  selectedRow,
}: Props) {
  const { cart } = useClearingCart();

  useEffect(() => {
    const escKeyModalClose = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', escKeyModalClose);
    return () => window.removeEventListener('keydown', escKeyModalClose);
  }, []);

  return (
    <>
      {visible && (
        <div
          css={modalCss.mask}
          onClick={() => {
            onClose();
          }}
        >
          <div css={modalCss.container}>
            <div css={modalCss.header}>
              <TurtleIcon name="modalClose" onClick={onClose} />
            </div>

            <div css={modalTopContentCss.self}>
              <div css={modalTopContentCss.title}>
                {cart.clearingRequestDate}
              </div>
              <div css={modalTopContentCss.content}>
                <div
                  css={[modalTopContentCss.item, modalTopContentCss.firstItem]}
                >
                  <span>{t('table.vendorName')}</span>
                  <span>{selectedRow.vendor_info.vendor_name}</span>
                </div>
                <div
                  css={[modalTopContentCss.item, modalTopContentCss.secondItem]}
                >
                  <span>{t('table.unpaidAmount')}</span>
                  <span>
                    {selectedRow.clearing_amount?.toLocaleString() ?? 0}
                    {t('description.won')}
                  </span>
                </div>
              </div>
            </div>

            <div css={divider} />

            <div>
              <div css={modalBottomContentCss.title}>
                {t('title.detail list')}
              </div>

              <ul css={modalBottomContentCss.content}>
                <li css={[modalBottomContentCss.item]}>
                  <span>{t('table.exchange refund')}</span>
                  <span>
                    {(selectedRow.overpaid_payment_amount ?? 0) > 0 && '- '}
                    {selectedRow.overpaid_payment_amount?.toLocaleString() ?? 0}
                  </span>
                </li>
                <li css={modalBottomContentCss.item}>
                  <span>{t('table.reserve warehousing')}</span>
                  <span>
                    {selectedRow.reserve_subtract_amount > 0 && '- '}
                    {selectedRow.reserve_subtract_amount.toLocaleString()}
                  </span>
                </li>
                <li css={modalBottomContentCss.item}>
                  <span>{t('table.today reserve')}</span>
                  <span>
                    {selectedRow.reserve_payment_amount.toLocaleString()}
                  </span>
                </li>
                <li css={modalBottomContentCss.item}>
                  <span>{t('table.today warehousing')}</span>
                  <span>
                    {(
                      selectedRow.warehousing_amount +
                      selectedRow.reserve_subtract_amount
                    ).toLocaleString()}
                  </span>
                </li>
                <li css={modalBottomContentCss.item}>
                  <span>{t('table.unpaid')}</span>
                  <span>{selectedRow.unpaid_amount.toLocaleString()}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

const modalCss = {
  mask: css({
    height: '100vh',
    position: 'fixed',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    zIndex: 2,
    background: 'rgba(0, 0, 0, 0.45)',
  }),

  container: css({
    fontSize: 15,
    lineHeight: 1,
    padding: 56,
    height: 597,
    width: 400,

    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',

    display: 'flex',
    flexDirection: 'column',
    backgroundColor: 'none',
    backgroundImage: `url(${backgroundImg})`,
    backgroundPosition: 'center',
    backgroundSize: 'cover',
    borderRadius: 4,
  }),

  header: css({
    display: 'flex',
    justifyContent: 'end',
  }),
};

const modalTopContentCss = {
  self: css({
    marginTop: 4,
  }),

  title: css({
    color: '#A1A2A6',
    fontWeight: 500,
    marginBottom: 40,
  }),

  content: css({
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
  }),

  item: css({
    display: 'flex',
    justifyContent: 'space-between',
    'span:first-child': {
      color: '#A1A2A6',
      fontWeight: 500,
    },
  }),

  firstItem: css({
    'span:last-child': {
      color: '#242934',
      fontWeight: 700,
    },
  }),

  secondItem: css({
    alignItems: 'center',
    'span:last-child': {
      color: '#00B3BE',
      fontWeight: 700,
      fontSize: 28,
    },
  }),
};

const divider = css({
  marginTop: 30,
  marginBottom: 40,
  height: 2,
  background: theme.grey800,
  width: '100%',
});

const modalBottomContentCss = {
  title: css({
    color: '#A1A2A6',
    fontWeight: 500,
    marginBottom: 24,
  }),

  content: css({
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
  }),

  item: css({
    display: 'flex',
    justifyContent: 'space-between',

    'span:first-child': {
      color: '#5B5D63',
      fontWeight: 500,
    },
    'span:last-child': {
      color: '#242934',
    },
  }),
};

export default DetailModal;
