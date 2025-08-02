var grid_size = 26;
var screenSize = $(window).width();
var sliderIndex = 0;
var rightBound = document.getElementById('xor-ciphers-table').offsetWidth - document.getElementById('text-table').offsetWidth;
var messageInitialized = false;

document.getElementById("ciphertext1").addEventListener('input', function (evt) {
  updateXORTable();
  updateXORResultText();
  updateBruteForce();
});

document.getElementById("ciphertext2").addEventListener('input', function (evt) {
  updateXORTable();
  updateXORResultText();
  updateBruteForce();
});

document.getElementById("cribword").addEventListener('input', function (evt) {
  updateCribTable();
  updateResultTable();
  updateBruteForce();
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
  for (var i = 0; i < inputHex.length / 2; i++) {
    var row = document.getElementById("crib-hex-table");
    var x = row.insertCell(i);
    x.innerHTML = inputHex.substring(i * 2, (i * 2) + 2);
  }
}

function updateResultTable() {
  document.getElementById('box').style.width = "auto";
  var cribhex = ascii_to_hex(document.getElementById("cribword").value);
  var cipherhex = "";
  for (var i = 0; i < document.getElementById("xor-ciphers-table").getElementsByTagName("td").length; i++) {
    cipherhex = cipherhex.concat(document.getElementById("xor-ciphers-table").getElementsByTagName("td")[i].innerHTML);
  }
  result = xor_hex(cipherhex.substring(((sliderIndex) * 2), ((sliderIndex) * 2) + cribhex.length), cribhex);
  document.getElementById("crib-result").innerHTML = hex_to_ascii(result);

  document.getElementById("result-hex-table").innerHTML = "";
  var cribword = result;
  for (var i = 0; i < cribword.length / 2; i++) {
    var row = document.getElementById("result-hex-table");
    var x = row.insertCell(i);
    x.innerHTML = cribword.substring(i * 2, (i * 2) + 2);
  }
}

function updateBruteForce() {
  var table = document.getElementById("brute-results-table");
  var maxlength = document.getElementById("xor-ciphers-table").getElementsByTagName("td").length;
  var cribhex = ascii_to_hex(document.getElementById("cribword").value);
  var cipherhex = document.getElementById("ciphertextxorresult").value;

  table.innerHTML = "";
  for (var i = 0; i < maxlength - (cribhex.length / 2) + 1; i++) {
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
  var cells = rows[index].getElementsByTagName("td");
  
  if (!cells[0].classList.contains("highlight-td") || !cells[1].classList.contains("highlight-td")) {
    // Remove highlight from all cells in all rows
    var allCells = document.getElementById("brute-results-table").getElementsByTagName("td");
    for (var i = 0; i < allCells.length; i++) {
      allCells[i].classList.remove('highlight-td');
    }
    
    // Highlight both cells in the selected row
    cells[0].classList.add("highlight-td");
    cells[1].classList.add("highlight-td");
  }
}

$(window).resize(function () {
  updateSliderPos();
});

function updateSliderPos() {
  rightBound = document.getElementById('xor-ciphers-table').offsetWidth - document.getElementById('text-table').offsetWidth;
  screenSize = $(window).width();
  
  var contentOffset = $(".content").offset().left;
  var leftBound = contentOffset + 20; // 20px padding
  var rightLimit = leftBound + rightBound;
  
  $(".box").draggable({containment: [leftBound, 0, rightLimit, 0]});
}

function correctSegment(messageNumber) {
  maxlength = document.getElementById("ciphertextxorresult").value.length / 2;
  cribsegment = document.getElementById("cribword").value;

  var segment = document.getElementById("crib-result").textContent;
  var message1, message2;
  
  if (!messageInitialized) {
    var emptystr = "";
    for (var i = 0; i < maxlength; i++) {
      emptystr = emptystr.concat("_");
    }
    message1 = emptystr;
    message2 = emptystr;
    messageInitialized = true;
  } else {
    message1 = document.getElementById("message1").value;
    message2 = document.getElementById("message2").value;
  }

  switch (messageNumber) {
    case 1:
      message1 = message1.substring(0, sliderIndex) + segment + message1.substring(sliderIndex + segment.length, maxlength);
      message2 = message2.substring(0, sliderIndex) + cribsegment + message2.substring(sliderIndex + segment.length, maxlength);
      break;

    case 2:
      message1 = message1.substring(0, sliderIndex) + cribsegment + message1.substring(sliderIndex + segment.length, maxlength);
      message2 = message2.substring(0, sliderIndex) + segment + message2.substring(sliderIndex + segment.length, maxlength);
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

$(".box")
  .draggable({
    drag: function () {
      setSliderIndex();
      updateResultTable();
      selectBruteRow(sliderIndex);
    },
    axis: "x",
    grid: [grid_size, grid_size]
  })
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
new ClipboardJS('.copy-image');
