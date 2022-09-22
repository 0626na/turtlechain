import { ReactComponent as RemoveIcon } from '@icons/remove.svg';
import { ReactComponent as ModalCloseIcon } from '@icons/modalClose.svg';

import { ReactComponent as MatchingIcon } from '@icons/matching.svg';
import { ReactComponent as MisMatchingIcon } from '@icons/misMatching.svg';

import { ReactComponent as ExelIcon } from '@icons/exel.svg';
import { ReactComponent as SingleIcon } from '@icons/single.svg';
import { ReactComponent as UpdateVendorNameIcon } from '@icons/updateVendorName.svg';
import { ReactComponent as UpdateVendorInfoIcon } from '@icons/updateVendorInfo.svg';
import { ReactComponent as MoreIcon } from '@icons/more.svg';
import { ReactComponent as WarningIcon } from '@icons/warning.svg';
import { ReactComponent as SiderSelectIcon } from '@icons/siderSelect.svg';

import { ReactComponent as DownLoadIcon } from '@icons/download.svg';
import { ReactComponent as AddReserveIcon } from '@icons/addReserve.svg';
import { ReactComponent as AddExchangeRefundIcon } from '@icons/addExchangeRefund.svg';

import { ReactComponent as ArrowDownIcon } from '@icons/arrowDown.svg';
import { ReactComponent as ArrowRightIcon } from '@icons/arrowRight.svg';

import { css } from '@emotion/react';
import React from 'react';

interface Props {
  danger?: boolean;
  name:
    | 'delete'
    | 'download'
    | 'modalClose'
    | 'matching'
    | 'misMatching'
    | 'exel'
    | 'single'
    | 'updateVendorName'
    | 'updateVendorInfo'
    | 'more'
    | 'warning'
    | 'siderSelect'
    | 'exchangeRefund'
    | 'reserve'
    | 'arrowDown'
    | 'arrowRight';

  onClick?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
}

function TurtleIcon({ name, onClick, danger }: Props) {
  const handleClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    onClick && onClick(e);
  };

  if (name === 'delete') {
    return (
      <div
        css={[iconContainer, { stroke: danger ? 'red' : '#A1A2A6' }]}
        onClick={handleClick}
      >
        <RemoveIcon />
      </div>
    );
  }

  if (name === 'modalClose') {
    return (
      <div css={iconContainer} onClick={handleClick}>
        <ModalCloseIcon />
      </div>
    );
  }

  if (name === 'matching') {
    return (
      <div css={iconContainer} onClick={handleClick}>
        <MatchingIcon />
      </div>
    );
  }

  if (name === 'misMatching') {
    return (
      <div css={iconContainer} onClick={handleClick}>
        <MisMatchingIcon />
      </div>
    );
  }

  if (name === 'exel') {
    return (
      <div css={iconContainer} onClick={handleClick}>
        <ExelIcon />
      </div>
    );
  }

  if (name === 'single') {
    return (
      <div css={iconContainer} onClick={handleClick}>
        <SingleIcon />
      </div>
    );
  }

  if (name === 'warning') {
    return (
      <div css={iconContainer} onClick={handleClick}>
        <WarningIcon />
      </div>
    );
  }

  if (name === 'updateVendorName') {
    return (
      <div css={iconContainer} onClick={handleClick}>
        <UpdateVendorNameIcon />
      </div>
    );
  }

  if (name === 'updateVendorInfo') {
    return (
      <div css={iconContainer} onClick={handleClick}>
        <UpdateVendorInfoIcon />
      </div>
    );
  }

  if (name === 'more') {
    return (
      <div css={[iconContainer]} onClick={handleClick}>
        <MoreIcon />
      </div>
    );
  }

  if (name === 'siderSelect') {
    return (
      <div css={[iconContainer]} onClick={handleClick}>
        <SiderSelectIcon />
      </div>
    );
  }

  if (name === 'exchangeRefund') {
    return (
      <div css={[iconContainer]} onClick={handleClick}>
        <AddExchangeRefundIcon />
      </div>
    );
  }

  if (name === 'reserve') {
    return (
      <div css={[iconContainer]} onClick={handleClick}>
        <AddReserveIcon />
      </div>
    );
  }

  if (name === 'arrowDown') {
    return (
      <div css={[iconContainer]} onClick={handleClick}>
        <ArrowDownIcon />
      </div>
    );
  }

  if (name === 'arrowRight') {
    return (
      <div css={[iconContainer]} onClick={handleClick}>
        <ArrowRightIcon />
      </div>
    );
  }
  if (name === 'download') {
    return (
      <div css={[iconContainer]} onClick={handleClick}>
        <DownLoadIcon />
      </div>
    );
  }

  return <></>;
}

const iconContainer = css`
  display: flex;
  height: 100%;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

export default TurtleIcon;
