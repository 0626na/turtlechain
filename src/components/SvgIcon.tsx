import styled from "styled-components";

interface Props {
  filled?: boolean;
  src: string;
  alt: string;
}

const SvgIcon = function ({ filled = true, src, alt }: Props) {
  if (filled) {
    return (
      <FilledContainer>
        <img src={src} alt={alt} />
      </FilledContainer>
    );
  } else {
    return <img src={src} alt={alt} width="25px" height="25px" />;
  }
};

const FilledContainer = styled.div`
  width: 2rem;
  height: 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem;
  background-color: #eee;
  border-radius: 50%;
`;

export default SvgIcon;
