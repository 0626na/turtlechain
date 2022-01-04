import styled from "styled-components";

interface Props {
  filled?: boolean;
  src: string;
  alt: string;
}

function CustomIcon({ filled, src, alt }: Props) {
  if (filled) {
    return (
      <FilledDiv>
        <img src={src} alt={alt} />
      </FilledDiv>
    );
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
  background-color: ${({ theme }) => theme.imgBackground};
  border-radius: 50%;
`;

const StyledImg = styled.img`
  width: 25px;
  height: 25px;
`;

export default CustomIcon;
