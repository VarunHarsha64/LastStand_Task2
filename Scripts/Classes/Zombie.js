class Zombie extends Sprite {
    constructor({defaultBlocks,position, imageSrc,scale,frameRate,frameBuffer, animations, cropbox ,loop, isDestroyable, hitbox}){
        super({position, imageSrc,scale,frameRate,frameBuffer, animations, cropbox ,loop, isDestroyable, hitbox});
        this.lastDirection = 'right';
        this.id;
        this.position = {
            x: 100,
            y: 100
        };
        this.velocity = {
            x:0,
            y:0
        }
        this.gravity = 1.5;
        this.defaultBlocks = defaultBlocks;
        this.hitPoint = 100;
        this.attackbox ={
            position: {
                x:this.position.x + 30,
                y:this.position.y + 10
            },
            width: 80,
            height:50
        };
        this.isAttacking = false;
        this.dying = false;
        this.type = 'zombie';
    }

    update(){
        //console.log(this.velocity.x);
        this.position.x += this.velocity.x;
        //updating the player sides values on each frame.
        //check for horizontal collisions
        this.updateHitbox();
        this.checkForPlayerCollision();
        this.checkForHorizontalCollisions(this.defaultBlocks);
        this.applyGravity();
        //updating the player sides values on each frame.
        this.updateHitbox();

        // c.fillStyle = 'rgba(255,0,0,0.5)'
        // c.fillRect(this.hitbox.position.x, this.hitbox.position.y, this.hitbox.width, this.hitbox.height)
        //check for vertical collisison
        this.checkForVerticalCollisions(this.defaultBlocks);
        this.updateHitbox();
    }
    
    switchSprite(name) {
        //console.log(name,this.animations)
        if( this.image === this.animations[name].image) return
        this.currentFrame = 0;
        this.image = this.animations[name].image
        this.frameRate = this.animations[name].frameRate;
        this.frameBuffer = this.animations[name].frameBuffer;
        this.loop = this.animations[name].loop;


    }

    checkForHorizontalCollisions(collisionBlocks) {
        for(let i =0; i < collisionBlocks.length ; i++) {
            const collisionBlock = collisionBlocks[i];

            //if a collision exists
            if (this.hitbox.position.x <= collisionBlock.position.x + collisionBlock.width &&
                this.hitbox.position.x + this.hitbox.width >= collisionBlock.position.x &&
                this.hitbox.position.y + this.hitbox.height >= collisionBlock.position.y &&
                this.hitbox.position.y <= collisionBlock.position.y + collisionBlock.height){
                if(this.velocity.x < 0) {
                    console.log('test')
                    const offset = this.hitbox.position.x - this.position.x
                    this.position.x = collisionBlock.position.x + collisionBlock.width -offset + 0.01;
                    this.velocity.x*=-1;
                    // if(this.lastDirection === 'right'){
                    //     this.switchSprite('walkLeft')
                    //     this.lastDirection = 'left';
                    // }
                    // else{
                    //     this.switchSprite('walkRight');
                    //     this.lastDirection = 'right';
                    // }
                    if(this.lastDirection === 'right'){
                        if(this.velocity.x === -3){
                            this.switchSprite('runLeft')
                            
                        }
                        else{
                            this.switchSprite('walkLeft')
                        }
                        this.lastDirection = 'left';
                        
                    }
                    else{
                        if(this.velocity.x === 3){
                            this.switchSprite('runRight')
                        }
                        else{
                            this.switchSprite('walkRight')
                        }
                        this.lastDirection = 'right';
                    }
                    console.log('test1')
                    break;
                }

                if(this.velocity.x > 0) {
                    console.log('test2')
                    const offset = this.hitbox.position.x - this.position.x + this.hitbox.width;
                    this.position.x = collisionBlock.position.x -offset -0.01;
                    this.velocity.x*=-1;
                    if(this.lastDirection === 'right'){
                        if(this.velocity.x === -3){
                            this.switchSprite('runLeft')
                            
                        }
                        else{
                            this.switchSprite('walkLeft')
                        }
                        this.lastDirection = 'left';
                        
                    }
                    else{
                        if(this.velocity.x === 3){
                            this.switchSprite('runRight')
                        }
                        else{
                            this.switchSprite('walkRight')
                        }
                        this.lastDirection = 'right';
                    }
                    break;
                }
            }
        }
    }

    applyGravity() {
        keys.w.pressed = true;
        this.velocity.y += this.gravity;
        this.position.y += this.velocity.y;
    }

    checkForVerticalCollisions(collisionBlocks) {
        for(let i =0; i < collisionBlocks.length ; i++) {
            const collisionBlock = collisionBlocks[i];

            //if a collision exists
            if (this.hitbox.position.x <= collisionBlock.position.x + collisionBlock.width &&
                this.hitbox.position.x + this.hitbox.width >= collisionBlock.position.x &&
                this.hitbox.position.y + this.hitbox.height >= collisionBlock.position.y &&
                this.hitbox.position.y <= collisionBlock.position.y + collisionBlock.height){
                if(this.velocity.y < 0) {
                    this.velocity.y = 0;
                    const offset = this.hitbox.position.y - this.position.y
                    this.position.y = collisionBlock.position.y + collisionBlock.height -offset + 0.01;
                    break;
                }

                if(this.velocity.y > 0) {
                    this.velocity.y = 0;
                    //this.switchToJumpSprite()
                    const offset = this.hitbox.position.y - this.position.y + this.hitbox.height
                    this.position.y = collisionBlock.position.y - offset -0.01;
                    break;
                }
            }
        }
    }

    checkForPlayerCollision(){
        if(this.dying) return;
        if (this.hitbox.position.x <= player.hitbox.position.x + player.hitbox.width &&
            this.hitbox.position.x + this.hitbox.width >= player.hitbox.position.x &&
            this.hitbox.position.y + this.hitbox.height >= player.hitbox.position.y &&
            this.hitbox.position.y <= player.hitbox.position.y + player.hitbox.height){
            if(this.velocity.x < 0) {
                let temp = this.velocity.x;
                this.velocity.x = 0;
                this.attack(temp);
                
            }

            if(this.velocity.x > 0) {
                let temp = this.velocity.x;
                this.velocity.x = 0;
                //this.switchToJumpSprite()
                this.attack(temp);
                
            }
        }
    }

    updateHitbox() {
        this.hitbox.position = {
                x:this.position.x + 30,
                y:this.position.y + 10
            }

        if(this.lastDirection === 'right'){
            this.attackbox.position = {
                x:this.position.x + 40,
                y:this.position.y + 30
            }
        }    
        else{
            this.attackbox.position = {
                x:this.position.x+10,
                y:this.position.y + 30
            }
        }   
        
    }

    randomizePosition() {
        this.velocity.x = Math.random() < 0.5?1:-1;
        if(this.velocity.x === -1) {
            console.log('hi')
            this.position.x = 800 - (Math.random()*40);
            this.switchSprite('walkLeft')
            this.lastDirection = 'left';
        }
        else {
            this.position.x = 100 + (Math.random()*40);
            this.switchSprite('walkRight')
            this.lastDirection = 'right';
        }
        this.position.y = 370;
    }

    attack(temp){
        if(this.lastDirection === 'right'){
            this.switchSprite('attackRight')
        }
        else{
            this.switchSprite('attackLeft')
        }
        if(player.powerUp !== 'immunity'){
            if(this.attackbox.position.x <= player.hitbox.position.x + player.hitbox.width &&
                this.attackbox.position.x + this.attackbox.width >= player.hitbox.position.x &&
                this.attackbox.position.y + this.attackbox.height >= player.hitbox.position.y &&
                this.attackbox.position.y <= player.hitbox.position.y + player.hitbox.height){
    
                    if(player.lastDirection === 'right'){
                        player.switchSprite('hitRight')
                    }
                    else{
                        player.switchSprite('hitLeft')
                    }
                    
                    player.hitPoint-=10;
                    currentlyShooting = 1;
    
            }
        }
        
        setTimeout(()=>{
            this.velocity.x = temp;
            currentlyShooting = 0;
            if(this.lastDirection === 'right'){
                if(this.velocity.x === 3){
                    this.switchSprite('runRight')
                }
                else{
                    this.switchSprite('walkRight')
                }
                
            }
            else{
                if(this.velocity.x === -3){
                    this.switchSprite('runLeft')
                }
                else{
                    this.switchSprite('walkLeft')
                }
            }
            
        },1000)
    }

}