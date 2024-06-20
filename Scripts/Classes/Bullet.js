class Bullet extends Sprite {
    constructor({defaultBlocks,position, imageSrc,scale,frameRate,frameBuffer, animations, cropbox ,loop, isDestroyable, hitbox, velocity}){
        super({position, imageSrc,scale,frameRate,frameBuffer, animations, cropbox ,loop, isDestroyable, hitbox})

        this.gravity = 0.1;
        //this.position = position;
        this.velocity = velocity;
        this.direction;
        this.defaultBlocks = defaultBlocks;
        this.type = 'bullet'
    }

    updateBullet(i) {
        this.position.x += this.velocity.x;
        this.updateHitbox();
        if(player.powerUp !== 'mega-bullet'){

            this.applyGravity();
        }
        this.updateHitbox();
        this.checkForZombie(i);
        return this.checkForCollision(i,defaultBlocks);
    }

    applyGravity() {
        this.velocity.y += this.gravity;
        this.position.y += this.velocity.y;
    }

    setSprite(name) {
        if( this.image === this.animations[name].image) return
        this.currentFrame = 0;
        this.image = this.animations[name].image
        this.frameRate = this.animations[name].frameRate;
        this.frameBuffer = this.animations[name].frameBuffer;
    }

    updateHitbox() {
        this.hitbox = {
            position: {
                x:this.position.x,
                y:this.position.y
            },
            height: 10,
            width: 10

        }
    }

    checkForCollision(j,collisionBlocks) {
        for(let i =0; i < collisionBlocks.length ; i++) {
            const collisionBlock = collisionBlocks[i];

            //if a collision exists
            if (this.hitbox.position.x <= collisionBlock.position.x + collisionBlock.width &&
                this.hitbox.position.x + this.hitbox.width >= collisionBlock.position.x &&
                this.hitbox.position.y + this.hitbox.height >= collisionBlock.position.y &&
                this.hitbox.position.y <= collisionBlock.position.y + collisionBlock.height){
                    console.log(this.hitbox, collisionBlock)
                    //bulletList.splice(j,1);
                    console.log(i);
                    if(player.powerUp === 'mega-bullet'){
                        player.powerUp = false;
                    }
                    return true;
            }
        }
    }

    checkForZombie(j){
        for(let i =0; i < zombieList.length ; i++) {
            const zombie = zombieList[i];
            
            //if a collision exists
            if (this.hitbox.position.x <= zombie.hitbox.position.x + zombie.hitbox.width &&
                this.hitbox.position.x + this.hitbox.width >= zombie.hitbox.position.x &&
                this.hitbox.position.y + this.hitbox.height >= zombie.hitbox.position.y &&
                this.hitbox.position.y <= zombie.hitbox.position.y + zombie.hitbox.height){
                    
                    if(player.powerUp !== 'mega-bullet'){
                        bulletList.splice(j,1);
                    }
                    if(zombie.dying) {
                        
                        console.log('continueing');
                        if(player.powerUp !== 'mega-bullet'){
                            break;
                        }
                        else {
                            continue;
                        }
                    }
                    let temp = zombie.velocity.x;
                    zombie.velocity.x = 0;
                    if(player.powerUp !== 'mega-bullet'){
                        zombie.hitPoint-=gunDamage;
                    }
                    else {
                        zombie.hitPoint-=100;
                    }
                    
                    if(zombie.hitPoint >0){
                        if(zombie.lastDirection === 'right'){
                            zombie.switchSprite('hurtRight')
                        }
                        else{
                            zombie.switchSprite('hurtLeft')
                        }
                        
                        setTimeout(()=>{
                            if(!zombie.dying){
                                if(this.lastDirection === 'left'){
                                    if(temp === -3){
                                        zombie.switchSprite('runLeft')
                                        
                                    }
                                    else if(temp === -1){
                                        zombie.switchSprite('walkLeft')
                                    }
                                    else if(temp === 3){
                                        zombie.switchSprite('runRight')
                                    }
                                    else{
                                        zombie.switchSprite('walkRight')
                                    }
                                    
                                }
                                else{
                                    if(temp === -3){
                                        zombie.switchSprite('runLeft')
                                        
                                    }
                                    else if(temp === -1){
                                        zombie.switchSprite('walkLeft')
                                    }
                                    else if(temp === 3){
                                        zombie.switchSprite('runRight')
                                    }
                                    else{
                                        zombie.switchSprite('walkRight')
                                    }
                                }
                                
                            }
                            zombie.velocity.x = temp;
                        },1000)
                    }
                    else{
                        if(zombie.lastDirection === 'right'){
                            zombie.dying = true;
                            zombie.switchSprite('deathRight')
                        }
                        else{
                            zombie.dying = true;
                            zombie.switchSprite('deathLeft')
                        }
                        kills+=1;
                        if(player.powerUp === false){
                            powerUp+=1;
                        }
                        setTimeout(()=>{

                            zombieRemoveIdList.push(zombie.id);
                        },1000)
                        
                    }
                    
                    if(player.powerUp !== 'mega-bullet'){
                        break;
                    }
                    else {
                        continue;
                    }
                
            }
        }
    }
}