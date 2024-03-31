/*
 * File: get-playfield.ts
 * Project: bingo
 * Created Date: 2023-07-27 19:44:03
 * Author: 3urobeat
 *
 * Last Modified: 2024-03-31 12:49:57
 * Modified By: 3urobeat
 *
 * Copyright (c) 2023 - 2024 3urobeat <https://github.com/3urobeat>
 *
 * This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
 * You should have received a copy of the GNU General Public License along with this program. If not, see <https://www.gnu.org/licenses/>.
 */


import { useDatabase } from "../../composables/useDatabase";
// Import { UpdateObserver } from "../updateObserver";


/**
 * This API route returns the user's playfield data.
 * Params: { name: string }
 * Returns: "{ name: string, playfield: [{ id: number, content: string, strike: boolean }] }"
 */


// This function is executed when this API route is called
export default defineEventHandler(async (event) => {

    // Read name from the body of the request we received
    const { name } = await readBody(event);
    if (!name) return false;

    console.log(`API get-playfield: Received get-playfield request for '${name}'`);


    // Load DB
    const db = useDatabase();

    // Get record
    const data = await db.findOneAsync({ name: name });
    if (!data) return false;

    // Respond with the playfield and corresponding name
    return { name: data.name, playfield: data.playfield };


    // Should we want to implement visiting other user's playfields later on then use this code to get an eventstream
    /* // Make this a stream to update each client's names list when the DB changes
    const res = event.node.res;

    setHeader(event, 'cache-control', 'no-cache')
    setHeader(event, 'connection', 'keep-alive')
    setHeader(event, 'content-type', 'text/event-stream')
    setResponseStatus(event, 200)

    event.node.res.flushHeaders();


    // Read name from the body of the request we received
    const { name } = await readBody(event);
    if (!name) return false;


    const updateClient = async () => {
        // Load DB
        const db = useDatabase();

        // Get record
        let data = await db.findOneAsync({ name: name });

        // Respond with the playfield and corresponding name
        res.write(`data: ${JSON.stringify({ name: data.name, playfield: data.playfield })}\n\n`);
    }


    // Subscribe this update function to our update observer
    const index = UpdateObserver.getInstance().addSubscriber(updateClient);

    // Update once on load
    updateClient();

    // Listen for connection close and clean up
    event.node.req.on("close", () => {
        UpdateObserver.getInstance().deleteSubscriber(index);
    });

    event._handled = true; */
});
