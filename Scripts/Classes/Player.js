class Player extends Sprite {
    constructor({defaultBlocks,position, imageSrc,scale,frameRate,frameBuffer, animations, cropbox ,loop, isDestroyable, hitbox}){
        super({position, imageSrc,scale,frameRate,frameBuffer, animations, cropbox ,loop, isDestroyable, hitbox,});
        this.lastDirection = 'right';
        this.position = {
            x: 500,
            y: 100
        };
        this.velocity = {
            x:0,
            y:0
        }
        this.gravity = 1.5;
        this.defaultBlocks = defaultBlocks;
        this.hitPoint = 100;
        this.powerUp = false;
        this.type = 'player';
    }

    update(){
        this.position.x += this.velocity.x;
        //updating the player sides values on each frame.
        //check for horizontal collisions
        this.updateHitbox();

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
                    const offset = this.hitbox.position.x - this.position.x
                    this.position.x = collisionBlock.position.x + collisionBlock.width -offset + 0.01;
                    break;
                }

                if(this.velocity.x > 0) {
                    console.log('test2')
                    const offset = this.hitbox.position.x - this.position.x + this.hitbox.width;
                    this.position.x = collisionBlock.position.x -offset -0.01;
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

    updateHitbox() {
        this.hitbox.position = {
                x:this.position.x + 55,
                y:this.position.y + 50
            }
    }

    shoot(direction) {
        //console.log('hi');
        let velocityMultiplier;
        if( direction === 'right') {
            velocityMultiplier = 1;
            this.velocity.x+= -20;
        }
        else {
            this.velocity.x +=20;
            velocityMultiplier = -1;
        }
        const bullet = new Bullet({
            defaultBlocks: defaultBlocks,
            position:{
                x: this.position.x +this.scaledWidth/2,
                y: this.position.y +this.scaledHeight/2 -20
            },
            velocity:{
                x: velocityMultiplier * 20,
                y:0
            },
            imageSrc: '../../Sprites/normal_bullet.png',
            // height: 90,
            // width: 50
            scale : 4,
            frameRate: 1,
            frameBuffer:8,
            loop: false,
            isDestroyable: false,
            animations: {
                normalShootRight: {
                    frameRate: 1,
                    frameBuffer: 8,
                    loop: true,
                    imageSrc: '../../Sprites/normal_bullet_right.png',
        
                },
                normalShootLeft: {
                    frameRate: 1,
                    frameBuffer: 8,
                    loop: true,
                    imageSrc: '../../Sprites/normal_bullet_left.png',
        
                },
                megaShoot: {
                    frameRate: 7,
                    frameBuffer: 4,
                    loop: true,
                    imageSrc: '../../Sprites/weapon_bullet_level2.png',
                }

            },
            isDestroyable: true,
            cropbox:{
                position:{
                    x: 0,
                    y: 0 
                },
                height: 32,
                width: 32
            },
            hitbox:{
                position: {
                    x: this.position.x -10,
                    y: this.position.y +10
                },
                height: 10,
                width: 10
    
            }
        });
        //console.log(bullet)
        if(player.powerUp !== 'mega-bullet'){
            if(direction === 'right') {
                bullet.setSprite('normalShootRight');
            }
            else {
                bullet.setSprite('normalShootLeft');
            }
        }
        else {
            bullet.setSprite('megaShoot');
        }
        
        bulletList.push(bullet);
        //console.log(bullet.position, bullet.velocity);
        
    }

}