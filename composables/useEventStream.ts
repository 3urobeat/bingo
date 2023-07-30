/*
 * File: useEventStream.ts
 * Project: bingo
 * Created Date: 29.07.2023 23:15:42
 * Author: 3urobeat
 *
 * Last Modified: 30.07.2023 12:42:15
 * Modified By: 3urobeat
 *
 * Copyright (c) 2023 3urobeat <https://github.com/3urobeat>
 *
 * This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
 * You should have received a copy of the GNU General Public License along with this program. If not, see <https://www.gnu.org/licenses/>.
 */


const streams: Record<string, EventSource> = {};


/**
 * Gets an existing stream or creates a new one
 * @param name Name of the API endpoint
 * @returns EventSource for you to listen to
 */
export function useEventStream(name: string) {

    // Create new EventStream if none exists
    if (!streams[name]) {
        streams[name] = new EventSource("/api/" + name);
    }

    return streams[name];

}