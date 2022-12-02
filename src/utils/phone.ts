import { phoneMaskingPattern } from './pattern';

export const phoneMasking = (data: string) => {
  return data.replace(phoneMaskingPattern, '$1-$2-$3');
};
