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

# Tasks

- [x] Create room functionality and client / server connection 
- [x] Define Gamestate object
- [x] Create list of client game actions 
- [x] Fix a bug, with a new user being added when the generated room page is refreshed
- [x] Index page design (logo / start new game button)
- [x] Notify clients about game state change 
- [x] read playerId from cookie and add to context
- [x] find a way to get room id from url and add to context (istead of manually pathing)
- [x] design a lobby, where owner sees connecting players and decides when to start a game
- [x] Before starting game we should verify there are more than 1 players
- [x] PLayer 2 shouldn't be able to start game
- [x] Create lobby component
- [x] We should show different card hands to different players
- [x] Make placing player hands procedural based on player list
- [x] Read about TCP
- [x] Read about webRTC
- [x] Add defend endpoint  /!\

- [?] create new endpoint in game.ts 
- [ ] add loserId field to players db games table
- [ ] add date field to games table 
- [ ] Think of a loading before game
- [ ] Add UI indication of wrong turn when attacking
- [ ] When starting a new game check which hand has the smallest trump card and let them make the first turn
- [ ] We shouldn't be able to start several games simultaniously
- [ ] Implement create game TRPC Procedure
- [ ] Find out the reason for the lag when starting new game
- [ ] Design a Ui flow for several active games in a room. lobby.tsx: 80-90
- [ ] Add admin funct to delete users


- [X] In chrome text buttons  disapear on hover
- [X] Make "Start game" inactive when there are less than 2 players
- [X] Add admin funct to delete users
- [X] Restrict player names (length? character set?)
- [X] Add cursor change on all clickable elements.
- [ ] Add some kind of error for when name length is exceeded.
- [ ] Player's page updates, when player sets ready, but admin's page doesn't.


- [X] add endpoint that returns current running game
- [X] revisit UI for 3 and more player game. (attacking and collecting multiple cards) /!\
- [ ] Add tabindex to clickable elements

- [X] Add vignette to green background
- [ ] Update UI based on reworked concept from figma
- [X] Add endpoint to collect cards
- [X] Implement card collection to frontend 
- [ ] Add logic for showing corresponding badges    
- [ ] Make component names correspond to their file names 
- [ ] change favicon
- [ ] think of ways to add card movement
- [X] add face cards
- [ ] change ace cards to show large suit symbol in center

- [ ] add sounds
- [ ] add deck remaining cards number
- [ ] add auto turn ending when player has no suitable cards to make a move
- [ ] Fix Ui breaking for 125% zoom, mb lock for further zoom?

- [ ] implement battle area onclick handler /!\

- [ ] add favicon
- [ ] add celebration badge to notify winner, mb a separate pop-up banner?
- [ ] check if Image components behave correctly wherrever used. Use MR logo in  room-lobby as reference.

# Issues:
- [ ] When player is added admin's interface is not refreshed
- [ ] the longer pages stay open the less responsive they seem to become in terms of refreshing on changes made



# Long-term tasks:
- [ ] Turn all icons into font
- [ ] Check how I declare default prop values in components. change to direct equality where nullish coalescing operator is used (??). See button-text component for example.
- [ ] Compose a describtion, listing used technology stack:
A multiplayer online card game, built using a TypeScript stack, running on Node.js, using tRPC for API management, Zod for validation, and a SQL database with an drizzle ORM for data persistence.