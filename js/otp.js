document.getElementById("messagetext").addEventListener('input', function (evt) {
  updateMessageHex();
});

document.getElementById("keytext").addEventListener('input', function (evt) {
  updateKeyHex();
});

function updateMessageHex() {
  document.getElementById("messagehex").value = ascii_to_hex(document.getElementById("messagetext").value);
  updateXORResult();
}

function updateKeyHex() {
  document.getElementById("keyhex").value = ascii_to_hex(document.getElementById("keytext").value);
  updateXORResult();
}

function updateXORResult() {
  var messageHex = document.getElementById("messagehex").value;
  var keyHex = document.getElementById("keyhex").value;
  
  // Check if key is too short
  if (keyHex.length < messageHex.length) {
    document.getElementById("otpresult").value = "Error: Key is too short. The key must be at least as long as the message.";
    document.getElementById("otpresult").style.color = "red";
  } else {
    document.getElementById("otpresult").value = xor_hex(messageHex, keyHex);
    document.getElementById("otpresult").style.color = ""; // Reset to default color
  }
}

function ascii_to_hex(str) {
  var arr1 = [];
  for (var n = 0, l = str.length; n < l; n++) {
    var hex = Number(str.charCodeAt(n)).toString(16);
    arr1.push(hex);
  }
  return arr1.join('');
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
