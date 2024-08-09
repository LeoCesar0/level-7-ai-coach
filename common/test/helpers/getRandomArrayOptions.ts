import { getRandomBoolean } from "./getRandomBoolean";
import { getRandomOfArray } from "./getRandomOfArray";

export const getRandomArrayOptions = <T>(
  arr: T[],
  {
    maxLength,
    preventEmpty,
  }: {
    maxLength?: number;
    preventEmpty?: boolean;
  }
): T[] => {
  const _maxLength = maxLength || arr.length;

  const shouldBeEmpty = preventEmpty ? false : getRandomBoolean();

  if (shouldBeEmpty || arr.length === 0) return [];

  const length = Math.floor(Math.random() * _maxLength) + 1;

  const options: T[] = [];

  let tries = 0;
  const maxTries = 30;

  while (options.length < length && tries <= maxTries) {
    const option = getRandomOfArray(arr);
    if (!options.includes(option)) {
      options.push(option);
    } else {
    }

    tries += 1;
  }

  return options;
};
