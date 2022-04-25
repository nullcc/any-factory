import * as _ from 'lodash';

export const sleep = async (milliseconds: number): Promise<void> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, milliseconds);
  });
};

export const waitUntil = async (
  // eslint-disable-next-line @typescript-eslint/ban-types
  fn: Function,
  expectedValue: any,
  backOff: number,
  timeout: number,
): Promise<boolean> => {
  const startTime = new Date().getTime();
  let res = undefined;
  while (new Date().getTime() < startTime + timeout) {
    res = await fn();
    if (_.isEqual(res, expectedValue)) {
      return true;
    }
    await sleep(backOff);
  }
  return false;
};
