const Fastify = require('fastify')
const mercurius = require('mercurius')
const crypto = require("crypto")
const CryptoJS = require("crypto-js")
const bigInteger = require("big-integer")
sha1 = require('js-sha1')
const querystring = require('querystring');

const knex = require('knex')({
  client: 'mysql2',
  connection: {
    host : '127.0.0.1',
    user : 'root',
    password : 'mangos',
    database : 'tbcrealmd'
  }
}) // https://devhints.io/knex


const app = Fastify()

const schema = `
  type Query {
    add(x: Int, y: Int): Int
  }
`

const resolvers = {
  Query: {
    add: async (_, obj) => {
      const { x, y } = obj
      return x + y
    }
  }
}

app.register(mercurius, {
  schema,
  resolvers,
  graphiql: true
})

app.get('/', async function (req, reply) {
  const query = '{ add(x: 2, y: 2) }'
  return reply.graphql(query)
})

function hashSSHA(password){
	// let salt = crypto.createHash('sha1').update(crypto.randomBytes(8)).digest('base64');
	// salt = salt.substring(0,10);
	let salt = ''
	const hash = crypto.createHash('sha1');
	hash.update(password + salt);
	return {
			salt: salt,
			encrypted: Buffer.concat([hash.digest(), Buffer.from(salt)]).toString('base64')
	};
};

function checkhashSSHA(salt, password) {
	const hash = crypto.createHash('sha1');
	hash.update(password + salt);
	return Buffer.concat([hash.digest(), Buffer.from(salt)]).toString('base64');
}

function toHex(str,hex){
  try{
    hex = unescape(encodeURIComponent(str))
    .split('').map(function(v){
      return v.charCodeAt(0).toString(16)
    }).join('')
  }
  catch(e){
    hex = str
    console.log('invalid text input: ' + str)
  }
  return hex
}

function toHex2(str) {
	var result = '';
	for (var i=0; i<str.length; i++) {
		result += str.charCodeAt(i).toString(16);
	}
	return result;
}


function string2byte(str) {
	let byteArray = []
	for (let j=0; j < str.length; j++) {
			byteArray.push(str.charCodeAt(j));
	}

	return byteArray
}

function convertStringToUTF8ByteArray(str) {
	let binaryArray = new Uint8Array(str.length)
	Array.prototype.forEach.call(binaryArray, function (el, idx, arr) { arr[idx] = str.charCodeAt(idx) })
	return binaryArray
}

function toBytesInt32(num) {
	var ascii='';
	for (let i=3;i>=0;i--) {
			ascii+=String.fromCharCode((num>>(8*i))&255);
	}
	return ascii;
};

function base64_decode(base64String) {
  var b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
  var h1, h2, h3, h4, o1, o2, o3, bits, i = 0, bytes = [];

  do {
    h1 = b64.indexOf(base64String.charAt(i++));
    h2 = b64.indexOf(base64String.charAt(i++));
    h3 = b64.indexOf(base64String.charAt(i++));
    h4 = b64.indexOf(base64String.charAt(i++));

    bits = h1 << 18 | h2 << 12 | h3 << 6 | h4;

    o1 = bits >> 16 & 0xff;
    o2 = bits >> 8 & 0xff;
    o3 = bits & 0xff;

    bytes.push(o1);
    bytes.push(o2);
    bytes.push(o3);
  } while (i < base64String.length);

  return bytes;
}

function bin2String(array) {
  var result = "";
  for (var i = 0; i < array.length; i++) {
    result += String.fromCharCode(parseInt(array[i], 2));
  }
  return result;
}
// cmangos egna lösning => https://jimmyb.ninja/post/1582217788
// https://github.com/Laizerox/php-wowemu-auth

function parseBigInt(str, base=10) {
  base = BigInt(base)
  var bigint = BigInt(0)
  for (var i = 0; i < str.length; i++) {
    var code = str[str.length-1-i].charCodeAt(0) - 48; if(code >= 10) code -= 39
    bigint += base**BigInt(i) * BigInt(code)
  }
  return bigint
}



var utf8ArrayToStr = (function () {
	var charCache = new Array(128);  // Preallocate the cache for the common single byte chars
	var charFromCodePt = String.fromCodePoint || String.fromCharCode;
	var result = [];

	return function (array) {
			var codePt, byte1;
			var buffLen = array.length;

			result.length = 0;

			for (var i = 0; i < buffLen;) {
					byte1 = array[i++];

					if (byte1 <= 0x7F) {
							codePt = byte1;
					} else if (byte1 <= 0xDF) {
							codePt = ((byte1 & 0x1F) << 6) | (array[i++] & 0x3F);
					} else if (byte1 <= 0xEF) {
							codePt = ((byte1 & 0x0F) << 12) | ((array[i++] & 0x3F) << 6) | (array[i++] & 0x3F);
					} else if (String.fromCodePoint) {
							codePt = ((byte1 & 0x07) << 18) | ((array[i++] & 0x3F) << 12) | ((array[i++] & 0x3F) << 6) | (array[i++] & 0x3F);
					} else {
							codePt = 63;    // Cannot convert four byte code points, so use "?" instead
							i += 3;
					}

					result.push(charCache[codePt] || (charCache[codePt] = charFromCodePt(codePt)));
			}

			return result.join('');
	};
})();

