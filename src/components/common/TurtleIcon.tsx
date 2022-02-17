interface Props {
  type: "menu" | "pageHeader";
  name: string;
}

function TurtleIcon({ type, name }: Props) {
  return <img src={`${process.env.PUBLIC_URL}/assets/svg/${name}.svg`} alt={name} />;
}

export default TurtleIcon;
