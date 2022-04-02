import { ApolloLink } from '@apollo/client/core';

declare module MultiLink {
  export type DefaultEndpoints = Record<
    string,
    {
      uri: string;
    }
  >;

  export interface APILinkConfig<Endpoints extends DefaultEndpoints> {
    /**
     * Dictionary of your endpoints.
     * Keys will be used as name identifier in the `@service` directive
     */
    endpoints: DefaultEndpoints;
    /**
     * Optional default endpoint to fallback to if no `@service` directive is explicitly provided
     */
    defaultEndpoint: Extract<keyof Endpoints, string>;
    /**
     * Init http apollo link
     */
    createHttpLink: () => ApolloLink;
    /**
     * Init websocket apollo link
     * @param endpoint
     */
    /**
     * Suffix to add to your endpoint for http calls
     */
    getContext?: (endpoint: string, getCurrentContext: () => Record<string, any>) => Record<string, any>;
  }
}

export default MultiLink;
