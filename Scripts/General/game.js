const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d')
canvas.width = 64 * 16;
canvas.height = 64 * 9;

const background = new Sprite({
    position : {
        x:0,
        y:0
    },
    imageSrc: '../../Sprites/main_game_bg_4.png',
    scale: 1.3333333,
    frameRate: 1,
    frameBuffer:1,
    animations: false,
    cropbox: {
        position:{
            x:0,
            y:0
        },
        height: 480,
        width: 768
    },
    loop: false,
    isDestroyable: false
})

const defaultBlocks = defaultBlocksPosition.createObjectsFrom2D();
//console.log(defaultBlocks);

const player = new Player({
    defaultBlocks:defaultBlocks,
    position: {
        x: 900,
        y:300
    }, 
    imageSrc:'../../Sprites/shooter_idle_right.png',
    scale:2,
    frameRate:5,
    frameBuffer:8, 
    animations:{
        idleRight: {
            frameRate: 5,
            frameBuffer: 6,
            loop: true,
            imageSrc: '../../Sprites/shooter_idle_right.png',

        },
        idleLeft: {
            frameRate: 5,
            frameBuffer: 8,
            loop: true,
            imageSrc: '../../Sprites/shooter_idle_left.png',

        },
        runRight: {
            frameRate: 6,
            frameBuffer: 8,
            loop: true,
            imageSrc: '../../Sprites/shooter_run_right.png',

        },
        runLeft: {
            frameRate: 6,
            frameBuffer: 8,
            loop: true,
            imageSrc: '../../Sprites/shooter_run_left.png',

        },
        jumpRight: {
            frameRate: 1,
            frameBuffer: 1,
            loop: false,
            imageSrc: '../../Sprites/shooter_jump_right.png',

        },
        jumpLeft: {
            frameRate: 1,
            frameBuffer: 8,
            loop: false,
            imageSrc: '../../Sprites/shooter_jump_left.png',

        },
        shootRight: {
            frameRate: 3,
            frameBuffer: 5,
            loop: false,
            imageSrc: '../../Sprites/shooter_shoot_right.png',

        },
        shootLeft: {
            frameRate: 3,
            frameBuffer:5,
            loop: false,
            imageSrc: '../../Sprites/shooter_shoot_left.png',

        },
        hitRight: {
            frameRate: 4,
            frameBuffer: 5,
            loop: false,
            imageSrc: '../../Sprites/shooter_hit_right.png',

        },
        hitLeft: {
            frameRate: 4,
            frameBuffer:5,
            loop: false,
            imageSrc: '../../Sprites/shooter_hit_left.png',

        },
    }, 
    cropbox:{
        position: {
            x:0,
            y:0
        },
        width: 90,
        height: 90

    },
    loop:true, 
    isDestroyable:true, 
    hitbox:{
        position: {
            x:0,
            y:0
        },
        height: 80,
        width: 70
    }
});

const keys = {
    w:{
        pressed:false,
    },
    a: {
        pressed:false,
    },
    d: {
        pressed:false,
    },
    space: {
        pressed:false
    }
}

let bulletList = [];
let bulletReloadTime = 400;
let currentlyShooting = false;

let zombieList = [];
let zombieRemoveIdList = [];
let kills = 0;

const torches = [];

const torch1 = new Sprite({
    position : {
        x:100,
        y:canvas.height -145
    },
    imageSrc: '../../Sprites/zombie_spawner_torch.png',
    scale: 1.5,
    frameRate: 8,
    frameBuffer:8,
    animations: false,
    cropbox: {
        position:{
            x:0,
            y:0
        },
        height: 64,
        width: 64
    },
    loop: true,
    isDestroyable: false
});

const torch2 = new Sprite({
    position : {
        x:canvas.width - 100 - 64*1.5,
        y:canvas.height -145
    },
    imageSrc: '../../Sprites/zombie_spawner_torch.png',
    scale: 1.5,
    frameRate: 8,
    frameBuffer:8,
    animations: false,
    cropbox: {
        position:{
            x:0,
            y:0
        },
        height: 64,
        width: 64
    },
    loop: true,
    isDestroyable: false
})

let gameLevel = 0;



