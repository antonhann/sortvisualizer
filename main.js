var slider = document.getElementById('range')
var output = document.getElementById('output')
let block = document.getElementsByClassName('block')
var buttons = document.querySelectorAll('button')
var bubble = document.getElementById('bubble')
var selection = document.getElementById('selection')
var mergeb = document.getElementById('merge')
var heapb = document.getElementById('heap')
//html

var animationOngoing = false
var animationDone = false
var buttonCheck = false
var data //global object

//sort coloring
var doneColor = 'white'
var processColor = '#E74C3C'
var highlightColor = '#2ECC71'
var normalColor = 'cyan'
var sortedColor = '#9B59B6'


//function for the live updating range slider to change the size of the array
slider.oninput = function() {
    var number = this.value
    data = new SortVisualizer(number)
    data.makeBlock()
}

//html button functions
const dropdownButton = document.querySelector(".dropbtn");
const dropdownContent = document.querySelector(".dropdown-content");
const dropdownButtons = document.querySelectorAll(".dropdown-content button")
dropdownButton.addEventListener("click", function() {
    if (dropdownContent.style.display === "block") {
        dropdownContent.style.display = "none";
    } else {
        dropdownContent.style.display = "block";
    }
});
dropdownButtons.forEach((button) => {
    button.addEventListener(("click"), () => {
        if (dropdownContent.style.display === "block") {
            dropdownContent.style.display = "none";
        }
    })
});
function randomizeArray(){
    data = new SortVisualizer(slider.value)
    data.makeBlock()
}
function bubbleSort(){
    if(animationOngoing == false){
        clearButton()
        bubble.classList.add('active')
    }
    data.bubbleSort()
}
function selectionSort(){
    if(animationOngoing == false){
        clearButton()
        selection.classList.add('active')
    }
    data.selectionSort()
}
function mergeSort(){
    if(animationOngoing == false){
        clearButton()
        mergeb.classList.add('active')
    }
    data.mergeSort()
}
function heapSort(){
    if(animationOngoing == false){
        clearButton()
        heapb.classList.add('active')
    }
    data.heapSort()
}


// sortVisualizer class that creates the array and displays it to the user, and it includes methods such as the sorting algs 
class SortVisualizer {
    constructor (number) {
        clearButton()
        this.number = number * 4
        this.randomData = generateRandomArray(this.number)
        animationOngoing = false
        animationDone = false
    }
    makeBlock(){
        var data = document.querySelector('.data')
        data.replaceChildren()
        for (var i = 0; i < this.randomData.length; i++){
            var block = document.createElement('div')
            block.classList.add('block')
            block.setAttribute('id', i)
            block.style.height = this.randomData[i]/2 + 'px';
            block.style.width = 50 + 'px';
            data.append(block)
        }
    };
    async bubbleSort(){
        if(animationOngoing){
            return
        }
        animationDone = false
        animationOngoing = true
        let length = this.randomData.length
        let speed = declareSpeed(length)
        for(var i = 0; i < length; i++){
            let sorted = true
            //check whether the array is sorted or not based on if there is a comparison made or not
            for (var j = 0; j < length - i - 1; j++){
                //below function takes the arguments of the index of the array that is being compared and if they are complications with the blocks we swap them and also animate the highlight as well
                highlightBubbleAnimation(j, j+1, this.randomData, speed)
                await sleep(speed)
                if (compare(this.randomData[j], this.randomData[j + 1]) === 1){
                    swap(this.randomData, j, j + 1)
                    bubbleAnimation(j, j+1, this.randomData, speed)
                    await sleep(speed)
                    sorted = false
                    if (animationOngoing == false){
                        //exit the function if the array was reseted or altered
                        return
                    }
                }
            }
            //changes the color of the block to being sorted since every cycle the largest element of the array would be in it correct spot if done correctly
            doneBubbleBlock((length - 1) - i, length, speed)
            if(sorted == true){
                break
            }
        }
        //declares the sorting alg is done and gives the user a done animation
        animationDone = true
        doneAnimation(length, speed)
    }

