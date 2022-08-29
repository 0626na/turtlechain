import styled from 'styled-components';
import { Dropdown, Menu } from 'antd';
import { ItemType } from 'antd/lib/menu/hooks/useItems';

interface Props {
  // ItemType 예시 : { key: '1', label: 'test', icon: <TestIcon /> ,style : {}}
  items?: ItemType[];
  triggerButton: React.ReactNode;
}

function TurtleDropdown({ items, triggerButton }: Props) {
  return (
    <Dropdown overlay={<StyledMenu items={items} />} trigger={['click']}>
      {triggerButton}
    </Dropdown>
  );
}

const StyledMenu = styled(Menu)`
  width: 196px;
  max-height: 150px;
  overflow-y: scroll;

  padding: 8px;

  position: absolute;
  top: 0px;
  left: 28px;

  box-shadow: 0px 4px 18px rgba(34, 44, 56, 0.4);
  border-radius: 8px;
`;

export default TurtleDropdown;
