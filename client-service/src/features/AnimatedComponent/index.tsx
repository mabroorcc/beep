import { motion, MotionProps } from "framer-motion";

export const AnimatedComponent: React.FC<MotionProps> = ({
  children,
  initial,
  animate,
  transition,
  exit,
  style,
}) => {
  return (
    <motion.div
      style={style}
      transition={transition}
      initial={initial}
      animate={animate}
      exit={exit}
    >
      {children}
    </motion.div>
  );
};
