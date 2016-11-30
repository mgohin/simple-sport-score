'use strict';

var keyCodes = {
    3: 'break',
    8: 'backspace / delete',
    9: 'tab',
    12: 'clear',
    13: 'enter',
    16: 'shift',
    17: 'ctrl',
    18: 'alt',
    19: 'pause/break',
    20: 'caps lock',
    27: 'escape',
    32: 'spacebar',
    33: 'page up',
    34: 'page down',
    35: 'end',
    36: 'home',
    37: 'left',
    38: 'up',
    39: 'right',
    40: 'down',
    41: 'select',
    42: 'print',
    43: 'execute',
    44: 'Print Screen',
    45: 'insert',
    46: 'delete',
    48: '0',
    49: '1',
    50: '2',
    51: '3',
    52: '4',
    53: '5',
    54: '6',
    55: '7',
    56: '8',
    57: '9',
    58: ':',
    59: 'semicolon (firefox), equals',
    60: '<',
    61: 'equals (firefox)',
    63: 'ß',
    64: '@ (firefox)',
    65: 'a',
    66: 'b',
    67: 'c',
    68: 'd',
    69: 'e',
    70: 'f',
    71: 'g',
    72: 'h',
    73: 'j',
    74: 'j',
    75: 'k',
    76: 'l',
    77: 'm',
    78: 'n',
    79: 'o',
    80: 'p',
    81: 'q',
    82: 'r',
    83: 's',
    84: 't',
    85: 'u',
    86: 'v',
    87: 'w',
    88: 'x',
    89: 'y',
    90: 'z',
    91: 'Windows Key / Left ⌘ / Chromebook Search key',
    92: 'right window key',
    93: 'Windows Menu / Right ⌘',
    96: 'numpad 0',
    97: 'numpad 1',
    98: 'numpad 2',
    99: 'numpad 3',
    100: 'numpad 4',
    101: 'numpad 5',
    102: 'numpad 6',
    103: 'numpad 7',
    104: 'numpad 8',
    105: 'numpad 9',
    106: 'multiply',
    107: 'add',
    108: 'numpad period (firefox)',
    109: 'subtract',
    110: 'decimal point',
    111: 'divide',
    112: 'f1',
    113: 'f2',
    114: 'f3',
    115: 'f4',
    116: 'f5',
    117: 'f6',
    118: 'f7',
    119: 'f8',
    120: 'f9',
    121: 'f10',
    122: 'f11',
    123: 'f12',
    124: 'f13',
    125: 'f14',
    126: 'f15',
    127: 'f16',
    128: 'f17',
    129: 'f18',
    130: 'f19',
    131: 'f20',
    132: 'f21',
    133: 'f22',
    134: 'f23',
    135: 'f24',
    144: 'num lock',
    145: 'scroll lock',
    160: '^',
    161: '!',
    163: '#',
    164: '$',
    165: 'ù',
    166: 'page backward',
    167: 'page forward',
    169: 'closing paren (AZERTY)',
    170: '*',
    171: '~ + * key',
    173: 'minus (firefox), mute/unmute',
    174: 'decrease volume level',
    175: 'increase volume level',
    176: 'next',
    177: 'previous',
    178: 'stop',
    179: 'play/pause',
    180: 'e-mail',
    181: 'mute/unmute (firefox)',
    182: 'decrease volume level (firefox)',
    183: 'increase volume level (firefox)',
    186: 'semi-colon / ñ',
    187: 'equal sign',
    188: 'comma',
    189: 'dash',
    190: 'period',
    191: 'forward slash / ç',
    192: 'grave accent / ñ',
    193: '?, / or °',
    194: 'numpad period (chrome)',
    219: 'open bracket',
    220: 'back slash',
    221: 'close bracket',
    222: 'single quote',
    223: '`',
    224: 'left or right ⌘ key (firefox)',
    225: 'altgr',
    226: '< /git >',
    230: 'GNOME Compose Key',
    233: 'XF86Forward',
    234: 'XF86Back',
    255: 'toggle touchpad'
};

var docEl = document.documentElement,
    fullscreen = false;

var changeScore = function (id, amount, add) {
    var elem = document.getElementById(id);
    var score;
    if (!add) {
        score = amount;
    } else {
        var previous = elem.innerText;
        try {
            previous = parseInt(previous);
        } catch (e) {
            previous = 0;
        }
        score = Math.max(0, previous + amount);
    }
    elem.innerText = score;
    window.localStorage.setItem(id, score);
};

var fullscreenChanged = function () {
    fullscreen = !fullscreen;
    document.getElementById('panel').style.display = fullscreen ? 'none' : 'block';
};

/******** TEAMS NAME **********/
var reloadTeamNames = function () {
    document.getElementById('team-a-name-display').innerHTML = window.localStorage.getItem('team-a-name');
    document.getElementById('team-b-name-display').innerHTML = window.localStorage.getItem('team-b-name');
};

