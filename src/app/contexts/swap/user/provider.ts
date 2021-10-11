import { useState } from 'react';

import { PublicKey } from '@solana/web3.js';
import { createContainer } from 'unstated-next';

import { useSolana } from 'app/contexts/solana';

import { useConfig, useProgramIds } from '../config';
import TokenAccount from '../models/TokenAccount';
import { TokenConfigs } from '../orca-commons';
import AsyncCache, {
  AsyncResult,
  AsyncSuccess,
  createAsyncSuccess,
  DEFAULT_MAX_AGE,
} from '../utils/AsyncCache';
import { loadTokenAccounts } from '../utils/tokenAccounts';

export type UserTokenAccountMap = {
  // If the account is for a standard token, pool token, or collectible,
  //   the key is the token symbol, e.g. ETH, USDC, ORCA, etc.
  // If the account is for a farm token, the key is the mint address.
  // This should be refactored so all keys are mint addresses.
  [key: string]: TokenAccount;
};

export type CacheValue = {
  standardTokenAccounts: AsyncSuccess<UserTokenAccountMap>;
};

const cache = new AsyncCache<CacheValue>();

function getCacheKey(publicKey: PublicKey) {
  return 'fetch' + publicKey.toBase58();
}

const NOT_CONNECTED_CACHE_KEY = 'notConnected';

export interface UseUser {
  useAsyncStandardTokenAccounts: (maxAge?: number) => AsyncResult<UserTokenAccountMap>;
  getAsyncUserTokenAccountsLastUpdated(): number | undefined;
  refreshStandardTokenAccounts(): Promise<UserTokenAccountMap | undefined>;
  accountHasNonATAs: boolean;
}

export const useUserInternal = (): UseUser => {
  const { connection, wallet, slot, setSlot } = useSolana();
  const { tokenConfigs, mintToTokenName } = useConfig();
  const { token: tokenProgramId } = useProgramIds();
  const [accountHasNonATAs, setAccountHasNonATAs] = useState(false);

  function getAsyncUserTokenAccountsLastUpdated(): number | undefined {
    const cacheKey = wallet ? getCacheKey(wallet.publicKey) : NOT_CONNECTED_CACHE_KEY;

    return cache.getLastUpdate(cacheKey);
  }

  function useAsyncUserTokenAccounts(maxAge: number) {
    let cacheKey, poll;

    if (wallet) {
      cacheKey = getCacheKey(wallet.publicKey);
      poll = true;
    } else {
      cacheKey = NOT_CONNECTED_CACHE_KEY;
      poll = false;
    }

    return cache.useAsync(cacheKey, asyncTokenAccountsFn, maxAge, poll);
  }

  const asyncTokenAccountsFn = async (): Promise<CacheValue> => {
    if (!wallet) {
      return {
        standardTokenAccounts: createAsyncSuccess({}),
      };
    }

    const { tokenAccounts, hasNonATAs } = await loadTokenAccounts(
      connection,
      slot,
      setSlot,
      wallet.publicKey,
      tokenProgramId,
      tokenConfigs['SOL'].mint,
      mintToTokenName,
    );

    setAccountHasNonATAs(hasNonATAs);

    function filterTokenAccountsByType(configs: TokenConfigs): UserTokenAccountMap {
      return Object.fromEntries(
        Object.entries(tokenAccounts).filter(([tokenName, _]) => configs.hasOwnProperty(tokenName)),
      );
    }

    const standardTokenAccounts = filterTokenAccountsByType(tokenConfigs);

    return {
      standardTokenAccounts: createAsyncSuccess(standardTokenAccounts),
    };
  };

  function useAsyncStandardTokenAccounts(maxAge = DEFAULT_MAX_AGE) {
    const asyncResult = useAsyncUserTokenAccounts(maxAge);

    if (!asyncResult.value) {
      return asyncResult;
    }

    return asyncResult.value.standardTokenAccounts;
  }

  async function refreshStandardTokenAccounts(): Promise<UserTokenAccountMap | undefined> {
    const cacheKey = wallet ? getCacheKey(wallet.publicKey) : NOT_CONNECTED_CACHE_KEY;
    const result = await cache.refreshCache(cacheKey);

    return result?.standardTokenAccounts.value;
  }

  return {
    getAsyncUserTokenAccountsLastUpdated,
    useAsyncStandardTokenAccounts,
    refreshStandardTokenAccounts,
    accountHasNonATAs,
  };
};

export const { Provider: UserProvider, useContainer: useUser } = createContainer(useUserInternal);
