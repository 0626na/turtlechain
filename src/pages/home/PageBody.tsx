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
import { Button, Form, Menu, Select, Table } from 'antd';

import { ReactComponent as DownloadIcon } from '@icons/download.svg';
import { ReactComponent as ListIcon } from '@icons/list.svg';
import styled from 'styled-components';
import {
  TurtleDropdown,
  TurtleFormInput,
  TurtleFormSearchInput,
  TurtleImg,
  TurtleRangePicker,
  TurtleSearchInput,
  TurtleSelector,
  TurtleText,
} from '@components/element';
import AnswerButton from '@components/element/Buttons/AnswerButton';
import { TurtleModal } from '@components/combine';
import { useState } from 'react';

function PageBody() {
  const [modalVisible, setModalVisible] = useState(false);

  const handleModal = () => {
    setModalVisible(!modalVisible);
  };

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
        <PrimaryButton text="상품 등록하기" onClick={handleModal} />
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
                title: '11222',
                key: '1',
                label: '12',
                icon: <DownloadIcon style={{ stroke: 'red' }} />,
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

        <Table title={() => <div>3123</div>}></Table>

        {/* <TurtleSelector
          defaultValue="상품명"
          onChange={(value) => console.log(value)}
          items={[
            { value: '상품명' },
            { value: '거래처명' },
            { value: '거래처 상품명' },
          ]}
        /> */}

        {/* <TurtleRangePicker onChange={() => {}} /> */}

        <TurtleSearchInput onSearch={(value: any) => console.log(value)} />
        <TurtleFormInput />
        <TurtleFormInput disabled={true} value="12" />
        <TurtleFormSearchInput />
        <TurtleModal
          visible={modalVisible}
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
        ></TurtleModal>
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
