var grid_size = 26;
var screenSize = $(window).width();
var sliderIndex = 0;
var rightBound = document.getElementById('xor-ciphers-table').offsetWidth - document.getElementById('text-table').offsetWidth;
var messageInitialized = false;

document.getElementById("ciphertext1").addEventListener('input', function (evt) {
  updateXORTable();
  updateXORResultText();
  updateBruteForce();
  updateSliderPos(); // Update slider position when ciphertext changes
});

document.getElementById("ciphertext2").addEventListener('input', function (evt) {
  updateXORTable();
  updateXORResultText();
  updateBruteForce();
  updateSliderPos(); // Update slider position when ciphertext changes
});

document.getElementById("cribword").addEventListener('input', function (evt) {
  updateCribTable();
  updateResultTable();
  updateBruteForce();
  updateSliderPos(); // Update slider position when crib word changes
});

function updateXORResultText() {
  var cipher1 = document.getElementById("ciphertext1").value
  var cipher2 = document.getElementById("ciphertext2").value
  var inputHex = xor_hex(cipher1, cipher2);
  document.getElementById("ciphertextxorresult").value = inputHex;
}

function updateXORTable() {
  document.getElementById("xor-ciphers").innerHTML = "";
  var cipher1 = document.getElementById("ciphertext1").value;
  var cipher2 = document.getElementById("ciphertext2").value;
  var inputHex = xor_hex(cipher1, cipher2);
  for (var i = 0; i < inputHex.length / 2; i++) {
    var row = document.getElementById("xor-ciphers");
    var x = row.insertCell(i);
    x.innerHTML = inputHex.substring(i * 2, (i * 2) + 2);
  }
}

function updateCribTable() {
  document.getElementById("crib-hex-table").innerHTML = "";
  var cribword = document.getElementById("cribword").value;
  var inputHex = ascii_to_hex(cribword);
  
  // Handle empty crib case
  if (inputHex.length === 0) {
    return;
  }
  
  // Calculate actual byte count
  var actualByteCount = Math.ceil(inputHex.length / 2);
  
  for (var i = 0; i < actualByteCount; i++) {
    var row = document.getElementById("crib-hex-table");
    var x = row.insertCell(i);
    
    // Handle the case where we might have an odd number of hex characters
    if (i * 2 + 2 <= inputHex.length) {
      x.innerHTML = inputHex.substring(i * 2, (i * 2) + 2);
    } else {
      x.innerHTML = inputHex.substring(i * 2);
    }
  }
}

function updateResultTable() {
  var cribhex = ascii_to_hex(document.getElementById("cribword").value);
  var cipherhex = "";
  for (var i = 0; i < document.getElementById("xor-ciphers-table").getElementsByTagName("td").length; i++) {
    cipherhex = cipherhex.concat(document.getElementById("xor-ciphers-table").getElementsByTagName("td")[i].innerHTML);
  }
  
  // Handle empty crib case
  if (cribhex.length === 0) {
    document.getElementById("crib-result").innerHTML = "";
    document.getElementById("result-hex-table").innerHTML = "";
    
    // Set minimal box width for empty crib (1px)
    document.getElementById('box').style.width = "1px";
    return;
  }
  
  result = xor_hex(cipherhex.substring(((sliderIndex) * 2), ((sliderIndex) * 2) + cribhex.length), cribhex);
  document.getElementById("crib-result").innerHTML = hex_to_ascii(result);

  document.getElementById("result-hex-table").innerHTML = "";
  var cribword = result;
  
  // Only create cells for actual bytes in the result
  var actualByteCount = Math.ceil(cribhex.length / 2);
  for (var i = 0; i < actualByteCount; i++) {
    var row = document.getElementById("result-hex-table");
    var x = row.insertCell(i);
    
    // Handle the case where we might have an odd number of hex characters
    if (i * 2 + 2 <= cribword.length) {
      x.innerHTML = cribword.substring(i * 2, (i * 2) + 2);
    } else {
      x.innerHTML = cribword.substring(i * 2);
    }
  }
  
  // Set box width based on actual byte count with a minimum width for UI purposes
  // For small crib lengths (1 byte), ensure we use exactly one grid cell width
  var boxWidth = actualByteCount === 1 ? grid_size : Math.max(actualByteCount * grid_size, grid_size * 2);
  document.getElementById('box').style.width = boxWidth + "px";
}

function updateBruteForce() {
  var table = document.getElementById("brute-results-table");
  var maxlength = document.getElementById("xor-ciphers-table").getElementsByTagName("td").length;
  var cribhex = ascii_to_hex(document.getElementById("cribword").value);
  var cipherhex = document.getElementById("ciphertextxorresult").value;

  table.innerHTML = "";
  
  // Handle empty crib case
  if (cribhex.length === 0) {
    // Create a single row with empty result
    var row = table.insertRow(0);
    
    // Add position index column
    var positionCell = row.insertCell(0);
    positionCell.innerHTML = 1;
    positionCell.className = "position-index";
    
    // Add empty result column
    var resultCell = row.insertCell(1);
    resultCell.innerHTML = "";
    return;
  }
  
  // Calculate actual byte count for the crib
  var actualByteCount = Math.ceil(cribhex.length / 2);
  
  for (var i = 0; i < maxlength - actualByteCount + 1; i++) {
    result = xor_hex(cipherhex.substring(((i) * 2), ((i) * 2) + cribhex.length), cribhex);
    var spacing = "";
    for (var j = 0; j < i; j++) {
      spacing = spacing.concat("&nbsp;");
    }
    var row = table.insertRow(i);
    
    // Add position index column
    var positionCell = row.insertCell(0);
    positionCell.innerHTML = i + 1;
    positionCell.className = "position-index";
    
    // Add result column
    var resultCell = row.insertCell(1);
    resultCell.innerHTML = spacing + hex_to_ascii(result);
  }
}

