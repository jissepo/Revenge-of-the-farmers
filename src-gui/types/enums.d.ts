export declare enum PlantType {
    VEGETABLE = "vegetable",
    FRUIT = "fruit",
    FLOWER = "flower",
    TREE = "tree",
    BUSH = "bush",
    SUCCULENT = "succulent",
    CROP = "crop"
}
export declare enum PlantAttributes {
    SHARP = "sharp",
    EVERGREEN = "evergreen",
    DECIDUOUS = "deciduous",
    FRAGRANT = "fragrant",
    TOXIC = "toxic",
    EDIBLE = "edible",
    POISONOUS = "poisonous",
    SPINY = "spiny",
    THORNY = "thorny",
    SUCCULENT = "succulent",
    TROPICAL = "tropical",
    DESERT = "desert",
    AQUATIC = "aquatic",
    MEDICINAL = "medicinal",
    CULINARY = "culinary",
    TEXTILE = "textile",
    FIBER = "fiber"
}
export declare enum PlantGrowthState {
    SEED = "seed",
    GROWING = "growing",
    READY = "ready"
}
/**
 * Actions that can be sent to the worker.
 */
export declare enum SendableWorkerActions {
    START_GAME = "startGame",
    PLANT_PLANT = "plantPlant",
    END_GAME = "endGame",
    UNLOAD = "unload",
    GET_CELL_STATE = "getCellState"
}
/**
 * Actions that can be received from the worker.
 */
export declare enum ReceivedWorkerActions {
    ERROR = "error",
    GAME_STARTED = "gameStarted",
    PLANT_PLANTED = "plantPlanted",
    PLANT_STATE_CHANGED = "plantStateChanged"
}
export declare enum GameOutcome {
    WIN = "WIN",
    LOSE = "LOSE"
}
export declare enum GameStatus {
    NOT_STARTED = "NOT_STARTED",
    STARTED = "STARTED",
    ENDED = "ENDED"
}
