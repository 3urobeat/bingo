/*
 * File: get-names.ts
 * Project: bingo
 * Created Date: 27.07.2023 19:28:14
 * Author: 3urobeat
 * 
 * Last Modified: 28.07.2023 12:06:10
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
    // Make this a stream
    const res = event.node.res;

    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Connection", "keep-alive");

    event.node.res.flushHeaders();

    // Update
    const updateClient = async () => {
        // Load DB
        const db = useDatabase();

        // Get all records
        let data = await db.findAsync({ });

        // Remove playfield from response to keep transmitted data size relatively small
        const filtered = data.map((e) => {
            return { name: e.name, lastActivity: e.lastActivity };
        });

        res.write(`data: ${JSON.stringify(filtered)}\n\n`);
    }

    // Register this update function
    const index = UpdateObserver.getInstance().addSubscriber(updateClient);

    updateClient(); // Update once

    res.on("close", () => { // TODO: Call deleteSubscriber
        
    })

    event._handled = true;
});