    async selectionSort(){
        if (animationOngoing){
            return
        }
        animationDone = false
        while(!animationDone){
            animationOngoing = true
            let length = this.randomData.length
            let speed = declareSpeed(length)
            for (var i = 0; i < length - 1; i++){
                let sorted = true
                let minIndex = i
                for(var j = 1 + i; j < length; j++){
                    //animates the highlighting or hovering of the for loop and shows the user what is being compared and if a new bottom is found the block is animated to represent that change
                    highlightSelectionAnimation(j, this.randomData, speed)
                    await sleep(speed)
                    if(this.randomData[j] < this.randomData[minIndex] || (i == 0 && j == 0)){
                        selectionMinIndexAnimation(minIndex, j, this.randomData, speed)
                        await sleep(speed)
                        minIndex = j
                    }
                    sorted = false
                    if (animationOngoing == false){
                        return
                    }
                }
                swap(this.randomData, minIndex, i)
                //after every cycle of the nested loop we animate the swap between the proper first element and the smallest element of the array 
                selectionSortSwapAnimation(minIndex, i, this.randomData, speed)
                await sleep(speed)
                if(sorted == true){
                    break
                }
            }
            block[length - 1].style.backgroundColor = sortedColor
            animationDone = true
            doneAnimation(length,speed)
        }
    }
    //https://www.youtube.com/watch?v=pFXYym4Wbkc&t=1818s
    async mergeSort(){
        if(animationOngoing){
            return
        }
        animationDone = false
        animationOngoing = true
            //there was lots of frustration animating merge sort for many reasons decided to look for another way to animate merge sort and credits to the youtube above
            //his idea was to create a merge sort that uses a aux array in order to keep the indexes of the array that were being selected or compared in order to animate the animation properly
            let length = this.randomData.length
            let speed = declareSpeed(length)
            let animations = getMergeSortAnimations(this.randomData)
            for (let i = 0; i < animations.length; i++) {
                if (!animationOngoing){
                    return
                }
                //since in the merge function we append the selected twice is to show the comparison then undo the comparison we use that into account to determine which animation is which
                const isColorChange = i % 3 !== 2;
                if (isColorChange) {
                const [barOneIdx, barTwoIdx] = animations[i];
                playNote(200 + (block[barOneIdx].style.height.slice(0,-2) * soundMultiplier))
                const barOneStyle = block[barOneIdx].style;
                const barTwoStyle = block[barTwoIdx].style;
                const color = i % 3 === 0 ? processColor : normalColor;
                barOneStyle.backgroundColor = color;
                barTwoStyle.backgroundColor = color;
                await sleep(speed)
                } else {
                    const [barOneIdx, newHeight] = animations[i];
                    const barOneStyle = block[barOneIdx].style;
                    barOneStyle.height = `${newHeight / 2}px`;
                    await sleep(speed)
                }
            }
            animationDone = true
            if(animationDone){
                doneAnimation(length,speed)
                return
            }
    }
    async heapSort(){
        if(animationOngoing){
            return
        }
        // decided to use the same approach as getting the animations in a list and iterate the list to show the animations
        //we get the heap animations list and based of the index at the 3 we can do the proper animation to the user whether it was a swap or a highlighting
        animationDone = false
        animationOngoing = true
        let length = this.randomData.length
        let speed = declareSpeed(length)
        let animation = getHeapAnimations(this.randomData)
        for(let i in animation){
            if (!animationOngoing){
                return
            }
            const isColorChange = animation[i].at(3);
            if (isColorChange == 0) {
                const [barOneIdx, barTwoIdx, barThreeIdx] = animation[i];
                playNote(200 + (block[barOneIdx].style.height.slice(0,-2) * soundMultiplier))
                const barOneStyle = block[barOneIdx].style;
                const barTwoStyle = block[barTwoIdx].style;
                const barThreeStyle = block[barThreeIdx].style;
                barOneStyle.backgroundColor = highlightColor;
                barTwoStyle.backgroundColor = highlightColor;
                barThreeStyle.backgroundColor = highlightColor;
                await sleep(speed)
            }else if (isColorChange == 1){
                const [barOneIdx, barTwoIdx, barThreeIdx] = animation[i];
                const barOneStyle = block[barOneIdx].style;
                const barTwoStyle = block[barTwoIdx].style;
                const barThreeStyle = block[barThreeIdx].style;
                barOneStyle.backgroundColor = normalColor;
                barTwoStyle.backgroundColor = normalColor;
                barThreeStyle.backgroundColor = normalColor;
                await sleep(speed)
            }else{
                const [barOneIdx, barTwoIdx] = animation[i];
                playNote(200 + (block[barOneIdx].style.height.slice(0,-2) * soundMultiplier))
                const barOneStyle = block[barOneIdx].style;
                const barTwoStyle = block[barTwoIdx].style;
                barOneStyle.backgroundColor = processColor;
                barTwoStyle.backgroundColor = processColor;
                await sleep(speed)
                let temp = barOneStyle.height
                barOneStyle.height = barTwoStyle.height
                barTwoStyle.height = temp
                const color = isColorChange === 2 ? highlightColor : sortedColor;
                barOneStyle.backgroundColor = color;
                barTwoStyle.backgroundColor = color;
                await sleep(speed)
            }
        }
        animationDone = true
        if(animationDone){
            doneAnimation(length,speed)
            return
        }
    }
}

