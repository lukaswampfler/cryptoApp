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
      sent
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
          createdAt
          updatedAt
        }
        receiver {
          id
          name
          publicKeyID
          createdAt
          updatedAt
          publicKey {
          id
          exponent
          modulus
          createdAt
          updatedAt
        }
        }
        text
        sent
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
export const getKey = /* GraphQL */ `
  query GetKey($id: ID!) {
    getKey(id: $id) {
      id
      exponent
      modulus
      createdAt
      updatedAt
    }
  }
`;
export const listKeys = /* GraphQL */ `
  query ListKeys(
    $filter: ModelKeyFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listKeys(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        exponent
        modulus
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
          createdAt
          updatedAt
        }
        receiver {
          id
          name
          publicKeyID
          createdAt
          updatedAt
        }
        text
        sent
        method
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const messagesBySent = /* GraphQL */ `
  query MessagesBySent(
    $sent: String
    $createdAt: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelMessageFilterInput
    $limit: Int
    $nextToken: String
  ) {
    messagesBySent(
      sent: $sent
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
          createdAt
          updatedAt
        }
        receiver {
          id
          name
          publicKeyID
          createdAt
          updatedAt
        }
        text
        sent
        method
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const messagesBySentTest = /* GraphQL */ `
  query MessagesBySentTest(
    $id: ID
    $createdAt: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelMessageFilterInput
    $limit: Int
    $nextToken: String
  ) {
    messagesBySentTest(
      id: $id
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
          createdAt
          updatedAt
        }
        receiver {
          id
          name
          publicKeyID
          createdAt
          updatedAt
        }
        text
        sent
        method
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
