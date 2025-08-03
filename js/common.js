function ascii_to_hex(str) {
  // Use Latin1 encoding (ISO-8859-1) by directly using character codes
  var arr1 = [];
  for (var i = 0; i < str.length; i++) {
    // Get character code (limited to 8 bits for Latin1)
    var charCode = str.charCodeAt(i) & 0xFF;
    var hex = charCode.toString(16).padStart(2, '0');
    arr1.push(hex);
  }
  return arr1.join('');
}

function hex_to_ascii(str) {
  var hex = str.toString(); // force conversion
  var result = '';

  // Map of control characters to their Unicode display equivalents
  const controlChars = {
    // Common printable control characters keep their special display
    0x09: '\u2409', // HORIZONTAL TAB (␉)
    0x0A: '\u240A', // LINE FEED (␊)
    0x0D: '\u240D', // CARRIAGE RETURN (␍)
    0x20: '\u2423', // SPACE (␣)
    0xA0: '\u2423', // NON-BREAKING SPACE (␣)
    
    // All other control characters use the replacement character
    // C0 control codes (0x00-0x1F, except Tab, LF, CR)
    0x00: '\uFFFD', // NULL (replacement character �)
    0x01: '\uFFFD', // START OF HEADING
    0x02: '\uFFFD', // START OF TEXT
    0x03: '\uFFFD', // END OF TEXT
    0x04: '\uFFFD', // END OF TRANSMISSION
    0x05: '\uFFFD', // ENQUIRY
    0x06: '\uFFFD', // ACKNOWLEDGE
    0x07: '\uFFFD', // BELL
    0x08: '\uFFFD', // BACKSPACE
    0x0B: '\uFFFD', // VERTICAL TAB
    0x0C: '\uFFFD', // FORM FEED
    0x0E: '\uFFFD', // SHIFT OUT
    0x0F: '\uFFFD', // SHIFT IN
    0x10: '\uFFFD', // DATA LINK ESCAPE
    0x11: '\uFFFD', // DEVICE CONTROL 1
    0x12: '\uFFFD', // DEVICE CONTROL 2
    0x13: '\uFFFD', // DEVICE CONTROL 3
    0x14: '\uFFFD', // DEVICE CONTROL 4
    0x15: '\uFFFD', // NEGATIVE ACKNOWLEDGE
    0x16: '\uFFFD', // SYNCHRONOUS IDLE
    0x17: '\uFFFD', // END OF TRANSMISSION BLOCK
    0x18: '\uFFFD', // CANCEL
    0x19: '\uFFFD', // END OF MEDIUM
    0x1A: '\uFFFD', // SUBSTITUTE
    0x1B: '\uFFFD', // ESCAPE
    0x1C: '\uFFFD', // FILE SEPARATOR
    0x1D: '\uFFFD', // GROUP SEPARATOR
    0x1E: '\uFFFD', // RECORD SEPARATOR
    0x1F: '\uFFFD', // UNIT SEPARATOR
    0x7F: '\uFFFD', // DELETE
    
    // C1 control codes (0x80-0x9F)
    0x80: '\uFFFD', // PADDING
    0x81: '\uFFFD', // HIGH OCTET PRESET
    0x82: '\uFFFD', // BREAK PERMITTED HERE
    0x83: '\uFFFD', // NO BREAK HERE
    0x84: '\uFFFD', // NEWLINE
    0x85: '\uFFFD', // DELETE FORM TWO
    0x86: '\uFFFD', // SUBSTITUTE FORM TWO
    0x87: '\uFFFD', // CARRIAGE RETURN
    0x88: '\uFFFD', // SHIFT OUT
    0x89: '\uFFFD', // SHIFT IN
    0x8A: '\uFFFD', // DATA LINK ESCAPE
    0x8B: '\uFFFD', // DEVICE CONTROL ONE
    0x8C: '\uFFFD', // DEVICE CONTROL TWO
    0x8D: '\uFFFD', // DEVICE CONTROL THREE
    0x8E: '\uFFFD', // DEVICE CONTROL FOUR
    0x8F: '\uFFFD', // NEGATIVE ACKNOWLEDGE
    0x90: '\uFFFD', // SYNCHRONOUS IDLE
    0x91: '\uFFFD', // END OF TRANSMISSION BLOCK
    0x92: '\uFFFD', // CANCEL
    0x93: '\uFFFD', // END OF MEDIUM
    0x94: '\uFFFD', // SUBSTITUTE
    0x95: '\uFFFD', // ESCAPE
    0x96: '\uFFFD', // FILE SEPARATOR
    0x97: '\uFFFD', // GROUP SEPARATOR
    0x98: '\uFFFD', // RECORD SEPARATOR
    0x99: '\uFFFD', // UNIT SEPARATOR
    0x9A: '\uFFFD', // SPACE
    0x9B: '\uFFFD', // OVERLINE
    0x9C: '\uFFFD', // DELETE FORM ONE
    0x9D: '\uFFFD', // SUBSTITUTE FORM ONE
    0x9E: '\uFFFD', // FIGURE SPACE
    0x9F: '\uFFFD'  // WORD SPACE
  };

  for (var i = 0; i < Math.floor(hex.length / 2); i++) {
    var charCode = parseInt(hex.substr(i * 2, 2), 16);
    
    // Check if it's a control character or other invisible character
    if (charCode in controlChars) {
      result += controlChars[charCode];
    } else {
      // Use Latin1 encoding (ISO-8859-1)
      result += String.fromCharCode(charCode);
    }
  }
  
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
