interface Props {
  name: string;
}

function TurtleImg({ name }: Props) {
  return <img src={`${process.env.PUBLIC_URL}/assets/svg/${name}.svg`} alt={name} />;
}

export default TurtleImg;
