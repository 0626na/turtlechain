import { ReactComponent as RemoveIcon } from '@icons/remove.svg';
import { ReactComponent as MemoIcon } from '@icons/memo.svg';
import { css } from '@emotion/react';

interface Props {
  name: 'delete' | 'memo';
  onClick?: () => void;
}

function TurtleIcon({ name, onClick }: Props) {
  const handleClick = (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
    e.stopPropagation();
    onClick && onClick();
  };

  if (name === 'delete') {
    return <RemoveIcon css={icon} onClick={handleClick} />;
  } else if ((name = 'memo')) {
    return <MemoIcon css={icon} onClick={handleClick} />;
  } else {
    return <></>;
  }
}

const icon = css`
  cursor: pointer;
  padding: 6;
`;

export default TurtleIcon;
