export default messages = [
    {
        clear: 'Die Schieferindustrie in Wales geht auf die Zeit der Beset­zung Britan­niens durch das Römische Reich zurück. Dach­schin­deln aus Schiefer wurden bereits beim Bau eines römi­schen Lagers in der Nähe des heuti­gen Caernarfon verwen­det. In der Zeit der Indus­triali­sie­rung des 19. Jahr­hun­derts wurden Ab­bau und Verar­bei­tung von Schiefer neben dem Stein­kohlen­berg­bau zum wichtigs­ten Indus­trie­zweig in Wales. Gegen Ende des 19. Jahr­hun­derts lagen die wich­tigs­ten Abbau­regio­nen im nord­west­lichen Wales. Der Penrhyn- und der Dinorwic-Stein­bruch waren zu diesem Zeit­punkt die beiden größten Schiefer­stein­brüche der Welt. Die Oakeley-Mine, in der der Schiefer unter­irdisch abge­baut wurde, war welt­weit die größte Schiefer­mine. Schiefer wurde und wird über­wiegend zum Decken von Dächern, außer­dem als Fuß­boden­belag sowie für Arbeits­platten und Grab­steine genutzt.',
        possibleMethod: ['caesar', 'vigenere', 'permutation'],
        encrypted: [
            {
                method: 'caesar', key: 3, secret: 'blacaesar'
            }, 
            {
                method: 'vigenere', key: 'paris', secret: 'blavigenere'
            }, 
            {
                method: 'permutation', key: 'badcfertgfkjlfhadfjhsfjdhfbvcvjydlfdhs', secret: 'blapermutation'
            }
        ]
    }, 
    {
        clear: 21456, 
        possibleMethod: ['rsa'],
        encrypted: [{
            method: 'rsa', 
            key: {public: {exp: 219, n: 19191278}, private: {exp: 12367, n: 19191278}}, 
            secret: 20999
        }]
    }, 
    {
        clear: '10001000',
        possibleMethod: ['sdes'], 
        encrypted: [
            {
                method: 'sdes', key: '1111100000', secret: '10100011'
            }
        ]
    }
    


]