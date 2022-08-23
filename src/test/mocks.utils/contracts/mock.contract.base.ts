import { mock } from "jest-mock-extended";

export function mockContract<T>(factory: any) {
  const mockContract = mock<T>();

  // @ts-ignore
  jest.spyOn(factory, 'connect').mockImplementation(() => mockContract);

  return mockContract;
}
