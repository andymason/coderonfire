

var postProcessImage = (function() {
    var tvOverlay = new Image();
    tvOverlay.src = 'images/tv_screen.png';

    var glitchAmount;
    var originalCanvas;
    var canvas;
    var ctx;
    var config;

    /**
     * Cut out random boxes.
     * @param {object} ctx - Canvas 2D contenxt.
     * @param {int} height - Height of the canvas.
     * @param {int} width - Width of the canvas.
     * @return {object} Canvas 2D contenxt.
     */
    function cutoutBoxes(ctx, height, width, glitchAmount) {
        var boxHeight = 10;
        var rowCount = Math.ceil(height / boxHeight);
        ctx.globalCompositeOperation = 'destination-out';

        for (var row = 0; row < rowCount; row++) {
            var boxCount = Math.ceil((200 * glitchAmount) * Math.random());
            for (var i = 0; i < boxCount; i++) {
                var boxWidth = 2 ;
                var rndXPos =  Math.floor(Math.random() * width);
                ctx.fillRect(rndXPos, boxHeight * row, boxWidth, boxHeight);
            }
        }
        return ctx;
    }

    /**
     * Draw jagged lines.
     * @param {object} ctx - Canvas 2D contenxt.
     * @param {int} height - Height of the canvas.
     * @param {int} width - Width of the canvas.
     * @return {object} Canvas 2D contenxt.
     */
    function drawStrands(ctx, height, width, glitchAmount) {
        ctx.globalCompositeOperation = 'source-over';
        ctx.strokeStyle = 'rgb(0, 0, 0)';
        ctx.lineWidth = 1;
        ctx.beginPath();

        var strandCount = 100 * glitchAmount;
        var drawWidth = Math.ceil(width * glitchAmount);
        
        for (var i = 0; i < strandCount; i++) {
            var rndX = drawWidth * Math.random() + (width - drawWidth);
            var xPos = width * glitchAmount + (10 * i);
            var maxHeight = Math.ceil((height * glitchAmount) * (i / strandCount));
            drawSingleStrand(rndX, 0, maxHeight, 0);
        }

        function drawSingleStrand(xPos, yPos, maxHeight, rndAmount) {
            var rndSign = (Math.random() < 0.5) ? -1 : 1;
            var rndX = Math.floor(xPos + (Math.random() * rndAmount) * rndSign);
            var rndY = Math.floor(yPos + 10 + (Math.random() * 80));
            ctx.moveTo(xPos, yPos);
            ctx.lineTo(rndX, rndY);
            rndAmount += 2;
            // Loop until finished
            if (yPos < maxHeight) {
                drawSingleStrand(rndX, rndY, maxHeight, rndAmount);
            }
        }
        
        // Finish and stroke lines.
        ctx.closePath();
        ctx.stroke();
        return ctx;
    }

    /**
     * Draw a border around the image.
     * @param {object} ctx - Canvas 2D contenxt.
     * @param {int} height - Height of the canvas.
     * @param {int} width - Width of the canvas.
     */
    function drawBorder(ctx, height, width) {
        var thinkness = 5;
        ctx.fillStyle = 'rgb(0, 0, 0)';
        ctx.globalCompositeOperation = 'destination-over';
        ctx.fillRect(0, 0, width, height);
        ctx.globalCompositeOperation = 'destination-out';
        ctx.fillRect(
            thinkness * 4,
            thinkness * 4,
            width - thinkness * 8,
            height - thinkness * 8
        );
        return ctx;
    }

    /**
     * Currupt image data with errors to generate JPEG artifact glitches.
     */
    function jpegArtifacts(canvas, ctx, glitchAmount, glitchStartPos, callback) {
        var tmpUrl = canvas.toDataURL('image/jpeg');
        var FILE_HEADER = 200;
        var EOI_LENGTH = 10;

        var startPos = FILE_HEADER + Math.round(tmpUrl.length * glitchStartPos);
        var errorByteCount = Math.floor(60 * glitchAmount);
        var sectionsLength = (tmpUrl.length - (startPos + EOI_LENGTH)) / errorByteCount;
        sectionsLength = Math.floor(sectionsLength - 10 * Math.random());

        for (var i = 0; i < errorByteCount; i++) {
            var pos = startPos + (sectionsLength * i);
            tmpUrl = tmpUrl.substr(0, pos - 1) + '0' + tmpUrl.substr(pos);
        }

        // NOTE: Potential race condition with loading of dataURL.
        var newImg = new Image();
        newImg.onload = function() {
            ctx.drawImage(this, 0, 0);
            callback(this);
        };
        newImg.src = tmpUrl;
    }

    function postFilters(img) {
        var surface = img || originalCanvas;
        if (config.filters.border) {
            drawBorder(ctx, canvas.height, canvas.width);
            cutoutBoxes(ctx, canvas.height, canvas.width, glitchAmount);
        }
        if (config.filters.strands) drawStrands(ctx, canvas.height, canvas.width, glitchAmount);

        // FIXME: Borders is acting weirdly.
        ctx.globalCompositeOperation = 'destination-over';
        ctx.drawImage(surface, 0, 0, canvas.height, canvas.width);

        var imgPixelArray = ctx.getImageData(0, 0, canvas.width, canvas.height);
        var imgData = imgPixelArray.data;

        if (config.filters.whiteNoise) imageFilters.whiteNoise(imgData);
        if (config.filters.bend) imageFilters.bend(imgData, canvas.height, canvas.width, glitchAmount);
        if (config.filters.stutter) imageFilters.stutter(imgData, canvas.height, canvas.width, glitchAmount);
        if (config.filters.rgbshift) imageFilters.rgbShift(imgData, canvas.height, canvas.width, glitchAmount);
        if (config.filters.invert) imageFilters.invert(imgData);
        if (config.filters.threshold) imageFilters.threshold(imgData);
        if (config.filters.scanlines) imageFilters.scanlines(imgData, canvas.height, canvas.width);
        if (config.filters.desaturate) imageFilters.desaturate(imgData);
        if (config.filters.tint) imageFilters.tint(imgData, canvas.height, canvas.width);

        ctx.putImageData(imgPixelArray, 0, 0);

        if (config.filters.tvOverlay) {
            ctx.globalCompositeOperation = 'source-over';
            ctx.drawImage(tvOverlay, 0, 0, canvas.height, canvas.width);
        }

        config.callback(canvas);
    }

    return function(c) {
        config = c;
        glitchAmount = config.glitchAmount;
        originalCanvas = config.originalCanvas;
        canvas = document.createElement('canvas');
        canvas.width = originalCanvas.width;
        canvas.height = originalCanvas.height;
        ctx = canvas.getContext('2d');

        if (config.filters.jpegArtifacts &&
            config.glitchAmount > 0 &&
            config.glitchStartPos < 1)
        {
            jpegArtifacts(originalCanvas, ctx, config.glitchAmount, config.glitchStartPos, postFilters);
        } else {
            postFilters();
        }
    };
}());

