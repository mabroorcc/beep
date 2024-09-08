import { CSSProperties } from "react";

export interface Props {
  place: {
    top?: string;
    left?: string;
    right?: string;
    bottom?: string;
  };
  styles?: CSSProperties;
}

export const FixedComponent: React.FC<Props> = (props) => {
  return (
    <div style={{ position: "fixed", ...props.place, ...props.styles }}>
      {props.children}
    </div>
  );
};
