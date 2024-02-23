function macumba(){
    let canvas = document.getElementById("my-canvas")
    let ctx = canvas.getContext('2d')
    let numberOfFlies = 30
    let flies = []
    let globalBest = {}
    let values = []
    let minValue = 1000000
    let maxValue = 0
    let inertia = 10

    for(let i=0;i<numberOfFlies;i++){
        flies.push({
            x:i*10,
            y:i*10,

        })
    }

    for(let i=0;i<=500;i++){
        values.push([])
        for(let j=0;j<=500;j++){
            let value = getValue(i,j)
            if(value<minValue){
                minValue = value
            }
            if(value>maxValue){
                maxValue = value
            }
            console.log(value)
            values[i][j] = value
            ctx.fillStyle = "rgba("+value+","+value+","+value+","+255+")";
            ctx.fillRect( i, j, 1, 1 );
        }
    }

    for(let i=0;i<flies.length;i++){
        flies[i].personalBest = {x:flies[i].x,y:flies[i].y}
        drawFly(ctx,flies[i])    
    }

    //clearCanvas(ctx)




}

function drawFly(ctx,fly){
    //draw personalBest
    ctx.beginPath();
    ctx.arc(fly.personalBest.x,fly.personalBest.y, 3, 0, 2 * Math.PI);
    ctx.fillStyle = "CornflowerBlue";
    ctx.fill();

    //draw currentPos
    ctx.beginPath();
    ctx.arc(fly.x,fly.y, 3, 0, 2 * Math.PI);
    ctx.fillStyle = "blue";
    ctx.fill();
}

function clearCanvas(ctx){

    ctx.beginPath();
    ctx.clearRect(0, 0, 1000, 1000);
    ctx.stroke();

}

function getValue(x,y){
    return Math.pow(Math.sin(x),2)+Math.pow(Math.sin(y),2)+(Math.sin(x)*Math.sin(y))
}