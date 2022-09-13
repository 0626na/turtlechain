import { ReactComponent as RemoveIcon } from '@icons/remove.svg';
import { ReactComponent as MemoIcon } from '@icons/memo.svg';
import { ReactComponent as ModalCloseIcon } from '@icons/modalClose.svg';

import { ReactComponent as MatchingIcon } from '@icons/matching.svg';
import { ReactComponent as MisMatchingIcon } from '@icons/misMatching.svg';

import { ReactComponent as ExelIcon } from '@icons/exel.svg';
import { ReactComponent as SingleIcon } from '@icons/single.svg';
import { css } from '@emotion/react';

interface Props {
  name:
    | 'delete'
    | 'memo'
    | 'modalClose'
    | 'matching'
    | 'misMatching'
    | 'exel'
    | 'single';
  onClick?: () => void;
  className?: string;
}

function TurtleIcon({ name, onClick, className }: Props) {
  const handleClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation();
    onClick && onClick();
  };

  if (name === 'delete') {
    return (
      <div css={iconContainer} onClick={handleClick}>
        <RemoveIcon className={className} />
      </div>
    );
  }

  if (name === 'memo') {
    return (
      <div css={iconContainer} onClick={handleClick}>
        <MemoIcon className={className} />
      </div>
    );
  }

  if (name === 'modalClose') {
    return (
      <div css={iconContainer} onClick={handleClick}>
        <ModalCloseIcon className={className} />
      </div>
    );
  }

  if (name === 'matching') {
    return (
      <div css={iconContainer} onClick={handleClick}>
        <MatchingIcon className={className} />
      </div>
    );
  }

  if (name === 'misMatching') {
    return (
      <div css={iconContainer} onClick={handleClick}>
        <MisMatchingIcon className={className} />
      </div>
    );
  }

  if (name === 'exel') {
    return (
      <div css={iconContainer} onClick={handleClick}>
        <ExelIcon className={className} />
      </div>
    );
  }

  if (name === 'single') {
    return (
      <div css={iconContainer} onClick={handleClick}>
        <SingleIcon className={className} />
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
