import { cacheService, faker } from '@example/shared';
import { mock } from '@example/shared/_tests';

import type { UserNetworkSources, UserNetworkSourcesDTO } from '../../sources';
import { makeFakeSourceRes } from '../../sources';

import { UserRepository } from './UserRepository';

describe('UserRepository', () => {
  it('getFullInfoQuery склеивает person info и contacts', async () => {
    const personDataStub: UserNetworkSourcesDTO.PersonDTO = {
      name: faker.person.firstName(),
      surname: faker.person.lastName(),
      displayName: faker.person.fullName(),
    };
    const contactDataStub: UserNetworkSourcesDTO.ContactDTO = {
      email: faker.internet.email(),
      phone: faker.phone.number(),
    };

    const userSourcesStub = mock<UserNetworkSources>({
      getContactInfo: async () => makeFakeSourceRes(contactDataStub),
      getPersonInfo: async () => makeFakeSourceRes(personDataStub),
    });

    const sut = new UserRepository(userSourcesStub, cacheService);

    const user = await sut.getFullInfoQuery().async();

    expect(user).toEqual({
      name: personDataStub.name,
      surname: personDataStub.surname,
      displayName: personDataStub.displayName,
      email: contactDataStub.email,
      phone: contactDataStub.phone,
    });
  });
});
