/*
 * File: storeKnownWins.ts
 * Project: bingo
 * Created Date: 2023-07-31 19:26:40
 * Author: 3urobeat
 *
 * Last Modified: 2024-03-31 12:48:53
 * Modified By: 3urobeat
 *
 * Copyright (c) 2023 - 2024 3urobeat <https://github.com/3urobeat>
 *
 * This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
 * You should have received a copy of the GNU General Public License along with this program. If not, see <https://www.gnu.org/licenses/>.
 */


const knownWins: {[key: string]: number} = {}; // Collection of usernames connected to a timestamp which have won


/**
 * Returns the list of known wins
 * @returns knownWins array
 */
export function getKnownWins() {
    return Object.keys(knownWins).filter((e) => knownWins[e] + 500 < Date.now()); // Ignore entries added in the 500ms
}


/**
 * Adds a name to the list of known wins
 * @param name The name to add
 */
export function addToKnownWins(name: string) {
    if (!Object.keys(knownWins).includes(name)) knownWins[name] = Date.now();
}


/**
 * Removes a name from the list of known wins
 * @param name The name to remove
 */
export function removeFromKnownWins(name: string) {
    if (Object.keys(knownWins).includes(name)) delete knownWins[name];
}
