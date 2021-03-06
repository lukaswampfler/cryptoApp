//import { gcd } from '../utils/CryptoMath';


export function gcd(a, b) {
    if (b > a) {
        [a, b] = [b, a];
    }
    while (b > 0) {
        [a, b] = [b, a % b];
    }
    return a;
}


export function extendedEuclid(e, f, useBigIntegerLibrary) {
    // uses extended euclid for calculation of decryption exponent d
    let x1 = BigInt(1), x2 = BigInt(0), x3 = BigInt(f), y1 = BigInt(0), y2 = BigInt(1), y3 = BigInt(e);
    let q = BigInt(1);
    while (y3 > 1) {
        if (useBigIntegerLibrary){
            q = BigInt(x3).divide(y3); // big-integer division without BigInt builtin type
        } else {
            q = x3 / y3; // BigInt-Division is integer division
        }
        // check here.
        if (useBigIntegerLibrary){
            [x1, x2, x3, y1, y2, y3] = [y1, y2, y3, x1.subtract(q.multiply(y1)) , x2.subtract(q.multiply(y2)), x3.subtract(q.multiply(y3))];
        }else {
            [x1, x2, x3, y1, y2, y3] = [y1, y2, y3, x1 - q * y1, x2 - q * y2, x3 - q * y3];
        }
        
    }
    if (y3 === BigInt(0)){
        return { 'inverse': undefined, 'gcd': x3 };
    }
    else {        
        return { 'inverse': y2, 'gcd': y3 };
    }
}
// primality test
export function isPrime(n, useBigIntegerLibrary) {
    // returns true if n is probably prime
    const MILLER_RABIN_ITERATIONS = 20;
    if(useBigIntegerLibrary){ // use builtin primality test
        return BigInt(n).isProbablePrime(MILLER_RABIN_ITERATIONS);
    } 
    if (n <= BigInt(1)){
        return false; 
    } else if (n === BigInt(2)){
        return true;
    } else if ( n % BigInt(2) === BigInt(0) ){ // even number larger than 2
        return false;
    } else if (n < 10000) {
        let nNumber = Number(n); // check for odd divisors of a small n -> type number
        for (let divisor = 3; divisor <= Math.pow(nNumber, 0.5); divisor += 2) {
            if (nNumber % divisor == 0){
                return false;
            }
        }
        return true;
    } else {
        return millerRabin(n, MILLER_RABIN_ITERATIONS, useBigIntegerLibrary); // use Miller Rabin for larger numbers 
    }
}

export function generatePrime(exp, useBigIntegerLibrary) {
    // returns a prime number (as string)
    let min = exp < 1 ? 1 : Math.pow(10, exp-1);
    let max = 10 * min;
    let cand = BigInt(Math.floor(Math.max(2, min + Math.random() * (max - min))));
    while (!isPrime(cand, useBigIntegerLibrary)){
        cand++;
    }
    return cand.toString();
}


function decomposeOdd(n) {
    // decomposes an odd number n into n-1 = 2**exp * d, where d is odd
    for (var j = 0, d = n - BigInt(1); d % BigInt(2) === BigInt(0); j++) {
        d = d / BigInt(2);
    }
    return { exponent: BigInt(j), odd: d };
}

export function smartExponentiation(base, exp, m, useBigIntegerLibrary) {
    // calculates the power base**exp mod m efficiently
    // takes three inputs: all of them are BigInts

    // 1) calculate binary rep of exponent, but in REVERSED ORDER
    if(useBigIntegerLibrary){
        base = BigInt(base)
        exp = BigInt(exp)
        m = BigInt(m)
    }
    var binExponent = '';
    while (exp > 0) {
        if(!useBigIntegerLibrary){
            binExponent = binExponent + exp % BigInt(2);
            exp = exp / BigInt(2);
        } else {
            binExponent = binExponent + exp.divmod(2).remainder;
            exp = exp.divide(2);
        }
    }
    // 2) calculate squares, include in result if needed (ie if corresponding bit equals 1)
    let res = BigInt(1);
    for (let i = 0; i < binExponent.length; i++) {
        if (binExponent.charAt(i) == '1') {
            if(!useBigIntegerLibrary) {res = BigInt((res * base)) % m;}
            else {res = BigInt(res).multiply(BigInt(base)).divmod(m).remainder;}
        }
        if(!useBigIntegerLibrary) {base = BigInt((base * base)) % m;
        } else {
            base = BigInt(base).pow(2).divmod(m).remainder;
        }
    }
    return res.toString();
}

