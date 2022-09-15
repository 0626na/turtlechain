import React from 'react';
import {
  AnswerButton,
  PrimaryButton,
  SecondaryButton,
} from '@components/element';
import {
  PageBottomBar,
  PageContent,
  PageHeader,
  PageTitle,
} from '@layout/page';
import { Button, Table } from 'antd';

import { ReactComponent as DownloadIcon } from '@icons/download.svg';
import { ReactComponent as ListIcon } from '@icons/list.svg';
import styled from '@emotion/styled';
import {
  TurtleDropdown,
  TurtleFormInput,
  TurtleFormSearchInput,
  TurtlePrimaryRangePicker,
  TurtleText,
} from '@components/element';
import { TurtleContentModal } from '@components/combine';
import { useState } from 'react';
import { css } from '@emotion/react';

function PageBody() {
  const [modalVisible, setModalVisible] = useState(false);

  const showModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  return (
    <>
      <PageHeader
        title="입고등록"
        button={
          <StyledButton>
            <ListIcon />
            <TurtleText
              css={css`
                margin-left: 8px;
                color: #fff;
                font-weight: 500;
              `}
            >
              거래처 목록
            </TurtleText>
          </StyledButton>
        }
      />

      <PageTitle
        title="페이지 제목"
        subTitle="페이지 부제목"
        buttons={[<Button>ㅁㅇㄹ</Button>, <Button>ㅁㅇㄹ</Button>]}
      />

      <PageContent>
        <PrimaryButton onClick={showModal}>상품 등록하기</PrimaryButton>
        <SecondaryButton text="상품 추가하기" />
        <AnswerButton text="예" type="YES"></AnswerButton>
        <AnswerButton text="취소" type="NO"></AnswerButton>
        {/* <Button size="small">asas</Button>
        <Button size="middle">asas</Button>
        <Button size="large">asas</Button> */}
        {/* <TeriaryButton icon={<DownloadIcon />} text="결제내역 다운" />
        <TeriaryButton text="재고프로그램 연동" /> */}
        {/* <TeriaryButton text="마감하기" /> */}

        <TurtleDropdown
          items={[
            {
              // title: '11222',
              key: '1',
              label: '12',
              icon: <DownloadIcon style={{ stroke: 'red' }} />,
            },
          ]}
          triggerButton={<SecondaryButton text="상품 추가하기" />}
        />

        <Table title={() => <div>3123</div>}></Table>

        <TurtlePrimaryRangePicker />

        {/* <TurtleSearchInput onSearch={(value: any) => console.log(value)} /> */}
        <TurtleFormInput />
        <TurtleFormInput disabled={true} value="12" />

        {/* <TurtleAnswerModal
          visible={true}
          onCancel={() => {
            setModalVisible(false);
          }}
          onOk={() => {
            setModalVisible(false);
          }}
          title="거래처명 수정"
          description={
            <span>
              선택한 거래처의 이름을 수정합니다. <br /> 원하는 거래처명을
              입력하세요.
            </span>
          }
        /> */}

        <TurtleContentModal
          visible={modalVisible}
          title="거래처명 수정"
          onClose={closeModal}
        >
          <div>123</div>
        </TurtleContentModal>

        <TurtleFormSearchInput />
      </PageContent>

      <PageBottomBar>
        <PrimaryButton>상품 등록하기</PrimaryButton>
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
