export const trimStartStr = (origin: string, target: string) => {
  const startStr = origin.slice(0, target.length);
  if (target === startStr) {
    return origin.slice(target.length);
  }
  return origin;
};