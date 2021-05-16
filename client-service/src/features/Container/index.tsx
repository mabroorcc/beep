export interface Props {
  width: string;
  height: string;
  style?: React.CSSProperties;
}

export const Container: React.FC<Props> = ({
  width,
  height,
  children,
  style,
}) => {
  return <div style={{ width, height, ...style }}>{children}</div>;
};
