'use strict';

var docEl = document.documentElement,
    fullscreen = false;

var apply = function (elems, cb) {
    for (var i = 0; i < elems.length; i++) {
        cb(elems[i]);
    }
};

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

    var enables = document.getElementsByClassName('fullscreen-disable'),
        visibles = document.getElementsByClassName('fullscreen-hide');

    apply(enables, function (e) {
        e.disabled = fullscreen;
    });

    apply(visibles, function (e) {
        e.classList.toggle('hide');
    });
};

var teamNameChanged = function (elem) {
    window.localStorage.setItem(elem.id, elem.value);
};

var addTeamNameEventListener = function (elem) {
    elem.addEventListener('blur', function () {
        teamNameChanged(elem);
    });
};

var loadTeamNames = function () {
    document.getElementById('team-a-name').value = window.localStorage.getItem('team-a-name') || 'Team A';
    document.getElementById('team-b-name').value = window.localStorage.getItem('team-b-name') || 'Team B';
};

var loadTeamScores = function () {
    changeScore('team-a-score', parseInt(window.localStorage.getItem('team-a-score')) || 0, false);
    changeScore('team-b-score', parseInt(window.localStorage.getItem('team-b-score')) || 0, false);
};

/* --------- EVENTS --------- */
document.getElementById('go-fullscreen').addEventListener('click', function () {
    var rfs = docEl.requestFullScreen || docEl.webkitRequestFullScreen || docEl.mozRequestFullScreen || docEl.msRequestFullscreen;
    rfs.call(docEl);
});

document.getElementById('reset').addEventListener('click', function () {
    changeScore('team-a-score', 0, false);
    changeScore('team-b-score', 0, false);
});

var teamNameInputs = document.getElementsByClassName('team-name-input');
for (var i = 0; i < teamNameInputs.length; i++) {
    addTeamNameEventListener(teamNameInputs[i]);
}

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
    switch (e.keyCode) {
        case 38:
            changeScore('team-a-score', 1, true);
            break;
        case 40:
            changeScore('team-a-score', -1, true);
            break;
        case 39:
            changeScore('team-b-score', 1, true);
            break;
        case 37:
            changeScore('team-b-score', -1, true);
            break;
    }
});

/* --------- INIT --------- */
loadTeamNames();
loadTeamScores();