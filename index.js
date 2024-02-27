var ctx;
var values;
var minValue;
var maxValue;
var run = true;
var flies = []
var globalBest
var w = 0.8
var c1 = 0.1
var c2 = 0.1
var wText
var c1Text
var c2Text
var globalBestText
var stepsSinceBestChange = 0
function macumba(){
    let canvas = document.getElementById("my-canvas")
    ctx = canvas.getContext('2d')
    globalBestText = document.getElementById("globalBest")
    let globalBestManualText = document.getElementById("globalBestManual")
    wText = document.getElementById("w")
    c1Text = document.getElementById("c1")
    c2Text = document.getElementById("c2")
    let numberOfFlies = 30
    let globaBestManualPosition = [0,0]
    values = []
    minValue = 1000000
    maxValue = 0
    flies = []
    globalBest = {value: 1000000}

    for(let i=0;i<numberOfFlies;i++){
        let randomX = Math.random()*500
        let randomY = Math.random()*500
        let randomVX = Math.random()*10
        let randomVY = Math.random()*10

        if(Math.random()>0.5){
            randomVX = randomVX*-1
        }

        if(Math.random()>0.5){
            randomVY = randomVY*-1
        }

        flies.push({
            position: [randomX,randomY],
            velocity: [randomVX,randomVY],
            personalBest: {
                position: [randomX,randomY],
                value:getValue(randomX,randomY)
            }
        })
        if(flies[i].personalBest.value < globalBest.value){
            globalBest = {
                position: [flies[i].personalBest.position[0],flies[i].personalBest.position[1]],
                value: flies[i].personalBest.value
            }
        }
    }

    for(let i=0;i<=500;i++){
        values.push([])
        for(let j=0;j<=500;j++){
            let value = getValue(i,j)
            values[i][j] = value
            if(value<minValue){
                globaBestManualPosition[0]=i
                globaBestManualPosition[1]=j
                minValue = value
            }
            if(value>maxValue){
                maxValue = value
            }
            
        }
    }
    globalBestManualText.innerText = "Melhor ponto encontrado por busca exaustiva: "+globaBestManualPosition[0]+","+globaBestManualPosition[1]+" "+minValue
    wText.value = w
    c1Text.value = c1
    c2Text.value = c2
    //console.log(minValue)
    // console.log('macumba')
    // console.log(flies)
    
    drawAll(ctx,values,flies,minValue,maxValue)
    //updateFlies();
}

function updateFlies(step = false){
    while(run){
        for(let i of flies.keys()){
            // console.log('start update')
            // console.log(i)
            // console.log(flies[i])
            let current = getValue(flies[i].position[0],flies[i].position[1])
            if(current < flies[i].personalBest.value){
                flies[i].personalBest = {
                    position: [flies[i].position[0],flies[i].position[1]],
                    value:current
                }
            }
            if(flies[i].personalBest.value < globalBest.value){
                // console.log("mudou melhor")
                stepsSinceBestChange=0
                globalBest = {
                    position: [flies[i].personalBest.position[0],flies[i].personalBest.position[1]],
                    value: flies[i].personalBest.value
                }
            }
            flies[i].velocity = velocidadeDoDemonio(flies[i].velocity,flies[i].position,flies[i].personalBest.position,globalBest)
            // console.log('end update')
            // console.log(flies[i])
            flies[i].position[0] = flies[i].position[0] + flies[i].velocity[0]
            flies[i].position[1] = flies[i].position[1] + flies[i].velocity[1]
            
        }
        wText.value = w
        c1Text.value = c1
        c2Text.value = c2
        stepsSinceBestChange++;
        //console.log(flies)
        if(step){
            run = false
        }
        console.log(stepsSinceBestChange)
        if(stepsSinceBestChange>20){
            run = false
        }
        globalBestText.innerText = "Melhor ponto encontrado por enxame de particulas: "+globalBest.position[0]+","+globalBest.position[1]+" "+globalBest.value
        drawAll(ctx,values,flies,minValue,maxValue)
    }
}
function stop(){
    run = false
}

