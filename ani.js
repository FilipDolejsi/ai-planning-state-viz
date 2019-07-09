function showState(stateId) {
    loadJSON(`state${stateId}.json`, showStateJson, onError);
}

function showStateJson(stateJson) {
    console.log(stateJson);
    var onTablePredicates = stateJson.predicates.filter(p => p.name==="ontable");
    console.log(onTablePredicates);

    var towerBottomBlocks = onTablePredicates.map(p => p.args[0]);
    console.log(towerBottomBlocks);

    var towers = towerBottomBlocks.map(block => [block]);
    console.log(towers)

    towers.forEach(t => buildUp(t, stateJson));

    var canvas = document.getElementById("canvas");
    //todo: for each tower.. and each block, call createBlock
}
function createBlock(id, tower, level){
    var element = document.createElement("div");
    element.className = "block";
    element.style="bottom: "+(50*level+1)+"px; left: "+(50*tower+1)+"px; background-color: "+id;
    element.setAttribute("tower", tower);
    element.setAttribute("level", level);
    return element;
}
function buildUp(t, stateJson) {
    var onPredicates = stateJson.predicates.filter(p => p.name==="on");
    var topBlock = t[0];
    while(topBlock) {
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
	xhr.onreadystatechange = function()
	{
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

function onError(error){
    console.error(error);
}