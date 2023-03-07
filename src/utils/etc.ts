import { phoneMaskingPattern, removeHyphen } from './pattern';

export const phoneMasking = (data: string) => {
  return data.replace(phoneMaskingPattern, '$1-$2-$3');
};


export const refinedValue = (data : string) => {
  return data.replace(removeHyphen,"").trim();

}