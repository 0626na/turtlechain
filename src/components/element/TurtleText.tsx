import styled from 'styled-components';

interface Props {
  children: React.ReactNode;
  style?: React.CSSProperties;
}

function TurtleText({ style, children }: Props) {
  return <StyledText style={style}>{children}</StyledText>;
}

const StyledText = styled.span`
  display: inline-block;
  line-height: 1;
`;

export default TurtleText;
