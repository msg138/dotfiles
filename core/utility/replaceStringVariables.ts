import path from 'node:path';

const stringVariables: Record<string, (() => string) | string> = {
  '<tmp>': '.tmp',
  '<home>': `${process.env.HOME}`,
  '<this-dir>': `${path.resolve(import.meta.dir, '..', '..')}`
};

const replaceStringVariables = (str: string): string => {
  let finalString = str;
  Object.keys(stringVariables).forEach((stringVariable) => {
    const replaceValue = typeof stringVariables[stringVariable] === 'function'
      ? stringVariables[stringVariable]()
      : stringVariables[stringVariable];
    finalString = finalString.replace(new RegExp(stringVariable), replaceValue);
  });
  return finalString;
};

export default replaceStringVariables;

