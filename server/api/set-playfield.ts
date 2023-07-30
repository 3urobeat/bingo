/*
 * File: set-playfield.ts
 * Project: bingo
 * Created Date: 28.07.2023 10:44:21
 * Author: 3urobeat
 *
 * Last Modified: 30.07.2023 13:52:22
 * Modified By: 3urobeat
 *
 * Copyright (c) 2023 3urobeat <https://github.com/3urobeat>
 *
 * This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
 * You should have received a copy of the GNU General Public License along with this program. If not, see <https://www.gnu.org/licenses/>.
 */


import { useDatabase } from "../../composables/useDatabase";


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

    console.log(`API set-playfield: Received get-playfield request for '${params.name}'`);

    // Get database instance
    const db = useDatabase();

    // Update database record
    await db.updateAsync({ name: params.name }, { $set: { playfield: params.playfield, lastActivity: Date.now() } });

    return true;
});