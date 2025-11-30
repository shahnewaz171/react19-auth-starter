/* eslint-disable max-params */

export const onRender: React.ProfilerOnRenderCallback = (
  id,
  phase,
  actualDuration,
  baseDuration,
  startTime,
  commitTime
) => {
  // Aggregate or log render timings...
  console.log({ id, phase, actualDuration, baseDuration, startTime, commitTime });
};
