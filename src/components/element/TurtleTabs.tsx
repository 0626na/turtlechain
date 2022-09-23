import { Tabs } from 'antd';
import { TabsProps } from 'rc-tabs';

interface Props extends TabsProps {
  color?: 'blue' | 'dark';
}

function TurtleTabs({ children, color = 'blue', ...props }: Props) {
  return (
    <Tabs
      css={{
        '.ant-tabs-nav-wrap': {
          backgroundColor: '#fff',
          padding: color === 'blue' ? '' : '0px 36px',
        },
        '.ant-tabs-nav': {
          marginBottom: color === 'blue' ? 18 : 0, // antd 기본속성 제거

          '.ant-tabs-tab': {
            padding: '0px 15px 8px 15px',
            marginLeft: 0, // antd 기본속성 제거
            display: 'block',
            textAlign: 'center',

            // 탭 비활성화 + hover
            '.ant-tabs-tab-btn': {
              color: colors[color].inactiveColor,
              fontWeight: 500,
              fontSize: 15,

              '&:hover': {
                color: colors[color].color,
              },
            },

            // 탭 활성화
            '&.ant-tabs-tab-active': {
              '.ant-tabs-tab-btn': {
                color: colors[color].color,
              },
            },
          },

          // status 바
          '.ant-tabs-ink-bar': {
            height: 4,
            backgroundColor: colors[color].statusBarColor,
            borderRadius: 2,
          },
        },
      }}
      size="large"
      {...props}
    >
      {children}
    </Tabs>
  );
}

const colors = {
  dark: {
    size: 100,
    color: '#242934',
    inactiveColor: '#A1A2A6',
    statusBarColor: '#5B5D63',
  },
  blue: {
    size: 80,
    color: '#1a66f9',
    inactiveColor: '#5b5d63',
    statusBarColor: '#1a66f9',
  },
};

// PageContent

export default TurtleTabs;
