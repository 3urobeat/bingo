/*
 * File: set-resetvote.ts
 * Project: bingo
 * Created Date: 31.07.2023 19:15:58
 * Author: 3urobeat
 *
 * Last Modified: 31.07.2023 19:41:11
 * Modified By: 3urobeat
 *
 * Copyright (c) 2023 3urobeat <https://github.com/3urobeat>
 *
 * This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
 * You should have received a copy of the GNU General Public License along with this program. If not, see <https://www.gnu.org/licenses/>.
 */


import { addToResetVotes, removeFromResetVotes } from "../../stores/storeResetVotes";
import { UpdateObserver } from "../updateObserver";


/**
 * This API route registers or unregisters a user's vote in the resetVotes store and returns boolean if update was successful.
 * Params: { name: string, hasVotedForRestart: boolean }
 * Returns: "boolean"
 */


// This function is executed when this API route is called
export default defineEventHandler(async (event) => {

    // Read name from the body of the request we received
    const params = await readBody(event);
    if (!params.name || typeof(params.hasVotedForRestart) == "undefined") return false;

    console.log(`API set-resetvote: Received set-resetvote request for '${params.name}' to '${params.hasVotedForRestart}'`);


    // Update store
    if (params.hasVotedForRestart) addToResetVotes(params.name);
        else removeFromResetVotes(params.name);


    // Update every subscriber
    UpdateObserver.getInstance().callSubscribers();


    return true;
});