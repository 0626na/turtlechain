import React from 'react';

import { css } from '@emotion/react';
import { ArrowRightIcon, TurtleIcon } from '@components/element';
import { useNavigate } from 'react-router-dom';
import { t } from 'i18next';

function Pagebody() {
  const navigate = useNavigate();

  const goRetailer = () => {
    navigate('/registration/retailer?step=user');
  };

  const goPicker = () => {
    navigate('/registration/picker?step=user');
  };

  return (
    <>
      <div css={boxCss.self}>
        <div
          css={boxCss.item}
          onClick={() => {
            goRetailer();
          }}
        >
          <div css={boxCss.left}>
            <TurtleIcon name="userCheck" />
            <span css={boxCss.text}>{t('title.store owner')}</span>
          </div>
          <ArrowRightIcon />
        </div>

        <div
          css={boxCss.item}
          onClick={() => {
            goPicker();
          }}
        >
          <div css={boxCss.left}>
            <TurtleIcon name="userLine" />
            <span css={boxCss.text}>사입자</span>
          </div>
          <ArrowRightIcon />
        </div>
      </div>
    </>
  );
}

const boxCss = {
  self: css({
    marginTop: 85,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 24,
  }),

  item: css({
    padding: '26px 37px',
    boxShadow: '0px 8px 28px rgba(41, 77, 119, 0.12)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 18,
    width: 472,
    height: 80,
    cursor: 'pointer',
  }),

  left: css({
    display: 'flex',
    alignItems: 'center',
  }),
  text: css({ marginLeft: 12, fontSize: 20, fontWeight: 500 }),
};

export default Pagebody;
