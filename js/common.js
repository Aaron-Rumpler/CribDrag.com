function ascii_to_hex(str) {
  const encoder = new TextEncoder();
  const utf8Bytes = encoder.encode(str);

  var arr1 = [];
  for (var i = 0; i < utf8Bytes.length; i++) {
    var hex = utf8Bytes[i].toString(16).padStart(2, '0');
    arr1.push(hex);
  }
  return arr1.join('');
}

function hex_to_ascii(str) {
  var hex = str.toString(); // force conversion

  var bytes = new Uint8Array(Math.floor(hex.length / 2));
  for (var i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(hex.substr(i * 2, 2), 16);
  }

  const decoder = new TextDecoder('utf-8');
  return decoder.decode(bytes);
}

function xor_hex(cipher1, cipher2) {
  var result = "",
    i = cipher1.length,
    j = cipher2.length;
  while (i-- > 0 && j-- > 0) {
    result = (parseInt(cipher1.charAt(i), 16) ^ parseInt(cipher2.charAt(j), 16)).toString(16) + result;
  }
  return result;
}