var loadTeamNames = function () {
    document.getElementById('team-a-name').value = window.localStorage.getItem('team-a-name');
    document.getElementById('team-b-name').value = window.localStorage.getItem('team-b-name');
    reloadTeamNames();
};

var teamNameChanged = function (id, value) {
    window.localStorage.setItem(id, value);
    reloadTeamNames();
};

var addTeamNameEventListener = function (elem) {
    elem.addEventListener('keyup', function () {
        teamNameChanged(elem.id, elem.value);
    });
    elem.addEventListener('blur', function () {
        teamNameChanged(elem.id, elem.value);
    });
};

var teamNameInputs = document.getElementsByClassName('team-name-input');
for (var j = 0; j < teamNameInputs.length; j++) {
    addTeamNameEventListener(teamNameInputs[j]);
}

document.getElementById('reset-names').addEventListener('click', function () {
    teamNameChanged('team-a-name', '');
    teamNameChanged('team-b-name', '');
    loadTeamNames();
});

/******** TEAMS BINDINGS **********/
var saveBinding = function (id, defaultCode, forceDefault) {
    forceDefault = forceDefault || false;
    window.localStorage.setItem(id, window.localStorage.getItem(id) && !forceDefault ? window.localStorage.getItem(id) : defaultCode);
    document.getElementById(id).children[0].textContent = keyCodes[window.localStorage.getItem(id)];
};

var loadBindings = function () {
    saveBinding('team-a-score-minus', 38);
    saveBinding('team-a-score-plus', 40);
    saveBinding('team-b-score-minus', 39);
    saveBinding('team-b-score-plus', 37);
};

var bindKeyTo = null;
var addRebindTo = function (elem) {
    elem.addEventListener('click', function () {
        loadBindings();
        elem.children[0].textContent = '?';
        bindKeyTo = elem.id;
    });
};

var rebinds = document.getElementsByClassName('rebind');
for (var i = 0; i < rebinds.length; i++) {
    addRebindTo(rebinds[i]);
}

document.getElementById('reset-bindings').addEventListener('click', function () {
    saveBinding('team-a-score-minus', 38, true);
    saveBinding('team-a-score-plus', 40, true);
    saveBinding('team-b-score-minus', 39, true);
    saveBinding('team-b-score-plus', 37, true);
});

/******** TEAMS SCORES **********/
var loadTeamScores = function () {
    changeScore('team-a-score', parseInt(window.localStorage.getItem('team-a-score')) || 0, false);
    changeScore('team-b-score', parseInt(window.localStorage.getItem('team-b-score')) || 0, false);
};

document.getElementById('reset-scores').addEventListener('click', function () {
    changeScore('team-a-score', 0, false);
    changeScore('team-b-score', 0, false);
});

/******** EVENTS **********/
var keyDown = function(e){
    switch (e.keyCode) {
        case parseInt(window.localStorage.getItem('team-a-score-minus')):
            changeScore('team-a-score', 1, true);
            break;
        case parseInt(window.localStorage.getItem('team-a-score-plus')):
            changeScore('team-a-score', -1, true);
            break;
        case parseInt(window.localStorage.getItem('team-b-score-minus')):
            changeScore('team-b-score', 1, true);
            break;
        case parseInt(window.localStorage.getItem('team-b-score-plus')):
            changeScore('team-b-score', -1, true);
            break;
    }
};

document.getElementById('go-fullscreen').addEventListener('click', function () {
    var rfs = docEl.requestFullScreen || docEl.webkitRequestFullScreen || docEl.mozRequestFullScreen || docEl.msRequestFullscreen;
    rfs.call(docEl);
});

document.getElementById('themes').addEventListener('change', function (e) {
    var theme = document.getElementById('stylesheet-theme');
    if (theme) {
        theme.href = 'styles/themes/' + e.target.value + '.css';
    }
});

docEl.addEventListener('fullscreenchange', function () {
    fullscreenChanged();
});

docEl.addEventListener('webkitfullscreenchange', function () {
    fullscreenChanged();
});

docEl.addEventListener('mozfullscreenchange', function () {
    fullscreenChanged();
});

docEl.addEventListener('MSFullscreenChange', function () {
    fullscreenChanged();
});

document.addEventListener('keydown', function (e) {
    if (bindKeyTo) {
        saveBinding(bindKeyTo, e.keyCode, true);
        bindKeyTo = null;
        return;
    }
    keyDown(e);
});

var panel = document.getElementById('panel');
document.onmousemove = function (e) {
    if (e.clientX < 50) {
        panel.classList.add('slidein');
        panel.classList.remove('slideout');
    } else if (e.clientX > panel.clientWidth) {
        panel.classList.add('slideout');
        panel.classList.remove('slidein');
    }
};

/* --------- INIT --------- */
loadTeamNames();
loadTeamScores();
loadBindings();