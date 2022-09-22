import { css } from '@emotion/react';
import React, { useEffect, useState } from 'react';
import TurtleText from './TurtleText';

interface Props {
  children: React.ReactNode;
  color: string;
}

function TurtleTag({ children, color }: Props) {
  const [tone, setTone] = useState({
    fontColor: '',
    backgroundColor: '',
  });

  useEffect(() => {
    if (color === '#DD7A32') {
      setTone({ fontColor: '#DD7A32', backgroundColor: '#FBEFE6' });
    }

    if (color === '#00AAB5') {
      setTone({ fontColor: '#00AAB5', backgroundColor: '#DDF3F5' });
    }

    if (color === '#5C6069') {
      setTone({ fontColor: '#5C6069', backgroundColor: '#EBECED' });
    }

    if (color === '#FFFFFF') {
      setTone({ fontColor: '#FFFFFF', backgroundColor: '#29A9DD' });
    }

    if (color === '#29A9DD') {
      setTone({ fontColor: '#29A9DD', backgroundColor: '##E6F4FA' });
    }
  }, [color]);

  return (
    <div
      css={[
        container,
        {
          backgroundColor: tone.backgroundColor,
          color: tone.fontColor,
        },
      ]}
    >
      <TurtleText>{children}</TurtleText>
    </div>
  );
}

const container = css`
  height: 20px;
  padding: 0px 7px;

  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;

  font-weight: 400;
  font-size: 12px;
`;

export default TurtleTag;
