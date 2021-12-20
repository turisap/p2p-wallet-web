import type { Network, TransactionEnvelope } from "@saberhq/solana-contrib";
import type {
  Commitment,
  KeyedAccountInfo,
  PublicKey,
  TransactionSignature,
} from "@solana/web3.js";

import type { TransactionErrorType } from "./categorizeTransactionError";
import { categorizeTransactionError } from "./categorizeTransactionError";

export type SailErrorName = `Sail${
  | "UnknownTXFail"
  | "Transaction"
  | "InsufficientSOL"
  | "RefetchAfterTX"
  | "RefetchSubscriptions"
  | "TransactionSign"
  | "AccountsCacheRefetch"
  | "TransactionsCacheRefetch"
  | "AccountParse"
  | "AccountLoad"
  | "TransactionLoad"
  | "GetMultipleTransactions"
  | "GetMultipleAccounts"}Error`;

export const ERROR_TITLES: { [N in SailErrorName]: string } = {
  SailUnknownTXFailError: "Transaction failed",
  SailTransactionError: "Transaction processing failed",
  SailInsufficientSOLError: "Insufficient SOL balance",
  SailRefetchAfterTXError: "Error fetching changed accounts",
  SailRefetchSubscriptionsError: "Error refetching subscribed accounts",
  SailTransactionSignError: "Error signing transactions",
  SailAccountsCacheRefetchError: "Error accounts refetching from cache",
  SailTransactionsCacheRefetchError: "Error transactions refetching from cache",
  SailAccountParseError: "Error parsing account",
  SailAccountLoadError: "Error loading account",
  SailTransactionLoadError: "Error loading transaction",
  SailGetMultipleAccountsError: "Error fetching multiple accounts",
  SailGetMultipleTransactionsError: "Error fetching multiple transactions",
};

/**
 * Extracts the message from an error.
 * @param errLike Error-like object.
 * @returns
 */
export const extractErrorMessage = (errLike: unknown): string | null => {
  return "message" in (errLike as { message?: string })
    ? (errLike as { message?: string }).message ?? null
    : null;
};

/**
 * Error originating from Sail.
 */
export class SailError extends Error {
  _isSailError = true;

  constructor(
    /**
     * Name of the Sail error.
     */
    public readonly sailErrorName: SailErrorName,
    /**
     * The original error thrown, if applicable.
     */
    public readonly originalError: unknown,
    /**
     * Underlying error message.
     */
    public readonly cause = `${extractErrorMessage(originalError) ?? "unknown"}`
  ) {
    super(`${ERROR_TITLES[sailErrorName]}: ${cause}`);
    this.name = sailErrorName;
    if (originalError instanceof Error) {
      this.stack = originalError.stack;
    }
  }

  /**
   * Title of the error.
   */
  get title(): string {
    return ERROR_TITLES[this.sailErrorName];
  }
}

/**
 * Error originating from Sail.
 */
export class SailUnknownTXFailError extends SailError {
  constructor(
    originalError: unknown,
    public readonly network: Network,
    public readonly txs: readonly TransactionEnvelope[]
  ) {
    super("SailUnknownTXFailError", originalError);
  }
}

/**
 * Error on a Solana transaction
 */
export class SailTransactionError extends SailError {
  constructor(
    public readonly network: Network,
    originalError: unknown,
    public readonly tx: TransactionEnvelope,
    /**
     * User message representing the transaction.
     */
    public readonly userMessage?: string
  ) {
    super("SailTransactionError", originalError);
  }

  /**
   * Tag used for grouping errors together.
   */
  get tag(): TransactionErrorType | null {
    return categorizeTransactionError(this.message);
  }

  /**
   * Returns true if this error is associated with a simulation.
   */
  get isSimulation(): boolean {
    return this.message.includes("Transaction simulation failed: ");
  }

  /**
   * Fingerprint used for grouping errors.
   */
  get fingerprint(): string[] {
    const tag = this.tag;
    if (tag) {
      return [this.name, tag];
    }
    return [this.name, ...this.message.split(": ")];
  }

  /**
   * Generates a debug string representation of the transactions involved in this error.
   * @param network
   * @returns
   */
  generateLogMessage(): string {
    const parts = [this.tx.debugStr];
    if (this.network !== "localnet") {
      parts.push(
        `View on Solana Explorer: ${this.tx.generateInspectLink(this.network)}`
      );
    }
    return parts.join("\n");
  }
}

/**
 * Thrown if there is not enough SOL to pay for a transaction.
 */
export class InsufficientSOLError extends SailError {
  constructor(public readonly currentBalance?: number) {
    super("SailInsufficientSOLError", null, "Insufficient SOL balance");
  }
}

/**
 * Thrown if there is an error refetching accounts after a transaction.
 */
export class SailRefetchAfterTXError extends SailError {
  constructor(
    originalError: unknown,
    public readonly writable: readonly PublicKey[],
    public readonly txSigs: readonly TransactionSignature[]
  ) {
    super("SailRefetchAfterTXError", originalError);
  }
}

/**
 * Thrown if an error occurs when refetching subscriptions.
 */
export class SailRefetchSubscriptionsError extends SailError {
  constructor(originalError: unknown) {
    super("SailRefetchSubscriptionsError", originalError);
  }
}

/**
 * Thrown if transactions could not be signed.
 */
export class SailTransactionSignError extends SailError {
  constructor(
    originalError: unknown,
    public readonly txs: readonly TransactionEnvelope[]
  ) {
    super("SailTransactionSignError", originalError);
  }
}

/**
 * Thrown if a cache refetch results in an error.
 */
export class SailAccountsCacheRefetchError extends SailError {
  constructor(
    originalError: unknown,
    public readonly keys: readonly (PublicKey | null | undefined)[]
  ) {
    super("SailAccountsCacheRefetchError", originalError);
  }
}

/**
 * Thrown if a cache refetch results in an error.
 */
export class SailTransactionsCacheRefetchError extends SailError {
  constructor(
    originalError: unknown,
    public readonly keys: readonly (string | null | undefined)[]
  ) {
    super("SailTransactionsCacheRefetchError", originalError);
  }
}

/**
 * Thrown if there is an error parsing an account.
 */
export class SailAccountParseError extends SailError {
  constructor(originalError: unknown, public readonly data: KeyedAccountInfo) {
    super("SailAccountParseError", originalError);
  }
}

/**
 * Thrown if an account could not be loaded.
 */
export class SailAccountLoadError extends SailError {
  constructor(originalError: unknown, public readonly accountId: PublicKey) {
    super("SailAccountLoadError", originalError);
  }

  get userMessage(): string {
    return `Error loading account ${this.accountId.toString()}`;
  }
}

/**
 * Thrown if an account could not be loaded.
 */
export class SailTransactionLoadError extends SailError {
  constructor(originalError: unknown, public readonly transactionId: string) {
    super("SailTransactionLoadError", originalError);
  }

  get userMessage(): string {
    return `Error loading transaction ${this.transactionId}`;
  }
}

/**
 * Callback called whenever getMultipleAccounts fails.
 */
export class SailGetMultipleAccountsError extends SailError {
  constructor(
    public readonly keys: readonly PublicKey[],
    public readonly commitment: Commitment,
    originalError: unknown
  ) {
    super("SailGetMultipleAccountsError", originalError);
  }
}

/**
 * Callback called whenever getMultipleTransactions fails.
 */
export class SailGetMultipleTransactionsError extends SailError {
  constructor(
    public readonly keys: readonly string[],
    public readonly commitment: Commitment,
    originalError: unknown
  ) {
    super("SailGetMultipleTransactionsError", originalError);
  }
}
