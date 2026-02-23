export const SAND_TAN = '#DAC3A7';
export const TREE_GREEN = '#10924D';
export const MOUNTAIN_BROWN = '#503E2B';
export const OCEAN_BLUE = "#0051ff";

export function convertHashTo0x(hashColor: string): number {
  return parseInt(hashColor.replace('#', ''), 16);
}