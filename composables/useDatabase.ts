/*
 * File: useDatabase.ts
 * Project: bingo
 * Created Date: 2023-07-27 19:32:28
 * Author: 3urobeat
 *
 * Last Modified: 2024-03-31 12:50:38
 * Modified By: 3urobeat
 *
 * Copyright (c) 2023 - 2024 3urobeat <https://github.com/3urobeat>
 *
 * This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
 * You should have received a copy of the GNU General Public License along with this program. If not, see <https://www.gnu.org/licenses/>.
 */


// Load database
import nedb from "@seald-io/nedb";

const database = new nedb<Player>({ filename: "./server/data/database.db", autoload: true }); // Autoload

type Player = {
    name: string,
    lastActivity: number,
    lang: string,
    playfield: { id: number, content: string, strike: boolean }[],
    hasWon: boolean
};

/**
 * Provide function to access Database instance from API
 * @returns Nedb database instance
 */
export function useDatabase() {
    return database;
}
