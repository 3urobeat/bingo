/*
 * File: set-lastactivity.ts
 * Project: bingo
 * Created Date: 2023-07-28 15:37:29
 * Author: 3urobeat
 *
 * Last Modified: 2024-03-31 12:49:41
 * Modified By: 3urobeat
 *
 * Copyright (c) 2023 - 2024 3urobeat <https://github.com/3urobeat>
 *
 * This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
 * You should have received a copy of the GNU General Public License along with this program. If not, see <https://www.gnu.org/licenses/>.
 */


import { useDatabase } from "../../composables/useDatabase";
import { UpdateObserver } from "../updateObserver";


/**
 * This API route updates the user's lastActivity property and returns boolean if update was successful. Set lastActivity to 0 if this is a logout.
 * Params: { name: string, lastActivity?: number }
 * Returns: "boolean"
 */


// This function is executed when this API route is called
export default defineEventHandler(async (event) => {
    // Get database instance
    const db = useDatabase();

    // Read body of the request we received
    const params = await readBody(event);

    if (params.lastActivity == undefined) params.lastActivity = Date.now();

    console.log(`API set-activity: Updating lastActivity of user '${params.name}'`);

    if (params.name) {
        // TODO: Check for invalid names

        // Update database record
        await db.updateAsync({ name: params.name }, { $set: { lastActivity: params.lastActivity } }, { });

        // Call update subscribers if lastActivity is 0 to show other users the logout
        if (params.lastActivity == 0) UpdateObserver.getInstance().callSubscribers();

        return true;
    }

    return false;
});
