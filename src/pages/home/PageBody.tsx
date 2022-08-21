import {
  PrimaryButton,
  SecondaryButton,
  TeriaryButton,
} from '@components/element/Buttons';
import {
  PageBottomBar,
  PageContent,
  PageHeader,
  PageTitle,
} from '@layout/page';
import { Button, Menu } from 'antd';

import { ReactComponent as DownloadIcon } from '@icons/download.svg';
import { ReactComponent as ListIcon } from '@icons/list.svg';
import styled from 'styled-components';
import { TurtleDropdown, TurtleImg, TurtleText } from '@components/element';
import AnswerButton from '@components/element/Buttons/AnswerButton';

function PageBody() {
  return (
    <>
      <PageHeader
        title="입고등록"
        Button={
          <StyledButton>
            <ListIcon />
            <TurtleText style={{ marginLeft: 8, color: '#fff' }}>
              거래처 목록
            </TurtleText>
          </StyledButton>
        }
      />

      <PageTitle
        title="페이지 제목"
        subTitle="페이지 부제목"
        Buttons={[<Button>ㅁㅇㄹ</Button>, <Button>ㅁㅇㄹ</Button>]}
      />

      <PageContent>
        <PrimaryButton text="상품 등록하기" />
        <SecondaryButton text="상품 추가하기" />
        <AnswerButton text="예" type="YES"></AnswerButton>
        <AnswerButton text="취소" type="NO"></AnswerButton>
        {/* <Button size="small">asas</Button>
        <Button size="middle">asas</Button>
        <Button size="large">asas</Button> */}
        <TeriaryButton icon={<DownloadIcon />} text="결제내역 다운" />
        <TeriaryButton text="재고프로그램 연동" />
        {/* <TeriaryButton text="마감하기" /> */}

        <TurtleDropdown
          items={
            [
              {
                key: '1',
                label: '12',
                // icon: ,
                // itemIcon: <DownloadIcon style={{ stroke: 'red' }} />,
              },
            ]
            // <Menu>
            //   <Menu.Item style={{ background: 'red' }} key="1">
            //     a
            //   </Menu.Item>
            //   <Menu.Item key="2">ab</Menu.Item>
            //   <Menu.Item key="3">ss</Menu.Item>
            //   <Menu.Item key="4">add</Menu.Item>
            //   {/* <Menu.Item key="1">
            //     <TurtleUpload //
            //       beforeUpload={parseFile}
            //       onRemove={resetStates}
            //       fileList={cart.fileList}
            //     />
            //   </Menu.Item>
            //   <Menu.Item
            //     key="2"
            //     onClick={() => {
            //       if (!isStoreExist()) return;
            //       setAddProductModalVisible(true);
            //     }}
            //   >
            //     {t('button.add single product')}
            //   </Menu.Item> */}
            // </Menu>
          }
          triggerButton={<SecondaryButton text="상품 추가하기" />}
        />
      </PageContent>

      <PageBottomBar>
        <PrimaryButton text="상품 등록하기" />
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
