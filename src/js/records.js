import * as screens from './screens';
import Mustache from 'mustache';
import moment from 'moment';


let records = {
    high: null,
    last: null,
    all: [],
};


export function getRecords() {
    records = JSON.parse(localStorage.getItem("records")) || records;
    return records;
}

export function saveRecords() {
    localStorage.setItem("records", JSON.stringify(records));
}

export function init() {
    getRecords();
    addRecord({ score: 100 + Math.floor(Math.random() * 1000), level: 2 + Math.floor(Math.random() * 100) });
    document.querySelector(".records-btn").addEventListener("click", () => {
        toggle();
    });
}

export function render() {
    document.querySelector("#records .is-records").classList.add('hidden');
    document.querySelector("#records .no-records").classList.add('hidden');
    if (records.all.length > 0) {
        document.querySelector("#records .is-records").classList.remove('hidden');
        var template = document.getElementById('last-and-high-score-template').innerHTML;
        var rendered = Mustache.render(template, records);
        document.querySelector('#records .is-records .last-and-high-score').innerHTML = rendered;
        template = document.getElementById('records-tbody-template').innerHTML;
        rendered = Mustache.render(template, records);
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
