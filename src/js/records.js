import * as screens from './screens';
import Mustache from 'mustache';
import moment from 'moment';
import maxBy from 'lodash/maxBy';


let records = {
    high: null,
    last: null,
    all: [],
    difficulty: 0,
    sortBy: '',
    renderData: {},
};

export function updateRenderData() {
    const all = records.all.filter(x => x.difficulty == records.difficulty);
    const last = maxBy(all, o => o.ts);
    const high = maxBy(all, o => o.score);
    all.sort((a, b) => {
        if (records.sortBy == 'level') {
            return -(a.level - b.level);
        } else if (records.sortBy == 'date') {
            return -(a.ts - b.ts);
        } else {
            return -(a.score - b.score);
        }
    });
    records.renderData = {
        high,
        last,
        all: all.slice(0, 5),
    };
}

export function getRecords() {
    records = JSON.parse(localStorage.getItem("records")) || records;
    return records;
}

export function saveRecords() {
    localStorage.setItem("records", JSON.stringify(records));
}

export function init() {
    getRecords();
    // addRecord({ score: 100 + Math.floor(Math.random() * 1000), level: 2 + Math.floor(Math.random() * 100) });
    document.querySelector(".records-btn").addEventListener("click", () => {
        toggle();
    });
    document.querySelector("#records .difficulty").addEventListener("click", (ev) => {
        records.difficulty = parseInt(document.querySelector("#records .difficulty").value);
        saveRecords();
        render();
    });
    document.querySelector("#records .sort-by").addEventListener("click", (ev) => {
        records.sortBy = document.querySelector("#records .sort-by").value;
        saveRecords();
        render();
    });
    document.querySelector("#records .clear-this-difficulty").addEventListener("click", (ev) => {
        records.all = records.all.filter(x => x.difficulty != records.difficulty);
        saveRecords();
        render();
    });
}

export function render() {
    document.querySelector("#records .is-records").classList.add('hidden');
    document.querySelector("#records .no-records").classList.add('hidden');
    document.querySelector("#records .difficulty").value = records.difficulty;
    document.querySelector("#records .sort-by").value = records.sortBy;
    updateRenderData();
    if (records.renderData.all.length > 0) {
        document.querySelector("#records .is-records").classList.remove('hidden');
        var template = document.getElementById('last-and-high-score-template').innerHTML;
        var rendered = Mustache.render(template, records.renderData);
        document.querySelector('#records .is-records .last-and-high-score').innerHTML = rendered;
        template = document.getElementById('records-tbody-template').innerHTML;
        rendered = Mustache.render(template, records.renderData);
        document.querySelector('#records .is-records tbody').innerHTML = rendered;
    } else {
        document.querySelector("#records .no-records").classList.remove('hidden');
    }
}

export function show() {
    screens.hideAll();
    document.querySelector("#records").classList.remove('hidden');
    Game.pause = true;
    document.body.style.overflow = "auto";
    render();
}

export function hide() {
    screens.hideAll();
    document.querySelector("#container").classList.remove('hidden');
    Game.pause = false;
}

export function toggle() {
    if (document.querySelector("#records").classList.contains('hidden')) {
        show();
    } else {
        hide();
    }
}

export function addRecord(record) {
    record.ts = record.ts || Date.now();
    var m = moment(record.ts);
    record.date = m.format("YYYY.MM.DD");
    record.time = m.format("HH:mm");
    if (!records.high || records.high.score < record.score) {
        records.high = record;
    }
    records.last = record;
    records.all.push(record);
    saveRecords();
}

window.app = window.app || {};
window.app.addRecord = addRecord;
