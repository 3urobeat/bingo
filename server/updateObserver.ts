/*
 * File: updateObserver.ts
 * Project: bingo
 * Created Date: 28.07.2023 10:45:36
 * Author: 3urobeat
 * 
 * Last Modified: 28.07.2023 10:56:39
 * Modified By: 3urobeat
 * 
 * Copyright (c) 2023 3urobeat <https://github.com/3urobeat>
 * 
 * This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
 * You should have received a copy of the GNU General Public License along with this program. If not, see <https://www.gnu.org/licenses/>.
 */


export class UpdateObserver {
    private subscribers: Function[];

    static Instance: UpdateObserver;

    static getInstance() {
        if (this.Instance) {
            return this.Instance;
        }

        this.Instance = new UpdateObserver();
        return this.Instance;
    }

    constructor() {
        this.subscribers = []
    }

    /**
     * Adds a subscriber to the subscription list
     * @param subscriber 
     * @returns 
     */
    addSubscriber(subscriber: Function) {
        this.subscribers.push(subscriber);

        return this.subscribers.length - 1;
    }

    /**
     * Deletes a subscriber to the subscription list
     * @param subscriber 
     * @returns 
     */
    deleteSubscriber(subscriber: Function) { // TODO

    }

    /**
     * Calls every subscribed function
     */
    callSubscribers() {
        this.subscribers.forEach((e) => e());
    }
}