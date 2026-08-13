import { ROUNDS_PER_PHASE_MAX, ROUNDS_PER_PHASE_MIN } from "../constants";

export function randomRoundsThisPhase(): number{
    return(
        ROUNDS_PER_PHASE_MIN + Math.floor(Math.random()* (ROUNDS_PER_PHASE_MAX - ROUNDS_PER_PHASE_MIN + 1))
    );
}