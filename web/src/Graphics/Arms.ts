export class Arms {

    constructor() {

        // open "/assets/textures/left_click.gif" to whole screen
        let leftClick = document.createElement("img");
        leftClick.src = "/assets/textures/left_click.gif";
        leftClick.style.position = "absolute";
        leftClick.style.top = "0";
        leftClick.style.left = "0";
        leftClick.style.width = "100%";
        leftClick.style.height = "100%";
        leftClick.style.zIndex = "100";

        // make it non-interactable
        leftClick.style.pointerEvents = "none";

        
        document.body.appendChild(leftClick);

    }

}