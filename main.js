var slider = document.getElementById('range')
var output = document.getElementById('output')
slider.oninput = function() {
    output.innerHTML = this.value;
    var number = this.value * 2
    var data = makeBoard(number)
}
 function makeBoard(number){
    var data = makeArray(number)
    var randomData = shuffleArray(data)
    makeBlock(randomData)
    return randomData
}
function makeArray(number){
    var data = []
    for(var i = 0; i < number; i++){
        var currentNumber = 30 + i*3
        data.push(currentNumber)
    }
    return data
}
function shuffleArray(array){
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
  return array
}
function makeBlock(n){
    var data = document.querySelector('.data')
    data.replaceChildren()
    for (var i = 0; i < n.length; i++){
        var block = document.createElement('div')
        block.classList.add('block')
        block.style.height = n[i] + 10 + 'px';
        block.style.width = 50 + 'px';
        data.append(block)
    }
};