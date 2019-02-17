/*
    Create glitch.
*/

// Aliases
function $(selector) { return  document.querySelector(selector); }
function _(selector) { return  document.querySelectorAll(selector); }

var randomSeed = Math.seedrandom();
var canvas = $('#creator');
var ctx = canvas.getContext('2d');
var img = document.createElement('img');
var width = canvas.width;
var height = canvas.height;
var glitchBtn = $('#glitchBtn');
var timeoutId = null;
var glitchedBase64Img = null;
var holdingImg = new Image();
var outputImg = $('#glitchedImage');

var glitchAmountSlider = $('#glitchAmount');
var glitchPosSlider = $('#glitchStartPos');



function setupCanvas() {
    ctx.fillStyle = 'rgb(0, 0, 0)';
    ctx.font = "bold 16px sans-serif";

    ctx.fillStyle = 'rgb(50, 50, 50)';
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = 'rgb(255, 255, 255)';
    ctx.fillText('Drag an image onto here', 60, Math.floor(height / 2));
    ctx.fillText('(You can drop multiple times to swap images)', 60, Math.floor(height / 2) + 20);
}

setupCanvas();

function glitchCanvasImage() {
    $('#workingMsg').style.display = 'block';
    // Reset pseudorandom.
    Math.seedrandom(randomSeed);
    var glitchAmount = parseFloat(glitchAmountSlider.value, 10);
    var glitchStartPos = parseFloat(glitchPosSlider.value, 10);
    getGlitchDataUrl(canvas, glitchAmount, glitchStartPos);

}

function getGlitchDataUrl(canvas, glitchAmount, glitchStartPos) {

    function whenDone(glitchedCanvas) {
        outputImg.src = glitchedCanvas.toDataURL('image/jpeg');
            $('#workingMsg').style.display = 'none';
    }

    var glitchedCanvas = postProcessImage({
        'originalCanvas': canvas,
        'glitchAmount': glitchAmount,
        'glitchStartPos': glitchStartPos,
        'callback': whenDone,
        'filters' : {
            'scanlines': $('#filterScanlines').checked,
            'rgbshift': $('#filterRgbShift').checked,
            'bend': $('#filterBend').checked,
            'stutter': $('#filterStutter').checked,
            'tint': $('#filterTint').checked,
            'invert': $('#filterInvert').checked,
            'threshold': $('#filterThreshold').checked,
            'border': $('#filterBorder').checked,
            'strands': $('#filterStrands').checked,
            'tvOverlay': $('#filterTVOverlay').checked,
            'desaturate': $('#filterDesaturate').checked,
            'whiteNoise': $('#filterWhiteNoise').checked,
            'jpegArtifacts': $('#filterJpeg').checked,
            'cutouts': true
        }
    });
}

// FIXME: Dirty FF fix.
setTimeout(glitchCanvasImage, 100);


// Interaction event bindings.
glitchAmountSlider.addEventListener('change', glitchCanvasImage, false);
glitchPosSlider.addEventListener('change', glitchCanvasImage, false);

// Bind click to all checkbox filter options.
var optionInputs = _('.option');
for (var i = 0; i < optionInputs.length; i++) {
    optionInputs[i].addEventListener('change', glitchCanvasImage, false);
}

// Sample image loader
$('.sampleImage').addEventListener('click', function() {
    img.src = this.src;
}, false);


// Clear settings.
$('.clearSettings').addEventListener('click', function() {
    var inputs = _('.options input');
    for (var i = 0; i < inputs.length; i++) {
        inputs[i].checked =  '';
    }
    glitchAmountSlider.value = 0;
    glitchPosSlider.value = 0;
    glitchCanvasImage();
});

// Randomise seed.
$('.randomSeed').addEventListener('click', function() {
    randomSeed = Math.seedrandom();
    
    // Selector random filters
    var inputs = _('.options input');
    for (var i = 0; i < inputs.length; i++) {
        inputs[i].checked = (Math.random() < 0.5) ? 'checked' : '';
    }

    // Random glitch amount and position.
    glitchAmountSlider.value = Math.random();
    glitchPosSlider.value = Math.random();

    glitchCanvasImage();
}, false);

window.addEventListener('dragover', function(event) {
    $('.dropHelper').style.display = 'block';
    event.preventDefault();
    event.stopPropagation();
}, false);

window.addEventListener('drop', function(event) {
    event.preventDefault();
    event.stopPropagation();

    $('.dropHelper').style.display = 'none';

    var files = event.dataTransfer.files;
    if (files.length > 0) {
        var file = files[0];
        if (typeof FileReader !== 'undefined' &&
            file.type.indexOf('image') !== -1
        ) {
            var reader = new FileReader();
            reader.onload = function(event) {
                img.src = event.target.result;
            };
            reader.readAsDataURL(file);
        }
    }
}, false);

img.addEventListener('load', function(event) {
    console.log(this);
    var imgWidth = this.width;
    var imgHeight = this.height;
    var ratio = 1;
    var offsetX = 0;
    var offsetY = 0;
    
    if (imgWidth >= imgHeight) {
        ratio = width / imgWidth;
        offsetY = (height / 2) - ((imgHeight * ratio) / 2);       
    } else {
        ratio = height / imgHeight;
        offsetX = (width / 2) - ((imgWidth * ratio) / 2);
    }
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, width, height);
    ctx.drawImage(this, 0, 0, imgWidth, imgHeight, offsetX, offsetY, imgWidth * ratio, imgHeight * ratio);
    glitchCanvasImage();
}, false);

// File upload.
function handleFileUpload(event) {
    var file = event.target.files[0];
    
    // Only load images.
    if (!file.type.match('image.*')) {
        console.log(file);
        return;
    }

    var reader = new FileReader();
    
    reader.onload = function(event) {
         img.src = event.target.result;
    };

    // Read in the image file as a data URL.
    reader.readAsDataURL(file);
}

$('#fileInput').addEventListener('change', handleFileUpload, false);



// Webcam.
video = $('.live');
video.addEventListener('click', function() {
    ctx.drawImage(this, 0, 0, width, height);
    glitchCanvasImage();
}, false);

$('.activateWebcam').addEventListener('click', function() {
    
    setUpCam();
}, false);

function setUpCam() {
    if (navigator.getUserMedia) {
      navigator.getUserMedia({audio: true, video: true}, function(stream) {
        video.src = window.URL.createObjectURL(stream);
      });
      canvas.style.display = 'none';
    video.style.display = 'block';
    
    } else {
      video.src = 'somevideo.webm'; // fallback.
    }

}

window.URL = window.URL || window.webkitURL;
navigator.getUserMedia  = navigator.getUserMedia || navigator.webkitGetUserMedia ||
                          navigator.mozGetUserMedia || navigator.msGetUserMedia;
