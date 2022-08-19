import { PrimaryButton, SecondaryButton } from '@components/element/Buttons';
import {
  PageBottomBar,
  PageContent,
  PageHeader,
  PageTitle,
} from '@layout/page';
import { Button } from 'antd';

function PageBody() {
  return (
    <>
      <PageHeader title="입고등록">
        <Button style={{ marginLeft: 20 }}>1aa</Button>
      </PageHeader>

      <PageTitle
        title="페이지 제목"
        subTitle="페이지 부제목"
        Buttons={[<Button>ㅁㅇㄹ</Button>, <Button>ㅁㅇㄹ</Button>]}
      />

      <PageContent>
        <PrimaryButton text="상품 등록하기" />
        <SecondaryButton text="상품 추가하기" />
      </PageContent>

      <PageBottomBar>
        <Button>12</Button>
      </PageBottomBar>
    </>
  );
}

export default PageBody;
