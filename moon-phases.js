const Astronomy = require('astronomy-engine');

function Pad(s, w) {
    s = s.toFixed(0);
    while (s.length < w) {
        s = '0' + s;
    }
    return s;
}

function FormatDate(date) {
    var year = Pad(date.getUTCFullYear(), 4);
    var month = Pad(1 + date.getUTCMonth(), 2);
    var day = Pad(date.getUTCDate(), 2);
    var hour = Pad(date.getUTCHours(), 2);
    var minute = Pad(date.getUTCMinutes(), 2);
    var svalue = date.getUTCSeconds() + (date.getUTCMilliseconds() / 1000);
    var second = Pad(Math.round(svalue), 2);
    return `${year}-${month}-${day} ${hour}:${minute}:${second} UTC`;
}

function ParseDate(text) {
    const d = new Date(text);
    if (!Number.isFinite(d.getTime())) {
        console.error(`ERROR: Not a valid date: "${text}"`);
        process.exit(1);
    }
    return d;
}

function getMoonPhasesList (months) {
    const nextCount = months ? months * 4 : 48; 
    const moonPhases = []; 
    const date = (process.argv.length === 3) ? ParseDate(process.argv[2]) : new Date();

    // Calculate the Moon's ecliptic phase angle,
    // which ranges from 0 to 360 degrees.
    //   0 degrees = new moon,
    //  90 degrees = first quarter,
    // 180 degrees = full moon,
    // 270 degrees = third quarter.
    const phase = Astronomy.MoonPhase(date);
    console.log(`${FormatDate(date)} : Moon's ecliptic phase angle = ${phase.toFixed(3)} degrees.`);

    // Calculate the fraction of the Moon's disc
    // that appears illuminated, as seen from the Earth.
    const illum = Astronomy.Illumination(Astronomy.Body.Moon, date);
    console.log(`${FormatDate(date)} : Moon's illuminated fraction = ${illum.phase_fraction.toFixed(2)}%.`);

    // Predict when the next 10 lunar quarter phases will happen.
    const QuarterName = ['🌑 New Moon', '🌓 First Quarter', '🌕 Full Moon', '🌗 Third Quarter'];
    let mq;
    for (let i=0; i < nextCount; ++i) {
        if (mq === undefined) {
            // The first time around the for loop, we search forward
            // from the current date and time to find the next quarter
            // phase, whatever it might be.
            mq = Astronomy.SearchMoonQuarter(date);
        } else {
            // Use the previous moon quarter information to find the next quarter phase event.
            mq = Astronomy.NextMoonQuarter(mq);
        }
        console.log(`${FormatDate(mq.time.date)} : ${QuarterName[mq.quarter]}`);
        moonPhases.push({ phase: QuarterName[mq.quarter], date: mq.time.date })
    }
    return moonPhases;
}

module.exports = getMoonPhasesList; 
