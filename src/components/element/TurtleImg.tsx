interface Props {
  name: string;
}

function TurtleImg({ name }: Props) {
  return (
    <img src={`${process.env.PUBLIC_URL}/assets/img/${name}.png`} alt={name} />
  );
}

export default TurtleImg;
