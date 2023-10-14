import { createSlice } from "@reduxjs/toolkit";

const mapValue = {
    boat: "b",
    cursedGrass: "c",
    dog: "d",
    farm: "f",
    grass: "g",
    house: "h",
    paw: "p",
    river: "r",
    seedling: "s",
    tree: "t",
    unknown: "u",
    wilt: "w"
};

const mockMap = [
    ["c", "c", "c", "c", "r", "d"],
    ["c", "t", "t", "g", "r", "g"],
    ["c", "g", "f", "f", "r", "r"],
    ["t", "g", "s", "h", "r", "r"],
    ["c", "b", "g", "r", "r", "w"],
    ["r", "c", "r", "r", "c", "p"]
];

const plantEnergyMap = [
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0]
];

const unknowns = [
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [1, 0, 0, 0, 0, 0],
    [1, 1, 0, 0, 0, 0]
];

export const gameSlice = createSlice({
    name: "currentTerrain",
    initialState: {
        terrain: {
            map: mockMap,
            fogMap: unknowns,
            plantEnergyMap: plantEnergyMap
        },
        player: {
            humanCoordinate: {x: 3, y: 3},
            dogCoordinate: null, // a null indicates the dog hasn't been added to the team yet
            round: 1, // 6 rounds per day
            trueRound: 1, // only increments
            humanStatus: {
                hunger: 100,
                sanity: 60,
                actionPoints: 5, // will be variable by hunger/sanity in the future
                onBoat: false,
            },
            dogStatus: {
                alive: true,
                hunger: 10,
                actionPoints: 3, // will be variable by hunger in the future
                onBoat: false
            },
            inventory: {
                seed: 4,
                saplings: 10,
                wood: 0,
                fish: 0,
                crop: 0,
                food: 0
            },
        },
        history: {
            reverseCount: 0,
            coordinates: [
                {
                    player: null,
                    dog: null
                },
                {
                    player: null,
                    dog: null
                },
                {
                    player: null,
                    dog: null
                }
            ]
        }
    },
    reducers: {
        forwardTime: (state, action) => {
            
            // ============ human & dog status changes =============
            
            // change human hunger: drop by 15 to a minimum of 0
    
            // change dog hunger: drop by 10; dog dies if its hunger drops to -30
            
            // change sanity based on:
            // - new hunger
            // - dog presence (dog death)
            // - surrounding environment
            // - at rest during night (round % 6 === 4 || round % 6 === 5)
            
            // determine next round's available action amount for human & dog
            
            // ============= history =============
            
            // add current coordinates to history; only take the first 3 elements in the coordinates list
            
            // ============ do map scan ============
    
            // declare variable lifeNum, deathNum from action.payload;
            // these 2 are randomly generated numbers between 0 and 100
            
            // sapling: if lifeNum < plantEnergy, grow; else +min(50, lifeNum) to plantEnergy
            
            // tree: if deathNum > plantEnergy, wilt; else -max(33, deathNum) to plantEnergy
            
            // wilt: if deathNum > 0.5, spread to a neighbouring cell
            // if spread:
            //      if neighbouring cell has tree/sapling, cell becomes wilt; otherwise cell becomes cursed grassland
            //      wilt becomes cursed grassland
            
            // crop seedling: if lifeNum < plantEnergy, mature; else + min(50, lifeNum) to plantEnergy
            
            // ============= map scan completes ==============
            
            // increment round and true round
            
            // reset reverse count to 1
            
            // check failing conditions: sanity <= 0 || time limit reached
            
            // check success conditions: no cursed grasslands
        },
        reverseTime: (state, action) => {
            
            // cannot reverse time if trueRound < 2 || round < 2
            
            // ============= status changes ===============
            
            // set human & dog coordinates based on 1st entry
            
            // reduce human sanity based on 25 * reverse count
            
            // ============= do map scan ===============
            
            // declare variable lifeNum, a random number between 50 and 100
            
            // wilt: becomes tree; cell plantEnergy gets assigned lifeNum
            
            // crop: if plantEnergy < lifeNum, revert to seedling
            
            // ============= complete map scan ================
            
            // decrement round, increment true round, increment reverse count
            
            // check failing conditions: sanity <= 0
            
        },
        movePlayer: (state, action) => {
            // declare variable based on action.payload
            
            // change player coordinate based on w-a-s-d
            // if not onBoat, cannot walk into water
            // if onBoat, and walking onto land: set onBoat to false
            // if onBoat, and walking into water: change player/boat/dog coordinate, swap map boat/water cells
            
            // if map coordinate points to boat: set onBoat to true
        },
        moveDog: (state, action) => {
            // cannot move if onBoat
            
            // declare variable based on action.payload
            
            // change dog coordinate based on w-a-s-d
            // if not onBoat, cannot walk into water
            // if onBoat, cannot walk; except for walking onto adjacent land, then set onBoat to false
            
            // if map coordinate points to boat: set onBoat to true
        },
        explore: (state, action) => {
            // cannot explore if surrounding cells all explored
            
            // set surrounding cells unknown to false
            
            // if on cursed grass, human sanity -10
        },
        interactWithWater: (state, action) => {
            // cannot interact if unexplored or no action points
            
            // get action type and water coordinates from action.payload
            
            // fish: 70% 1 fish, 25% 2 fish, 5% garbage
            
            // buildBoat: if inventory wood >= 5, water coordinate becomes boat
            
            // if action successful, actionPoint -1
        },
        interactWithCrop: (state, action) => {
            // cannot interact if unexplored or no action points
            
            // plantCrop:
            // cannot plant crop if no seeds left in inventory
            // cannot plant crop if not on normal grass/paw
            // plant crop:
            //      - modify map
            //      - inventory seed -1
            //      - plantEnergy resets to 0
            
            // harvestCrop:
            // cannot harvest crop if no mature crop
            // declare number from action payload: random integer between 0 and 2
            // harvest crop:
            //      - cell becomes grass
            //      - seed +2 if number > 0, else +1
            //      - crop +(5 + number), if water within 2-blocks radius then crop +(8 + number)
            
            // if action successful, actionPoint -1
        },
        interactWithHouse: (state, action) => {
            // cannot interact if unexplored or no action points
            
            // makeFood:
            //      - inventory food +(sum of fish and crop)
            //      - inventory fish resets to 0, crop resets to 0
            //      - does not consume action points
            
            // eat:
            //      - inventory food -1, human hunger status +30
            //      - does not consume action points
            
            // sleep:
            //      - sanity +25 at night, +15 during the day
            //      - sets action points to 0
        },
        interactWithTree: (state, action) => {
            // cannot interact if unexplored or no action points
            
            // plantTree:
            //      - can only plant on normal grass/paw
            //      - inventory sapling -1
            //      - plantEnergy on cell resets to 0
            
            // releaseTreeEnergy:
            // declare number from action payload: random integer between 3 and 8
            //      - can only perform on grown trees
            //      - inventory sapling +2, wood +1
            //      - starting clockwise on top of the cell, if neighbour cell is cursed then change neighbour cell to grass
            //      - overflowed healing restores sanity: +3 per over-heal
            
            // cleanWilt:
            //      - can only perform on wilts
            //      - cell becomes grass
            
            // consume 1 action point
        },
        interactWithDog: (state, action) => {
            // cannot interact if unexplored or no action points
            
            // feedDog
            //      - can only interact if is on the same cell as dog
            //      - if dog not on team, feeding adds dog to the team: dog cell becomes grass, initializes dog coordinates
            //      - inventory food -1, dog hunger +40
            //      - does not consume action points
        }
    }
});