function selectBruteRow(index) {
  var rows = document.getElementById("brute-results-table").getElementsByTagName("tr");
  
  // Check if index is valid and rows exist
  if (index < 0 || index >= rows.length || rows.length === 0) {
    return; // Exit if index is out of bounds or no rows exist
  }
  
  var cells = rows[index].getElementsByTagName("td");
  
  // Check if cells exist in the row
  if (cells.length < 2) {
    return; // Exit if row doesn't have enough cells
  }
  
  // Remove highlight from all cells in all rows
  var allCells = document.getElementById("brute-results-table").getElementsByTagName("td");
  for (var i = 0; i < allCells.length; i++) {
    allCells[i].classList.remove('highlight-td');
  }
  
  // Highlight both cells in the selected row
  cells[0].classList.add("highlight-td");
  cells[1].classList.add("highlight-td");
}

$(window).resize(function () {
  updateSliderPos();
});

function updateSliderPos() {
  // Recalculate the right boundary based on current table widths
  // This ensures the slider can move across the entire XOR table
  var xorTableWidth = document.getElementById('xor-ciphers-table').offsetWidth;
  var textTableWidth = document.getElementById('text-table').offsetWidth;
  rightBound = Math.max(0, xorTableWidth - textTableWidth);
  
  screenSize = $(window).width();
  
  var contentOffset = $(".content").offset().left;
  var leftBound = contentOffset + 20; // 20px padding
  var rightLimit = leftBound + rightBound;
  
  // Completely destroy and reinitialize the draggable element
  // This ensures all properties are updated correctly
  if ($(".box").hasClass("ui-draggable")) {
    $(".box").draggable("destroy");
  }
  
  $(".box").draggable({
    containment: [leftBound, 0, rightLimit, 0],
    drag: function () {
      setSliderIndex();
      updateResultTable();
      selectBruteRow(sliderIndex);
    },
    axis: "x",
    grid: [grid_size, grid_size]
  });
}

function correctSegment(messageNumber) {
  // Calculate the number of bytes in the XOR result (each byte is 2 hex characters)
  const maxByteLength = document.getElementById("ciphertextxorresult").value.length / 2;
  const cribsegment = document.getElementById("cribword").value;
  const segment = document.getElementById("crib-result").textContent;
  
  let message1, message2;
  
  // Initialize messages if needed
  if (!messageInitialized) {
    // Use '•' (bullet) character to represent unknown characters instead of underscore
    // This allows distinguishing between actual underscores and unknown characters
    const emptystr = "•".repeat(maxByteLength);
    message1 = emptystr;
    message2 = emptystr;
    messageInitialized = true;
  } else {
    message1 = document.getElementById("message1").value;
    message2 = document.getElementById("message2").value;
    
    // If cipher text length has changed, adjust message lengths
    const currentLength = message1.length;
    if (currentLength < maxByteLength) {
      // Add unknown characters if message is too short
      const additionalChars = "•".repeat(maxByteLength - currentLength);
      message1 += additionalChars;
      message2 += additionalChars;
    } else if (currentLength > maxByteLength) {
      // Truncate if message is too long
      message1 = message1.substring(0, maxByteLength);
      message2 = message2.substring(0, maxByteLength);
    }
  }

  // Update the appropriate message with the decrypted segment
  switch (messageNumber) {
    case 1:
      message1 = message1.substring(0, sliderIndex) + segment + message1.substring(sliderIndex + segment.length);
      message2 = message2.substring(0, sliderIndex) + cribsegment + message2.substring(sliderIndex + cribsegment.length);
      break;

    case 2:
      message1 = message1.substring(0, sliderIndex) + cribsegment + message1.substring(sliderIndex + cribsegment.length);
      message2 = message2.substring(0, sliderIndex) + segment + message2.substring(sliderIndex + segment.length);
      break;
  }

  document.getElementById("message1").value = message1;
  document.getElementById("message2").value = message2;
}

function setSliderIndex() {
  var xPos = $(".box").offset().left;
  var contentOffset = $(".content").offset().left;
  sliderIndex = Math.floor((xPos - contentOffset) / grid_size);
}

// Add event handlers for the box element
$(".box")
  .on("mouseover", function () {
    $(this).addClass("move-cursor")
  })
  .on("mousedown", function () {
    $(this)
      .removeClass("move-cursor")
      .addClass("grab-cursor")
      .addClass("opac");
    $(".text").hide();
  })
  .on("mouseup", function () {
    $(this)
      .removeClass("grab-cursor")
      .removeClass("opac")
      .addClass("move-cursor");
  });

function defaultText() {
  document.getElementById("ciphertext1").value = "3b000f1e0a543c0a0b5d5612";
  document.getElementById("ciphertext2").value = "3604100b45464b260b505158";
  document.getElementById("ciphertextxorresult").value = "0d041f154f12772c000d074a";
  document.getElementById("cribword").value = "Hello";

}

function setup() {
  defaultText();
  updateXORTable();
  updateCribTable();
  updateSliderPos();
  setSliderIndex();
  updateResultTable();
  updateBruteForce();
  selectBruteRow(0);
}

setup();
