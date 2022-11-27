var slider = document.getElementById('range')
var output = document.getElementById('output')
slider.oninput = function() {
    output.innerHTML = this.value;
    var number = this.value
    makeBlock(number)
}

function makeBlock(number){
    var data = document.querySelector('.data')
    data.replaceChildren()
    for (var i = 0; i < number; i++){
        var block = document.createElement('div')
        block.classList.add('block')
        block.style.height = 50 + 5*i + 'px';
        if (number < 45){
            block.style.width = 30 + 'px';
        }else{
            block.style.width = 15 + 'px';
        }
        
        data.append(block)
    }
};