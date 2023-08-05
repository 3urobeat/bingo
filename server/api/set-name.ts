/*
 * File: set-name.ts
 * Project: bingo
 * Created Date: 27.07.2023 19:59:02
 * Author: 3urobeat
 *
 * Last Modified: 05.08.2023 15:42:06
 * Modified By: 3urobeat
 *
 * Copyright (c) 2023 3urobeat <https://github.com/3urobeat>
 *
 * This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
 * You should have received a copy of the GNU General Public License along with this program. If not, see <https://www.gnu.org/licenses/>.
 */


import { useDatabase } from "../../composables/useDatabase";
import { UpdateObserver } from "../updateObserver";


/**
 * This API route inserts a record for a new user and returns a boolean if the name was accepted. Duplicate names will be rejected.
 * Params: { name: string, lang?: string }
 * Returns: "boolean"
 */


// This function is executed when this API route is called
export default defineEventHandler(async (event) => {
    // Get database instance
    const db = useDatabase();

    // Read body of the request we received
    const params = await readBody(event);

    if (params.name) {
        // Check for invalid names and reject request
        if (!/^[A-Za-z][A-Za-z0-9_]{1,33}$/.test(params.name) || ["undefined", "null"].includes(params.name)) return false;

        // Check for existing record and reject request
        const existingNames = await db.findAsync({ name: params.name });

        if (existingNames.length > 0) return false;


        // Set default lang if none was specified
        if (!params.lang) params.lang = "english";


        // Upsert new database record
        await db.insertAsync({ name: params.name, lastActivity: Date.now(), lang: params.lang, playfield: [], hasWon: false });

        console.log(`API set-name: Inserting new name '${params.name}'`);


        // Update every subscriber
        UpdateObserver.getInstance().callSubscribers();


        // Return true because request was accepted
        return true;
    }

    return false;
});