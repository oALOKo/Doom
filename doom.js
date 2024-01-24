import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js'
import {
    getFirestore,
    collection,
    serverTimestamp,
    addDoc,
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js'

const firebaseConfig = {
    apiKey: "AIzaSyBg0ICpx0AXCWErHT5qHSrnFHfFRCvRUSM",
    authDomain: "retro-doom-4dc71.firebaseapp.com",
    projectId: "retro-doom-4dc71",
    storageBucket: "retro-doom-4dc71.appspot.com",
    messagingSenderId: "395511210552",
    appId: "1:395511210552:web:4366215ff4f72abf537ccd",
    measurementId: "G-PGBQZSL31E"
  };

initializeApp(firebaseConfig);

//init services
const db = getFirestore(); //our database is stored here 

//specific collection reference
const colRef = collection(db,'Score');

///setting up timer
let time = 120;
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const decodedUsername = decodeURIComponent(urlParams.get('username'));
console.log(decodedUsername)
if (time != 0){
   setInterval(()=>{time=time-1},1000)
}

///making game over
let gameover = false;
setTimeout(()=>{
    gameover = true
    canvas.removeEventListener('click', shoot);
    addDoc(colRef,{
        name:decodedUsername,
        score:score,
        createdAt: serverTimestamp(),
    })
    .then(()=>{
    console.log("Score saved")
    })

    const redirectTo = './LeaderBoards.html?username=' + encodeURIComponent(decodedUsername);
        setTimeout(() => {
          window.location.replace(redirectTo); 
      },3000);   
},(time*1000))

///background setup

const canvas = document.querySelector('canvas');
const c = canvas.getContext("2d");

canvas.width = 1040;
canvas.height = 520;
///setting score
let score = 0;
////all audio
const reload = new Audio('reload.mp3');
const revshot = new Audio('revshot.mp3');
const rifleshot = new Audio('rifleshot.mp3');
const shotgunshot = new Audio('shotgunshot.mp3');
const damage = new Audio('damage.mp3');
const dead = new Audio('dead.mp3');
const swap = new Audio('swap.mp3');


///screenshake
function screenShake(){
   // Create a style element
const styleElement = document.createElement('style');

// Define the shake animation keyframes
const shakeAnimation = `
 @keyframes shake {
   0% { transform: translate(1px, 1px) rotate(0deg); }
   10% { transform: translate(-1px, -2px) rotate(-1deg); }
   20% { transform: translate(-3px, 0px) rotate(1deg); }
   30% { transform: translate(3px, 2px) rotate(0deg); }
   40% { transform: translate(1px, -1px) rotate(1deg); }
   50% { transform: translate(-1px, 2px) rotate(-1deg); }
   60% { transform: translate(-3px, 1px) rotate(0deg); }
   70% { transform: translate(3px, 1px) rotate(-1deg); }
   80% { transform: translate(-1px, -1px) rotate(1deg); }
   90% { transform: translate(1px, 2px) rotate(0deg); }
   100% { transform: translate(1px, -2px) rotate(-1deg); }
 }
`;

// Append the shake animation keyframes to the style element
styleElement.appendChild(document.createTextNode(shakeAnimation));

// Define additional CSS rules for the #changeCursorBtn element
styleElement.appendChild(document.createTextNode(`
 #changeCursorBtn {
   animation: shake 0.04s;
   animation-iteration-count: 1;
 }
`));

// Append the style element to the document's head section
document.head.appendChild(styleElement);
setTimeout(()=>{document.head.removeChild(styleElement)},500)

}



///cross hair
const crosshair = document.getElementById("changeCursorBtn");
crosshair.onmouseover = function () {
   this.style.cursor="crosshair";
};


class Weapon {
   constructor(damage, rof, reloadTime, bullets, fired, mag) {
       this.damage = damage;
       this.rof = rof;
       this.reloadTime = reloadTime;
       this.bullets = bullets;
       this.fired = fired;
       this.mag = mag;
   }
}



///setting up main player
class MainPlayer {
   constructor(health) {
       this.health = health;
   }

   drawSprite() { }
}
let weaponMove;
canvas.onmousemove = function(event){
   weaponMove = event.clientX
};
class Sprite {
   constructor(imgposition, imageSrc, width, height) {
       this.imgposition = imgposition
       this.image = new Image()
       this.image.src = imageSrc
       this.width = width
       this.height = height
   }
}


///with this I can make enemy that can run in any direction and one which moves left or right with var speed
///setting up enemy Class
class enemy {
   constructor(health, speed, position, imgWidth, imgHeight, velocity, life, imageSrc, flip) {
       this.health = health;
       this.speed = speed;
       this.position = position;
       this.imgHeight = imgHeight;
       this.imgWidth = imgWidth;
       this.hit = false;
       this.velocity = velocity;
       this.life = life;
       this.image = new Image()
       this.image.src = imageSrc
       this.flip = flip
   }

   ///setting up a function to determine whether we are clicking at enemy or not
   collison(event) {
       if ((this.position.x < event.clientX
           && this.position.y < event.clientY
           && (this.position.y + this.imgHeight) > event.clientY
           && (this.position.x + this.imgWidth) > event.clientX)) {
           this.hit = true;
       };
   }

   positionChanging() {
       this.position.x = this.position.x + (this.velocity.x * this.speed.x);
   }
   drawSprite() {
       c.drawImage(this.image, this.position.x, this.position.y, 106, 89);
   }


}

class enemyUp extends enemy {

   drawSprite() {
       c.drawImage(this.image, this.position.x, this.position.y, 109, 106);
   }

   positionChanging() {
       this.position.x = this.position.x + (this.velocity.x * this.speed.x);
       this.position.y = this.position.y + (this.velocity.y * this.speed.y);
   }
}

class enemyUpp extends enemy {
   drawSprite() {
       c.drawImage(this.image, this.position.x, this.position.y, 104, 96);
   }
}




const Runner = [];
const Fly = [];
const Ghost = [];

/// for velocity
const randVel = [-1, 1]

///frame counter
let frame = 0;
let frame1 = 0;
let frame2 = 0;
let framegap = 7;
let gap = 8;
///Animating
function animate() {
   draw()
   if (gameover != true){

       
   framegap++
   if ((framegap % gap === 0)) {
       frame++
       frame2 = frame2 + 111
       frame1 = frame1 + 11
   }



   update()

   for (let i = 0; i < (Runner.length); i++) {

       if ((framegap % gap === 0)) {
           if (Runner[i].velocity.x === -1) {
               Runner[i].image.src = `./${frame1}Copy.png`
           } else { Runner[i].image.src = `./${frame1}.png` }
       }
       Runner[i].drawSprite()
       Runner[i].positionChanging()
   }

   for (let i = 0; i < (Fly.length); i++) {
       if ((framegap % gap === 0)) {
           Fly[i].image.src = `./${frame}.png`
       }
       Fly[i].drawSprite()
       Fly[i].positionChanging()
   }

   for (let i = 0; i < (Ghost.length); i++) {
       if ((framegap % gap === 0)) {
           Ghost[i].image.src = `./${frame2}.png`
       }
       Ghost[i].drawSprite()
   }

   /// if it goes out of bounds
   /// for runner

   for (let i = 0; i < (Runner.length); i++) {
       if (Runner[i].position.x > canvas.width || Runner[i].position.y > canvas.height || Runner[i].position.x + Runner[i].imgWidth < 0 || Runner[i].position.y + Runner[i].imgHeight < 0) {
           Runner.splice(i, 1);
       }

   }

   //// for fly

   for (let i = 0; i < (Fly.length); i++) {
       if (Fly[i].position.x + Fly[i].imgWidth > canvas.width || Fly[i].position.x < 0) {
           Fly[i].velocity.x = Fly[i].velocity.x * -1;
       }
       if (Fly[i].position.y < 0 || Fly[i].position.y + Fly[i].imgHeight > canvas.height) {
           Fly[i].velocity.y = Fly[i].velocity.y * -1;
       }

   }

   if (currentWeapon === revolver) {
       if (flash === true){
           rev.image.src= './revolverflash.png'
           rev.imgposition.y = 350
       }else{rev.image.src= './revolver00.png'
               rev.imgposition.y = 400}
       c.drawImage(rev.image,(weaponMove-65), rev.imgposition.y);
   }
   if (currentWeapon === assault) {
       if (flash === true){
           ass.image.src= './arflash.png'
           ass.imgposition.y = 350
       }else{ass.image.src= './ar00.png'
       ass.imgposition.y = 400}
       c.drawImage(ass.image,(weaponMove-75), ass.imgposition.y);
   }
      
   if (currentWeapon === shotgun) {
       if (flash === true){
           sho.image.src= './shotgunflash.png'
           sho.imgposition.y = 350
       }else{sho.image.src= './shotgun00.png'
       sho.imgposition.y = 400   }
       c.drawImage(sho.image,(weaponMove-75), sho.imgposition.y);
   }

   if (frame === 4) {
       frame = 0
   }

   if (frame1 === 77) {
       frame1 = 0
   }

   if (frame2 === 555) {
       frame2 = 0
   }


   ///writing text on canvas
   // Load the Press Start 2P font
   c.font = '20px "Press Start 2P", extrabold';

   // Set the text color
   c.fillStyle = 'white';

   // Draw text on the canvas
   c.fillText("Score :"+score, 100, 500);
   c.fillText("Bullets :"+currentWeapon.bullets, 700, 500);
   c.fillText("Time - "+time, 400, 500);
   }
   if(gameover){
       ///writing text on canvas
   // Load the Press Start 2P font
   c.font = '100px "Press Start 2P", extrabold';

   // Set the text color
   c.fillStyle = 'white';

   c.fillText("Game over", 50,150);

   c.font = '50px "Press Start 2P", extrabold';
   c.fillText("Your Score - "+score, 100,300);

   c.font = '10px "Press Start 2P", extrabold';
   c.fillText("get gud noob", 300,350);
   }
   

       requestAnimationFrame(animate);
   
}

///spawner
setInterval(() => {
   if (Runner.length < 2) {
       setTimeout(() => {
           Runner.push(new enemy(100 * (Math.floor(Math.random() * 2) + 1), { x: (Math.floor(Math.random() * 4) + 2), y: (Math.floor(Math.random() * 4) + 2) }, { x: 100 * (2 + (Math.floor(Math.random() * ((Math.floor(canvas.width / 100)) - 4)))), y: 364 }, 106, 89, { x: randVel[Math.floor(Math.random() * 2)], y: randVel[Math.floor(Math.random() * 2)] }, true, './11.png', 1));
       }, (Math.floor(Math.random() * 3) + 2))
   }

   if (Fly.length < 2) {
       setTimeout(() => {
           Fly.push(new enemyUp(100 * (Math.floor(Math.random() * 2) + 1), { x: (Math.floor(Math.random() * 4) + 4), y: (Math.floor(Math.random() * 4) + 4) }, { x: 100 * (2 + (Math.floor(Math.random() * ((Math.floor(canvas.width / 100)) - 4)))), y: 100 * (2 + (Math.floor(Math.random() * ((Math.floor(canvas.height / 100)) - 4)))) }, 109, 106, { x: randVel[Math.floor(Math.random() * 2)], y: randVel[Math.floor(Math.random() * 2)] }, true, './Fly.png'));
       }, (Math.floor(Math.random() * 3) + 2))
   }

}, 2000);


setInterval(() => {
   if (Ghost.length < 2) {
       setTimeout(() => {
           Ghost.push(new enemyUpp(100, 0, { x: 100, y: 100 }, 104, 96, { x: randVel[Math.floor(Math.random() * 2)], y: randVel[Math.floor(Math.random() * 2)] }, true, './111.png'));
       }, (Math.floor(Math.random() * 3) + 12))

       setTimeout(() => {
           Ghost.push(new enemyUpp(100, 0, { x: 600, y: 364 }, 104, 96, { x: randVel[Math.floor(Math.random() * 2)], y: randVel[Math.floor(Math.random() * 2)] }, true, './111.png'));
       }, (Math.floor(Math.random() * 3) + 12))
   }

}, 10000);


///killing after certain time
//// for Ghost
setInterval(() => {
   for (let i = 0; i < (Ghost.length); i++) {
       Ghost.splice(i, 1);
   }
   console.log("hi")
}, 4500);



///updating
function update(

) { }

///makin weapon
const ass = new Sprite({ x: weaponMove, y: 400 }, './ar00.png')
const rev = new Sprite({ x: weaponMove, y: 400 }, './revolver00.png')
const sho = new Sprite({ x: weaponMove, y: 400 }, './shotgun00.png')
const assault = new Weapon(70, 150, 1000, 48, 6, 48)
const revolver = new Weapon(100, 250, 1000, 6, 1, 6)
const shotgun = new Weapon(200, 500, 1000, 2, 1, 2)

let currentWeaponDmg = revolver.damage;
let currentWeaponRof = revolver.rof;
let currentWeapon = revolver;
console.log(currentWeaponDmg)
console.log(revolver)
///fuction to select gun
function keypress(event) {


   if (event.key === '1') {
       if (currentWeapon !== revolver){swap.play()}
       currentWeapon = revolver
       currentWeaponDmg = revolver.damage
       currentWeaponRof = revolver.rof
       console.log('revolver');
       console.log(currentWeaponDmg);


   }
   if (event.key === '2') {
       if (currentWeapon !== shotgun){swap.play()}
       currentWeapon = shotgun
       currentWeaponDmg = shotgun.damage
       currentWeaponRof = shotgun.rof
       console.log(currentWeaponDmg);
   }
   if (event.key === '3') {
       if (currentWeapon !== assault){swap.play()}
       currentWeapon = assault
       currentWeaponDmg = assault.damage
       currentWeaponRof = assault.rof
       console.log('Assault rifle');
   }
}


let pause = 0;
///shooting mechanics
///changing the timeout duration can give different rate of fire,which will be used to make revolver,shotgun and assault rifle
let flash ;
function shoot(event) {
   if (gameover != true){

       screenShake()
       flash = true;
       setTimeout(() => {flash=false},currentWeaponRof)
       setTimeout(()=>{
               if(currentWeapon===revolver){revshot.play()}
               if(currentWeapon===shotgun){shotgunshot.play()}
               if(currentWeapon===assault){rifleshot.play()}
       },100)
   
       if (currentWeapon.bullets <= 1 || assault.bullets/6 <= 1) {
           reload.play()
           console.log('removing event');
           canvas.removeEventListener('click', shoot);
           setTimeout(() => {
               canvas.addEventListener('click', shoot);
               currentWeapon.bullets = currentWeapon.mag
           }, currentWeapon.reloadTime);
        
           
       } else {
           canvas.removeEventListener('click', shoot);
           if (gameover != true){
               setTimeout(() => canvas.addEventListener('click', shoot), currentWeaponRof);
           }
       }
   
       currentWeapon.bullets = currentWeapon.bullets - currentWeapon.fired
       console.log(currentWeapon.bullets)
   
   
       ///shooting fly
       for (let i = 0; i < (Fly.length); i++) {
           Fly[i].collison(event)
           if (Fly[i].hit) {
               damage.play()
               Fly[i].hit = false;
               Fly[i].health = Fly[i].health - currentWeaponDmg
               if (Fly[i].health <= 0) {
                   score = score + 2
                   dead.play();
                   Fly.splice(i, 1);
               }
   
           }
       }
   
       ///shooting Runner
       for (let i = 0; i < (Runner.length); i++) {
           Runner[i].collison(event)
           if (Runner[i].hit) {
               damage.play()
               Runner[i].health = Runner[i].health - currentWeaponDmg
               Runner[i].hit = false;
               if (Runner[i].health <= 0) {
                   score = score + 1
                   console.log('I ded :(')
                   dead.play();
                   Runner.splice(i, 1);
               }
           }
       }
   
       ///shooting Ghost
       for (let i = 0; i < (Ghost.length); i++) {
           Ghost[i].collison(event)
           if (Ghost[i].hit) {
               damage.play()
               Ghost[i].health = (Ghost[i].health - currentWeaponDmg)
               Ghost[i].hit = false;
               if (Ghost[i].health <= 0) {
                   score = score + 4
                   console.log('I ded :(')
                   dead.play();
                   Ghost.splice(i, 1);
               }
           }
       }
   }
}

canvas.addEventListener('click', shoot);
window.addEventListener('keyup', keypress);

///drawing background
const background = new Sprite({ x: 0, y: 0 }, './bg2.png', canvas.width, canvas.height)
function draw() {
   // c.drawImage(rev.image,rev.imgposition.x,rev.imgposition.y);
   c.drawImage(background.image, 0, 0, canvas.width, canvas.height);


}

animate()
