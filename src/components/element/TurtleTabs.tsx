import { theme } from '@styles/theme';
import { Tabs } from 'antd';
import { TabsProps } from 'rc-tabs';

const colors = {
  dark: {
    size: 100,
    color: theme.grey800,
    inactiveColor: theme.grey400,
    statusBarColor: theme.grey600,
  },

  blue: {
    size: 80,
    color: theme.blue,
    inactiveColor: theme.grey600,
    statusBarColor: theme.blue,
  },
};
interface Props extends TabsProps {
  color?: 'blue' | 'dark';
}

function TurtleTabs({ children, color = 'blue', ...props }: Props) {
  return (
    <Tabs
      css={{
        '.ant-tabs-nav-wrap': {
          backgroundColor: theme.white,
          borderBottom: `1px solid ${theme.dividerGrey}`,
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
            borderRadius: 2,
            backgroundColor: colors[color].statusBarColor,
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

export default TurtleTabs;
