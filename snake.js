
document.addEventListener("DOMContentLoaded", () => {
    const playBtn = document.querySelector('.playBtn');

    playBtn.addEventListener('click', () => {
        location.assign("snake.html");
    });

    const helpBtn = document.querySelector(".helpBtn");

    helpBtn.addEventListener('click', () => {
        location.assign("help.html");
    });

    const leaveBtn = document.querySelector('.leaveBtn');

    leaveBtn.addEventListener('click', () => {
        location.assign("menu.html");
    });

    class Element{
        #x;
        #y;
        #width;
        #height;
        #domElement;

        constructor(domElement){
            this.#domElement = domElement;
            this.#x = 0;
            this.#y = 0;
            this.#width = this.domElement.clientWidth;
            this.#height = this.domElement.clientHeight;
        }

        
        get width(){    
            return this.#width; 
        }

        set width(value){
            this.#width = value;
        }

        get height(){
            return this.#height; 
        }

        set height(value){
            this.#height = value;
        }

        get domElement(){
            return this.#domElement;
        }

        set domElement(value){
            this.#domElement = value;
            // Met à jour les dimensions en cas de changement de l'élément DOM
            this.width = this.#domElement.clientWidth;
            this.height = this.#domElement.clientHeight;
        }

        get x(){
            return this.#x;
        }

        set x(value){
            this.#x = value;
            this.positioningElement();
        }

        get y(){
            return this.#y;
        }

        set y(value){
            this.#y = value;
            this.positioningElement();
        }

        positioningElement(){
            this.domElement.style.left = this.x + "px";
            this.domElement.style.top = this.y + "px";
        }

        get left() {
            return this.x;
        }
    
        get right() {
            return this.x + this.width; 
        }
    
        get top() {
            return this.y; 
        }
    
        get bottom() {
            return this.y + this.height; 
        }

    }

    playAreaElement = document.querySelector(".playArea");
    const playArea = new Element(playAreaElement);

    class Food extends Element{
        constructor(dom){
            super(dom);
            this.randomizePosition();
        }

        randomizePosition() {
            const maxX = playArea.right - this.width;
            const maxY = playArea.bottom - this.height;

            this.x = playArea.left + Math.floor(Math.random()*maxX);
            this.y = playArea.top + Math.floor(Math.random()*maxY);
        }

        isFoodEaten(snake){
            if (collision(snake.head, this)){
                this.randomizePosition();
                snake.growSnake();
                augmenteScore();
            }
        }
    }

    class SnakeSegment extends Element{
        constructor(x, y, dom) {
            super(dom);
            this.x = x;
            this.y = y;
        }
    }
    
    class Snake{
        #head;
        #body;
        #snake;
        #direction;
        #gameOver;
        
        constructor(head, body){
            this.#head = new SnakeSegment(100, 100, head);
            this.#body = [new SnakeSegment(80, 100, body)];
            this.#direction = 'right';
            this.#snake = [this.#head, ...this.#body];
            this.#gameOver = false; 
        }

        get head(){
            return this.#head;
        }

        set head(value){
            this.#head = value;
        }

        get body(){
            return this.#body;
        }

        set body(value){
            this.#body = value;
        }

        get direction(){
            return this.#direction;
        }

        set direction(value){
            this.#direction = value;
        }

        get snake(){
            return this.#snake;
        }

        set snake(value){
            this.#snake = value;
        }

        get gameOver() {
            return this.#gameOver;
        }
    
        set gameOver(value) {
            this.#gameOver = value;
        }

        moveSnake(){
            if (this.gameOver){
                return;
            }          
            
            const oldHeadPosition = { 
                x: this.head.x, 
                y: this.head.y 
            };

            const move = 20;
            
            switch(this.direction){
                case 'right':
                    if(this.direction != 'left') this.head.x += move;
                    break;
                case 'left':
                    this.head.x -= move;
                    break;
                case 'up':
                    this.head.y -= move;
                    break;
                case 'down':
                    this.head.y += move;
                    break;
            }

            // Vérifie les collisions avec les murs
            if (this.head.left < playArea.left || this.head.right > playArea.right || this.head.top < playArea.top || this.head.bottom > playArea.bottom){
                this.gameOver = true;
                document.getElementById("zoneMessage").style.display = 'block';
                return;
            }

            // Vérifie les collisions avec le corps du serpent
            for (let i = 1; i < this.snake.length; i++) {
                if (collision(this.head, this.snake[i])) {
                    this.gameOver = true; // Marque le jeu comme terminé
                    document.getElementById("tailMessage").style.display = 'block';
                    return;
                }
            }
            
            // Move body segments
            for (let i = this.snake.length - 1; i > 0; i--) {
                this.snake[i].x = this.snake[i-1].x;
                this.snake[i].y = this.snake[i-1].y;
            }

            // Update the first body segment with the old head position
            this.body[0].x = oldHeadPosition.x;
            this.body[0].y = oldHeadPosition.y;
        }

        growSnake(){
            const lastSegment = this.snake[this.snake.length - 1];
            const newSegment = new SnakeSegment(lastSegment.x, lastSegment.y, document.createElement('div'));
            newSegment.domElement.classList.add('segment');
            document.getElementById('snake').appendChild(newSegment.domElement);
            this.snake.push(newSegment);
            this.body.push(newSegment);
        }
    }

    function controlSnake(snake){
        window.addEventListener('keydown' , (event) => {
            if(event.key == 'ArrowLeft'){
                snake.direction = 'left';
            }

            if(event.key == 'ArrowRight'){
                snake.direction = 'right';
            } 

            if(event.key == 'ArrowUp'){
                snake.direction = 'up'; 
            }

            if(event.key == 'ArrowDown'){
                snake.direction = 'down';
            }

            event.preventDefault();
        });
    }

    function collision(obj1, obj2){
        const obj1Bounds = obj1.domElement.getBoundingClientRect();
        const obj2Bounds = obj2.domElement.getBoundingClientRect(); 
        return (obj1Bounds.left < obj2Bounds.right && obj1Bounds.right > obj2Bounds.left && obj1Bounds.top < obj2Bounds.bottom && obj1Bounds.bottom > obj2Bounds.top);
    }

    function augmenteScore(){
        let number = document.getElementById("number");
        let score = parseInt(number.innerHTML.split(': ')[1]); // Extraire le score actuel
        score ++; 
        number.innerHTML = "Score: " + score;
    }

    function scoreGameOverScreen(){
        const score = parseInt(document.getElementById("number").innerHTML.split(': ')[1]);

        document.getElementById("scoreMessage").innerHTML = "You scored " + score + " points.";

        const record = parseInt(localStorage.getItem("record"));
        const newHighScoreMessage = document.getElementById("newHighScoreMessage");

        if (score > record) {
            newHighScoreMessage.style.display = 'block';
        } else {
            newHighScoreMessage.style.display = 'none';
        }

    }
    
    function game(){
        const headElement = document.getElementById("snakeHead");
        const bodyElement = document.getElementById("snakeBody");
        const foodElement = document.getElementById("food");

        let s = new Snake(headElement, bodyElement);
        let f = new Food(foodElement);

        controlSnake(s);    
    
        function gameLoop(){
            if (s.gameOver){
                document.querySelector('.gameOverScreen').style.display = 'flex';
                scoreGameOverScreen();
                return;
            }

            s.moveSnake();
            f.isFoodEaten(s);
            setTimeout(gameLoop, 200);
        }
        gameLoop();
    }

    game();

    //Traite les scores affichés au menu
    window.addEventListener('beforeunload', () => {
        const score = parseInt(document.getElementById("number").innerHTML.split(': ')[1]);
        let record = localStorage.getItem("record");
        
        if (score > record) {
            localStorage.setItem("record", score); // Enregistre le nouveau record
        }
        localStorage.setItem("scorePrecedent", score); // Enregistre le score précédent
        //localStorage.setItem("record", 0);
    });
});