function genHexString(len) {
	const str = Math.floor(Math.random() * Math.pow(16, len)).toString(16);
	return "0".repeat(len - str.length) + str;
}


// const salt = genHexString(64)
// console.log("salt: ", salt)

// let saltReversed = reverseHex(salt)
// console.log("saltReversed: ", saltReversed)
// saltReversed = hex2bin(saltReversed)
// console.log("hex2bin saltReversed: ", saltReversed)

// console.log('----------');

let digest   = crypto.createHash('sha1').update('HIONEYYY:aaaaaaaa').digest();
let digestHex   = crypto.createHash('sha1').update(digest).digest('hex');
// let digestHex   = crypto.createHash('sha1').update('HIONEYYY:aaaaaaaa').digest('hex')
// const password = "HIONEYYY:aaaaaaaa"
// const hashResult = hashSSHA(password)
// console.log("Check hash result: ", checkhashSSHA(hashResult.salt, password))
// console.log('hashResult.salt :>> ', hashResult.salt.toLocaleUpperCase());

// function bin2hex (s) {
//   //  discuss at: https://locutus.io/php/bin2hex/
//   // original by: Kevin van Zonneveld (https://kvz.io)
//   // bugfixed by: Onno Marsman (https://twitter.com/onnomarsman)
//   // bugfixed by: Linuxworld
//   // improved by: ntoniazzi (https://locutus.io/php/bin2hex:361#comment_177616)
//   //   example 1: bin2hex('Kev')
//   //   returns 1: '4b6576'
//   //   example 2: bin2hex(String.fromCharCode(0x00))
//   //   returns 2: '00'
//   let i
//   let l
//   let o = ''
//   let n
//   s += ''
//   for (i = 0, l = s.length; i < l; i++) {
//     n = s.charCodeAt(i)
//       .toString(16)
//     o += n.length < 2 ? '0' + n : n
//   }
//   return o
// }

function hex2bin (s) {
  //  discuss at: https://locutus.io/php/hex2bin/
  // original by: Dumitru Uzun (https://duzun.me)
  //   example 1: hex2bin('44696d61')
  //   returns 1: 'Dima'
  //   example 2: hex2bin('00')
  //   returns 2: '\x00'
  //   example 3: hex2bin('2f1q')
  //   returns 3: false
  const ret = []
  let i = 0
  let l
  s += ''
  for (l = s.length; i < l; i += 2) {
    const c = parseInt(s.substr(i, 1), 16)
    const k = parseInt(s.substr(i + 1, 1), 16)
    if (isNaN(c) || isNaN(k)) return false
    ret.push((c << 4) | k)
  }
  return String.fromCharCode.apply(String, ret)
}

// function hex2bin(hex){
// 	hex = hex.replace("0x", "").toLowerCase();
// 	var out = "";
// 	for(var c of hex) {
// 			switch(c) {
// 					case '0': out += "0000"; break;
// 					case '1': out += "0001"; break;
// 					case '2': out += "0010"; break;
// 					case '3': out += "0011"; break;
// 					case '4': out += "0100"; break;
// 					case '5': out += "0101"; break;
// 					case '6': out += "0110"; break;
// 					case '7': out += "0111"; break;
// 					case '8': out += "1000"; break;
// 					case '9': out += "1001"; break;
// 					case 'a': out += "1010"; break;
// 					case 'b': out += "1011"; break;
// 					case 'c': out += "1100"; break;
// 					case 'd': out += "1101"; break;
// 					case 'e': out += "1110"; break;
// 					case 'f': out += "1111"; break;
// 					default: return "";
// 			}
// 	}

// 	return out;
// }
const bin2hex = str => str.split('').reduce((str, glyph) => str += glyph.charCodeAt().toString(16).length < 2 ? `0${glyph.charCodeAt().toString(16)}`
      : glyph.charCodeAt().toString(16), '');

function hex2binOld(hex) {
  var bytes = [],
    str;

  for (var i = 0; i < hex.length - 1; i += 2)
    bytes.push(parseInt(hex.substr(i, 2), 16));

  return String.fromCharCode.apply(String, bytes);
}

