import { makeAutoObservable } from 'mobx';

import type { CartRepository } from '@example/data';
import { cartRepository as cartRepositoryInstance } from '@example/data';
import { notify } from '@example/shared';

export class CartStore {
  /**
   * Счетчик товаров, позволяющий показать нужную цифру до того, как данные отправятся на бэк
   */
  private optimisticCount: number = 0;

  constructor(
    private readonly cartRepository: CartRepository,
    private readonly notifyService: typeof notify,
  ) {
    makeAutoObservable(this);
  }

  private get goodsQuery() {
    return this.cartRepository.getGoodsQuery();
  }

  private get goodsCountQuery() {
    return this.cartRepository.getGoodsCountQuery();
  }

  public get count() {
    // позволяет увеличить счетчик до того, как инфа успешно сохраниться на бэк
    if (this.optimisticCount !== this.goodsCountQuery.data) {
      return this.optimisticCount;
    }

    return this.goodsCountQuery.data;
  }

  public get goods() {
    return this.goodsQuery.data || [];
  }

  public addGoods = (goodsID: string[]) => {
    this.optimisticCount = this.optimisticCount + goodsID.length;

    this.cartRepository.addGoods(goodsID).catch((err: Error) => {
      this.notifyService.error(err.message);
      // откат изменений
      this.optimisticCount = this.optimisticCount - goodsID.length;
    });
  };

  public removeGoods = (goodsID: string[]) => {
    this.optimisticCount = this.optimisticCount - goodsID.length;

    this.cartRepository.removeGoods(goodsID).catch((err: Error) => {
      this.notifyService.error(err.message);
      // откат изменений
      this.optimisticCount = this.optimisticCount + goodsID.length;
    });
  };
}

export const cartStore = new CartStore(cartRepositoryInstance, notify);
