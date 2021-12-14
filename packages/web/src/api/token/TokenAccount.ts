import { PublicKey } from '@solana/web3.js';
import type BN from 'bn.js';
import { Decimal } from 'decimal.js';

import { toDecimal } from 'utils/amount';

import type { SerializableToken } from './Token';
import { Token } from './Token';

export type SerializableTokenAccount = {
  mint: SerializableToken;
  owner: string;
  address: string;
  balance: string;
  isDerivable: boolean;
  lastUpdatedSlot?: number;
  previous?: SerializableTokenAccount;
};

export class TokenAccount {
  readonly mint: Token;

  readonly owner: PublicKey;

  readonly address: PublicKey;

  readonly balance: Decimal;

  readonly isDerivable: boolean;

  constructor(
    mint: Token,
    owner: PublicKey,
    address: PublicKey,
    balance: number | BN | Decimal,
    isDerivable = false,
  ) {
    this.mint = mint;
    this.owner = owner;
    this.address = address;
    this.balance = toDecimal(balance);
    this.isDerivable = isDerivable;
  }

  // matchToken(token: Token): boolean {
  //   return this.mint.equals(token);
  // }

  // sameToken(other: TokenAccount): boolean {
  //   return this.mint.equals(other.mint);
  // }

  // isAccountFor(tokens: Array<Token>): boolean {
  //   return includes(this.mint, tokens);
  // }

  // matchOwner(owner: PublicKey): boolean {
  //   return this.owner.equals(owner);
  // }

  /**
   * Return the proportion of the total supply of the token
   * that this token account controls, as a number between 0 and 1
   * with 5 decimal places of precision
   */
  // proportionOfTotalSupply(): number {
  //   if (this.mint.supply.equals(0)) {
  //     return 0;
  //   }
  //
  //   const precision = 5;
  //   const scaling = new Decimal(10).pow(new Decimal(precision));
  //   return this.balance.mul(scaling).div(this.mint.supply).toNumber() / scaling.toNumber();
  // }

  toString(): string {
    return `Account with token: ${this.mint.toString()}. Address: ${this.address.toBase58()}. Balance: ${
      this.balance
    }`;
  }

  serialize(): SerializableTokenAccount {
    return {
      mint: this.mint.serialize(),
      owner: this.owner.toBase58(),
      address: this.address.toBase58(),
      balance: this.balance.toString(),
      isDerivable: this.isDerivable,
    };
  }

  equals(other: TokenAccount): boolean {
    return this.address.equals(other.address);
  }

  static from(serializableTokenAccount: SerializableTokenAccount): TokenAccount {
    return new TokenAccount(
      Token.from(serializableTokenAccount.mint),
      new PublicKey(serializableTokenAccount.owner),
      new PublicKey(serializableTokenAccount.address),
      new Decimal(serializableTokenAccount.balance),
      serializableTokenAccount.isDerivable,
    );
  }
}