function continueFlies(){
    run = true
    updateFlies();
}

function step(){
    // console.log('step')
    // console.log(flies)
    run = true
    updateFlies(true);
}

function updateWeight(){
    w = wText.value
    c1 = c1Text.value
    c2 = c2Text.value
}

function drawAll(ctx,values,flies,minValue,maxValue){
    //clears canvas
    clearCanvas(ctx)

    //draws background
    for(let i=0;i<=500;i++){
        for(let j=0;j<=500;j++){
            let value = values[i][j]
            //console.log(value,minValue, maxValue)
            value = (value-minValue) * (255/(maxValue-minValue))
            let color = getColorFromValue(value)
            //console.log(value)
            ctx.fillStyle = "rgba("+color[0]+","+color[1]+","+color[2]+","+255+")";
            ctx.fillRect( i, j, 1, 1 );
        }
        
    }
    
    //draws all flies
    for(let i=0;i<flies.length;i++){
        drawFly(ctx,flies[i])    
    }

    ctx.beginPath();
    ctx.arc(globalBest.position[0],globalBest.position[1], 3, 0, 2 * Math.PI);
    ctx.fillStyle = "red";
    ctx.fill();

    // console.log('endDraw')
    // console.log(flies)
}

function drawFly(ctx,fly){
    //draw personalBest
    ctx.beginPath();
    ctx.arc(fly.personalBest.position[0],fly.personalBest.position[1], 3, 0, 2 * Math.PI);
    ctx.fillStyle = "CornflowerBlue";
    ctx.fill();

    //draw currentPos
    ctx.beginPath();
    ctx.arc(fly.position[0],fly.position[1], 3, 0, 2 * Math.PI);
    ctx.fillStyle = "blue";
    ctx.fill();

    //draw velocity
    ctx.beginPath();
    ctx.moveTo(fly.position[0],fly.position[1]);
    ctx.lineTo(fly.position[0] + fly.velocity[0],fly.position[1] + fly.velocity[1]);
    ctx.strokeStyle = "red";
    ctx.lineWidth = 1;
    ctx.stroke();
}

function clearCanvas(ctx){

    ctx.beginPath();
    ctx.clearRect(0, 0, 1000, 1000);
    ctx.stroke();

}

function getColorFromValue(value){
    let color = []
    //console.log(value)
    if(value>=0 && value<64){
        //console.log('caso1')
        color = [255-(value*(255/64)),255,0]
    }else if(value>=64 && value<128){
        //console.log('caso2')
        color = [0,255,0+((value-64)*(255/64))]
    }else if(value>=128 && value<192){
        //console.log('caso3')
        color = [0,255-((value-128)*(255/64)),255]
    }else{
        //console.log('caso4')
        color = [0+((value-192)*(255/64)),0,255]
    }
    return color
}

function getValue(x,y){
    x = x/100
    y = y/100
    return (x-3.14)**2 + (y-2.72)**2 + Math.sin(3*x+1.41) + Math.sin(4*y-1.73)
}

function velocidadeDoDemonio(velocity,currentPos,pbest,gbest){
    let r1 = Math.random()
    let r2 = Math.random()
    let newXVelocity = w*velocity[0]+c1*r1*(pbest[0]-currentPos[0])+c2*r2*(gbest.position[0]-currentPos[0])
    let newYVelocity = w*velocity[1]+c1*r1*(pbest[1]-currentPos[1])+c2*r2*(gbest.position[1]-currentPos[1])
    let newVelocity = [newXVelocity,newYVelocity]
    // console.log("newVelocity")
    // console.log(velocity)
    // console.log(currentPos)
    // console.log(pbest)
    // console.log(gbest)
    // console.log(newVelocity)
    return newVelocity
}

function test(){
    let a = [1,1]
    let b = [3,5]
    let c = [a[0]+b[0],a[1]+b[1]]
    // console.log(c)
}