function ascii_to_hex(str) {
  var arr1 = [];
  for (var n = 0, l = str.length; n < l; n++) {
    var hex = Number(str.charCodeAt(n)).toString(16);
    arr1.push(hex);
  }
  return arr1.join('');
}

function hex_to_ascii(str) {
  var hex = str.toString(); // force conversion
  var result = '';
  for (var i = 0; (i < hex.length && hex.substr(i, 2) !== '00'); i += 2)
    result += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
  return result;
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
