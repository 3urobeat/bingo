/*
 * File: storeResetVotes.ts
 * Project: bingo
 * Created Date: 2023-07-31 19:35:27
 * Author: 3urobeat
 *
 * Last Modified: 2024-03-31 12:48:39
 * Modified By: 3urobeat
 *
 * Copyright (c) 2023 - 2024 3urobeat <https://github.com/3urobeat>
 *
 * This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
 * You should have received a copy of the GNU General Public License along with this program. If not, see <https://www.gnu.org/licenses/>.
 */


import { useDatabase } from "../composables/useDatabase";


const resetVotes: string[] = []; // Collection of usernames


/**
 * Returns the list of registered votes
 * @returns resetVotes array
 */
export function getResetVotes() {
    return resetVotes;
}


/**
 * Adds a name to the list of registered votes
 * @param name The name to add
 */
export function addToResetVotes(name: string) {
    if (!resetVotes.includes(name)) resetVotes.push(name);
}


/**
 * Removes a name from the list of registered votes
 * @param name The name to remove
 */
export function removeFromResetVotes(name: string) {
    if (resetVotes.includes(name)) resetVotes.splice(resetVotes.indexOf(name), 1);
}


/**
 * Deletes every vote stored in the list of registered votes if no active user has a win stored
 */
export async function resetResetVotes() {
    const db = useDatabase();

    // Get all records
    const data = await db.findAsync({ });

    // Get only records from active users
    const filtered = data.filter((e) => e.lastActivity + 1.8e+6 > Date.now()); // 30 min in ms

    // Reset if no active user has a win stored
    if (filtered.every((e) => !e.hasWon)) resetVotes.splice(0, resetVotes.length);
}
