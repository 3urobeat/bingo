<!--
/*
 * File: index.vue
 * Project: bingo
 * Created Date: 2023-07-27 13:03:50
 * Author: 3urobeat
 *
 * Last Modified: 2024-03-23 14:14:07
 * Modified By: 3urobeat
 *
 * Copyright (c) 2023 - 2024 3urobeat <https://github.com/3urobeat>
 *
 * This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
 * You should have received a copy of the GNU General Public License along with this program. If not, see <https://www.gnu.org/licenses/>.
 */
-->


<template>
    <div class="greetings-wrapper items-center gap-y-16 md:gap-x-0 mt-16">
        <div class="greetings-new-name flex flex-col items-center gap-2">
            <span class="text-lg">Dein Name:</span>
            <input type="text" @keyup.enter="play" v-model="nameinput" class="rounded-lg">
            <button @click="play" class="greetings-new-name-play rounded-lg py-[1px] px-7 bg-playbtn hover:bg-green-500">Play!</button>
            <div class="greetings-new-name-error text-red-500 mt-5" v-if="showNewNameError">Error! This name is invalid or already in use! Names must be 2-32 alphanumeric characters long.</div>
        </div>

        <div class="greetings-existing-name">
            <span>...oder wähle einen aus:</span>
            <ul id="greetings-existing-names-list" class="greetings-existing-names-list rounded-lg p-1 border-solid border-2 border-black">
                <span class="ml-4 mr-4" v-if="names.length == 0">No existing names found!</span>
                <li class="ml-4 mr-4" v-for="thisname in names" @click="selectExistingName(thisname.name)" :key="thisname">{{thisname.name}}</li> <!-- This is filled automatically with data from useFetch() below -->
            </ul>
            <div class="greetings-existing-name-error text-red-500 mt-5" v-if="showExistingNameError">Error! This name is already in use.</div>
        </div>
    </div>
</template>


<script setup lang="ts">
    import { useFetch } from '@vueuse/core'

    const router = useRouter();


    // Get refs to various elements
    const nameinput = ref("");
    const names: Ref<any[]> = ref([]);
    const showNewNameError = ref(false);
    const showExistingNameError = ref(false);


    // Get an event stream to update the names list on change
    let eventStream: EventSource;

    onBeforeMount(() => {
        eventStream = new EventSource("/api/get-names");

        eventStream.addEventListener("message", (msg) => {
            // Get a list of all names we currently know and update the list
            names.value = JSON.parse(msg.data.split(" ").pop());
        })
    });


    // Clean up when the page is unmounted
    onUnmounted(() => {
        eventStream.close();
    });


    /**
     * Starts a game by hiding the Greetings page and showing the Bingo page
     * @param selectedName The name selected by the user
     * @param lastActivity If an existing name, the lastActivity timestamp from the database
     */
    function startGame(selectedName: string, lastActivity: { lastActivity: number, isInactive: boolean }) {
        // Check if we are allowed to choose this name
        showExistingNameError.value = !lastActivity.isInactive;

        if (!lastActivity.isInactive) return; // ...if not, abort


        // Update lastActivity in database, store name in localstorage
        useFetch("/api/set-lastactivity", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: selectedName
            })
        });

        localStorage.selectedName = selectedName;
        localStorage.lastActivity = Date.now();


        // Redirect user to game room
        router.push({ path: "/game/" + selectedName });
    };

    /**
     * Function which gets called when the user presses the play button
     * @param event DOM Button Click event
     */
    async function play(event: Event) {
        // Post our data and await a response
        const res = await useFetch("/api/set-name", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: nameinput.value
            })
        });

        // Display error div if name was not accepted
        showNewNameError.value = res.data.value == "false";

        if (showNewNameError.value) return; // ...and abort

        startGame(nameinput.value, { lastActivity: 0, isInactive: true });
    };

    /**
     * Function which gets called when the user selects an existing name
     */
    async function selectExistingName(name: string) {

        // Check if name is currently in use
        const res = await useFetch("/api/get-lastactivity", { // TODO: Stupid that this is a POST
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: name
            })
        });

        const lastActivity = JSON.parse(res.data.value as string);

        console.log("User selected existing name '" + name + "' which is " + (lastActivity.isInactive ? "available." : "not available!"))

        startGame(name, lastActivity);
    };
</script>


<style>
    .greetings-wrapper {
        display: grid;
        grid-auto-flow: row;
        grid-template-columns: 1fr 1fr 1fr;
        grid-auto-flow: row;
        grid-template-areas:
            ". . ."
            ". name-input ."
            ". existing-names .";
    }

    .greetings-new-name {
        grid-area: name-input;
    }

    .greetings-existing-name {
        grid-area: existing-names;
    }
</style>
