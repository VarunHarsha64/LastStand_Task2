
Array.prototype.createObjectsFrom2D = function () {
    const objects = [];
    this.forEach((row,y)=>{
        row.forEach((symbol,x)=>{
            if(symbol) {
                //push a new collision into collisionblocks array
                objects.push(new DefaultBlock({
                    position: {
                        x: x * 64,
                        y: y * 64
                    }
                }))
            }
        })
    })

    return objects;
}
