import { ApolloLink, NextLink, Operation, RequestHandler } from '@apollo/client/core';
import { hasDirectives, removeDirectivesFromDocument } from '@apollo/client/utilities';
import MultiLink from '../@types';
import { getDirectiveArgumentValueFromOperation } from './helpers';

export class MultiAPILink<Endpoints extends MultiLink.DefaultEndpoints = MultiLink.DefaultEndpoints> extends ApolloLink {
  httpLink: ApolloLink;
  config: MultiLink.APILinkConfig<Endpoints>;

  constructor(config: MultiLink.APILinkConfig<Endpoints>, request?: RequestHandler) {
    super(request);
    this.config = config;
    this.httpLink = config.createHttpLink();
  }

  public request(operation: Operation, forward?: NextLink) {
    if (
      (!hasDirectives(['service'], operation.query) && !this.config.defaultEndpoint) ||
      hasDirectives(['rest'], operation.query)
    ) {
      return forward?.(operation) ?? null;
    }

    const apiName: string =
      getDirectiveArgumentValueFromOperation(operation, 'service', 'name') ?? this.config.defaultEndpoint;
    const query = removeDirectivesFromDocument([{ name: 'service', remove: true }], operation.query);

    if (!query) {
      throw new Error('Error while removing directive service, missing');
    }

    operation.query = query;
    debugger;

    if (this.config.getContext) {
      operation.setContext(this.config.getContext(apiName, operation.getContext));
    }

    if (this.config.endpoints[apiName]) {
      operation.setContext({
        uri: `${this.config.endpoints[apiName].uri}`,
      });
    }

    const response = this.httpLink.request(operation, forward);

    return response;
  }
}
