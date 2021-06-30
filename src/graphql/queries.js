/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getMessage = /* GraphQL */ `
  query GetMessage($id: ID!) {
    getMessage(id: $id) {
      id
      senderID
      receiverID
      sender {
        id
        name
        publicKeyID
        privateKeyID
        publicKey {
          id
          exponent
          modulus
          createdAt
          updatedAt
        }
        createdAt
        updatedAt
      }
      receiver {
        id
        name
        publicKeyID
        privateKeyID
        publicKey {
          id
          exponent
          modulus
          createdAt
          updatedAt
        }
        createdAt
        updatedAt
      }
      text
      method
      createdAt
      updatedAt
    }
  }
`;
export const listMessages = /* GraphQL */ `
  query ListMessages(
    $filter: ModelMessageFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listMessages(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        senderID
        receiverID
        sender {
          id
          name
          publicKeyID
          privateKeyID
          createdAt
          updatedAt
        }
        receiver {
          id
          name
          publicKeyID
          privateKeyID
          createdAt
          updatedAt
        }
        text
        method
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getUser = /* GraphQL */ `
  query GetUser($id: ID!) {
    getUser(id: $id) {
      id
      name
      publicKeyID
      privateKeyID
      publicKey {
        id
        exponent
        modulus
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
    }
  }
`;
export const listUsers = /* GraphQL */ `
  query ListUsers(
    $filter: ModelUserFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listUsers(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        publicKeyID
        privateKeyID
        publicKey {
          id
          exponent
          modulus
          createdAt
          updatedAt
        }
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const messagesByReceiver = /* GraphQL */ `
  query MessagesByReceiver(
    $receiverID: ID
    $createdAt: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelMessageFilterInput
    $limit: Int
    $nextToken: String
  ) {
    messagesByReceiver(
      receiverID: $receiverID
      createdAt: $createdAt
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        senderID
        receiverID
        sender {
          id
          name
          publicKeyID
          privateKeyID
          createdAt
          updatedAt
        }
        receiver {
          id
          name
          publicKeyID
          privateKeyID
          createdAt
          updatedAt
        }
        text
        method
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