function handlePlayerMovement(){
    if(keys.d.pressed) {
        
        if(!currentlyShooting){
            player.velocity.x =10;
            player.switchSprite('runRight');
        }
        player.lastDirection = 'right';
    }
    else if(keys.a.pressed) {
        
        if(!currentlyShooting){
            player.velocity.x =-10;
            player.switchSprite('runLeft')
        }
        player.lastDirection = 'left';
    }
    else {

        
        if(!currentlyShooting){
            if(player.lastDirection === 'left') {
                
                player.switchSprite('idleLeft')
            }
            else {
                
                player.switchSprite('idleRight')
            }
        }
        
    }
    player.velocity.x+= player.velocity.x*-1*0.2;
    if(player.velocity.y !=0) {
        if(!currentlyShooting){
            if(player.lastDirection === 'left') {
                
                player.switchSprite('jumpLeft');
            }
            else {
                
                player.switchSprite('jumpRight');
            }
        }
        
    }
    if(keys.space.pressed) {
        if(player.lastDirection === 'left') {
            
            if(!currentlyShooting){
                player.switchSprite('shootLeft');
                player.shoot(player.lastDirection);
                currentlyShooting = 1;
                setTimeout(()=>{
                    console.log('no error')
                    currentlyShooting = 0
                },bulletReloadTime);
            }
            
        }
        else {
            if(!currentlyShooting){
                player.switchSprite('shootRight');
                player.shoot(player.lastDirection);
                currentlyShooting = 1;
                setTimeout(()=>{
                    console.log('no error')
                    currentlyShooting = 0
                },bulletReloadTime);
            }
        }
    }
}

function handleUpdateBullet(){
    for (let i = 0; i <= bulletList.length -1 ; i++) {
        let bullet = bulletList[i];
        
        if(bullet.updateBullet(i)){
            bulletList.splice(i,1);
            i--;
            console.log('spliced');
        }
        bullet.draw();
        //c.fillStyle = 'white';
        //c.fillRect(bullet.position.x, bullet.position.y, bullet.width, bullet.height)
    }
    
}

function handleUpdateZombie(){
    for (let i = 0; i <= zombieList.length -1 ; i++) {
        let zombie = zombieList[i];
        if(zombieRemoveIdList.includes(zombie.id)){
            let index = zombieRemoveIdList.indexOf(zombie.id);
            if (index > -1) {
                zombieRemoveIdList.splice(index, 1);
            }
            zombieList.splice(i,1);
            i--;

        }

        zombie.draw();
        zombie.update();
        //c.fillStyle = 'rgba(0,0,0,0.5)'
        //c.fillRect(zombie.attackbox.position.x, zombie.attackbox.position.y, zombie.attackbox.width, zombie.attackbox.height)
        //c.fillStyle = 'white';
        //c.fillRect(bullet.position.x, bullet.position.y, bullet.width, bullet.height)
    }
}

