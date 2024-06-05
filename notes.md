# todo
- [x] implement trump card transperency when deck is empty
- [x] implement beaten cards area
- [x] add generating keys for divs generated with maps (see console errors) 

# Operations    
    │   
    ├── create room
    │   └── output:
    │       ├── player1 id           
    │       └── room url 
    │ 
    │  
    ├── join room
    │   ├── input:
    │   │   └── room url   
    │   └── output:
    │       └── player2 id
    │   
    │     
    ├── start game 
    │   ├── input:
    │   │   └──   
    │   └── output:
    │       └── Game state
    │
    │
    ├── attack 
    │   ├── input:
    │   │   ├─ attack card
    │   │   └── user ID      
    │   └── output:
    │       └── Game state
    │   
    │     
    ├── defend 
    │   ├── input:
    │   │   ├── defence card  
    │   │   └── user ID     
    │   └── output:
    │       └── Game state    
    │     
    │     
    ├── end turn 
    │    ├── input:
    │    │   └── user ID
    │    └── output:
    │        └── Game state
    │
    │
    ├── collect cards 
    │    ├── input:
    │    │   └── user ID
    │    └── output:
    │        └── Game state
    │
    │
    └─── get game state 
        ├── input:
        │   └─── user ID
        └── output:
            └── Game state


- [x] Create room functionality and client / server connection 
- [x] Define Gamestate object
- [x] Create list of client game actions 
- [x] Fix a bug, with a new user being added when the generated room page is refreshed

- [ ] Notify clients about game state change 
- [ ] Index page design (logo / start new game button)
- [ ] read playerId from cookie and add to context
- [ ] find a way to get room id from url and add to context (istead of manually pathing)
- [ ] Implement create game TRPC Procedure