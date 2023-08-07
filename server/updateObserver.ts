/*
 * File: updateObserver.ts
 * Project: bingo
 * Created Date: 28.07.2023 10:45:36
 * Author: 3urobeat
 *
 * Last Modified: 07.08.2023 19:29:30
 * Modified By: 3urobeat
 *
 * Copyright (c) 2023 3urobeat <https://github.com/3urobeat>
 *
 * This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
 * You should have received a copy of the GNU General Public License along with this program. If not, see <https://www.gnu.org/licenses/>.
 */


export class UpdateObserver {
    private subscribers: { id: number, func: () => void }[];

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
        this.subscribers = [];
    }

    /**
     * Adds a subscriber to the subscription list
     * @param subscriber
     * @returns ID of this subscriber function in the subscribers collection
     */
    addSubscriber(subscriber: () => void) {
        const lastSub = this.subscribers[this.subscribers.length - 1] || { id: -1 };

        this.subscribers.push({ id: lastSub.id + 1, func: subscriber });

        console.log(`UpdateObserver: New subscription request, adding sub with id ${lastSub.id + 1}. There are now ${this.subscribers.length} subscribers.`);

        return lastSub.id + 1;
    }

    /**
     * Deletes a subscriber from the subscription list
     * @param id ID of the subscriber to delete
     */
    deleteSubscriber(id: number) {
        this.subscribers = this.subscribers.filter((e) => e.id != id);

        console.log(`UpdateObserver: Subscriber with id ${id} requested to be deleted, there are now ${this.subscribers.length} subscribers left.`);
    }

    /**
     * Calls every subscribed function
     */
    callSubscribers() {
        Object.values(this.subscribers).forEach((e) => e.func());
    }
}