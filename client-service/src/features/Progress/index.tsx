import { makeStyles } from "@material-ui/core/styles";
import { CircularProgress } from "@material-ui/core";

export interface Props {
  val: number;
}

export const Progress: React.FC<Props> = ({ val }) => {
  return (
    <CircularProgress
      style={{ height: "100%" }}
      variant="determinate"
      value={val}
    />
  );
};

const useStyles = makeStyles({
  root: {
    width: "100%",
  },
  progress: {
    bottom: "100%",
  },
});
