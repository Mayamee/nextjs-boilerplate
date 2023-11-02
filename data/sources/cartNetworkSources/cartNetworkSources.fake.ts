import { faker } from '@example/shared';

import { makeFakeSourceRes } from '../utils';

import { CartNetworkSources, cartNetworkSources } from './cartNetworkSources';
import { CartNetworkSourcesDTO } from './dto';

export const cartNetworkSourcesFaker = {
  makeGoodsList: (length: number = 10): CartNetworkSourcesDTO.CartGoodsDTO => ({
    data: Array.from({ length }).map(() => ({
      name: faker.commerce.productName(),
      id: faker.string.uuid(),
      price: faker.number.int(100000),
      count: faker.number.int(5),
    })),
  }),
};

export const fakeCartNetworkSources: CartNetworkSources = {
  ...cartNetworkSources,
  getGoods: async () =>
    makeFakeSourceRes(cartNetworkSourcesFaker.makeGoodsList()),
  getGoodsCount: async () => makeFakeSourceRes(10),
};
