<!--
/*
 * File: index.vue
 * Project: bingo
 * Created Date: 27.07.2023 13:03:50
 * Author: 3urobeat
 * 
 * Last Modified: 30.07.2023 00:09:44
 * Modified By: 3urobeat
 * 
 * Copyright (c) 2023 3urobeat <https://github.com/3urobeat>
 * 
 * This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
 * You should have received a copy of the GNU General Public License along with this program. If not, see <https://www.gnu.org/licenses/>.
 */
-->


<template>
    <div class="greetings-wrapper flex flex-col items-center">
        <div class="greetings-new-name">
            <span>Dein Name:</span>
            <input type="text" @keyup.enter="play" v-model="nameinput" class="rounded-lg">
            <button @click="play" class="greetings-new-name-play rounded-xl px-3 bg-playbtn hover:bg-lime-500">Play!</button>
            <div class="greetings-new-name-error text-red-500" v-if="showNewNameError">Error! This name is invalid or already in use!</div>
        </div>

        <div class="greetings-existing-name">
            <span>...oder wähle einen aus:</span>
            <ul id="greetings-existing-names-list" class="greetings-existing-names-list rounded-lg">
                <li v-for="thisname in names" @click="selectExistingName(thisname.name)" :key="thisname">{{thisname.name}}</li> <!-- This is filled automatically with data from useFetch() below -->
            </ul>
            <div class="greetings-existing-name-error text-red-500" v-if="showExistingNameError">Error! This name is already in use.</div>
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
        eventStream = useEventStream("get-names");

        eventStream.addEventListener("message", (msg) => {
            // Get a list of all names we currently know and update the list
            names.value = JSON.parse(msg.data.split(" ").pop());
        })
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

        startGame(nameinput.value, { lastActivity: 0, isInactive: true })
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
        @apply gap-y-16 md:gap-x-0;
        grid-auto-flow: row;
        grid-template-areas:
            ". . ."
            ". . ."
            ". name-input ."
            ". existing-names ."
            ". . ."
            ". . .";
    }

    .greetings-new-name {
        grid-area: name-input;
    }

    .greetings-new-name-play {
        margin-top: 10px;
    }
    
    .greetings-existing-name {
        grid-area: existing-names;
    }

    .greetings-existing-names-list {
        border-style: solid;
        border-width: 3px;
        border-color: black;
    }

    li:before {
        width: 21px;
        /* height: 21px; */
        display: inline-block;
        content: " ";
    }

</style>