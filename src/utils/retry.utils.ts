// improve, add list of errors to retry (can be only IO errors, or whatever)
// almost died typing this function, `any` for now, type flow is working fine with generic
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function retryFuncWrapper<A extends (...args: any[]) => any, B>(
  func: A,
  binder: B | null = null,
  retryTimes: number = 2,
) {
  if (!func) throw new Error('func is required');
  if (typeof func !== 'function') throw new Error('func must be a function');

  return async function (...args: Parameters<A>): Promise<ReturnType<A>> {
    let retryCount = 0;

    let lastError: Error | unknown = null;

    while (retryCount < retryTimes) {
      const rebindedFunc = binder ? func.bind(binder) : func;

      try {
        if (func.constructor.name !== 'AsyncFunction') {
          return await rebindedFunc(...args);
        }

        return rebindedFunc(...args);
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
