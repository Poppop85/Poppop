const character=document.getElementById("character");

let x=50;
let y=75;

const step=4;

function update(){

    character.style.left=x+"%";
    character.style.top=y+"%";

}

document.getElementById("forwardButton").onclick=function(){

    y-=step;

    if(y<10)y=10;

    update();

};

document.getElementById("backwardButton").onclick=function(){

    y+=step;

    if(y>90)y=90;

    update();

};

document.getElementById("leftButton").onclick=function(){

    x-=step;

    if(x<5)x=5;

    character.style.transform="translate(-50%,-50%) scaleX(-1)";

    update();

};

document.getElementById("rightButton").onclick=function(){

    x+=step;

    if(x>95)x=95;

    character.style.transform="translate(-50%,-50%) scaleX(1)";

    update();

};

update();