//HEAP SORT
async function heapify(arr, length, parentIndex, animation){
    let largest = parentIndex;
    let left = parentIndex * 2 + 1;
    let right = parentIndex * 2 + 2;
    if(left < length && right < length ){
        animation.push([parentIndex,left,right,0])
        
        // highlightHeapAnimations(parentIndex, left, right, length)
        
        if(left < length && arr[left] > arr[largest]){
            
            largest = left;
            
        }
        if(right < length && arr[right] > arr[largest]){
            largest = right;
        }
        if(largest !== parentIndex){
            
            swap(arr, parentIndex, largest)
            animation.push([parentIndex,largest,0,2])
            // heapSwapAnimations(parentIndex, largest, arr, length)
            
            // await sleep(declareSpeed(length))
            heapify(arr, length, largest, animation)
            
        }
        animation.push([parentIndex,left,right,1])
    }

}
async function heap(arr, animation){
    let length = arr.length
    let lastParentNode = Math.floor(length / 2 - 1);
    let lastChild = length - 1;
    
    while(lastParentNode >= 0){
        
        heapify(arr,length,lastParentNode, animation)
        lastParentNode--;
        
    }
    while(lastChild >= 0){
        
        swap(arr, 0 , lastChild)
        animation.push([0,lastChild,0,3])
        // heapSwapAnimations(0, lastChild, arr, length)
        // await sleep(declareSpeed(length))
        heapify(arr, lastChild, 0, animation)
        lastChild--;  
        
    }
    if(arr[0] > arr[1]){
        swap(arr,0,1)
        animation.push([0,1,0,3])
    }
}
function getHeapAnimations(arr){
    let animation = []
    heap(arr,animation)
    return animation
}
// async function highlightHeapAnimations(a, b, c, length){
//     let speed = declareSpeed(length)
//     const barOneStyle = block[a].style;
//     const barTwoStyle = block[b].style;
//     const barThreeStyle = block[c].style;
//     console.log(a,b,c, length)
//     barOneStyle.backgroundColor = highlightColor;
//     barTwoStyle.backgroundColor = highlightColor;
//     barThreeStyle.backgroundColor = highlightColor;
//     // await sleep(speed)
//     // barOneStyle.backgroundColor = normalColor;
//     // barTwoStyle.backgroundColor = normalColor;
//     // barThreeStyle.backgroundColor = normalColor;
//     return
// }
// async function heapSwapAnimations(a, b, arr, length){
//     let speed = declareSpeed(length)
//     // block[a].stylebackgroundColor = processColor
//     // block[b].style.backgroundColor = processColor
//     block[a].style.height = arr[a]/2 + 'px';
//     block[b].style.height = arr[b]/2 + 'px';
//     await sleep(speed)
//     // block[a].stylebackgroundColor = normalColor;
//     // block[b].style.backgroundColor = normalColor;
//     // return
// }
// BUBBLE SORTING
async function bubbleAnimation(a, b, arr, speed){
    block[a].style.backgroundColor = processColor
    block[b].style.backgroundColor = processColor
    block[a].style.height = arr[a]/2 + 'px';
    block[b].style.height = arr[b]/2 + 'px';
    await sleep(speed)
    block[a].style.backgroundColor = normalColor
    block[b].style.backgroundColor = normalColor
    return
}
async function highlightBubbleAnimation(a, b, arr, speed){
    if (a == arr.length - 1){
        playNote(200 + (block[a].style.height.slice(0,-2) * soundMultiplier))
        block[a].style.backgroundColor = highlightColor
        await sleep(speed)
        block[a].style.backgroundColor = normalColor
    }else{
        playNote(200 + (block[a].style.height.slice(0,-2) * soundMultiplier))
        playNote(200 + (block[b].style.height.slice(0,-2) * soundMultiplier))
        block[a].style.backgroundColor = highlightColor
        block[b].style.backgroundColor = highlightColor
        await sleep(speed)
        block[a].style.backgroundColor = normalColor
        block[b].style.backgroundColor = normalColor
    }
}
async function doneBubbleBlock(a,length,speed){
    block[a].style.backgroundColor = sortedColor
}



