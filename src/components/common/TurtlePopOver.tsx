import { Popover } from "antd";

interface Props {
  children: React.ReactChild;
}
function TurtlePopOver({ children }: Props) {
  return (
    <Popover content={"hello world"} trigger="click">
      {children}
    </Popover>
  );
}

export default TurtlePopOver;