function conditionMillerRabin(base, n, odd, exp, useBigIntegerLibrary) {
    // checks whether the necessary condition for prime numbers is fulfilled
    var pow = smartExponentiation(base, odd, n, useBigIntegerLibrary);
    pow = BigInt(pow);
    if (pow == BigInt(1) || pow == n - BigInt(1)) {
        return true;
    }
    else {
        for (let i = 0; i < exp; i++) {
            pow = smartExponentiation(BigInt(pow), BigInt(2), n, useBigIntegerLibrary);
            if (BigInt(pow) === n - BigInt(1))
                return true;
        }
        return false;
    }
}
function millerRabin(n, millerRabinIterations, useBigIntegerLibrary) {
    // extract properties of return value
    const { exponent, odd } = decomposeOdd(n);
    const listOfResults = [];
    const listOfCandidates = [];
    const numberOfCandidates = millerRabinIterations;
    var cand = BigInt(2);
    while (listOfCandidates.length < numberOfCandidates) {
        // choose a new candidate 
        while (listOfCandidates.includes(cand)) {
            cand = BigInt(Math.floor(Math.random() * (Number(n) - 3) + 1));
        }
        listOfCandidates.push(cand);
        listOfResults.push(conditionMillerRabin(cand, n, odd, exponent, useBigIntegerLibrary));
    }
    return listOfResults.every(x => x == true);
}


export function calculatePubExp(phi){
    let cand = 2;
        while (gcd(cand, phi) > 1){
          cand += 1
        }
    return cand.toString()
}

export function calculateKeyPair(p, q, useBigIntegerLibrary) {
    let phi, n; 
    if(useBigIntegerLibrary){
        const num1 = BigInt(p).subtract(1);
        const num2 = BigInt(q).subtract(1);
        phi = num1.multiply(num2);
        n = BigInt(p).multiply(BigInt(q))
    } else {
        phi = (BigInt(p) - BigInt(1)) * (BigInt(q) - BigInt(1));
        n = (BigInt(p) * BigInt(q)).toString();
    }
    const expPublic = phi > Math.pow(2, 16) ?  (Math.pow(2, 16) + 1).toString() : calculatePubExp(Number(phi))
    let { inverse, gcd } = extendedEuclid(BigInt(expPublic), phi, useBigIntegerLibrary);
    if (inverse === undefined) {
        console.log("Not possible to determine private Key: " + "public" + pubKey.exp + "phi: " + phi);
    } else if ((useBigIntegerLibrary && inverse.lesser(0)) || (!useBigIntegerLibrary && inverse < 0)) {
        if (useBigIntegerLibrary){
                inverse = inverse.add(phi)
        } else {
            inverse += phi;
        }
    } else if (gcd != BigInt(1)) {
        console.log("GCD not equal to 1");
    } 
    const keys = {private: {exp: inverse.toString(), mod: n}, public: {exp: expPublic, mod: n}}
    return keys;
            
 }

 export function generateDummyKeys(useBigIntegerLibrary) {
    const p = "11"; 
    const q = "17"; 
    const keys = calculateKeyPair(p, q, useBigIntegerLibrary)
    return keys
  }
    

  export function factorize(n, useBigIntegerLibrary){
      // finds two factors of a given number n
      n = BigInt(n);
      if (useBigIntegerLibrary){
        if(n.isEven()){
            return {fac1: "2", fac2: n.divide(2).toString()}
        } else {
                let cand = BigInt(3)
                while ((cand.multiply(cand)).leq(n)){
                    if (n.isDivisibleBy(cand)){
                        return {fac1: cand.toString(), fac2: n.divide(cand).toString()} 
                    }
                    cand = cand.add(BigInt(2))
            }}
        } else {
            if(n % BigInt(2) === BigInt(0)) return {fac1: "2", fac2: (n/BigInt(2)).toString()}
            else {
                let cand = BigInt(3)
                while (cand * cand <= n){
                    if(n % cand === BigInt(0)) return {fac1: cand.toString(), fac2: (n / cand).toString()}
                    cand += BigInt(2)
                }
        }
      }
      return {fac1: "1", fac2: n.toString()}
      
  }

