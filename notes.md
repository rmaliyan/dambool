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

# todo

- [x] Create room functionality and client / server connection 
- [x] Define Gamestate object
- [x] Create list of client game actions 
- [x] Fix a bug, with a new user being added when the generated room page is refreshed
- [x] Index page design (logo / start new game button)

- [ ] Notify clients about game state change 
- [ ] read playerId from cookie and add to context
- [ ] find a way to get room id from url and add to context (istead of manually pathing)
- [ ] Implement create game TRPC Procedure
- [ ] Find out the reason for the lag when starting new game

- [x] design a lobby, where owner sees connecting players and decides when to start a game


- [ ] We shouldn't be able to start several games simultaniously
- [x] Before starting game we should verify there are more than 1 players
- [x] PLayer 2 shouldn't be able to start game
- [ ] Think of a loading before game


-[ ] Create lobby component
-[ ] create new endpoint in game.ts 
-[ ] add loserId field to players db games table
-[ ] add date field to games table 


- [ ] We should show different card hands to different players
- [ ] Make placing player hands procedural based on player list
- [ ] Add UI indication of wrong turn when attacking
- [ ] When starting a new game check which hand has the smallest trump card and let them make the first turn
- [ ] Turn all icons into font