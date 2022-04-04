import { TurtleInfo, TurtleText } from "components/common";

interface Props {
  title: string;
  children: React.ReactNode;
  info?: string;
}

function MainContent({ title, info, children }: Props) {
  return (
    <div style={{ paddingTop: 32, paddingBottom: 32 }}>
      <TurtleText>
        {title}
        {info && (
          <>
            <br />
            <TurtleInfo>{info}</TurtleInfo>
          </>
        )}
      </TurtleText>
      {children}
    </div>
  );
}

export default MainContent;
