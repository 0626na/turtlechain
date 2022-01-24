import styled from "styled-components";

interface Props {
  filled?: boolean;
  src: string;
  alt: string;
  color?: "green";
}

function TurtleIcon({ color, src, alt }: Props) {
  if (color === "green") {
    return <GreenImg src={src} alt={alt} />;
  } else {
    return <StyledImg src={src} alt={alt} />;
  }
}

const FilledDiv = styled.div`
  width: 2rem;
  height: 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem;
  background-color: #242934;
  border-radius: 50%;
`;

const StyledImg = styled.img`
  width: 20px;
  height: 20px;
`;

const GreenImg = styled.img`
  width: 25px;
  height: 25px;
  filter: invert(60%) sepia(13%) saturate(7428%) hue-rotate(128deg) brightness(96%) contrast(85%);
`;

export default TurtleIcon;