function zombieSpawner(i){
    const zombie = new Zombie({
        defaultBlocks:defaultBlocks,
        position: {
            x: 100,
            y: 500
        }, 
        imageSrc:'../../Sprites/zombie_normal_walk_right.png',
        scale:2,
        frameRate:6,
        frameBuffer:8, 
        animations: {
            idleRight: {
                id:'idleRight',
                frameRate: 4,
                frameBuffer: 15,
                loop: true,
                imageSrc: '../../Sprites/zombie_normal_idle_right.png',
    
            },
            idleLeft: {
                id:'idleLeft',
                frameRate: 4,
                frameBuffer: 15,
                loop: true,
                imageSrc: '../../Sprites/zombie_normal_idle_left.png',
    
            },
            runRight: {
                id:'runRight',
                frameRate: 10,
                frameBuffer: 8,
                loop: true,
                imageSrc: '../../Sprites/zombie_normal_run_right.png',
    
            },
            runLeft: {
                id:'runLeft',
                frameRate: 10,
                frameBuffer: 8,
                loop: true,
                imageSrc: '../../Sprites/zombie_normal_run_left.png',
    
            },
            walkRight: {
                id:'walkRight',
                frameRate: 6,
                frameBuffer: 15,
                loop: true,
                imageSrc: '../../Sprites/zombie_normal_walk_right.png',
    
            },
            walkLeft: {
                id:'walkLeft',
                frameRate: 6,
                frameBuffer: 15,
                loop: true,
                imageSrc: '../../Sprites/zombie_normal_walk_left.png',
    
            },
            attackRight: {
                id:'attackRight',
                frameRate: 6,
                frameBuffer: 8,
                loop: false,
                imageSrc: '../../Sprites/zombie_normal_attack_right.png',
    
            },
            attackLeft: {
                id:'attackLeft',
                frameRate: 6,
                frameBuffer: 8,
                loop: false,
                imageSrc: '../../Sprites/zombie_normal_attack_left.png',
    
            },
            hurtRight: {
                id: 'hurtRight',
                frameRate: 5,
                frameBuffer: 8,
                loop: false,
                imageSrc: '../../Sprites/zombie_normal_hurt_right.png',
    
            },
            hurtLeft: {
                id:'hurtLeft',
                frameRate: 5,
                frameBuffer: 8,
                loop: false,
                imageSrc: '../../Sprites/zombie_normal_hurt_left.png',
    
            },
            deathRight: {
                id: 'deathRight',
                frameRate: 8,
                frameBuffer: 8,
                loop: false,
                imageSrc: '../../Sprites/zombie_normal_death_right.png',
    
            },
            deathLeft: {
                id:'deathLeft',
                frameRate: 8,
                frameBuffer: 8,
                loop: false,
                imageSrc: '../../Sprites/zombie_normal_death_left.png',
    
            }
            
        },
        cropbox:{
            position: {
                x:0,
                y:0
            },
            width: 64,
            height: 64
    
        },
        loop:true, 
        isDestroyable:true, 
        hitbox:{
            position: {
                x:0,
                y:0
            },
            height: 112,
            width: 67
        }
    });
    zombie.id = i;
    zombie.randomizePosition();
    //zombie.update();
    zombieList.push(zombie);
}

function animate(){
    updateGun();
    updateKills()
    //console.log('animating...')
    c.clearRect(0, 0, canvas.width, canvas.height);
    background.draw();

    for(let i=0; i<=defaultBlocks.length -1; i++){
        //console.log('loop');
        defaultBlocks[i].draw();
    }
    handleUpdateBullet();
    handlePlayerMovement();

    torch1.draw();
    torch2.draw();
    // c.fillStyle = 'rgba(0,0,0,0.5)';
    // c.fillRect(torch1.position.x, torch1.position.y, torch1.scaledWidth, torch1.scaledHeight)
    // c.fillStyle = 'rgba(255,255,255,0.5)';
    // c.fillRect(torch2.position.x, torch2.position.y, torch2.width, torch2.height)

    

    handleUpdateZombie();

    player.update();
    player.draw();
    //zombie.handleZombieMovement()

    //zombie.update();
    //zombie.draw();
    //player.update();

    //c.fillStyle = 'rgba(0,0,0,0.5)'
    //c.fillRect(zombie.hitbox.position.x, zombie.hitbox.position.y, zombie.hitbox.width, zombie.hitbox.height)

    //c.fillStyle = 'rgba(0,0,255,0.5)'
    //c.fillRect(zombie.position.x, zombie.position.y, zombie.scaledWidth, zombie.scaledHeight)
    //console.log(player.hitPoint);
    //console.log(bulletList);
    animationFrameRequest = window.requestAnimationFrame(animate);
    updateHealthBar(document.querySelector('.health-bar-inner'),player);
    updatePowerUpBar();
    
}

function fibonacciValue(n) {
    if (n < 1) {
        return 2;
    }
    let a = 1, b = 2;
    for (let i = 1; i <= n; i++) {
        let temp = a + b;
        a = b;
        b = temp;
    }
    return b;
}
function updateLevelRequirements(level){
    document.querySelector('.level-bar').innerHTML = `Level ${level}`;
    zombieList = [];
    for(i=0;i<=fibonacciValue(level)-1;i++){
        zombieSpawner(i+1);
    }
    for(i=0;i<=level;i++){
        zombieRunner();
    }
}

function updateHealthBar(healthBarInner,player) {
    if(player.hitPoint <= 0){
        document.querySelector('.game-overlay').style.backgroundColor = 'rgba(0,0,0,0.5)';
        cancelAnimationFrame(animationFrameRequest);
        handlePopUp('game-over');
        clearInterval(timerRequest);
    }
    healthBarInner.style.width = `${player.hitPoint}%`;
  }

