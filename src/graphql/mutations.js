/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createMessage = /* GraphQL */ `
  mutation CreateMessage(
    $input: CreateMessageInput!
    $condition: ModelMessageConditionInput
  ) {
    createMessage(input: $input, condition: $condition) {
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
        privateKey {
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
export const updateMessage = /* GraphQL */ `
  mutation UpdateMessage(
    $input: UpdateMessageInput!
    $condition: ModelMessageConditionInput
  ) {
    updateMessage(input: $input, condition: $condition) {
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
        privateKey {
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
        privateKey {
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
export const deleteMessage = /* GraphQL */ `
  mutation DeleteMessage(
    $input: DeleteMessageInput!
    $condition: ModelMessageConditionInput
  ) {
    deleteMessage(input: $input, condition: $condition) {
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
        privateKey {
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
        privateKey {
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
export const createUser = /* GraphQL */ `
  mutation CreateUser(
    $input: CreateUserInput!
    $condition: ModelUserConditionInput
  ) {
    createUser(input: $input, condition: $condition) {
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
      privateKey {
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
export const updateUser = /* GraphQL */ `
  mutation UpdateUser(
    $input: UpdateUserInput!
    $condition: ModelUserConditionInput
  ) {
    updateUser(input: $input, condition: $condition) {
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
      privateKey {
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
export const deleteUser = /* GraphQL */ `
  mutation DeleteUser(
    $input: DeleteUserInput!
    $condition: ModelUserConditionInput
  ) {
    deleteUser(input: $input, condition: $condition) {
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
      privateKey {
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
export const createKey = /* GraphQL */ `
  mutation CreateKey(
    $input: CreateKeyInput!
    $condition: ModelKeyConditionInput
  ) {
    createKey(input: $input, condition: $condition) {
      id
      exponent
      modulus
      createdAt
      updatedAt
    }
  }
`;
export const updateKey = /* GraphQL */ `
  mutation UpdateKey(
    $input: UpdateKeyInput!
    $condition: ModelKeyConditionInput
  ) {
    updateKey(input: $input, condition: $condition) {
      id
      exponent
      modulus
      createdAt
      updatedAt
    }
  }
`;
export const deleteKey = /* GraphQL */ `
  mutation DeleteKey(
    $input: DeleteKeyInput!
    $condition: ModelKeyConditionInput
  ) {
    deleteKey(input: $input, condition: $condition) {
      id
      exponent
      modulus
      createdAt
      updatedAt
    }
  }
`;
