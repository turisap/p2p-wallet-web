import { RpcResponseAndContext } from '@solana/web3.js';

import { SetSlot } from 'app/contexts/solana';

/**
 * Retry an async function that returns a RpcResponseAndContext up to
 * 3 times if it returns out-of-date data (as measured by the latest
 * slot number saved in the SolanaContext).
 * @param fn The function to retry
 * @param slot The latest slot number stored in context
 * @param setSlot A function to update the slot number stored in context
 * @param maxRetries The maximum number of times to retry
 * @returns
 */
export async function retryRpcResponseAndContext<T>(
  fn: () => Promise<RpcResponseAndContext<T>>,
  slot: number,
  setSlot: SetSlot,
  maxRetries: number = 3,
): Promise<RpcResponseAndContext<T>> {
  for (let retries = 0; retries < maxRetries; retries++) {
    const response = await fn();
    let { slot: responseSlot } = response.context;

    // Discard responses that have a response slot that is lower than the current slot
    if (responseSlot > slot) {
      setSlot(responseSlot);
      return response;
    } else {
      console.error(
        `The response is out-of-date (${slot - responseSlot} slots behind). Fetching again...`,
      );
    }
  }

  throw new Error('The request timed out. Try refreshing the page and try again.');
}
