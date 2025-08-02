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
