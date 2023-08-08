/*
 * File: get-names.ts
 * Project: bingo
 * Created Date: 27.07.2023 19:28:14
 * Author: 3urobeat
 *
 * Last Modified: 08.08.2023 18:14:15
 * Modified By: 3urobeat
 *
 * Copyright (c) 2023 3urobeat <https://github.com/3urobeat>
 *
 * This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
 * You should have received a copy of the GNU General Public License along with this program. If not, see <https://www.gnu.org/licenses/>.
 */


import { useDatabase } from "../../composables/useDatabase";
import { getKnownWins } from "../../stores/storeKnownWins";
import { getResetVotes } from "../../stores/storeResetVotes";
import { UpdateObserver } from "../updateObserver";


/**
 * This API route returns an event stream which is constantly updated with all names and some data stored in the database
 * Parameters: /
 * Returns: "[{ name: string, lastActivity: number, lang: string, strikesCount: number, cardsCount: number, hasWon: boolean, isNewWin: boolean, hasVotedForRestart: boolean }]"
 */


// This function is executed when this API route is called
export default defineEventHandler(async (event) => {
    // Make this a stream to update each client's names list when the DB changes
    const res = event.node.res;

    setHeader(event, "cache-control", "no-cache");
    setHeader(event, "connection", "keep-alive");
    setHeader(event, "content-type", "text/event-stream");
    setResponseStatus(event, 200);

    event.node.res.flushHeaders();

    /**
     * Updates the names list with database content
     */
    const updateClient = async () => {
        // Load DB
        const db = useDatabase();

        // Get all records
        const data = await db.findAsync({ });

        // Remove playfield from response to keep transmitted data size relatively small
        const filtered = data.map((e) => {
            const inKnownWins = !getKnownWins().includes(e.name);

            // Format object to return
            const obj = {
                name: e.name,
                lastActivity: e.lastActivity,
                lang: e.lang,
                strikesCount: Object.values(e.playfield).filter((f) => f.strike).length,
                cardsCount: Object.keys(e.playfield).length,
                hasWon: e.hasWon,
                isNewWin: e.hasWon && inKnownWins,
                hasVotedForRestart: getResetVotes().includes(e.name)
            };

            return obj;
        });

        console.log("API get-names: Updating event stream with new data");

        res.write(`data: ${JSON.stringify(filtered)}\n\n`);
    };

    // Subscribe this update function to our update observer
    const index = UpdateObserver.getInstance().addSubscriber(updateClient);

    // Update once on load
    updateClient();

    // Broadcast new user
    UpdateObserver.getInstance().callSubscribers();

    // Listen for connection close and clean up
    event.node.req.on("close", () => {
        UpdateObserver.getInstance().deleteSubscriber(index);
    });

    event._handled = true;
});