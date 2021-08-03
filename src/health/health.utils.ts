import { ChainResult, HealthSnapshot, Result, SubgraphResult } from './health.types';

export function camelCaseToSentenceCase(text: string) {
  const result = text.replace(/([A-Z])/g, ' $1');
  const finalResult = result.charAt(0).toUpperCase() + result.slice(1);
  return finalResult;
}

export function convertToSnapshot(name: string, results: SubgraphResult[] | ChainResult[] | Result[]): HealthSnapshot {
  const now = new Date();
  const utc = new Date(
    Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate(),
      now.getUTCHours(),
      now.getUTCMinutes(),
      now.getUTCSeconds(),
      now.getUTCMilliseconds(),
    ),
  );
  return {
    dateTime: utc.toUTCString(),
    name: name,
    results: results,
  };
}
