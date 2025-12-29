const softEase: number[] = [0.16, 1, 0.3, 1];

export const durations = {
  sm: 0.24,
  md: 0.42,
  lg: 0.7,
};

export const fadeIn = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { duration: durations.md, ease: softEase },
  },
};

export const fadeInUp = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: durations.lg, ease: softEase },
  },
};

export const zoomIn = {
  hidden: { opacity: 0, scale: 0.96 },
  show: {
    opacity: 1,
    scale: 1,
    transition: { duration: durations.md, ease: softEase },
  },
};

export const staggerChildren = (delay = 0.08, initialDelay = 0) => ({
  hidden: {},
  show: {
    transition: { staggerChildren: delay, delayChildren: initialDelay },
  },
});

export const parallaxLayer = (distance = 32) => ({
  hidden: { y: distance },
  show: {
    y: 0,
    transition: { duration: durations.lg, ease: softEase },
  },
});
