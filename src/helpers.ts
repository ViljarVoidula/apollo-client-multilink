import { Operation } from '@apollo/client/core';
import { OperationDefinitionNode, StringValueNode } from 'graphql';

export const getDirectiveArgumentValueFromOperation = (
  operation: Operation,
  directiveName: string,
  argumentName: string,
) =>
  (
    (
      operation.query.definitions.find(
        (definition) => definition.kind === 'OperationDefinition',
      ) as OperationDefinitionNode
    )?.directives
      ?.find((directive) => directive.name?.value === directiveName)
      ?.arguments?.find((argument) => argument.name?.value === argumentName)?.value as StringValueNode
  )?.value;