//SELECTION SORTING
async function selectionMinIndexAnimation(a, b, arr, speed){
    block[a].style.backgroundColor = normalColor
    block[b].style.backgroundColor = processColor
}
async function selectionSortSwapAnimation(a, b, arr, speed){
    block[a].style.backgroundColor = processColor
    block[b].style.backgroundColor = processColor
    playNote(200 + (block[a].style.height.slice(0,-2) * soundMultiplier))
    await sleep(speed)
    block[a].style.height = arr[a]/2 + 'px'
    block[b].style.height = arr[b]/2 + 'px'
    block[a].style.backgroundColor = normalColor
    block[b].style.backgroundColor = sortedColor
}
async function highlightSelectionAnimation(a, arr, speed){
    block[a].style.backgroundColor = highlightColor
    playNote(200 + (block[a].style.height.slice(0,-2) * soundMultiplier))
    await sleep(speed)
    block[a].style.backgroundColor = normalColor
}
//MERGE SORT ALL CREDITS TO https://www.youtube.com/watch?v=pFXYym4Wbkc&t=1818s
function getMergeSortAnimations (arr){
    const animations = [];
    if (arr.length <= 1) return arr;
    const auxArr = arr.slice();
    mergeSortHelper(arr, 0, arr.length - 1, auxArr, animations);
    return animations;
    
}
function mergeSortHelper(arr, leftIndex, rightIndex, auxArr, animations){
    if(leftIndex === rightIndex) return;
    const middleIndex = Math.floor((leftIndex + rightIndex) / 2);
    mergeSortHelper(auxArr, leftIndex, middleIndex, arr, animations);
    mergeSortHelper(auxArr, middleIndex + 1, rightIndex, arr, animations);
    merge(arr, leftIndex, middleIndex, rightIndex, auxArr, animations);
}
function merge(
    mainArray,
    startIdx,
    middleIdx,
    endIdx,
    auxiliaryArray,
    animations,
  ) {
    let k = startIdx;
    let i = startIdx;
    let j = middleIdx + 1;
    while (i <= middleIdx && j <= endIdx) {
      // These are the values that we're comparing; we push them once
      // to change their color.
      animations.push([i, j]);
      // These are the values that we're comparing; we push them a second
      // time to revert their color.
      animations.push([i, j]);
      if (auxiliaryArray[i] <= auxiliaryArray[j]) {
        // We overwrite the value at index k in the original array with the
        // value at index i in the auxiliary array.
        animations.push([k, auxiliaryArray[i]]);
        mainArray[k++] = auxiliaryArray[i++];
      } else {
        animations.push([k, auxiliaryArray[j]]);
        mainArray[k++] = auxiliaryArray[j++];
      }
    }
    while (i <= middleIdx) {
      animations.push([i, i]);
      animations.push([i, i]);
      animations.push([k, auxiliaryArray[i]]);
      mainArray[k++] = auxiliaryArray[i++];
    }
    while (j <= endIdx) {
      animations.push([j, j]);
      animations.push([j, j]);
      animations.push([k, auxiliaryArray[j]]);
      mainArray[k++] = auxiliaryArray[j++];
    }
  }




//HELPER FUNCTIONS
function sleep(length){
    return new Promise((resolve) => setTimeout(resolve, length))
}
function declareSpeed(length){
    let speed = length
    if (length <= 30){
        speed = length * 80
    }
    else{
        speed = length / 100000
    }
    return speed
}
async function doneAnimation(length, speed){
    for(let i = 0; i < length; i++){
        if(animationDone == true){
            block[i].style.backgroundColor = doneColor
            playNote(200 + (i * 10))
            await sleep(speed)
            
        }
    }
    buttonCheck = false
}
function generateRandomArray(n){
    var array = []
    for (var i = 0; i < n; i++) {
        array.push(getRandomArbitrary(5,1000))
    }
    return array
}
//https://stackoverflow.com/questions/1527803/generating-random-whole-numbers-in-javascript-in-a-specific-range
function getRandomArbitrary(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}
function swap(arr, a, b){
    let temp = arr[a]
    arr[a] = arr[b]
    arr[b] = temp
    return
}
function compare(a, b){
    if (a === b){
        return 0;
    }
    else if (a > b){
        return 1;
    }
    else{
        return -1;
    }
    //TIED = 0
    //A GREATER B = 1
    //A LESSER B= -1
}
function clearButton(){
    buttons.forEach(button => {
        button.removeAttribute('class')
    });
}

let audio = null;
var soundCheck = true
let soundMultiplier = 1
function playNote(freq){
    if(soundCheck){
        if(audio == null){
            audio = new(
                AudioContext ||
                webkitAudioContext ||
                window.webkiteAudioContext
            )();
            
        }
        const duration = 0.1;
        const osc = audio.createOscillator();
        osc.frequency.value = freq;
        osc.start();
        osc.stop(audio.currentTime+duration);
        const node = audio.createGain();
        node.gain.value = 0.005;
        node.gain.linearRampToValueAtTime(
            0, audio.currentTime + duration
        );
        osc.connect(node);
        node.connect(audio.destination);
    }
}
var soundButton = document.getElementById('sound')
function soundToggle(){
    if(soundCheck){
        soundCheck = false
        soundButton.style.backgroundColor = '#E74C3C '
    }else{
        soundCheck = true
        soundButton.style.backgroundColor = '#58D68D'
    }

}

//displays array when loading the website
data = new SortVisualizer(50);
data.makeBlock();

