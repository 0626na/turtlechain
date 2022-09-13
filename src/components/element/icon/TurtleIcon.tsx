import { ReactComponent as RemoveIcon } from '@icons/remove.svg';
import { ReactComponent as ModalCloseIcon } from '@icons/modalClose.svg';

import { ReactComponent as MatchingIcon } from '@icons/matching.svg';
import { ReactComponent as MisMatchingIcon } from '@icons/misMatching.svg';

import { ReactComponent as ExelIcon } from '@icons/exel.svg';
import { ReactComponent as SingleIcon } from '@icons/single.svg';
import { ReactComponent as WarningIcon } from '@icons/warning.svg';

import { css } from '@emotion/react';

interface Props {
  name:
    | 'delete'
    | 'modalClose'
    | 'matching'
    | 'misMatching'
    | 'exel'
    | 'single'
    | 'warning';
  onClick?: () => void;
}

function TurtleIcon({ name, onClick }: Props) {
  const handleClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation();
    onClick && onClick();
  };

  if (name === 'delete') {
    return (
      <div css={iconContainer} onClick={handleClick}>
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
