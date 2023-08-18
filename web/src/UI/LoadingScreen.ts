export class LoadingScreen {

    private loadingScreen: HTMLElement | null = null;

    constructor() {
        this.loadingScreen = document.createElement("div");
        this.loadingScreen.id = "loadingScreen";
        this.loadingScreen.innerHTML = `
            <div class="loadingScreenContent">
                <div class="loadingScreenTitle">Loading...</div>
                <div class="loadingScreenSpinner"></div>
            </div>
        `;
        document.body.appendChild(this.loadingScreen);
        this.addStyles();
    }

    private addStyles(): void {
        this.loadingScreen!.style.position = "fixed";
        this.loadingScreen!.style.top = "0";
        this.loadingScreen!.style.left = "0";
        this.loadingScreen!.style.width = "100vw";
        this.loadingScreen!.style.height = "100vh";
        this.loadingScreen!.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
        this.loadingScreen!.style.display = "flex";
        this.loadingScreen!.style.justifyContent = "center";

        let loadingScreenContent = this.loadingScreen!.querySelector(".loadingScreenContent") as HTMLElement;
        loadingScreenContent.style.display = "flex";
        loadingScreenContent.style.flexDirection = "column";
        loadingScreenContent.style.justifyContent = "center";
        loadingScreenContent.style.alignItems = "center";
        
        let loadingScreenTitle = this.loadingScreen!.querySelector(".loadingScreenTitle") as HTMLElement;
        loadingScreenTitle.style.color = "white";
        loadingScreenTitle.style.fontSize = "2rem";
        loadingScreenTitle.style.fontWeight = "bold";
        loadingScreenTitle.style.marginBottom = "1rem";

        let loadingScreenSpinner = this.loadingScreen!.querySelector(".loadingScreenSpinner") as HTMLElement;
        loadingScreenSpinner.style.border = "16px solid #f3f3f3";
        loadingScreenSpinner.style.borderTop = "16px solid #3498db";
        loadingScreenSpinner.style.borderRadius = "50%";
        loadingScreenSpinner.style.width = "120px";
        loadingScreenSpinner.style.height = "120px";
        loadingScreenSpinner.style.animation = "spin 2s linear infinite";

        let style = document.createElement("style");
        style.innerHTML = `
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(style);
    }

    public show(): void {
        this.loadingScreen!.style.display = "flex";
    }

    public hide(): void {
        this.loadingScreen!.style.display = "none";
    }

}