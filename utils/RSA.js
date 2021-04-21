import { smartExponentiation } from "./RSAMath.js";

export default class RSA {
    constructor(m, exp, mod) {
        this._message = m;
        this.exp = exp;
        this.mod = mod;
        this.encrypted = '';
    }
    set message(m) {
        this._message = m;
    }
    get message() {
        return this._message.toString();
    }
    set encrypted(e) {
        this.encrypted = e;
    }
    get encrypted() {
        return this.encrypted;
    }

    
    
    encrypt() {
        const mNumber = BigInt(this._message);
        const expNumber = BigInt(this.exp);
        const modNumber = BigInt(this.mod);
        this.encrypted = smartExponentiation(mNumber, expNumber, modNumber).toString();
    }
    
    decrypt() {
        let { exp, mod } = this.privateKey;
        let decryptedBlocks = [];
        for (let block of this._secret) {
            decryptedBlocks.push(smartExponentiation(block, exp, mod));
        }
        this.decryptedMessage = decryptedBlocks;
    }
    static generateRandom(min, max) {
        // returns random value in the interval [min, max] - > only used below 2**16-1
        return Math.floor(min + (max - min) * Math.random());
    }
    
    calculatePrivateKey() {
        let { inverse, gcd } = extendedEuclid(this.publicKey.exp, this.phi);
        if (inverse === undefined)
        // TODO: error messages - throw error
            console.log("Not possible to determine private Key" + "public" + this.publicKey + "phi: " + this.phi);
        else if (gcd != BigInt(1))
            console.log("GCD not equal to 1");
        else {
            if (inverse < 0)
                inverse += this.phi;
            this.privateKey = { exp: inverse, mod: this.n };
            console.log("d = " + inverse + " phi = " + this.phi);
        }
    }
    generatePublicKey() {
        // choose standard value for e if possible
        if (this.phi > Math.pow(2, 16))
            this.publicKey = { exp: BigInt(Math.pow(2, 16) + 1), mod: this.n };
        else {
            let e = this.phi;
            const phiNumber = Number(this.phi);
            while (gcd(phiNumber, Number(e)) > 1)
                e = BigInt(RSA.generateRandom(2, phiNumber - 1));
            this.publicKey = { exp: e, mod: this.n };
        }
    }
}
/*const {p1, p2} = generatePrime(6, 2)
console.log(p1 + ': ' + p2 + ':' + p1*p2);
let r1 = new RSA(String(p1), String(p2), String(311786788));
r1.generatePublicKey();
r1.calculatePrivateKey();
r1.encrypt();
r1.decrypt();
console.log("public: " + r1.publicKey);
console.log("private: "+ r1.privateKey);
console.log(r1.secret);
console.log("message: "+ r1.message);
console.log("decrypted: " +r1.decryptedMessage);
console.log("e: "+r1.publicKey.exp);
console.log("d: " +r1.privateKey.exp)
let ed = (r1.publicKey.exp-BigInt(1))*(r1.privateKey.exp-BigInt(1))
let phi = (p1-BigInt(1))*(p2-BigInt(1))*/
//console.log('ed: ' + ed)
//console.log('phi: '+  phi)
//console.log(ed%phi);
// TODO: hier überprüfen, ob exponenten richtig berechnet werden. 
// encryption und decryption ergibt noch nicht identität!!
