/*
 * File: set-name.ts
 * Project: bingo
 * Created Date: 27.07.2023 19:59:02
 * Author: 3urobeat
 *
 * Last Modified: 28.07.2023 18:55:45
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


// This function is executed when this API route is called
export default defineEventHandler(async (event) => {
    // Get database instance
    const db = useDatabase();

    // Read body of the request we received
    const params = await readBody(event);

    if (params.name) {
        // TODO: Check for invalid names

        // Check for existing record and reject request
        const existingNames = await db.findAsync({ name: params.name });

        if (existingNames.length > 0) return false;


        // Upsert new database record
        await db.insertAsync({ name: params.name, lastActivity: Date.now(), playfield: {} });

        console.log(`API set-name: Inserting new name '${params.name}'`);


        // Update every name subscriber
        UpdateObserver.getInstance().callSubscribers();


        // Return true because request was accepted
        return true;
    }

    return false;
});