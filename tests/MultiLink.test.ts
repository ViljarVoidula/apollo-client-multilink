import { ApolloLink, createHttpLink, execute, gql, toPromise } from '@apollo/client/core';
import { MultiAPILink } from '../src';
// import { RestLink } from 'apollo-link-rest';
import fetchMock from 'jest-fetch-mock';
fetchMock.enableMocks();

describe('Apollo Multilink tests', () => {
  const endpoints = {
    v1: {
      uri: 'http://localhost:4000/v1',
      response: {
        __typename: 'v1:Project',
      },
    },
    v2: {
      uri: 'http://localhost:4000/v2',
      response: {
        __typename: 'v2:Project',
      },
    },
    '/graphql': {
      uri: '/graphql',
      response: {
        errors: [
          {
            message: 'No endpoint found for @service(name: "v3")',
            locations: [{ line: 1, column: 1 }],
            path: ['query'],
          },
        ],
      },
    },
  };
  beforeEach(() => {
    fetchMock.mockResponse((req) => {
      const data = Object.values(endpoints).find((config) => {
        const test = req.url;
        return config.uri === req.url;
      })?.response;
      if (req.headers.get('authorization')) {
        return Promise.resolve(JSON.stringify({ data, authorization: req.headers.get('authorization') }));
      }
      return Promise.resolve(JSON.stringify({ data }));
    });
  });

  it('Should route request to correct endpoint', async () => {
    const link = new MultiAPILink({
      endpoints,
      defaultEndpoint: 'v1',
      createHttpLink: () => createHttpLink(),
    });
    expect(
      await toPromise(
        execute(link, {
          query: gql`
            query @service(name: "v1") {
              queryToB {
                data
              }
            }
          `,
        }),
      ),
    ).toEqual({ data: { __typename: 'v1:Project' } });
  });

  it('Should route request to default endpoint if no @service directive is provided', async () => {
    const link = new MultiAPILink({
      endpoints,
      defaultEndpoint: 'v1',
      createHttpLink: () => createHttpLink(),
    });
    expect(
      await toPromise(
        execute(link, {
          query: gql`
            query {
              queryToB {
                data
              }
            }
          `,
        }),
      ),
    ).toEqual({ data: { __typename: 'v1:Project' } });
  });

  it('Should throw an error if no endpoint is found', async () => {
    const link = new MultiAPILink({
      endpoints,
      defaultEndpoint: 'v1',
      createHttpLink: () => createHttpLink(),
    });
    expect(
      await toPromise(
        execute(link, {
          query: gql`
            query @service(name: "v3") {
              queryToB {
                data
              }
            }
          `,
        }),
      ),
    ).toEqual({
      data: {
        errors: [
          {
            message: 'No endpoint found for @service(name: "v3")',
            locations: [{ line: 1, column: 1 }],
            path: ['query'],
          },
        ],
      },
    });
  });

  it('Should add headers to context using getContext', async () => {
    const link = new MultiAPILink({
      endpoints,
      defaultEndpoint: 'v1',
      createHttpLink: () => createHttpLink(),
      getContext: (_, getCurrentContext) => ({
        headers: {
          Authorization: 'Bearer 123',
        },
        ...getCurrentContext(),
      }),
    });
    expect(
      await toPromise(
        execute(link, {
          query: gql`
            query {
              queryToB {
                data
              }
            }
          `,
        }),
      ),
    ).toEqual({ data: { __typename: 'v1:Project' }, authorization: 'Bearer 123' });
  });
});
