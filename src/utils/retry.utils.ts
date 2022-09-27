// improve, add list of errors to retry (can be only IO errors, or whatever)
export function retryFuncWrapper<A, R>(func: A, retryTimes: number = 2) {
  if (!func) throw new Error('func is required');
  if (typeof func !== 'function') throw new Error('func must be a function');

  return async function (...args: A extends (...args: infer P) => R ? P : never[]) {
    let retryCount = 0;

    let lastError: Error | unknown = null;

    while (retryCount < retryTimes) {
      try {
        if (func.constructor.name !== 'AsyncFunction') {
          return await func(...args);
        }

        return func(...args);
      } catch (err) {
        retryCount++;

        lastError = err;
      }
    }

    console.error('Retry failed');
    throw lastError;
  };
}

// shortcut
export const rfw = retryFuncWrapper;
