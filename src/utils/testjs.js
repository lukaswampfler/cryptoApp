
function kasiskiTest(secret, minLength = 3, maxLength = 5) {
    if (secret.length < 6) return 1; 
    // verwende der Einfachheit halber nur das aktuelle und das letzte Vorkommen einer Zeichenkette der Länge len
    let posDiff = [];
    let s = secret.toLowerCase().replace(/\s/g, ''); // remove all whitespace from secret
    console.log("s : ",s)
    for (let len = minLength; len <= maxLength; len++) {
        for (let start = 0; start < s.length - len; start++) {
            let part = s.substr(start, len);
            let lastPos = s.lastIndexOf(part);
            if (lastPos != start) {
                //console.log(part, lastPos-start);
                posDiff.push(lastPos - start);
            }
        }
        // starting from length = 3 up to 5: 
        // let part = str.substr(start, len)
        // let nextPos = str.indexOf(part) ODER str.lastIndexOf
    }
    const gcd = gcdArray(posDiff);
    console.log("gcd: ", gcd);
    if (posDiff.length == 0) {
        return kasiskiTest(secret, minLength - 1, minLength - 1);
    }
    else if (gcd == 1)
        return kasiskiTest(secret, minLength + 1, maxLength + 1);
    return gcd;
}

function gcdArray(a) {
    if (a.length == 0)
        return 1;
    else if (a.length == 1)
        return a[0];
    else if (a.length == 2)
        return gcd(a[0], a[1]);
    else {
        return gcd(a[0], gcdArray(a.slice(1)));
    }
}




function testForEqualParts(s, minLength, maxLength){
    //const NUM_DIFFERENT_PARTS = 5
    let result = []
    for (let len = maxLength; len >= minLength; len--) {
        for (let start = 0; start < s.length - len; start = start + len) {
            let part = s.substr(start, len);
            //console.log(part)
            let lastPos = s.lastIndexOf(part);
            if (lastPos != start && !(result.hasOwnProperty(part)) && !isSubstringOf(part, Object.keys(result)) ) {
                //console.log(part, lastPos-start);
                result.push({fragment: part , posDiff:  lastPos - start});
                //console.log(result)
                /*if ( Object.entries(result).length == NUM_DIFFERENT_PARTS){
                    return result;
                }*/
            } 
        }
    }
    console.log("result of test for equal parts: ", result)
    return result;
}

function isSubstringOf(part, arrayOfWholes){
    for (let ind = 0 ; ind < arrayOfWholes.length; ind++){
        if (arrayOfWholes[ind].includes(part)) return true; 
    }
    return false; 
}



const secret = "lukaslukaswampflerwampfler"


const minl = 2
const maxl = 3
testForEqualParts(secret, 4, 6);


function gcd(a, b) {
    if (b > a) {
        [a, b] = [b, a];
    }
    while (b > 0) {
        [a, b] = [b, a % b];
    }
    return a;
}

function calculatePubExp(phi){
    let cand = 2
    while (gcd(cand, phi) > 1){
            console.log(cand)
          cand += 1
        }
    return cand.toString()
}

/*for(let c = 0; c< 256; c++){
    let code = c
    if (code<32) {code+= 256}
    else if (127 <= code && code <= 160) {code+= 192}
    else if (code == 173) {code = 295}
    console.log(c, String.fromCharCode(code))
}*/

let s= "abdchjkldsfAvhjavd0lc"
let re = /^[a-zA-Z]*$/

console.log(re.test(s))

console.log(BigInt('10111111111111111111111111111', 2))