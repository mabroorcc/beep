import { CSSProperties } from "react";

export interface Props {
  width: string;
  height: string;
  center?: boolean;
  style?: React.CSSProperties;
}

export const Container: React.FC<Props> = ({
  width,
  height,
  children,
  style,
  center,
}) => {
  const centerStyle: CSSProperties = center
    ? {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }
    : {};

  return (
    <div style={{ width, height, ...centerStyle, ...style }}>{children}</div>
  );
};
