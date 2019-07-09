function showState(stateId) {
    loadJSON(`state${stateId}.json`, showStateJson, onError);
}

function showStateJson(stateJson) {
    console.log(stateJson);
    var onTablePredicates = stateJson.predicates.filter(p => p.name === "ontable");
    console.log(onTablePredicates);

    var towerBottomBlocks = onTablePredicates.map(p => p.args[0]);
    console.log(towerBottomBlocks);

    var towers = towerBottomBlocks.map(block => [block]);
    console.log(towers)

    towers.forEach(t => buildUp(t, stateJson));

    var canvas = document.getElementById("canvas");
    while (canvas.firstChild) {
        canvas.removeChild(canvas.firstChild);
    }
    var gripElement = createGripper();
    canvas.appendChild(gripElement)
    // for each tower.. and each block, call createBlock and add as a child to 'canvas'
    for (let towerIndex = 0; towerIndex < towers.length; towerIndex++) {
        const tower = towers[towerIndex];
        console.log(tower)

        for (let level = 0; level < tower.length; level++) {
            const blockColor = tower[level];
            console.log(`Tower: ${towerIndex}, Block: ${level}, ${blockColor}`);
            var blockElement = createBlock(blockColor, towerIndex, level);
            canvas.appendChild(blockElement);
        }
    }
    // var onTablePredicates = stateJson.predicates.filter(p => p.name === "ontable");
    // console.log(onTablePredicates);
}

function createBlock(color, tower, level) {
    // <div class="block" style="left:0px; bottom:0px; background-color:red" />
    var element = document.createElement("div");
    element.className = "block";
    element.style = "bottom: " + (50 * level + 1) + "px; left: " + (50 * tower + 1) + "px; background-color: " + color;
    element.setAttribute("tower", tower);
    element.setAttribute("level", level);
    return element;
}

function createGripper() {
    // <img class="gripper" src="gripper-opened-implicit.svg">
    var element = document.createElement("img");
    element.className = "gripper";
    element.style = "top:0px; left:0px;"
    element.setAttribute("src", "gripper-opened-implicit.svg");
    return element;
}

function buildUp(t, stateJson) {
    var onPredicates = stateJson.predicates.filter(p => p.name === "on");
    var topBlock = t[0];
    while (topBlock) {
        var predicate1 = onPredicates.find(p => p.args[1] === topBlock);
        if (predicate1) {
            var onTopBlock = predicate1.args[0];
            t.push(onTopBlock);
            topBlock = onTopBlock
        }
        else {
            // todo: check that there is a clear predicate for topBlock
            topBlock = null;
        }
    }
}

function loadJSON(filePath, success, error) {

    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                if (success)
                    success(JSON.parse(xhr.responseText));
            } else {
                if (error)
                    error(xhr);
            }
        }
    };
    xhr.open("GET", filePath, true);
    xhr.send();
}

function onError(error) {
    console.error(error);
}