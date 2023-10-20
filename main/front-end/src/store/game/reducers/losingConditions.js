export const losingConditions = {
    check:  (state) => {
        // check failing conditions: sanity <= 0 || time limit reached (in the future)
        if (state.player.humanStatus.sanity <= 0) {
            console.error("Failing conditions met");
            state.gameStatus = false;
        }
    }
};