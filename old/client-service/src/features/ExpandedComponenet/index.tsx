import { CSSProperties } from "react";

export interface Props {
  center?: boolean;
  styles?: CSSProperties;
}

export const ExpandedComponenet: React.FC<Props> = ({
  styles,
  center,
  children,
}) => {
  const centerStyle: CSSProperties = center
    ? {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }
    : {};
  return (
    <div style={{ width: "100%", height: "100%", ...centerStyle, ...styles }}>
      {children}
    </div>
  );
};
