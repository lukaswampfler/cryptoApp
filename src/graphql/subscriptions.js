/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateMessageByReceiverID = /* GraphQL */ `
  subscription OnCreateMessageByReceiverID($receiverID: String!) {
    onCreateMessageByReceiverID(receiverID: $receiverID) {
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
export const onCreateMessage = /* GraphQL */ `
  subscription OnCreateMessage {
    onCreateMessage {
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
export const onUpdateMessage = /* GraphQL */ `
  subscription OnUpdateMessage {
    onUpdateMessage {
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
export const onDeleteMessage = /* GraphQL */ `
  subscription OnDeleteMessage {
    onDeleteMessage {
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
export const onCreateUser = /* GraphQL */ `
  subscription OnCreateUser {
    onCreateUser {
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
export const onUpdateUser = /* GraphQL */ `
  subscription OnUpdateUser {
    onUpdateUser {
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
export const onDeleteUser = /* GraphQL */ `
  subscription OnDeleteUser {
    onDeleteUser {
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
export const onCreateKey = /* GraphQL */ `
  subscription OnCreateKey {
    onCreateKey {
      id
      exponent
      modulus
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateKey = /* GraphQL */ `
  subscription OnUpdateKey {
    onUpdateKey {
      id
      exponent
      modulus
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteKey = /* GraphQL */ `
  subscription OnDeleteKey {
    onDeleteKey {
      id
      exponent
      modulus
      createdAt
      updatedAt
    }
  }
`;
