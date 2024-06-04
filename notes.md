# todo
- (Done) implement trump card transperency when deck is empty
- (Done)implement beaten cards area
- (Done) add generating keys for divs generated with maps (see console errors) 


- Create room functionality and client / server connection 
- Define Gamestate object
- Persist gamestate object to db
- Create list of client game actions 
- Notify clients about game state change 
  

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


- Fix a bug, with a new user being added when the generated room page is refreshed