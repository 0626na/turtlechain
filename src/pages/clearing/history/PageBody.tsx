import { TeriaryButton, TurtleCard, TurtleIcon } from '@components/element';
import { PageContent, PageTitle } from '@layout/page';
import React from 'react';

function PageBody() {
  return (
    <>
      <PageTitle
        title="결제현황"
        buttons={[
          <TeriaryButton
            text="결제내역 다운"
            icon={<TurtleIcon name="download" />}
            onClick={() => {
              // openInventoryModal();
            }}
          />,
        ]}
      />
      <PageContent>
        {/*
         *  매입조정 현황
         */}

        <TurtleCard
          value={[
            {
              color: 'green',
              title: '요청',
              count: 10,
              price: 10000,
            },
            {
              color: 'orange',
              title: '대기',
              count: 22,
              price: 1000,
            },
            {
              color: 'cyan',
              title: '완료',
              count: 21,
              price: 100000,
            },
          ]}
        />
      </PageContent>
    </>
  );
}

export default PageBody;
