import { ArrowRightIcon, TurtleTag } from '@components/element';
import { theme } from '@styles/theme';
import { t } from 'i18next';
import React from 'react';

function AnnouncementCard() {
  return (
    <>
      <div css={{ display: 'flex', alignItems: 'center' }}>
        <span>🔊</span>
        <div css={{ marginLeft: 16, color: theme.grey800 }}>
          {t('title.service updates')}⚡️
        </div>
      </div>
      <ArrowRightIcon value={theme.grey300} />
    </>
  );
}

export default AnnouncementCard;