/*
function postProcessImage(config) {
    
}
*/

var imageFilters = (function() {
    /**
     * Horizontally bend image.
     * @param {object} imgData - Canvas image data object.
     * @param {int} height - Height of the image.
     * @param {int} width - Width of the image.
     * @param {float} glitchAmount - Amount to bend the image.
     * @return {object} - Canvas image data object.
     */
    function bend(imgData, height, width, glitchAmount) {
        var freq = 300;
        var amp = 100 * glitchAmount;
        for (var i = 0; i < height; i++) {
            // Bounce
            var colourShift = Math.round(Math.sin(i / freq) * amp);
            colourShift *= (colourShift < 0) ? -1 : 1;
            for (var k = 0; k < width; k++) {
                var index = ((i * width) + k) * 4;
                imgData[index] = imgData[index + 4 * colourShift];
                imgData[index + 1] = imgData[index + 1 + 4 * colourShift];
                imgData[index + 2] = imgData[index + 2 + 4 * colourShift];
            }
        }
        return imgData;
    }

    /**
     * TV like scanlines.
     * @param {object} imgData - Canvas image data object.
     * @param {int} height - Height of the image.
     * @param {int} width - Width of the image.
     * @return {object} - Canvas image data object.
     */
    function scanlines(imgData, height, width) {
        var DARKEN_AMOUNT = 60;
        for (var i = 0; i < height; i++) {
            if (i % 2) continue;
            for (var k = 0; k < width; k++) {
                var index = ((i * width) + k) * 4;
                imgData[index] = imgData[index] - DARKEN_AMOUNT;
                imgData[index + 1] = imgData[index + 1] - DARKEN_AMOUNT;
                imgData[index + 2] = imgData[index + 2] - DARKEN_AMOUNT;
            }
        }
        return imgData;
    }

    /**
     * Stutter bug.
     * @param {object} imgData - Canvas image data object.
     * @param {int} height - Height of the image.
     * @param {int} width - Width of the image.
     * @param {float} glitchAmount - Amount to bend the image.
     * @return {object} - Canvas image data object.
     */
    function stutter(imgData, height, width, glitchAmount) {
        var stutterAmount = 10 * glitchAmount;
        for (var i = 0; i < height; i++) {
            var colourShift = Math.round(stutterAmount * Math.random());
            for (var k = 0; k < width; k++) {
                var index = ((i * width) + k) * 4;
                imgData[index] = imgData[index + 4 * colourShift];
                imgData[index + 1] = imgData[index + 1 + 4 * colourShift];
                imgData[index + 2] = imgData[index + 2 + 4 * colourShift];
            }
        }
        return imgData;
    }

    /**
     * Shift that colour.
     * @param {object} imgData - Canvas image data object.
     * @param {int} height - Height of the image.
     * @param {int} width - Width of the image.
     * @param {float} glitchAmount - Amount to bend the image.
     * @return {object} - Canvas image data object.
     */
    function rgbShift(imgData, height, width, glitchAmount) {
        var lowerShift = Math.round(2 * glitchAmount);
        var upperShift = Math.round(4 * glitchAmount);
        for (var i = 0; i < height; i++) {
            var shiftAmount = (i % 2) ? lowerShift : upperShift;
            for (var k = 0; k < width; k++) {
                var index = ((i * width) + k) * 4;
                imgData[index] = imgData[index + 4 * shiftAmount * 4];
                imgData[index + 1] = imgData[index + 1 + 4 * shiftAmount];
                imgData[index + 2] = imgData[index + 2 + 4 * shiftAmount];
            }
        }
        return imgData;
    }

    /**
     * Tint.
     * @param {object} imgData - Canvas image data object.
     * @param {int} height - Height of the image.
     * @param {int} width - Width of the image.
     * @return {object} - Canvas image data object.
     */
    function tint(imgData, height, width) {
        var tintAmount = 30;
        for (var i = 0; i < canvas.height; i++) {
            for (var k = 0; k < canvas.width; k++) {
                var index = ((i * canvas.width) + k) * 4;
                imgData[index + 1] = imgData[index + 1] + tintAmount;
                imgData[index + 2] = imgData[index + 2] + tintAmount;
            }
        }
        return imgData;
    }

    /**
     * Invert.
     * @param {object} imgData - Canvas image data object.
     * @return {object} - Canvas image data object.
     */
    function invert(imgData) {
        var length = imgData.length;
        for (var i = 0; i < length; i++) {
            if ((i + 1) % 4 !== 0) imgData[i] = 255 - imgData[i];
        }
        return imgData;
    }

    /**
     * Threshold.
     * @param {object} imgData - Canvas image data object.
     * @return {object} - Canvas image data object.
     */
    function threshold(imgData) {
        var threshholdVal = 100;
        var length = imgData.length;
        for (var i = 0; i < length; i++) {
            if ((i + 1) % 4 !== 0) {
                imgData[i] = (imgData[i] > threshholdVal) ? 255 : 0;
            }
        }
        return imgData;
    }

    /**
     * Desaturate.
     * @param {object} imgData - Canvas image data object.
     * @return {object} - Canvas image data object.
     */
    function desaturate(imgData) {
        var length = imgData.length;
        for (var i = 0; i < length; i++) {
            if ((i + 1) % 4 !== 0) {
                var grey = (imgData[i] + imgData[i + 1] + imgData[i + 2]) / 3;
                imgData[i] = imgData[i + 1] = imgData[i + 2] = grey;
                i += 3;
            }
        }
        return imgData;
    }

    /**
     * whiteNoise.
     * @param {object} imgData - Canvas image data object.
     * @return {object} - Canvas image data object.
     */
    function whiteNoise(imgData) {
        var length = imgData.length;
        for (var i = 0; i < length; i++) {
            if ((i + 1) % 4 !== 0) {
                var offset = (Math.random() < 0.5) ? -15 : 15;
				for (var n = 0; n < 3; n++) {
					var val = imgData[i + n];
					if (val + offset < 255 && val + offset > 0)
						imgData[i + n] = val + offset;
                }
                i += 3;
            }
        }
        return imgData;
    }

    return {
        bend: bend,
        scanlines: scanlines,
        stutter: stutter,
        rgbShift: rgbShift,
        tint: tint,
        invert: invert,
        threshold: threshold,
        desaturate: desaturate,
		whiteNoise: whiteNoise
    };
}());
