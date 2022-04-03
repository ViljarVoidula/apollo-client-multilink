![](https://img.shields.io/badge/Coverage-89%25-83A603.svg?prefix=$coverage$)

# apollo-client-multilink

A minimal setup of an interface around Apollo HttpLink to route requests to multiple GraphQL API's .

## Purpose

In modern times , sometimes multiple graphql endpoints are exposed especially in microservice world . In some cases schema stitching or Apollo federation is not possible cause of the latency introduced or cause of difference of GraphQL server implementation. So frontend has todo some heavy lifting.

## Ceveats

- Does not cover subscriptions cause various GraphQL server implementations might use different websocket implementation
- Does not support mechanism for namespacing schemas and types, its antipattern to have conflicting type definitions in backend (having same naming but different props) - this should be addressed in backend

## Credits:

- [Habx](https://github.com/habx/apollo-multi-endpoint-link#readme), original and much more feature rich solution is available however it is heavily reliant on Apollo Server backend - I removed majority of unstable and incompatible features to have minimal clean library for personal goals.
