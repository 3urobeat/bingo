/*
 * File: set-playfield.ts
 * Project: bingo
 * Created Date: 2023-07-28 10:44:21
 * Author: 3urobeat
 *
 * Last Modified: 2024-03-31 12:49:22
 * Modified By: 3urobeat
 *
 * Copyright (c) 2023 - 2024 3urobeat <https://github.com/3urobeat>
 *
 * This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
 * You should have received a copy of the GNU General Public License along with this program. If not, see <https://www.gnu.org/licenses/>.
 */


import { useDatabase } from "../../composables/useDatabase";
import { addToKnownWins, removeFromKnownWins } from "../../stores/storeKnownWins";
import { resetResetVotes } from "../../stores/storeResetVotes";
import { UpdateObserver } from "../updateObserver";


/**
 * This API route updates the user's playfield property and returns a boolean if the update was accepted.
 * Params: { name: string, playfield: [{ id: number, content: string, strike: boolean }] }
 * Returns: "boolean"
 */


// This function is executed when this API route is called
export default defineEventHandler(async (event) => {

    // Read name from the body of the request we received
    const params = await readBody(event);
    if (!params.name) return false;

    // Check for win
    const hasWon = checkPlayfieldForWin(params.playfield);

    console.log(`API set-playfield: Received set-playfield request for '${params.name}'`);


    // Get database instance
    const db = useDatabase();

    // Update database record
    await db.updateAsync({ name: params.name }, { $set: { playfield: params.playfield, lastActivity: Date.now(), hasWon: hasWon } });


    // Add name to knownWins if hasWon is true, otherwise remove it
    if (hasWon) addToKnownWins(params.name);
        else removeFromKnownWins(params.name);

    // Check if we should reset all votes
    resetResetVotes();


    // Update every subscriber
    UpdateObserver.getInstance().callSubscribers();


    return true;
});


/**
 * Checks if this user has a Bingo (full row in x, y and xy direction) and notifies all other users
 * @param playfield Array of card objects in this playfield
 * @returns Boolean if this user has won
 */
function checkPlayfieldForWin(playfield: [{ id: number, content: string, strike: boolean }]) { // TODO: This code is probably inefficient and shit as fuck
    let hasWon = false;

    // Calculate the amount of rows and columns we have (playfield is square)
    const rowColAmount = Math.sqrt(playfield.length);


    // Check each row for win
    for (let row = 0; row < rowColAmount; row++) {
        const rowIdMin = rowColAmount * row;
        const rowIdMax = rowColAmount * (row + 1);

        // Get all cards inside the [rowIdMin, rowIdMax] interval
        const rowCards = playfield.filter((e) => e.id > rowIdMin && e.id <= rowIdMax); // > and <= as our playfield starts at index 1 instead of 0

        // Check if every element is striked
        const rowWin = rowCards.every((e) => e.strike);

        // Only update hasWon if it is not already true to avoid resetting existing win
        if (!hasWon) hasWon = rowWin;
    }


    // Check each column for win
    for (let col = 0; col < rowColAmount; col++) {
        const colCards = [];

        // Get all cards inside this column
        for (let row = 0; row < rowColAmount; row++) {
            const cardId = (rowColAmount * row) + col + 1; // +1 because our playfield starts at index 1 instead of 0

            // Get this card and push it
            colCards.push(playfield.find((e) => e.id == cardId));
        }

        // Check if every element is striked
        const colWin = colCards.every((e) => e!.strike);

        // Only update hasWon if it is not already true to avoid resetting existing win
        if (!hasWon) hasWon = colWin;
    }


    // Check diagonale for win
    const diagTlBrCards = []; // Top left to bottom right

    for (let row = 0; row < rowColAmount; row++) {
        const cardId = (rowColAmount * row) + (row + 1);

        diagTlBrCards.push(playfield.find((e) => e.id == cardId));
    }

    const diagTrBlCards = []; // Top right to bottom left

    for (let row = 0; row < rowColAmount; row++) {
        const cardId = (rowColAmount * (row + 1)) - row;

        diagTrBlCards.push(playfield.find((e) => e.id == cardId));
    }

    const diagWin = diagTlBrCards.every((e) => e!.strike) || diagTrBlCards.every((e) => e!.strike);

    if (!hasWon) hasWon = diagWin;


    // Return result
    return hasWon;
}
