function darkModeSwitch() {
    let isDarkMode = document.body.classList.contains("dark-mode");
    let visualizeBtn = document.getElementById("visualizeBtn");
    if(!isDarkMode) {
        document.body.classList.add("dark-mode");
        visualizeBtn.classList.remove("btn-outline-primary");
        visualizeBtn.classList.add("btn-outline-light");
    } else {
        document.body.classList.remove("dark-mode");
        visualizeBtn.classList.add("btn-outline-primary");
        visualizeBtn.classList.remove("btn-outline-light");
    }
}

function Init() {
    // 1. clear the bars
    document.getElementById("bars").innerHTML = "";

    // 2. calculate maximum height of the bar depending on available space
    let barsElem = document.getElementById("bars");
    let bounding = barsElem.getBoundingClientRect();
    let totalHeight = document.documentElement.clientHeight;
    let fromTop = bounding.top;
    let max = totalHeight - fromTop - 24;       // 24px margin
    let min = 24;

    let numbersArray = [];
    let sampleSizeElem = document.getElementById("sampleSize");
    let sampleSizeFactor = parseFloat(sampleSizeElem.value);
    let totalElements = 25 * sampleSizeFactor;

    for(let i=0; i < totalElements; i++) {
        let randomNumber = Math.floor(Math.random() * (max - min) + min);
        numbersArray.push(randomNumber);
        let tempBarElem = document.createElement("div");
        tempBarElem.style.height = randomNumber + "px";
        tempBarElem.classList.add("bar");
        tempBarElem.id = "bar-" + i;
        barsElem.appendChild(tempBarElem);
    }
}

async function Visualize() {
    // common util
    const delay = ms => new Promise(res => setTimeout(res, ms));
    function swapElements(index1, index2) {
        let elem1 = document.getElementById("bar-" + index1);
        let elem2 = document.getElementById("bar-" + index2);

        const style1 = window.getComputedStyle(elem1);
        const style2 = window.getComputedStyle(elem2);

        const trans1 = style1.getPropertyValue("height");
        const trans2 = style2.getPropertyValue("height");

        elem1.style.height = trans2;
        elem2.style.height = trans1;
    }
    function heightOfElem(index) {
        let elem = document.getElementById("bar-" + index);
        return parseFloat(elem.style.height.slice(0, -2));
    }
    function comparingStart(index) {
        let elem = document.getElementById("bar-" + index);
        elem.style.background = "var(--bs-yellow)";
    }
    function comparingEnd(index) {
        let elem = document.getElementById("bar-" + index);
        elem.style.background = "var(--bs-blue)";
    }
    function elemAtFinalPost(index) {
        let elem = document.getElementById("bar-" + index);
        elem.style.background = "var(--bs-green)";
    }

    let selectedAlgoElem = document.querySelector("input[name='sortAlgorithm']:checked");
    let selectedAlgo = selectedAlgoElem.value;
    let totalBars = document.getElementsByClassName("bar").length;
    let speedElem = document.getElementById("visualSpeed");
    let speedElemFactor = parseFloat(speedElem.value);
    
    switch(selectedAlgo) {
        
        case "bubbleSort":
            // bubble sort algorithm
            for(let i=0; i<=totalBars-1; i++) {
                for(let j=0; j<totalBars-i-1; j++) {
                    let elem1Height = heightOfElem(j);
                    let elem2Height = heightOfElem(eval(j+1));
                    comparingStart(j);
                    comparingStart(eval(j+1));
                    if(elem1Height > elem2Height) {
                        await delay(100*speedElemFactor);
                        swapElements(j, eval(j+1));
                    }
                    comparingEnd(j);
                    comparingEnd(eval(j+1));
                }
                elemAtFinalPost(eval(totalBars-i-1));
            }
            break;
        
        case "insertionSort":
            for(let i=0; i<totalBars; i++) {
                let j = i;
                while(j > 0 && heightOfElem(j-1) >= heightOfElem(j)) {
                    comparingStart(j-1);
                    comparingStart(j);
                    await delay(100*speedElemFactor);
                    swapElements(j, eval(j-1));
                    comparingEnd(j-1);
                    comparingEnd(j);
                    j -= 1;
                }
            }
            break;

        default:
            let confirmation = confirm("Something went wrong. Click Ok to refresh the page...");
            if(confirmation) {
                document.location.reload();
            }
            break;
    }
}

document.getElementById("darkModeSwitch").addEventListener("click", darkModeSwitch);
document.onload = Init();
document.getElementById("sampleSize").addEventListener("change", Init);
document.getElementById("visualizeBtn").addEventListener("click", Visualize);