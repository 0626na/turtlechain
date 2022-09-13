interface Props {
  name: string;
  className?: string;
}

function TurtleImg({ name, ...props }: Props) {
  return (
    <img
      src={`${process.env.PUBLIC_URL}/assets/img/${name}.png`}
      alt={name}
      {...props}
    />
  );
}

export default TurtleImg;
