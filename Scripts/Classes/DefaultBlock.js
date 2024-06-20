class DefaultBlock {
    constructor({position}){
        this.position = position;
        this.width = 64;
        this.height = 64;
        this.scale = 1.33333333;
        if(this.position.x === 0 && this.position.y === 64*8) {
            // console.log('ok');
            this.blockType = 1;
        }
        else if(this.position.x === 64*15 && this.position.y === 64*8) {
            // console.log('bye')
            this.blockType = 3;
        }
        else {
            // console.log('hi')
            this.blockType = 2;
        }
    }

    draw() {
        let image = new Image();

        if(this.blockType === 1){
            // console.log('test1');
            //image.src = '../../Sprites/tile012.png';
        }
        else if(this.blockType === 2){
            // console.log('test2');
            //image.src = '../../Sprites/tile013.png';
        }
        else {
            // console.log('test3');
            //image.src = '../../Sprites/tile014.png';
        }
        if(this.hitPoint <= 0){
            return true;
        }
        //console.log('draw');
        //console.log(this.position.x);
        c.drawImage(image,this.position.x,this.position.y,image.width*this.scale, image.height* this.scale);           
    }
}