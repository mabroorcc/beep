import { AnimatedComponent } from "../AnimatedComponent";

export interface Props {
  enter: "top" | "left" | "right" | "bottom" | "middle";
  leave: "top" | "left" | "right" | "bottom" | "middle";
  duration: number;
}

export const PageComponenet: React.FC<Props> = ({ children, enter, leave, duration }) => {
  let initial;
  let exit;
  let animate: any = { x: 0, y: 0 };

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

  if (enter === "middle") {
    initial = { scale: 0 };
    animate = { scale: 1 };
  }

  if (leave === "middle") {
    exit = { scale: 0 };
  }

  return (
    <AnimatedComponent
      style={{ width: "100vw", height: "100vh", overflow: "hidden" }}
      initial={initial}
      transition={{ duration }}
      animate={animate}
      exit={exit}
    >
      {children}
    </AnimatedComponent>
  );
};
