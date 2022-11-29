var slider = document.getElementById('range')
var output = document.getElementById('output')


var animationOngoing = false
var animationDone = false
var data //global object

//sort coloring
var doneColor = 'white'
var processColor = 'red'
var highlightColor = 'green'
var normalColor = 'blue'



slider.oninput = function() {
    output.innerHTML = this.value;
    var number = this.value
    data = new SortVisualizer(number)
    data.makeBlock()
}

//html button functions
function randomizeArray(){
    data = new SortVisualizer(slider.value)
    data.makeBlock()
}
function bubbleSort(){
    data.bubbleSort()
}

class SortVisualizer {
    constructor (number) {
        this.number = number * 4
        this.randomData = generateRandomArray(this.number)
        this.sortedData = this.randomData.valueOf()
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
            if (this.randomData.length.length < 300){
                block.style.height = this.randomData[i] + 'px';
            }
            else{
                block.style.height = this.randomData[i]/2 + 'px';
            }
            block.style.width = 50 + 'px';
            data.append(block)
        }
    };
    async bubbleSort(){
        animationDone = false
        animationOngoing = true
        let length = this.randomData.length
        let speed = length
        if (length <= 30){
            speed = length * 80
        }
        else{
            speed = length / 100
        }
        for(var i = 0; i < length; i++){
            let sorted = true
            for (var j = 0; j < length; j++){
                highlightAnimation(j, j+1, length, speed)
                await sleep(speed)
                if (compare(this.randomData[j], this.randomData[j + 1]) === 1){
                    swap(this.randomData, j, j + 1)
                    bubbleAnimation(j, j+1, this.randomData, speed)
                    await sleep(speed)
                    sorted = false
                    if (animationOngoing == false){
                        return
                    }
                }
            }
            if(sorted == true){
                break
            }
        }
        animationDone = true
        doneAnimation(length, speed)
    }
}




function sleep(length){
    return new Promise((resolve) => setTimeout(resolve, length))
}
async function doneAnimation(length, speed){
    let block = document.getElementsByClassName('block')
    for(let i = 0; i < length; i++){
        if(animationDone == true){
            block[i].style.backgroundColor = processColor
            await sleep(speed)
            block[i].style.backgroundColor = doneColor
        }
    }
}
async function highlightAnimation(a, b, length, speed){
    let block = document.getElementsByClassName('block')
    if (a == length - 1){
        block[a].style.backgroundColor = highlightColor
        await sleep(speed)
    block[a].style.backgroundColor = normalColor
    }else{
        block[a].style.backgroundColor = highlightColor
        block[b].style.backgroundColor = highlightColor
        await sleep(speed)
        block[a].style.backgroundColor = normalColor
        block[b].style.backgroundColor = normalColor
    }
}

// SORTING FUNCTIONS
async function bubbleAnimation(a, b, arr, speed){
    let block = document.getElementsByClassName('block')
    block[a].style.backgroundColor = processColor
    block[b].style.backgroundColor = processColor
    if (arr.length.length < 300){
        block[a].style.height = arr[a] + 'px';
        block[b].style.height = arr[b] + 'px';
    }
    else{
        block[a].style.height = arr[a]/2 + 'px';
        block[b].style.height = arr[b]/2 + 'px';
    }
    await sleep(speed)
    block[a].style.backgroundColor = normalColor
    block[b].style.backgroundColor = normalColor
    return
}
function generateRandomArray(n){
    var array = []
    for (var i = 0; i < n; i++) {
        array.push(getRandomArbitrary(5,1000))
    }
    return array
}


//HELPER FUNCTIONS
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

//displays array when loading the website
data = new SortVisualizer(50)
data.makeBlock()
