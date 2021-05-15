import { AnimatedComponent } from "../AnimatedComponent";

export interface Props {
  enter: "top" | "left" | "right" | "bottom";
  leave: "top" | "left" | "right" | "bottom";
  duration: number;
}

export const Page: React.FC<Props> = ({ children, enter, leave, duration }) => {
  let initial;
  let exit;

  if (enter === "top") {
    initial = { y: "-100%" };
  }

  if (leave === "top") {
    exit = { y: "-100%" };
  }

  if (enter === "left") {
    initial = { x: "-100%" };
  }

  if (leave === "left") {
    exit = { x: "-100%" };
  }

  if (enter === "right") {
    initial = { x: "100%" };
  }

  if (leave === "right") {
    exit = { x: "100%" };
  }

  if (enter === "bottom") {
    initial = { y: "100%" };
  }

  if (leave === "bottom") {
    exit = { y: "100%" };
  }

  return (
    <AnimatedComponent
      style={{ width: "100vw", height: "100vh", overflow: "hidden" }}
      initial={initial}
      transition={{ duration }}
      animate={{ x: 0, y: 0 }}
      exit={exit}
    >
      {children}
    </AnimatedComponent>
  );
};
