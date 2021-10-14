export const riddlesHomeIntroText = `
SECRET WITH GIVEN CIPHER: choose a method of your liking and solve the riddle\n
SECRET WITH UNKNOWN CIPHER: create a random riddle\n
RANDOM MESSAGE FROM SERVER: download a few of the last sent messages from other people.`


const introTextMethods = "- Caesar, Vigenère, Permutation: hard: you will get fewer characters than easy, extreme: only ASCII-characters and NO WHITE SPACE is shown"
const introSDES = "- SDES easy is just an 8-bit string \n- SDES hard is ONE ASCII-encoded character\n- SDES extreme: a larger text first encoded and then encrypted."
const introRSA = "- RSA easy is the result of the encryption using YOUR public key\n- RSA hard: you will get the public key and the result, primes not larger than 1000\n- RSA extreme: the same with larger primes."

export const riddlesMethodChoiceIntroText = introTextMethods + '\n' + introSDES + '\n' + introRSA;

export const permutationIntroText = `
The key for the permutation method is any reordering of the letters a-z \n
Transposition: changes the position of two random letters in the secret alphabet\n
Shuffle: random ordering of the whole secret alphabet \n
Identity: reset the secret alphabet equal to the clear text alphabet, i.e. Output equals Input.\n
You can see the whole key by sliding left - right.`

export const rsaIntroText = `
A key for the RSA-method consists of two parts: a private key and a public key, each having an exponent and a (common) modulus.\n
Input: Any number which is smaller than the modulus n. \n
GENERATE/USE OWN KEYS: In this screen you can generate a new key pair or import YOUR OWN KEYS \n
IMPORT KEYS: import public keys of other users of the App.
`


export const sdesIntroText = `
ENCODE MESSSAGE: change to the screen where you can write your message and it will be (ASCII-)coded and directly used as input for SDES. Alternatively, you can use any sequence of bits of length 8, 16, 24, ... as input.\n
The key for S-DES is a bit-String of length 10.\n
CALCULATE K1, K2: the two keys (each length 8) will be calculated.\n
RSA ENCRYPT 10-BIT KEY: in a real scenario, the key of the symmetric method would be encrypted using an asymmetric method (i.e. RSA)
`

export const sdesEncodingIntroText = `
Here comes the introduction to S-DES encoding ..., please use only characters from latin-1 encoding, i.e. no emojis
`
