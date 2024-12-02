import { isRejectedWithValue } from '@reduxjs/toolkit';
import type { Middleware } from '@reduxjs/toolkit';

export const rtkQueryLogger: Middleware = () => next => action => {
  // RTK Query uses `createAsyncThunk` from redux-toolkit under the hood, so we're able to utilize these matchers!

  /**
   * Success !
   */
  /**

  if (isFulfilled(action)) {
    console.log(
      `We got a fulfilled action! Result: ${JSON.stringify(action.payload)}`
    );

    Toastify(
      action.payload &&
        typeof action.payload === 'object' &&
        action.payload !== null &&
        'data' in action.payload &&
        typeof action.payload.data === 'object' &&
        action.payload.data !== null
        ? (action.payload.data as { message: string }).message
        : '',
      action.payload &&
        typeof action.payload === 'object' &&
        action.payload !== null &&
        'data' in action.payload &&
        typeof action.payload.data === 'object' &&
        action.payload.data !== null
        ? (action.payload.data as { statusCode: number }).statusCode
        : 200
    );
  }
  */

  /**
   * Error !
   */
  if (isRejectedWithValue(action)) {
    console.warn(
      `We got a rejected action! Error: ${JSON.stringify(action.error)}`
    );

    /**
    Toastify(
      action.payload &&
        typeof action.payload === 'object' &&
        action.payload !== null &&
        'data' in action.payload &&
        typeof action.payload.data === 'object' &&
        action.payload.data !== null
        ? (action.payload.data as { message: string }).message
        : action.error?.message || '',
      action.payload &&
        typeof action.payload === 'object' &&
        action.payload !== null &&
        'data' in action.payload &&
        typeof action.payload.data === 'object' &&
        action.payload.data !== null
        ? (action.payload.data as { statusCode: number }).statusCode
        : 500
    );
   */
  }
  next(action);
};
