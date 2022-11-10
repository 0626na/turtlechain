import { ArrowRightIcon, TurtleTag } from '@components/element';
import { theme } from '@styles/theme';
import React from 'react';

function AnnouncementCard() {
  return (
    <>
      <div css={{ display: 'flex', alignItems: 'center' }}>
        <TurtleTag color="red">공지</TurtleTag>
        <div css={{ marginLeft: 16, color: theme.grey800 }}>
          터틀체인 2.0 업데이트 공지⚡️
        </div>
      </div>
      <ArrowRightIcon value={theme.grey300} />
    </>
  );
}

export default AnnouncementCard;