// -----------------
function bnToBuf(bn) {
  var hex = BigInt(bn).toString(16);
  if (hex.length % 2) { hex = '0' + hex; }

  var len = hex.length / 2;
  var u8 = new Uint8Array(len);

  var i = 0;
  var j = 0;
  while (i < len) {
    u8[i] = parseInt(hex.slice(j, j+2), 16);
    i += 1;
    j += 2;
  }

  return u8;
}

function reverseHex(string) {
	let bytes = []
		for (i = 0, length = String(string).length; i < length; i += 2) {
				bytes.push(string.substr(i, 2));
		}
		return bytes.reverse().join('')
}

/**
 * Generate a hash value (message digest).
 * @param {string} algo Name of selected hashing algorithm (i.e. "md5", "sha1", "haval160,4", etc..)
 * @param {string} data Message to be hashed.
 * @param {boolean} raw_output When set to true, outputs raw binary data. false outputs lowercase hexits.
 * 
 * @returns {string} Returns a `string containing the calculated message digest as lowercase hexits unless binary is set.
 */
function hash(algo, _data, raw_output = false) {
	let data = _data
	if (['sha1'].includes(algo) !== true) throw 'Please supply a compatable `algo` hashing algorithm, like "sha1"'

	if (algo === 'sha1') data = sha1(data)
	if (raw_output === true) {
		// const utf8Array = bnToBuf(String(BigInt(`0x${sha1(data)}`)))
		// return utf8ArrayToStr(utf8Array)
		return hex2bin(data)
	}
	return data
}

function generateSalt() {
	return '5686f9b58f18a000000000000000000000000000000000000000000000000000'
	// return genHexString(64)
}

function convertUint8ArrayToBinaryString(u8Array) {
	var i, len = u8Array.length, b_str = "";
	for (i=0; i<len; i++) {
		b_str += String.fromCharCode(u8Array[i]);
	}
	return b_str;
}

function hex2a(hexx) {
	var hex = hexx.toString(); // Force string conversion
	var array = [];
	for (var i = 0; (i < hex.length && hex.substr(i, 2) !== '00'); i += 2)
		array.push(parseInt(hex.substr(i, 2), 16));
		
	return querystring.decode(escape(String.fromCharCode.apply(null, array)));
}
function computePrivateKey(username, password, _salt) {
	let salt = reverseHex(_salt)
	salt = hex2bin(salt)
	const identity = hash('sha1', String(username).toUpperCase() + ':' + String(password).toUpperCase(), true)
	const identity2 = sha1(String(username).toUpperCase() + ':' + String(password).toUpperCase())

	// let digest   = crypto.createHash('sha1').update('HIONEYYY:aaaaaaaa').digest();
	// let base64 = digest.toString(crypto.enc.Base64);
	// let digestHex   = crypto.createHash('sha1').update(digest).digest('hex');
	// let cryptohash = crypto.createHash('sha1').update('HIONEYYY:aaaaaaaa').digest('base64')
	// let digest = crypto.sha1(digest.concat(crypto.enc.Utf8.parse(salted)))
	let salted = 'HIONEYYY:aaaaaaaa'
	let dig = CryptoJS.SHA1(CryptoJS.enc.Utf8.parse(salted));
	let cryptohash = dig.toString(CryptoJS.enc.Base64) 
	console.log('identity cryptohash:>> ', cryptohash);
	// console.log('identity digest:>> ', digest);

	let x = String(BigInt('0x369efbcfe85691295f12a643db62d4fbb1995bd4'))
	let utf8Array = bnToBuf(x) 

	const btoa = b => Buffer.from(b).toString('base64')
	const atob = a => Buffer.from(a, 'base64').toString('binary')
	// const encodedData = Buffer.from(identity2).toString('base64') 
	const encodedData = Buffer.from(identity2, 'base64').toString()

	console.log('utf8Arutf8ArrayToStrray :>> ', utf8ArrayToStr(utf8Array));
	console.log('bin2hex :>> ', bin2hex(utf8ArrayToStr(utf8Array)) );
	console.log('identity hash:>> ', identity2.toString('binary'));
	console.log('identity hex2bin :>> ', hex2bin(identity2) );
	console.log('identity hex2bin :>> ', identity2 );
	console.log('identity hex2a :>> ', btoa(Object.keys(hex2a(identity2))[0] ));
	console.log('identity bin2hex :>> ', bin2hex(identity2) );
	console.log('identity salt :>> ', salt );
	// console.log('identity bin2hex :>> ', utf8ArrayToStr(convertStringToUTF8ByteArray(identity2)));


	// let sha = sha1(`${salt}${identity}`)
	let sha = sha1(Object.keys(hex2a(identity2))[0])
	sha = reverseHex(sha)
	console.log('computePrivateKey() => reverseHex > sha :>> ', sha );

	return bigInteger(sha, 16)
}