function updatePowerUpBar(){
    if(powerUp === 10){
        powerUp = 0;
        choosePowerUp();
        return;
    }
    const powerUpBarInner = document.querySelector('.fill');
    let newWidth = (powerUp * 10) + '%';
    powerUpBarInner.style.width = newWidth;
}



function updateTimer() {
    if(timer%20 === 0 && player.hitPoint<=90){ player.hitPoint+=10};
    timer += 1;
    document.querySelector('.timer').innerHTML = formatTime(timer);
}

function formatTime(totalSeconds) {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return `${padTime(hours)}:${padTime(minutes)}:${padTime(seconds)}`;
}

function padTime(time) {
    return String(time).padStart(2, '0');
}

function handlePauseButton() {
    document.querySelector('.countdown-pause').innerHTML = `3`;
    clearInterval(req);
    if(player.hitPoint<=0){return}
    isPaused = true;
    document.querySelector('.pause-icon').style.display = 'none';
    document.querySelector('.continue-icon').style.display = 'block';
    console.log('Game paused!');
    document.querySelector('.game-overlay').style.backgroundColor = 'rgba(0,0,0,0.5)';
    handlePopUp('pause');
    cancelAnimationFrame(animationFrameRequest)
    clearInterval(timerRequest);
    // Add your pause game logic here
}

function handleContinueGame() {
    document.querySelector('.countdown-pause').innerHTML = `3`;
    clearInterval(req);
    console.log('Game continued!');
    isPaused = false;
    document.querySelector('.pause-icon').style.display = 'block';
    document.querySelector('.continue-icon').style.display = 'none';
    let c=3;

    req = setInterval(()=>{
        c--;
        document.querySelector('.countdown-pause').innerHTML = `${c}`
        if(c===0){

            document.querySelector('.game-overlay').style.backgroundColor = 'rgba(0,0,0,0)'
            document.querySelector('.pop-up').style.display = "none";
            document.querySelector('.pause-content').style.display = "none";
            document.querySelector('.countdown-pause').innerHTML = `3`;
            animationFrameRequest = requestAnimationFrame(animate);
            startTimer();
            clearInterval(req);
        }
    },1000)
    
// Add your continue game logic here
}

function handlePopUp(mode) {
    document.querySelector('.pause-content').style.display = "none";
    document.querySelector('.level-up-content').style.display = "none";
    document.querySelector('.game-over-content').style.display = "none";
    if(mode === 'pause'){
        document.querySelector('.pop-up').style.display = 'flex';
        document.querySelector('.pause-content').style.display = "flex";
    }
    if(mode === 'level-up'){
        document.querySelector('.pop-up').style.display = 'flex';
        document.querySelector('.level-up-content').style.display = "flex";
    }
    if(mode === 'game-over'){
        document.querySelector('.pop-up').style.display = 'flex';
        document.querySelector('.game-over-content').style.display = "flex";
        document.querySelector('.result-high-score').innerHTML = `Highest Kills: ${highestKills}`
    }
}

function updateGun(){
    if(gunType === 1){
        bulletReloadTime = 400;
        gunDamage = 20;
    }
    else if(gunType ===2){
        bulletReloadTime = 800;
        gunDamage = 90;
    }
}



// c.clearRect(0, 0, canvas.width, canvas.height);
// setInterval(()=>{
//     background.draw();
//     torch1.draw();
// });
let req;
let timer=0
let timerRequest;
let animationFrameRequest;
let isPaused = false;
let gunType = 1;
let gunDamage = 20;

let powerUp = 0;

