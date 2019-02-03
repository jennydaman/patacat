"use strict";
// Globals
var canvas;
var ctx;
var assets = {};
var cats = [];
var fireTime = 0;
var fire = 1;
var SLOTS = [
    { x: 350, y: 760, angle: 0 },
    { x: 590, y: 780, angle: 73 },
    { x: 1720, y: 835, angle: 0 },
    { x: 1930, y: 835, angle: 0 },
    { x: 2140, y: 835, angle: 0 },
];
var width = 2560; // TODO
var height = 1350; // TODO
// Helpers
// Players
var player1 = new Player({
    tag: '1',
    x: 0.25 * width + 50,
    y: 0.3 * height,
    keyUp: 'w',
    keyLeft: 'a',
    keyRight: 'd',
    keyDown: 's',
    keyPat: 'e',
    width: width,
    height: height
});
var player2 = new Player({
    tag: '2',
    x: 0.75 * width - 50,
    y: 0.3 * height,
    keyUp: 'i',
    keyLeft: 'j',
    keyRight: 'l',
    keyDown: 'k',
    keyPat: 'o',
    width: width,
    height: height
});
// Test
var player3 = new Player({
    tag: '1',
    x: 0.5 * width + 50,
    y: 0.3 * height,
    keyUp: 't',
    keyLeft: 'f',
    keyRight: 'g',
    keyDown: 'h',
    keyPat: 'y',
    width: width,
    height: height
});
var players = [player1, player2];
var update = function (time) {
    players.forEach(function (p) { return p.update(); });
    if (time - fireTime > 250) {
        fireTime = time;
        // noinspection UnnecessaryLocalVariableJS
        var oldFire = fire;
        while (fire === oldFire)
            fire = Math.round(1 + Math.random() * 3);
    }
};
var drawCatInSlot = function (cat, slot, fraction) {
    ctx.translate(slot.x, slot.y);
    ctx.rotate(slot.angle * Math.PI / 180);
    ctx.drawImage(cat.asset["img"], 0, -cat.draw_height + (cat.draw_height * (1 - fraction)), 200, cat.draw_height);
    // ctx.drawImage(assets["couch"]["img"], 0, -cat.draw_height + (cat.draw_height * (1 - fraction)), 200, cat.draw_height);
    ctx.rotate(-slot.angle * Math.PI / 180);
    ctx.translate(-slot.x, -slot.y);
};
var getCatPat = function (slot, fraction) {
};
var draw = function () {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(assets["wallpaper"]["img"], 0, 0, 2883, 1350);
    ctx.drawImage(assets["fireplace"]["img"], 630, -20, 832, 1160);
    ctx.drawImage(assets["lamp"]["img"], 2090, 300, 270, 900);
    // Draw Cats
    drawCatInSlot(cats[0], SLOTS[0], 1);
    drawCatInSlot(cats[0], SLOTS[1], 1);
    drawCatInSlot(cats[0], SLOTS[2], 0.6);
    drawCatInSlot(cats[0], SLOTS[3], 0.8);
    drawCatInSlot(cats[0], SLOTS[4], 1.0);
    // Draw Fore-Background
    ctx.drawImage(assets["boombox"]["img"], 930, 478, 250, 164);
    ctx.drawImage(assets["fire" + fire.toString()]["img"], 920, 890, 240, 244);
    ctx.drawImage(assets["pot"]["img"], 1200, 468, 202, 150);
    ctx.drawImage(assets["other-pot"]["img"], 680, 395, 240, 222);
    ctx.drawImage(assets["plant"]["img"], 20, 680, 245, 500);
    ctx.drawImage(assets["couch"]["img"], 200, 730, 508, 450);
    ctx.drawImage(assets["large-couch"]["img"], 1400, 820, 1000, 366);
    players.forEach(function (p) { return p.draw(ctx, assets); });
};
var gameLoop = function () {
    var time = (new Date).getTime();
    update(time);
    draw();
    window.requestAnimationFrame(gameLoop);
};
// Initialize!
document.addEventListener("DOMContentLoaded", function () {
    canvas = document.getElementById("main-canvas");
    ctx = canvas.getContext("2d");
    document.querySelectorAll("div#assets img").forEach(function (el) {
        var img = el;
        assets[img.id] = {};
        assets[img.id]["img"] = img;
        assets[img.id]["w"] = img.width;
        assets[img.id]["h"] = img.height;
    });
    for (var k in assets) {
        if (!assets.hasOwnProperty(k))
            continue;
        if (k.substr(0, 4) === "cat-") {
            cats.push({
                asset: assets[k],
                draw_height: 200 * (assets[k]["h"] / assets[k]["w"])
            });
        }
    }
    window.addEventListener("keyup", function (e) {
        players.forEach(function (p) { return p.onKeyUp(e.key); });
    });
    window.addEventListener("keydown", function (e) {
        players.forEach(function (p) { return p.onKeyDown(e.key); });
    });
    gameLoop();
});