window.addEventListener('keydown',(event)=>{ 
    console.log(event.key);
    switch(event.key) {
        case ' ':
            if(!currentlyShooting){
                keys.space.pressed = true;
                //console.log(player.lastDirection)
                
            }   
            break;
        case 'w':
            if ( player.velocity.y === 0 ){
                //keys.w.pressed = true;
                player.velocity.y = -20;
            }
            break;
        case 'a':
            //move player to left
            keys.a.pressed = true;
            break;
        case 'd':
            //move player to right
            keys.d.pressed = true;
            break;
    }
    if(event.key === "Shift"){
        swapGuns();
    }
});

window.addEventListener('keyup',(event)=>{
    switch(event.key) {
        case ' ':
            keys.space.pressed = false;
            break;
        case 'a':
            //move player to left
            keys.a.pressed = false;
            break;
        case 'd':
            //move player to right
            keys.d.pressed = false;
            break;
    }
});

document.querySelector('.pause-button').addEventListener('click', () => {
    if (isPaused) {
        
        handleContinueGame();
    } else {
        
        handlePauseButton(); 
    }
});

document.getElementById('swap-guns').addEventListener('click',()=>{
    swapGuns();
})


    
swapGuns = () => {
    

    const gun1Image = document.getElementById('gun1').querySelector('img').src;
    const gun1Info = document.getElementById('gun1').querySelector('.gun-info').innerHTML;
    const gun2Image = document.getElementById('gun2').querySelector('img').src;
    const gun2Info = document.getElementById('gun2').querySelector('.gun-info').innerHTML;
    gunType = parseInt(document.getElementById('gun2').querySelector('.gun-info h3').dataset.id);
    document.getElementById('gun1').querySelector('img').src = gun2Image;
    document.getElementById('gun1').querySelector('.gun-info').innerHTML = gun2Info;
    document.getElementById('gun2').querySelector('img').src = gun1Image;
    document.getElementById('gun2').querySelector('.gun-info').innerHTML = gun1Info;
}

document.querySelector('.button-89').addEventListener('click',()=>{
    preGame();
})