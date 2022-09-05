import { css } from '@emotion/react';
import { Tabs } from 'antd';
import { TabsProps } from 'rc-tabs';

interface Props extends TabsProps {}

function TurtleTabs({ children, ...props }: Props) {
  return (
    <Tabs css={tabContainer} size="large" {...props}>
      {children}
    </Tabs>
  );
}

// PageContent
const tabContainer = css`
  .ant-tabs-nav {
    margin-bottom: 18px; // antd 기본속성 제거

    .ant-tabs-tab {
      padding: 0px 0px 8px 0px;
      margin-left: 0px; // antd 기본속성 제거
      width: 80px;
      display: block;
      text-align: center;

      // 탭 비활성화 + hover
      .ant-tabs-tab-btn {
        color: #5b5d63;
        font-weight: 500;
        font-size: 15px;
        &:hover {
          color: #1a66f9;
        }
      }

      // 탭 활성화
      &.ant-tabs-tab-active {
        .ant-tabs-tab-btn {
          color: #1a66f9;
        }
      }
    }

    // status 바
    .ant-tabs-ink-bar {
      height: 4px;
      background-color: #1a66f9;
      border-radius: 2px;
    }
  }
`;

export default TurtleTabs;
