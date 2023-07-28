<!--
/*
 * File: Greetings.vue
 * Project: bingo
 * Created Date: 27.07.2023 13:03:50
 * Author: 3urobeat
 * 
 * Last Modified: 28.07.2023 18:58:15
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
    <div class="greetings-wrapper flex self-center justify-center items-center">
        <div class="greetings-new-name">
            <a>Dein Name:</a>
            <br />
            <input type="text" @keyup.enter="play" v-model="nameinput" class="rounded-l">
            <br />
            <button @click="play" class="greetings-new-name-play rounded-xl px-3">Play!</button>
            <br />
            <div class="greetings-new-name-error" v-if="showNewNameError">Error!</div>
        </div>

        <div class="greetings-existing-name">
            <a>...oder wähle einen aus:</a>
            <br />
            <ul id="greetings-existing-names-list" class="greetings-existing-names-list rounded-l">
                <li v-for="thisname in names" @click="selectExistingName" :key="thisname">{{thisname.name}}</li> <!-- This is filled automatically with data from useFetch() below -->
            </ul>
            <div class="greetings-existing-name-error" v-if="showExistingNameError">Error!</div>
        </div>
    </div>
</template>


<script setup lang="ts">
    import { useFetch } from '@vueuse/core'

    // Get refs to various elements
    const nameinput = ref("");
    const names: Ref<any[]> = ref([]);
    const showNewNameError = ref(false);
    const showExistingNameError = ref(false);


    // Get an event stream to update the names list on change
    let eventStream: EventSource;

    onMounted(() => {
        eventStream = new EventSource("/api/get-names");

        eventStream.addEventListener("message", (msg) => {
            // Get a list of all names we currently know and update the list
            names.value = JSON.parse(msg.data.split(" ").pop());
        })

        // Clean up when the page is unmounted
        onUnmounted(() => {
            eventStream.close();
        })
    });


    /**
     * Starts a game by hiding the Greetings page and showing the Bingo page
     * @param selectedName The name selected by the user
     * @param lastActivity If an existing name, the lastActivity timestamp from the database
     */
    function startGame(selectedName: string, lastActivity: { lastActivity: number, isInactive: number }) {
        // Check if we are allowed to choose this name
        showExistingNameError.value = !lastActivity.isInactive;

        if (!lastActivity.isInactive) return; // ...if not, abort

        // Update lastActivity in database, store name in localstorage and show bingo page
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

        document.getElementById("greetings-page-component").style = "display:none";
        document.getElementById("bingo-page-component").style     = "";
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
     * @param event DOM Button Click event
     */
    async function selectExistingName(event: Event) {
        const selectedName = event.target.innerHTML;

        // Check if name is currently in use
        const res = await useFetch("/api/get-lastactivity", { // TODO: Stupid that this is a POST
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: selectedName
            })
        });

        const lastActivity = JSON.parse(res.data.value);

        console.log("User selected existing name '" + event.target.innerHTML + "' which is " + (lastActivity.isInactive ? "available." : "not available!"))

        startGame(selectedName, lastActivity);
    };
</script>


<style>
    .greetings-wrapper {
        display: grid;
        grid-auto-flow: row;
        grid-template-columns: 1fr 1fr 1fr;
        grid-template-rows: 1fr 1fr 1fr 1fr;
        gap: 10px;
        grid-auto-flow: row;
        grid-template-areas:
            ". name-input ."
            ". existing-names ."
            ". . ."
            ". . .";
    }

    .greetings-new-name { grid-area: name-input; }

    .greetings-new-name-play {
        @apply bg-playbtn;
        margin-top: 10px;
    }
    
    .greetings-existing-name { grid-area: existing-names; }

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