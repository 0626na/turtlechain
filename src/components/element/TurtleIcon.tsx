import { ReactComponent as RemoveIcon } from '@icons/remove.svg';
import { ReactComponent as MemoIcon } from '@icons/memo.svg';
import { ReactComponent as ModalCloseIcon } from '@icons/modalClose.svg';
import { css } from '@emotion/react';

interface Props {
  name: 'delete' | 'memo' | 'modalClose';
  onClick?: () => void;
  isPadding?: boolean;
}

function TurtleIcon({ name, onClick, isPadding }: Props) {
  const handleClick = (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
    e.stopPropagation();
    onClick && onClick();
  };

  if (name === 'delete') {
    return (
      <RemoveIcon css={[icon, isPadding && padding]} onClick={handleClick} />
    );
  }

  if (name === 'memo') {
    return (
      <MemoIcon css={[icon, isPadding && padding]} onClick={handleClick} />
    );
  }

  if (name === 'modalClose') {
    return (
      <ModalCloseIcon
        css={[icon, isPadding && padding]}
        onClick={handleClick}
      />
    );
  }

  return <></>;
}

const icon = css`
  cursor: pointer;
`;

const padding = css`
  padding: 6px;
`;

export default TurtleIcon;
