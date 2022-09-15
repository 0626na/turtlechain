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

import { css } from '@emotion/react';

interface Props {
  danger?: boolean;
  name:
    | 'delete'
    | 'modalClose'
    | 'matching'
    | 'misMatching'
    | 'exel'
    | 'single'
    | 'updateVendorName'
    | 'updateVendorInfo'
    | 'more'
    | 'warning'
    | 'siderSelect';
  onClick?: () => void;
}

function TurtleIcon({ name, onClick, danger }: Props) {
  if (name === 'delete') {
    return (
      <div
        css={[iconContainer, { stroke: danger ? 'red' : '#A1A2A6' }]}
        onClick={onClick}
      >
        <RemoveIcon />
      </div>
    );
  }

  if (name === 'modalClose') {
    return (
      <div css={iconContainer} onClick={onClick}>
        <ModalCloseIcon />
      </div>
    );
  }

  if (name === 'matching') {
    return (
      <div css={iconContainer} onClick={onClick}>
        <MatchingIcon />
      </div>
    );
  }

  if (name === 'misMatching') {
    return (
      <div css={iconContainer} onClick={onClick}>
        <MisMatchingIcon />
      </div>
    );
  }

  if (name === 'exel') {
    return (
      <div css={iconContainer} onClick={onClick}>
        <ExelIcon />
      </div>
    );
  }

  if (name === 'single') {
    return (
      <div css={iconContainer} onClick={onClick}>
        <SingleIcon />
      </div>
    );
  }

  if (name === 'warning') {
    return (
      <div css={iconContainer} onClick={onClick}>
        <WarningIcon />
      </div>
    );
  }

  if (name === 'updateVendorName') {
    return (
      <div css={iconContainer} onClick={onClick}>
        <UpdateVendorNameIcon />
      </div>
    );
  }

  if (name === 'updateVendorInfo') {
    return (
      <div css={iconContainer} onClick={onClick}>
        <UpdateVendorInfoIcon />
      </div>
    );
  }

  if (name === 'more') {
    return (
      <div css={[iconContainer]} onClick={onClick}>
        <MoreIcon />
      </div>
    );
  }

  if (name === 'siderSelect') {
    return (
      <div css={[iconContainer]} onClick={onClick}>
        <SiderSelectIcon />
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
