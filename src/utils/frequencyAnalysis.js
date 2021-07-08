export function createFrequencyDict(s, dist = 1) {
    const parts = createParts(s, dist);
    let allDics = {};
    let d = {};
    for (let i = 0; i < parts.length; i++) {
        for (let char of parts[i].split('')) {
            if (char != ' ') {
                if (char in d) {
                    d[char]++;
                }
                else {
                    d[char] = 1;
                }
            }
        }
        allDics[i] = d;
        console.log(d);
        d = {};
    }
    return allDics;
}
function createParts(s, dist = 1) {
    let parts = [];
    for (let j = 0; j < dist; j++) {
        let part = '';
        for (let i = j; i < s.length; i += dist) {
            part = part.concat(s.charAt(i));
        }
        parts.push(part.toLowerCase());
    }
    console.log(parts);
    return parts;
}