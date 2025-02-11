canvas = document.getElementById("canvas")
const ctx = canvas.getContext("2d")

canvas.height = 512;
canvas.width = 448;

//Variables des MEXICANS
const files = 6
const columnes = 12
const ampleMur = 30;
const alturaMur = 14;
const margeTmur = 80;
const margeEmur = 30;
const sepMurs = 2;

const murs = []
const ESTAT_MUR = {
    DESTRUIT: 0,
    SHOW: 1
}

const Sprites = document.getElementById("sprites")
const Murs = document.getElementById("murs")

for(let c=0; c<columnes; c++){
    murs[c] = []
    for(let f=0; f<files; f++){
        let color = Math.floor(Math.random()*3)
        const murX = margeEmur+c*(ampleMur+sepMurs)
        const murY = margeTmur+f*(alturaMur+sepMurs)
        murs[c][f] = {
            x: murX,
            y: murY,
            status: ESTAT_MUR.SHOW,
            color: color
        }
    }
}

//Variables Vida
let vida = 3

// Variables Pilotes
let radiPilota = 4;

let x = canvas.width / 2
let y = canvas.height - 30

//Velocitat PILOTA
let dx = 2
let dy = -2

//Variables Pala
let amplePala = 50;
const alturaPala = 10;

let sensibilitat = 8;
let dreta = false;
let esquerra = false;

let palaX = (canvas.width-amplePala) / 2
let palaY = canvas.height - alturaPala - 10

function pintarPilota(){
    ctx.beginPath();
    ctx.arc(x, y, radiPilota, 0, Math.PI*2);
    ctx.fillStyle = "#FFF";
    ctx.fill();
    ctx.closePath();
}
function pintarPala(){
    ctx.drawImage(
    Sprites,
    0,
    0,
    807,
    118,
    palaX,
    palaY,
    amplePala,
    alturaPala,
    )
}
function pintarMurs(){
    for(let c=0; c<columnes; c++){
        for(let f=0; f<files; f++){
            const murActual = murs[c][f];
            if(murActual.status == ESTAT_MUR.DESTRUIT){
                continue;
            }
            ctx.fillStyle = murActual.color;
            ctx.rect(murActual.x,murActual.y,ampleMur,alturaMur)
            ctx.fill();
        }
    }

}
function detecciColisio(){
if(y + radiPilota >= palaY - alturaPala/2 && y <=palaY && x >= palaX && x <= palaX + amplePala){
    dy=-dy
}

for(let c=0; c<columnes; c++){
    for(let f=0; f<files; f++){
        const murActual = murs[c][f];
        if(murActual.status == ESTAT_MUR.DESTRUIT){
            continue;
        }
        const mateixaXmur =  x > murActual.x && x < murActual.x + ampleMur;
        const mateixaYmur =  y > murActual.y && y < murActual.y + alturaMur;
        if( mateixaXmur & mateixaYmur){
            dy = -dy
            murActual.status = ESTAT_MUR.DESTRUIT
        }
    }
}

}


function movimentPilota(){
    //REBOT EIX X
    if(x + dx >= canvas.width|| x + dx <= 0){
        dx=-dx
    }
    //REBOT EIX Y
    if(y  + dy <= 0){
        dy=-dy
    }
    //GAME OVER
    if(y  + dy > canvas.height ){
        vida -- 
        x = canvas.width / 2
        y = canvas.height - 30
    dx = 2
    dy = -2
    if(vida==0){
        console.log("GAMEOVER")
        document.location.reload();
    }
    }
    x += dx
    y += dy
}

function movimentPala(){
    if(dreta && palaX < canvas.width - amplePala){
        palaX += sensibilitat
    }else if(esquerra && palaX > 0){
        palaX -= sensibilitat
    }


}

function borrarPantalla(){
    canvas.height = 512;        
    canvas.width = 448;
}

function inicialitzadorEvents(){
    document.addEventListener('keydown', pulsar);
    document.addEventListener('keyup', soltar);

    function pulsar(event){
        if(event.key =='ArrowRight' || event.key =='d'){
            dreta = true;
        }
        if(event.key =='ArrowLeft' || event.key =='a'){
            esquerra = true;
        }
        if(event.key == '+'){
            amplePala = amplePala*2
            palaX = (canvas.width - amplePala)/2;
        }
        if(event.key == '-'){
            amplePala = amplePala/2
            palaX = (canvas.width - amplePala)/2;   
        }
        if(event.key == 'z'){
            radiPilota = radiPilota*2
        }
        if(event.key == 'x'){
            radiPilota = radiPilota/2
        }
        if(event.key == 'c'){
            sensibilitat = sensibilitat*2
        }
        if(event.key == 'v'){
            sensibilitat = sensibilitat/2
        }
        if(event.key == 'b'){
            dx=dx*2
            dy=dy*2
        }
        if(event.key == 'n'){
            dx=dx/2
            dy=dy/2
        }
        if(event.key == 'm'){
            dxn=dx;
            dyn=dy;
            dx= 0;
            dy= 0;
            setTimeout(() =>{
                dx=dxn
                dy=dyn
            },3000)
        }
    }

    function soltar(event){
        if(event.key =='ArrowRight' || event.key =='d'){
            dreta = false;
        }
        if(event.key =='ArrowLeft' || event.key =='a'){
            esquerra = false;
        }

    }

}

function pintarCanvas(){
    console.log("Hola");
    borrarPantalla();
    pintarPilota();
    pintarPala();
    pintarMurs();
    detecciColisio();
    movimentPilota();
    movimentPala();
    window.requestAnimationFrame(pintarCanvas);
    ctx.fillText("VIDA:"+ vida,10,10);
}

pintarCanvas();
inicialitzadorEvents();