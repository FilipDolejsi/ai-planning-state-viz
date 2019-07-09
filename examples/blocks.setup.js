const COLORS = ["red", "green", "blue", "yellow", "brown", "pink", "gold", "azure", "khaki"];
const PROTOTYPE = "prototype";

class BlocksInitialStateSetup{
    constructor(){
        this.availableColors = COLORS;        
    }

    initialize(){
        var prototypeBlock = this.createPrototypeBlock(0, 0);
        getBlocksSetupDiv().appendChild(prototypeBlock);
        this.generateProblemPddl();    
        this.refreshGrippers();
    }

    blockClicked(blockDiv) {
        var newBlock = blockDiv.id == PROTOTYPE;

        // get next available color
        var newColor = this.availableColors.shift();
                
        if(!newBlock){
            this.availableColors.push(blockDiv.id); // return the color to the circulation
            problem.replaceBlockColor(blockDiv, newColor);
        }
        else{
            blockDiv.id = newColor;
            
            // update the tower structure
            var towerId = this.getTowerId(blockDiv);
            problem.addBlock(towerId, blockDiv);

            // create new prototype block
            var prototypeInTowerBlock = this.createPrototypeBlock(this.getTowerId(blockDiv), this.getLevelId(blockDiv) + 1);
            getBlocksSetupDiv().appendChild(prototypeInTowerBlock);
            
            // create new prototype block
            if(this.getLevelId(blockDiv) == 0){
                var prototypeOnTableBlock = this.createPrototypeBlock(this.getTowerId(blockDiv) + 1, 0);
                getBlocksSetupDiv().appendChild(prototypeOnTableBlock);
            }
        }
    
        if(this.availableColors.length == 0){
            Array.prototype.slice.call(getBlocksSetupDiv().getElementsByClassName("block"))
                .filter(b => b.id == PROTOTYPE)
                .forEach(b => getBlocksSetupDiv().removeChild(b));
        }
    
        this.generateProblemPddl();
    }
    
    getTowerId(blockDiv){
        return parseInt(blockDiv.getAttribute('tower'));
    }
    
    getLevelId(blockDiv){
        return parseInt(blockDiv.getAttribute('level'));
    }

    generateProblemPddl(){
        var textArea = document.getElementById("problem");
        var goal = this.parseGoal(textArea.value);
        textArea.value = problem.generatePddl(goal);
    }
    
    parseGoal(problemPddl){
        var regex = /^\s*\(define\s*\(problem\s+(\S+)\s*\)\s*\(:domain\s+(\S+)\s*\)\s*\(:objects\s*([^\)]*)\)\s*\(:init\s*([\s\S]*)\s*\)\s*\(:goal\s*([\s\S]*)\s*\)\s*\)\s*$/g;
        var match = regex.exec(problemPddl);

        var goal = match != null ? match[5] : null;

        return goal;        
    }

    createBlock(id, tower, level){
        var element = document.createElement("div");
        element.id = PROTOTYPE;
        element.className = "block";
        element.style="bottom: "+(50*level+1)+"px; left: "+(50*tower+1)+"px";
        element.setAttribute("tower", tower);
        element.setAttribute("level", level);
        element.onclick= function() { blocksInitialStateSetup.blockClicked(this); };
        return element;
    }
    
    createPrototypeBlock(tower, level){
        return this.createBlock(PROTOTYPE, tower, level);
    }        

    refreshGrippers(){
        var blocks = getBlocksSetupDiv();
        blocks.querySelector("img.gripper#implicit").style.display = problem.gripperModelModeExplicit ? "none" : "inline";

        var explicitGrippers = Array.prototype.slice.call(blocks.getElementsByClassName("gripper"))
            .filter(g => g.id != "implicit");
            
        for (var index = 0; index < explicitGrippers.length; index++) {
            var gripper = explicitGrippers[index];
            gripper.style.display = problem.gripperModelModeExplicit && index < problem.gripperCount ? "inline" : "none";
        }
    }
}