function computeVerifier(privateKeyBigInt) {
	// let x = String(BigInt('0x22d13bb9bbea4d5323ec3c7b3c84d17235221a91'))
	const n = String(BigInt('0x894B645E89E1535BBDAD5B8B290650530801B18EBFBF5E8FAB3C82872A3E9BB7'))
	const g = bigInteger(07, 16)
	return g.modPow(privateKeyBigInt, n)
}

function generateVerifier(username, password, salt) {
		const privateKey = computePrivateKey(username, password, salt);
		const verifier = computeVerifier(privateKey);

		// return $verifier->toHex();
}
// let sha = sha1(salt + '' + saltReversed);
// console.log('sha1($salt.$identity) :>> ', sha);
// console.log('----------');

// let x = String(BigInt('0x22d13bb9bbea4d5323ec3c7b3c84d17235221a91')) // fungerar?
let x = String(BigInt('0x369efbcfe85691295f12a643db62d4fbb1995bd4'))
let n = String(BigInt('0x894B645E89E1535BBDAD5B8B290650530801B18EBFBF5E8FAB3C82872A3E9BB7'))
let g = BigInt(07)
let g2 = bigInteger(07, 16)
let modPow = g2.modPow(x, n)
// let strBytes = string2byte(String(modPow.value)).join('')
// let utf8Array = bnToBuf(String(modPow.value)) // fungerar?
let utf8Array = bnToBuf(x) // fungerar?

console.log('n :>> ', n);
console.log('g :>> ', g);
console.log('g2 :>> ', g2);
console.log('modPow :>> ', String(modPow.value));
console.log('utf8Array :>> ', utf8Array);
console.log('utf8Arutf8ArrayToStrray :>> ', utf8ArrayToStr(utf8Array));
console.log('bin2String :>> ', toHex2(utf8ArrayToStr(utf8Array)) );
console.log('toHex2 :>> ', toHex2('*3�E�.�8��O�R �p�n1O�h�1�hW'));
// biMod = bigInt(modulus, 16)
// biRet = biText.modPow(biEx, biMod)
// let g = BigInt(07).modPow(String(BigInt('0x22d13bb9bbea4d5323ec3c7b3c84d17235221a91')), n)
//  $this->g = new BigInteger($options['g'] ?? '07', 16);
console.log('----------');
console.log('digest :>> ', digest);
console.log('digestHex :>> ', digestHex);
console.log('sha1(digest) :>> ', sha1(digest));
console.log('BigInt :>> ', String(BigInt('0x22d13bb9bbea4d5323ec3c7b3c84d17235221a91')));
// console.log('sha1() :>> ', sha1(password).toLocaleUpperCase());
// console.log('sha1()hex :>> ', sha1.hex(password).toLocaleUpperCase());
// console.log('hashResult.encrypted :>> ', hashResult.encrypted.toLocaleUpperCase());

console.log('----------');
// Create your `account`-table v and s values.
const username = 'hioneyyy'
const password = 'aaaaaaaa'
const salt = generateSalt()
const verifier = generateVerifier(username, password, salt)

console.log('salt :>> ', salt);
console.log('verifier :>> ', verifier);

// /* Insert the data into the CMaNGOS database. */
// mysqli_query($db, "INSERT INTO account (username, v, s, gmlevel, email, joindate, last_ip, expansion) VALUES ('$username', '$verifier', '$salt',  '$gmLevel', '$email', '$joinDate', '$ip', '$expansion')");
// "INSERT INTO account(username,v,s,joindate) VALUES('%s','%s','%s',NOW())",


app.listen(3000, () => {
	console.log(`Application is running on: http://localhost:3000/graphql`);
	console.log(`Application is running on: http://localhost:3000/graphiql`);
	// let account = knex.from('account')

	// hioneyyy => v = 231A5CCD3BE9F32C867192DC37C8C72A6E86E49CC2C9BA0F1D9A5F18B26E9C67
	// s = F06F1912A4E4DB9B9B77E76D39AF7437FBCE84CD047957580C7DBB60C75FB235
	// SHA1(CONCAT(UPPER('hioneyyy'), ':', UPPER('test#')))
	// knex.raw('UPDATE account SET s = ? WHERE id = ?', [1, 7]).then(row => {
	// 	console.log('row :>> ', row)
	// })
	// knex.from('account')
  //   .then((rows) => {
  //       for (row of rows) {
  //           console.log(`${row['id']} ${row['username']} ${row['gmlevel']}`);
  //       }
  //   }).catch((err) => { console.log( err); throw err })
  //   .finally(() => {
  //       knex.destroy();
	// 	});
		
	// console.log('account :>> ', account);
})