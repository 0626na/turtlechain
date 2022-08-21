import { Dropdown, Menu } from 'antd';
import { ItemType } from 'antd/lib/menu/hooks/useItems';

interface Props {
  items: ItemType[];
  triggerButton: React.ReactNode;
}

function TurtleDropdown({ items, triggerButton }: Props) {
  return (
    <Dropdown overlay={<Menu items={items} />} trigger={['click']}>
      {triggerButton}
    </Dropdown>
  );
}

export default TurtleDropdown;
