/*
 * File: updateObserver.ts
 * Project: bingo
 * Created Date: 28.07.2023 10:45:36
 * Author: 3urobeat
 * 
 * Last Modified: 28.07.2023 12:45:09
 * Modified By: 3urobeat
 * 
 * Copyright (c) 2023 3urobeat <https://github.com/3urobeat>
 * 
 * This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
 * You should have received a copy of the GNU General Public License along with this program. If not, see <https://www.gnu.org/licenses/>.
 */


export class UpdateObserver {
    private subscribers: {[key: string]: Function};

    // Provide a getInstance() function to make this class a singleton
    static Instance: UpdateObserver;

    static getInstance() {
        if (this.Instance) {
            return this.Instance;
        }

        this.Instance = new UpdateObserver();
        return this.Instance;
    }

    constructor() {
        this.subscribers = {};
    }

    /**
     * Adds a subscriber to the subscription list
     * @param subscriber 
     * @returns 
     */
    addSubscriber(subscriber: Function) {
        const currentIndex = Object.values(this.subscribers).length - 1;

        this.subscribers[String(currentIndex + 1)] = subscriber;

        console.log(`UpdateObserver: New subscription request, adding index ${currentIndex + 1}. There are now ${currentIndex + 2} subscribers.`)

        return currentIndex + 1;
    }

    /**
     * Deletes a subscriber from the subscription list
     * @param index Index of the subscriber to delete
     * @returns true if subscriber was removed, false if it doesn't exist
     */
    deleteSubscriber(index: number) { // TODO
        console.log(`UpdateObserver: Subscriber ${index} requested to be deleted, there are now ${Object.values(this.subscribers).length} subscribers left.`);

        if (!Object.values(this.subscribers)[index]) return false;

        delete Object.values(this.subscribers)[index];

        return true;
    }

    /**
     * Calls every subscribed function
     */
    callSubscribers() {
        Object.values(this.subscribers).forEach((e) => e());
    }
}