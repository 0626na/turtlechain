import React from 'react';
import styled from '@emotion/styled';

import { Button } from 'antd';

import {
  PageBottomBar,
  PageContent,
  PageHeader,
  PageTitle,
} from '@layout/page';

import {
  PrimaryButton,
  SecondaryButton,
  TeriaryButton,
  TurtleDropdown,
} from '@components/element';
import { TurtleText } from '@components/element';

//icon
import { ReactComponent as ListIcon } from '@icons/list.svg';
import { ReactComponent as ExelIcon } from '@icons/exel.svg';
import { ReactComponent as SingleIcon } from '@icons/single.svg';
import { css } from '@emotion/react';

function PageBody() {
  // const [successList,setSuccessList] =

  return (
    <>
      <PageHeader
        title="거래처등록"
        Button={
          <StyledButton>
            <ListIcon />
            <TurtleText
              css={css`
                margin-left: 8px;
                color: #fff;
              `}
            >
              거래처 목록
            </TurtleText>
          </StyledButton>
        }
      />

      <PageTitle
        title="거래처등록 미리보기"
        Buttons={[
          <TeriaryButton text="재고프로그램 연동" />,
          <TurtleDropdown
            items={[
              { key: 'item1', label: '엑셀 업로드', icon: <ExelIcon /> },
              { key: 'item1', label: '단건추가', icon: <SingleIcon /> },
            ]}
            triggerButton={<SecondaryButton text="거래처 추가하기" />}
          />,
        ]}
      />

      <PageContent></PageContent>

      <PageBottomBar>
        <PrimaryButton text="거래처 등록하기" />
      </PageBottomBar>
    </>
  );
}

const StyledButton = styled(Button)`
  margin-left: 20px;

  border: none;
  background-color: #141720;

  display: flex;
  align-items: center;

  &:hover {
    background-color: #373a41;
  }

  // active 상태
  &.ant-btn:focus {
    background-color: #141720;
  }
`;

export default PageBody;
