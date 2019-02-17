/**
 *  News glitch.
 */

function doStuff() {
    console.log('doing stuff');
    var compressionQuality = 75; // Higher quality = more glitch
    
    for (var i = 0, count = images.length; i < count; i++) {
        var originalImg = images[i];
        var glitchAmount = originalImg.dataset.noise;
        var imgData = getImageDataFromImage(originalImg);

        // Slow. Needs callback.
        for (var j = 0; j<3; j++) {
            var gA = glitchAmount / (j+1);
            var gA2 = 2 + 3*(gA);
            var myEncoder = new JPEGEncoder(compressionQuality, gA2);
            var glitchedBase64Img = myEncoder.encode(imgData);
            var glitchImage = new Image();
            glitchImage.setAttribute('src', glitchedBase64Img);
            glitchImage.setAttribute('width', originalImg.width);
            glitchImage.setAttribute('height', originalImg.height);

            glitchImage.onload = (function(gA, originalImg,i, j) {
                return function() {
                     var newSrcBase64 = overlay(this, gA, j);
                     this.src = newSrcBase64;
                     this.setAttribute('class', 'glitchedOut');
                     this.setAttribute('id', 'bob'+i+j);
                     this.dataset.noise = gA;
                     originalImg.parentNode.appendChild(this);
                     // Clear onload function.
                     this.onload = null;
                 };
            })(gA, originalImg, i, j);
        }
    }

    setTimeout(animate, 1000);
}


function animate() {
    var wrappers = document.querySelectorAll('.screen');
    for (var i = 0, count = wrappers.length; i < count; i++) {
        var elms = wrappers[i].querySelectorAll('.glitchedOut');

        (function showRandom(elms) {
            for (var j = 0, c = elms.length; j < c; j++) {
                elms[j].style.display = 'none';
            }
            var glitchAmount = elms[0].dataset.noise;
            var rndTime = Math.round( (100 + (2000 * (1 - glitchAmount)))  * Math.random());
            //var rndTime = Math.round(400 * Math.random());
            var rndIndex = Math.round((elms.length - 1) * Math.random());
            
            elms[rndIndex].style.display = 'block';
            setTimeout(function() { showRandom(elms); }, rndTime);
        }(elms));
    }
}

var images;
var imageCount;

function checkFinishedLoading() {
    if (typeof images === 'undefined') {
        images = document.querySelectorAll('.originalImage');
        imageCount = images.length;
    }

    imageCount -= 1;
    if (imageCount === 0) {
        var loadingMsg = document.querySelector('.loading');
        loadingMsg.parentNode.removeChild(loadingMsg);
        doStuff();
    }
}

