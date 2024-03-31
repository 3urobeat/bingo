/*
 * File: update-name.ts
 * Project: bingo
 * Created Date: 2024-03-31 14:47:59
 * Author: 3urobeat
 *
 * Last Modified: 2024-03-31 15:29:26
 * Modified By: 3urobeat
 *
 * Copyright (c) 2024 3urobeat <https://github.com/3urobeat>
 *
 * This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
 * You should have received a copy of the GNU General Public License along with this program. If not, see <https://www.gnu.org/licenses/>.
 */


import { useDatabase } from "../../composables/useDatabase";
import { UpdateObserver } from "../updateObserver";


/**
 * This API changes a name in the database. Duplicate names will be rejected
 * Params: { oldName: string, newName: string }
 * Returns: boolean
 */


// This function is executed when this API route is called
export default defineEventHandler(async (event) => {
    // Get database instance
    const db = useDatabase();

    // Read body of the request we received
    const params = await readBody(event);

    if (params.oldName && params.newName) {
        // Check for invalid names and reject request
        if (!/^[A-Za-z][A-Za-z0-9_]{1,33}$/.test(params.newName) || ["undefined", "null"].includes(params.newName)) return false;

        // Check for existing record and reject request
        const existingNames = await db.findAsync({ name: params.newName });

        if (existingNames.length > 0) {
            console.log(`API update-name: Rejecting name change request to '${params.newName}' because it already exists`);
            return false;
        }


        // Upsert new database record
        await db.updateAsync({ name: params.oldName }, { $set: { name: params.newName } });

        console.log(`API update-name: Changing name '${params.oldName}' to name '${params.newName}'`);


        // Update every subscriber
        UpdateObserver.getInstance().callSubscribers();


        // Return true because request was accepted
        return true;
    }

    return false;
});
