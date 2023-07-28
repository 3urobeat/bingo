/*
 * File: get-lastactivity.ts
 * Project: bingo
 * Created Date: 28.07.2023 15:42:55
 * Author: 3urobeat
 * 
 * Last Modified: 28.07.2023 16:16:23
 * Modified By: 3urobeat
 * 
 * Copyright (c) 2023 3urobeat <https://github.com/3urobeat>
 * 
 * This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
 * You should have received a copy of the GNU General Public License along with this program. If not, see <https://www.gnu.org/licenses/>.
 */


import { useDatabase } from "../../composables/useDatabase";


// This function is executed when this API route is called
export default defineEventHandler(async (event) => {
    // Get database instance
    const db = useDatabase();

    // Read body of the request we received
    const params = await readBody(event);

    console.log(`API get-lastactivity: Received get-lastactivity request for '${params.name}'`);

    const resObj = {
        lastActivity: 0,
        isInactive: true
    }

    if (params.name) {
        // Find this user
        const res = await db.findOneAsync({ name: params.name });

        // Check if nothing was found
        if (!res || !res.lastActivity) return resObj;

        resObj.lastActivity = res.lastActivity;
        resObj.isInactive   = res.lastActivity + 1.8e+6 < Date.now(); // 30 min in ms

        return resObj; 
    }

    return resObj;
});