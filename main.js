class Game {
  clickCount = document.querySelector(".countClick");//nombre de coups joués
  found = document.querySelector(".found")
  click = 0; 
  timer = new Timer();
  playGroundCards = ["🦕","🦕","🦖","🦖","🦄","🦄","👺","👺","🐇","🐇","🎮","🎮"]
  playGround = document.querySelector(".playGround");
  card = new Card();
  
  play(){
    this.playGround.addEventListener("click", (pointerEvents) =>{
      this.card.returnCard(pointerEvents);
    })
  }

  countClick(){
    //met dans html le nombre de coups joués
    this.clickCount.innerHTML++;
    //garde le nombre de coups pour chaque pair vérifié
    this.click++;
  }

  countPairsFound(){
    this.found.innerHTML = ` ${this.card.found.length}`;
  }

  mix(array){
    let currentIndex = array.length, randomIndex;

    while (currentIndex != 0) {
  
      let randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
  
    return array;
  }

  startGame(){
    //stocker le tableau mixé
    let mixPlayGround = this.mix(this.playGroundCards);
    //répéter sur chaque carte du jeu
    for (let i = 0; i < mixPlayGround.length; i++) {
      let divCard = document.createElement("div");
      let icon = document.createElement("div");
      //donner une class css
      divCard.classList.add("card");
      icon.classList.add("icon");
      this.playGround.appendChild(divCard);
      divCard.appendChild(icon);
      icon.innerHTML = mixPlayGround[i];
    }
    this.timer.startTime();
  }

  isGameFinished(){
    if (this.card.found.length === 6) {
      this.endGame()
    }
  }
  endGame(){
    this.timer.stopTime();
    //alert (`Bravo ! Vous avez mis ${this.timer.getDateDiff()} secondes et joué ${this.countClick()} clics`);
    this.displayModal();

  }
  displayModal(){

    
    let modal = document.getElementById("myModal");
    let span = document.getElementsByClassName("close")[0];
    let replay = document.querySelector("#replay")
    let modalBody = document.querySelector(".modal-body")
    
    modal.style.display = "block";
    
    // When the user clicks on <span> (x), close the modal
    span.addEventListener("click", () => {
      modal.style.display = "none";
    })
    
    // When the user clicks anywhere outside of the modal, close it
    window.addEventListener("click", (event) => {
      if (event.target == modal) {
        modal.style.display = "none";
      }
    })
    modalBody.innerHTML = `<p>Vous avez trouvé les 6 paires</p>
                            <p>Vous avez mis ${this.timer.getDateDiff()} secondes</p>
                          `
    replay.addEventListener("click", () => {
      this.reset();
      modal.style.display = "none";
    })
  }

  removeCard(){
    while (this.playGround.hasChildNodes()) {
      this.playGround.removeChild(this.playGround.firstChild);
    }
  }

  reset(){
    location.reload();
  }
  
}









class Card {
  flippedCards = []; // on stock les cartes clickée ici
  found = []; // on mettra les paires trouvées dans ce tableau
  body = document.querySelector("body");

    
    returnCard(pointerEvents) {
      pointerEvents.target.classList.add("return");
      this.watchCard(pointerEvents);
    }

    watchCard(pointerEvents) {
      if(this.flippedCards.length === 0 || this.flippedCards.length === 1){
        this.flippedCards.push(pointerEvents.target);
      }
      this.findPair();
    }

    findPair(){
      if(this.flippedCards.length === 2){
        document.body.style.pointerEvents = "none";
      }
      if(this.flippedCards.length === 2 && this.flippedCards[0].innerHTML === this.flippedCards[1].innerHTML){
        this.similar();
      }else if (this.flippedCards.length === 2 && this.flippedCards[0].innerHTML != this.flippedCards[1].innerHTML){
        this.notSimilar()
      }
    }

    similar(){
      setTimeout(()=>{
        // elle reste visible
        this.flippedCards[0].classList.add("similar");
        this.flippedCards[1].classList.add("similar");
        //on met la paire trouvée dans le tableau des trouvés
        this.found.push(this.flippedCards);
        console.log(this.found);
        document.body.style.pointerEvents = "auto";
        //on verifie si le jeu est fini
        game.isGameFinished();
        //on vide le tableau des cartes clickées
        this.flippedCards = [];
      }, 300);
      game.countClick();
	    game.countPairsFound();
    }

    notSimilar(){
      setTimeout(()=> {
        //elles redeviennent cachées
        this.flippedCards[0].classList.remove("return");
        this.flippedCards[1].classList.remove("return");
        
        document.body.style.pointerEvents = "auto";
        //on vide le tableau des cartes clickées
        this.flippedCards = [];
      }, 1000);
      game.countClick();
	    game.countPairsFound();
    }
    
}











/////////////////////////////////////////////////////////////
//TIMER

class Timer {

  time;
  end;
  
  startTime(){
    this.time = Date.now();
    console.log("debut",this.time);
  }

  stopTime(){
    this.end= Date.now();
    console.log("fin", this.end);
  }

  getDateDiff(){
    return (this.end - this.time)/1000; 
  }

  resetTime(){
    this.time = null;
    this.end = null;
  }
}






/////////////////////////////////////////////////////////////
//INITIALISER LE JEU




let game = new Game();
let reset = document.querySelector("#reset")

window.addEventListener("load", () => {
  game.startGame()
  game.play()
})
reset.addEventListener("click", () => {
  game.reset() 
})
