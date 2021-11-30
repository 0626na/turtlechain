import styled from "styled-components";

interface Props {
  filled?: boolean;
  src: string;
  alt: string;
  size?: string | number;
  margin?: string | number;
}

const SvgIcon = function ({
  filled = true,
  src,
  alt,
  size = "1rem",
  margin,
}: Props) {
  if (filled) {
    return (
      <FilledContainer size={size} margin={margin}>
        <img style={{ width: size }} src={src} alt={alt} />
      </FilledContainer>
    );
  } else {
    return <img style={{ width: size, margin }} src={src} alt={alt} />;
  }
};

interface FilledContainerProps {
  size?: string | number;
  margin?: string | number;
}

const FilledContainer = styled.div<FilledContainerProps>`
  width: ${(props) => props.size};
  height: ${(props) => props.size};
  margin: ${(props) => props.margin};
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0.8rem;
  background-color: #eee;
  border-radius: 50%;
`;

export default SvgIcon;
