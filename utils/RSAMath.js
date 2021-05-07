export function extendedEuclid(e, f) {
    // uses extended euclid for calculation of decryption exponent d
    let x1 = BigInt(1), x2 = BigInt(0), x3 = f, y1 = BigInt(0), y2 = BigInt(1), y3 = e;
    while (y3 > 1) {
        let q = x3 / y3; // BigInt-Division is integer division
        [x1, x2, x3, y1, y2, y3] = [y1, y2, y3, x1 - q * y1, x2 - q * y2, x3 - q * y3];
    }
    if (y3 === BigInt(0))
        return { 'inverse': undefined, 'gcd': x3 };
    else
        return { 'inverse': y2, 'gcd': y3 };
}
// primality test
export function isPrime(n) {
    // returns true if n is probably prime 
    if (n <= BigInt(1))
        return false; 
    else if (n === BigInt(2))
        return true;
    else if (n % BigInt(2) === BigInt(0))
        return false;
    else if (n < 10000) {
        let nNumber = Number(n); // check for odd divisors of a small n -> type number
        for (let divisor = 3; divisor <= Math.pow(nNumber, 0.5); divisor += 2) {
            if (nNumber % divisor == 0)
                return false;
        }
        return true;
    }
    else
        return millerRabin(n); // use Miller Rabin for larger numbers
}
export function generatePrime(exp) {
    // returns a prime number (as string)
    let min = Math.pow(10, exp);
    let max = 10 * min;
    let cand = BigInt(Math.floor(Math.max(2, min + Math.random() * (max - min))));
    while (!isPrime(cand)){
        cand++;
    }
    return cand.toString();
}


function decomposeOdd(n) {
    // decomposes an odd number n into n-1 = 2**exp * d, where d is odd
    for (var j = 0, d = n - BigInt(1); d % BigInt(2) === BigInt(0); j++) {
        d = d / BigInt(2);
    }
    return { exponent: j, odd: d };
}
export function smartExponentiation(base, exp, m) {
    // calculates the power base**exp mod m efficiently
    // takes three inputs: all of them are BigInts
    // 1) calculate binary rep of exponent, but in REVERSED ORDER
    var binExponent = '';
    while (exp > 0) {
        binExponent = binExponent + exp % BigInt(2);
        exp = exp / BigInt(2);
    }
    // 2) calculate squares, include in result if needed (ie if corresponding bit equals 1)
    var res = BigInt(1);
    for (let i = 0; i < binExponent.length; i++) {
        if (binExponent.charAt(i) == '1') {
            res = (res * base) % m;
        }
        base = (base * base) % m;
    }
    return res.toString();
}
function conditionMillerRabin(base, n, odd, exp) {
    // checks whether the necessary condition for prime numbers is fulfilled
    var pow = smartExponentiation(base, odd, n);
    if (pow == BigInt(1) || pow == n - BigInt(1)) {
        return true;
    }
    else {
        for (let i = 0; i < exp; i++) {
            pow = smartExponentiation(pow, BigInt(2), n);
            if (pow == n - BigInt(1))
                return true;
        }
        return false;
    }
}
function millerRabin(n) {
    // extract properties of return value
    const { exponent, odd } = decomposeOdd(n);
    const listOfResults = [];
    const listOfCandidates = [];
    const numberOfCandidates = 50;
    var cand = BigInt(2);
    while (listOfCandidates.length < numberOfCandidates) {
        // choose a new candidate 
        while (listOfCandidates.includes(cand)) {
            cand = BigInt(Math.floor(Math.random() * (Number(n) - 3) + 1));
        }
        listOfCandidates.push(cand);
        listOfResults.push(conditionMillerRabin(cand, n, odd, exponent));
    }
    return listOfResults.every(x => x == true);
}


