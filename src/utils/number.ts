export const formatNumber = (num: number, unit: string): string => {
  if (num < 1000) {
    return num.toString() + " " + unit;
  } else if (num < 1000000) {
    return (num / 1000).toFixed(1) + "k " + unit;
  } else {
    return (num / 1000000).toFixed(1) + "m " + unit;
  }
};
