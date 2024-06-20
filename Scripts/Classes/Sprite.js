class Sprite {
    constructor({position, imageSrc,scale =1,frameRate =1,frameBuffer = 8, animations, cropbox ,loop, isDestroyable, hitbox = false}){
        this.animations = animations;
        this.isDestroyable = isDestroyable;
        this.position = position;
        this.scale = scale;
        this.cropbox = cropbox;
        this.frameBuffer = frameBuffer;
        this.hitbox = hitbox;
        this.image = new Image();
        this.image.src = imageSrc;
        this.frameRate = frameRate;
        this.loaded = false;
        this.image.onload = ()=>{
            this.loaded = true;
            this.height = this.image.height;
            this.width = (this.image.width) / this.frameRate;
            this.scaledWidth = this.width * this.scale;
            this.scaledHeight = this.height * this.scale;
        }
        this.currentFrame = 0;
        this.elapsedFrames = 0;
        this.loop = loop;

        if (this.animations) {
            for(let key in this.animations) {
                const image = new Image();
                image.src = this.animations[key].imageSrc
                this.animations[key].image = image
            }
        }


    }

    draw(){
        if(this.loaded){
            //console.log(this)
            if(this.isDestroyable){ //for sprites that have health code here
                //console.log('hi');
                //console.log(this)
                c.drawImage(this.image, this.cropbox.position.x, this.cropbox.position.y, this.cropbox.width, this.cropbox.height, this.position.x, this.position.y, this.scaledWidth, this.scaledHeight);
            }
            else { //for sprites which do not have health code here
                
                c.drawImage(this.image, this.cropbox.position.x, this.cropbox.position.y, this.cropbox.width, this.cropbox.height, this.position.x, this.position.y, this.scaledWidth, this.scaledHeight);
            }
            this.updateFrames();
        }

        
    }

    updateFrames() {
        
        this.elapsedFrames++;
        if( this.elapsedFrames % this.frameBuffer === 0) {
            if (this.currentFrame < this.frameRate - 1) {
                this.currentFrame++;
            }
            else {
                if(this.loop){
                    if(this.type === 'zombie' && this.frameRate === 10)
                        {
                            this.currentFrame = 4;
                        }
                    else {
                        this.currentFrame = 0;
                    }
                    
                }
                else{
                    //do nothin as of now
                }
                
            }
        }

        this.cropbox.position.x = this.width * this.currentFrame;

    }
}