/*
    Google query: intitle:'Network Camera' inurl:ViewerFrame  inurl:mode +pan +tilt

    params:
        Resolution = 640x480, 320x240, 160x120
        Quality = Clarity, Standard, Motion
        Interval = 10, 30

        PresetOperation = Move
        Language = 0, 1, 2, 3
        Mode = Refresh
        Size = STD, Expand
        Direction = DefaultBrightness, Brighter, Darker

        Image path: /nphMotionJpeg
        Control path: /ViewerFrame

    UPDATED 24-11-17:
        * Most of the interactive cams have been taken offline, good. But there
          are still a whole bunch of cams online. I've updated the list and tweaked
          query params to use less bandwidth.
*/

(function () {
    // All links taken from Goolge
    var feeds = [
        'http://129.89.28.32/axis-cgi/mjpg/video.cgi?resolution=320x240&fps=24&compression=60',
        'http://148.61.97.229/axis-cgi/mjpg/video.cgi?resolution=320x240&fps=24&compression=60',
        'http://195.200.199.8/axis-cgi/mjpg/video.cgi?resolution=320x240&fps=24&compression=60',
        'http://212.142.228.68/axis-cgi/mjpg/video.cgi?resolution=320x240&fps=24&compression=60',
        'http://213.138.74.86:2020/axis-cgi/mjpg/video.cgi?resolution=320x240&fps=24&compression=60',
        'http://213.96.90.110:8080/axis-cgi/mjpg/video.cgi?resolution=320x240&fps=24&compression=60',
        'http://217.197.157.7:7070/axis-cgi/mjpg/video.cgi?resolution=320x240&fps=24&compression=60',
        'http://rachleff.org/axis-cgi/mjpg/video.cgi?resolution=320x240&fps=24&compression=60',
        'http://132.235.24.98/axis-cgi/mjpg/video.cgi?resolution=320x240&fps=24&compression=60',
        'http://cam03.deninet.hu:8080/axis-cgi/mjpg/video.cgi?resolution=320x240&fps=24&compression=60',
        'http://regacam1.tagblatt.com/axis-cgi/mjpg/video.cgi?resolution=320x240&fps=24&compression=60',
        'http://cam1.rauris.net/axis-cgi/mjpg/video.cgi?resolution=320x240&fps=24&compression=60',
        'http://199.212.44.17/cgi-bin/mjpg/video.cgi?resolution=320x240&fps=24&compression=60',
        'http://grovecam.iup.edu/axis-cgi/mjpg/video.cgi?resolution=320x240&fps=24&compression=60',
        'http://gw.tallinnlv.ee:11082/axis-cgi/mjpg/video.cgi?resolution=320x240&fps=24&compression=60',
        'http://cam002.ethz.ch/axis-cgi/mjpg/video.cgi?resolution=320x240&fps=24&compression=60',
        'http://130.241.163.130/axis-cgi/mjpg/video.cgi?resolution=320x240&fps=24&compression=60',
        'http://lolu.axiscam.net/axis-cgi/mjpg/video.cgi?resolution=320x240&fps=24&compression=60',
        'http://86.56.185.46/axis-cgi/mjpg/video.cgi?resolution=320x240&fps=24&compression=60',
        'http://88.117.170.10/axis-cgi/mjpg/video.cgi?resolution=320x240&fps=24&compression=60',
        'http://cam1.sliven.net/axis-cgi/mjpg/video.cgi?resolution=320x240&fps=24&compression=60',
        'http://213.3.21.252/axis-cgi/mjpg/video.cgi?resolution=320x240&fps=24&compression=60',
        'http://lesmartinets.dyndns.org:55182/axis-cgi/mjpg/video.cgi?resolution=320x240&fps=24&compression=60',
        'http://webcam.wauwilermoos.lu.ch/axis-cgi/mjpg/video.cgi?resolution=320x240&fps=24&compression=60',
        'http://aps-m.axiscam.net:85/axis-cgi/mjpg/video.cgi?resolution=320x240&fps=24&compression=60',
        'http://axis_648127.axiscam.net/axis-cgi/mjpg/video.cgi?resolution=320x240&fps=24&compression=60',
        'http://golfvuissens18.axiscam.net:8085/axis-cgi/mjpg/video.cgi?resolution=320x240&fps=24&compression=60',
        'http://axis-lyss2.axiscam.net:8081/axis-cgi/mjpg/video.cgi?resolution=320x240&fps=24&compression=60',
        'http://alcensocam.axiscam.net:8081/axis-cgi/mjpg/video.cgi?resolution=320x240&fps=24&compression=60',
        'http://posta.mukolin.cz/axis-cgi/mjpg/video.cgi?resolution=320x240&fps=24&compression=60',
        'http://195.113.207.238/axis-cgi/mjpg/video.cgi?resolution=320x240&fps=24&compression=60',
        'http://stadtelstra.dyndns.org/axis-cgi/mjpg/video.cgi?resolution=320x240&fps=24&compression=60',
        'http://lsvgzgw1.axiscam.net/axis-cgi/mjpg/video.cgi?resolution=320x240&fps=24&compression=60',
        'http://heidbarghof.dyndns.org/axis-cgi/mjpg/video.cgi?resolution=320x240&fps=24&compression=60',
        'http://212.6.91.123/axis-cgi/mjpg/video.cgi?resolution=320x240&fps=24&compression=60',
        'http://217.22.201.135/axis-cgi/mjpg/video.cgi?resolution=320x240&fps=24&compression=60',
        'http://pendelcam.kip.uni-heidelberg.de/axis-cgi/mjpg/video.cgi?resolution=320x240&fps=24&compression=60',
        'http://dno750.dyndns.org/axis-cgi/mjpg/video.cgi?resolution=320x240&fps=24&compression=60',
        'http://88.2.219.69:8003/axis-cgi/mjpg/video.cgi?resolution=320x240&fps=24&compression=60',
        'http://telecentre.no-ip.org:8000/axis-cgi/mjpg/video.cgi?resolution=320x240&fps=24&compression=60',
        'http://iris.not.iac.es/axis-cgi/mjpg/video.cgi?resolution=320x240&fps=24&compression=60',
        'http://212.213.21.167/axis-cgi/mjpg/video.cgi?resolution=320x240&fps=24&compression=60',
        'http://webcam.ampere.inpg.fr/axis-cgi/mjpg/video.cgi?resolution=320x240&fps=24&compression=60',
        'http://80.13.189.135/axis-cgi/mjpg/video.cgi?resolution=320x240&fps=24&compression=60',
        'http://84.92.80.192:8081/axis-cgi/mjpg/video.cgi?resolution=320x240&fps=24&compression=60',
        'http://fybmovewebcam3.axiscam.net:8196/axis-cgi/mjpg/video.cgi?resolution=320x240&fps=24&compression=60',
        'http://fybmovecam1.axiscam.net:8194/axis-cgi/mjpg/video.cgi?resolution=320x240&fps=24&compression=60',
        'http://77.221.39.163/axis-cgi/mjpg/video.cgi?resolution=320x240&fps=24&compression=60',
        'http://77.221.39.162/axis-cgi/mjpg/video.cgi?resolution=320x240&fps=24&compression=60',
        'http://193.6.11.238/axis-cgi/mjpg/video.cgi?resolution=320x240&fps=24&compression=60',
        'http://194.105.250.197/axis-cgi/mjpg/video.cgi?resolution=320x240&fps=24&compression=60',
        'http://157.157.90.207/axis-cgi/mjpg/video.cgi?resolution=320x240&fps=24&compression=60',
        'http://myndavel.ma.is/axis-cgi/mjpg/video.cgi?resolution=320x240&fps=24&compression=60',
        'http://buffaure.realcam.it/axis-cgi/mjpg/video.cgi?resolution=320x240&fps=24&compression=60',
        'http://82.188.195.100/axis-cgi/mjpg/video.cgi?resolution=320x240&fps=24&compression=60',
        'http://201.166.63.44/axis-cgi/mjpg/video.cgi?resolution=320x240&fps=24&compression=60',
        'http://sbf.axiscam.net:9002/axis-cgi/mjpg/video.cgi?resolution=320x240&fps=24&compression=60',
        'http://194.19.11.26/axis-cgi/mjpg/video.cgi?resolution=320x240&fps=24&compression=60',
        'http://honningsvag.axiscam.net/axis-cgi/mjpg/video.cgi?resolution=320x240&fps=24&compression=60',
        'http://webcam.datainstituttet.no/axis-cgi/mjpg/video.cgi?resolution=320x240&fps=24&compression=60',
        'http://83.142.61.30:8081/axis-cgi/mjpg/video.cgi?resolution=320x240&fps=24&compression=60',
        'http://kamera.man.koszalin.pl/axis-cgi/mjpg/video.cgi?resolution=320x240&fps=24&compression=60',
        'http://193.231.246.7/axis-cgi/mjpg/video.cgi?resolution=320x240&fps=24&compression=60',
        'http://147.91.111.148/axis-cgi/mjpg/video.cgi?resolution=320x240&fps=24&compression=60',
        'http://smogen.axiscam.net/axis-cgi/mjpg/video.cgi?resolution=320x240&fps=24&compression=60',
        'http://81.8.158.58/axis-cgi/mjpg/video.cgi?resolution=320x240&fps=24&compression=60',
        'http://webcam2.stromstad.se/axis-cgi/mjpg/video.cgi?resolution=320x240&fps=24&compression=60',
        'http://210.243.41.156/axis-cgi/mjpg/video.cgi?resolution=320x240&fps=24&compression=60',
        'http://beach.sandestinwebcam.com/axis-cgi/mjpg/video.cgi?resolution=320x240&fps=24&compression=60',
        'http://67.53.34.94:4002/axis-cgi/mjpg/video.cgi?resolution=320x240&fps=24&compression=60',
        'http://dcccam.winthrop.edu/axis-cgi/mjpg/video.cgi?resolution=320x240&fps=24&compression=60',
        'http://myapplecam.com/axis-cgi/mjpg/video.cgi?resolution=320x240&fps=24&compression=60',
        'http://webcam.atlanticeyrielodge.com/axis-cgi/mjpg/video.cgi?resolution=320x240&fps=24&compression=60',
        'http://webcam.apexnc.org/axis-cgi/mjpg/video.cgi?resolution=320x240&fps=24&compression=60',
        'http://norwalk.axiscam.net:2222/axis-cgi/mjpg/video.cgi?resolution=320x240&fps=24&compression=60',
        'http://155.92.196.35/axis-cgi/mjpg/video.cgi?resolution=320x240&fps=24&compression=60',
        'http://198.150.52.78/axis-cgi/mjpg/video.cgi?resolution=320x240&fps=24&compression=60',
        'http://dogsaspen.dyndns.org:8081/axis-cgi/mjpg/video.cgi?resolution=320x240&fps=24&compression=60',
        'http://216.99.115.136:8080/axis-cgi/mjpg/video.cgi?resolution=320x240&fps=24&compression=60',
        'http://67.53.34.94/axis-cgi/mjpg/video.cgi?resolution=320x240&fps=24&compression=60',
        'http://209.143.33.109/axis-cgi/mjpg/video.cgi?resolution=320x240&fps=24&compression=60',
        'http://72.240.51.211/axis-cgi/mjpg/video.cgi?resolution=320x240&fps=24&compression=60',
        'http://dogsaspen.dyndns.org:8084/axis-cgi/mjpg/video.cgi?resolution=320x240&fps=24&compression=60',
        'http://hartohj.axiscam.net:5700/axis-cgi/mjpg/video.cgi?resolution=320x240&fps=24&compression=60',
        'http://webcam.erieyachtclub.org/axis-cgi/mjpg/video.cgi?resolution=320x240&fps=24&compression=60',
        'http://greenhousecam.hort.cornell.edu/axis-cgi/mjpg/video.cgi?resolution=320x240&fps=24&compression=60',
        'http://134.84.117.226/axis-cgi/mjpg/video.cgi?resolution=320x240&fps=24&compression=60',
        'http://towercam.uu.edu/axis-cgi/mjpg/video.cgi?resolution=320x240&fps=24&compression=60',
        'http://stackscam.lib.wsc.ma.edu/axis-cgi/mjpg/video.cgi?resolution=320x240&fps=24&compression=60',
        'http://128.118.52.239/axis-cgi/mjpg/video.cgi?resolution=320x240&fps=24&compression=60',
        'http://climatecam.gi.alaska.edu/axis-cgi/mjpg/video.cgi?resolution=320x240&fps=24&compression=60',
        'http://128.253.181.41/axis-cgi/mjpg/video.cgi?resolution=320x240&fps=24&compression=60',
        'http://c-cam.uchicago.edu/axis-cgi/mjpg/video.cgi?resolution=320x240&fps=24&compression=60',
        'http://66.212.195.106/axis-cgi/mjpg/video.cgi?resolution=320x240&fps=24&compression=60',
        'http://webcam.teuva.fi/axis-cgi/mjpg/video.cgi?resolution=320x240&fps=24&compression=60'
    ];

    var wrapper = document.getElementById('bedroom');
    var usedTVs = [];

    for (var i = 0; i < 20; i++) {
        var randomFeed = getRandomFeed(camlist);
        var TV = createTV(randomFeed.feed, i, randomFeed.index);

        wrapper.appendChild(TV);
        usedTVs.push([TV, randomFeed]);
    }

    function getRandomFeed(feeds) {
        var rndIndex = Math.floor(feeds.length * Math.random());
        return {
            feed: feeds.splice(rndIndex, 1),
            index: rndIndex
        };
    }

    function replaceTV(index) {
        var oldTV = usedTVs[index][0];
        var oldFeed = usedTVs[index][1];
        var randomFeed = getRandomFeed(feeds).feed;
        var video = oldTV.getElementsByTagName('img')[0];

        video.setAttribute('src', randomFeed);

        if (usedTVs[index][1]) {
            feeds.push(usedTVs[index][1]);
        }
        usedTVs[index][1] = randomFeed;

        setTimeout(turnTVOn(video), 2000);
    }

    function createTV(signal, tvPos, feedIndex) {
        var box = document.createElement('div');
        box.setAttribute('class', 'monitor');

        var img = document.createElement('img');
        img.setAttribute('src', signal);
        img.dataset['scale'] = 0.0;

        var tvPos = tvPos;
        var feedIndex = feedIndex;
        img.onerror = function () {
            usedTVs[tvPos][1] = false
            replaceTV(tvPos);
        }

        var span = document.createElement('span');
        span.setAttribute('class', 'static');

        box.appendChild(span);
        box.appendChild(img);

        return box;
    }


    powerUp(usedTVs);

    function powerUp(TVs) {
        for (var i = 0; i < TVs.length; i++) {
            var video = TVs[i][0].getElementsByTagName('img')[0];
            var randDelay = Math.floor(4000 * Math.random());
            setTimeout(turnTVOn(video), 1000 + randDelay);
        }
    }
    function turnTVOn(TV) {
        return function () {
            var tick = setInterval(function () {
                if (TV.dataset['scale'] < 1) {
                    TV.dataset['scale'] = parseFloat(TV.dataset['scale']) + 0.08;
                    TV.style.transform = `scaleY(${TV.dataset['scale']})`;
                    TV.style.opacity = TV.dataset['scale'];
                } else {
                    TV.dataset['scale'] = 1;
                    TV.style.transform = 'scaleY(1)';
                    TV.style.opacity = '1';
                    clearInterval(tick);

                }
            }, 1000 / 30);
        };
    }

    function switchChannels() {
        var rndTV = Math.floor(usedTVs.length * Math.random());
        turnTVOff(rndTV);
    }

    function turnTVOff(TVIndex) {
        var oldTV = usedTVs[TVIndex][0].getElementsByTagName('img')[0];
        console.log(oldTV);


        var tick = setInterval(function () {
            if (oldTV.dataset['scale'] > 0) {
                oldTV.dataset['scale'] = parseFloat(oldTV.dataset['scale']) - 0.08;
                oldTV.style.transform = `scaleY(${oldTV.dataset['scale']})`;
                oldTV.style.opacity = oldTV.dataset['scale'];
            } else {
                oldTV.dataset['scale'] = 0;
                oldTV.style.transform = 'scaleY(0)';
                oldTV.style.opacity = '0';
                clearInterval(tick);
                replaceTV(TVIndex)
            }
        }, 1000 / 30);
    }

    setInterval(switchChannels, 10000);

    var timeElm = document.getElementById('time');
    function updateTime() {
        timeElm.innerHTML = new Date();
    }
    updateTime();
    setInterval(updateTime, 1000);
}());
