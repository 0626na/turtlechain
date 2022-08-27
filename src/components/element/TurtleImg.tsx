interface Props {
  name: string;
  style?: React.CSSProperties;
}

function TurtleImg({ name, style, ...props }: Props) {
  return (
    <img
      {...props}
      style={{ width: '100%', height: '100%', ...style }}
      src={`${process.env.PUBLIC_URL}/assets/img/${name}.png`}
      alt={name}
    />
  );
}

export default TurtleImg;