function startTimer(){
    timerRequest = setInterval(()=>{
        updateTimer();
        // if(timer%7 ===0){
        //     zombieRunner();
        // }
        if(zombieList.length === 0){
            document.querySelector('.game-overlay').style.backgroundColor = 'rgba(0,0,0,0.5)';
            clearInterval(timerRequest);
            handlePopUp('level-up');
            cancelAnimationFrame(animationFrameRequest)
            gameLevel++;
            updateLevelRequirements(gameLevel);
            let c =3;
            req = setInterval(()=>{
                c--;
                document.querySelector('.countdown-level-up').innerHTML = `${c}`
                if(c===0){
        
                    document.querySelector('.game-overlay').style.backgroundColor = 'rgba(0,0,0,0)'
                    document.querySelector('.pop-up').style.display = "none";
                    document.querySelector('.level-up-content').style.display = "none";
                    document.querySelector('.countdown-level-up').innerHTML = `3`;
                    gameEngine();
                    startTimer();
                    clearInterval(req);
                }
            },1000)
            //gameEngine();
        }
    },1000)
}
let highestKills = JSON.parse(localStorage.getItem('HighestKills'))
if(highestKills === null){
    highestKills = 0
}
function updateKills() {
    document.querySelector('.kills').innerHTML = `Kills: ${kills}`;
    if(kills> highestKills){
        highestKills = kills;
        localStorage.setItem('HighestKills',JSON.stringify(highestKills));
    }
    document.querySelector('.highest-kills').innerHTML = `Highest Kills: ${highestKills}`;
}

function showPowerUp(text) {
    const element = document.querySelector('.power-up-text');
    element.style.display = 'block';
    element.style.opacity = 1;
    element.textContent = '';

    let i = 0;
    function typeWriter() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(typeWriter, 100);
        }
    }
    typeWriter();

    setTimeout(() => {
        element.style.opacity = 1;
        setTimeout(() => {
            element.style.display = 'none';
        }, 1000); // Wait for the fade-out transition to complete before hiding
    }, 5000); // Display for 5 seconds
}

function gameEngine(){
    if(!timer){
        startTimer();
    }
    updateLevelRequirements(gameLevel);
    animate();
}




function choosePowerUp() {

    //1. bullet that can pass through any number of zombies and give them a 100% damage to each. only 1 bullet. power-up-tag = 'mega-bullet'

    //2. immunity from zombie attacks for 20 seconds power-up-tag = 'immunity'

    //3. increased ammunition rate for 20 seconds power-up-tag = 'machine-gun'
    const randomValue = Math.random() * 3
    randomValue < 2 ? (randomValue < 1? player.powerUp = 'mega-bullet':player.powerUp = 'immunity'):player.powerUp = 'machine-gun';
    if(player.powerUp === 'immunity'){
        showPowerUp('You got temporary immunity');
        document.querySelector('.health-bar-inner').style.backgroundColor = '#fff12e';
        setTimeout(()=>{
             document.querySelector('.health-bar-inner').style.backgroundColor = '#ff2e2e';
            
            player.powerUp = false;
        },20000)
    }
    else if (player.powerUp === 'machine-gun'){
        showPowerUp('You got increased ammunition rate');
        bulletReloadTime/=2;
        setTimeout(()=>{
            bulletReloadTime*=2;
            player.powerUp = false;
        },20000)
    }
    else if(player.powerUp === 'mega-bullet'){
        showPowerUp('You got 1 mega bullet');
    }
    
    
}

function zombieRunner(){
    const randomIndex = Math.floor(Math.random() * zombieList.length);
    if(zombieList[randomIndex].lastDirection === 'right'){
        
        if(zombieList[randomIndex].velocity === 3){
            zombieRunner();
            return;
        }
        zombieList[randomIndex].switchSprite('runRight');
        zombieList[randomIndex].velocity.x=3;
    }
    else {
        
        if(zombieList[randomIndex].velocity === -3){
            zombieRunner();
            return;
        }
        zombieList[randomIndex].switchSprite('runLeft');
        zombieList[randomIndex].velocity.x=-3;
        
    }

}

//main
let preGameTimerReq;
function preGame(){
    setTimeout(()=>{
        
        const countdownContainer = document.querySelector('.pre-game');
        const pElement = document.createElement('p');
        document.querySelector('.button-89').style.display = 'none';
        pElement.classList.add('countdown')
        
        let count = 3;
        pElement.textContent = count;
        count --;
        countdownContainer.appendChild(pElement);

        preGameTimerReq = setInterval(()=>{
            pElement.textContent = count;
            count--;

            if (count < 0) {
                clearInterval(preGameTimerReq);
                document.querySelector('.pre-game').style.display = 'none';
                gameEngine();
            }
            
        },1000)
        
    },900)
    
}


