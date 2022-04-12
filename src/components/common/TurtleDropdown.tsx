import { Button, Dropdown } from "antd";
import { FileOutlined } from "@ant-design/icons";
import { JSXElementConstructor, ReactElement } from "react";

interface Props {
  menu: ReactElement<any, string | JSXElementConstructor<any>>;
  children: React.ReactNode;
}

function TurtleDropdown({ menu, children }: Props) {
  return (
    <Dropdown overlay={menu}>
      <Button
        style={{ borderColor: "#CBCCD1", borderRadius: 2, color: "#5B5D63" }}
        icon={<FileOutlined />}
      >
        {children}
      </Button>
    </Dropdown>
  );
}

export default TurtleDropdown;
