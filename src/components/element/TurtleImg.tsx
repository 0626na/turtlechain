interface Props {
  name: string;
  style?: React.CSSProperties;
}

function TurtleImg({ name, style }: Props) {
  return (
    <img
      style={style}
      src={`${process.env.PUBLIC_URL}/assets/img/${name}.png`}
      alt={name}
    />
  );
}

export default TurtleImg;
