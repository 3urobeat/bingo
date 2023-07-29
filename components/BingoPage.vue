<!--
/*
 * File: BingoPage.vue
 * Project: bingo
 * Created Date: 27.07.2023 13:06:42
 * Author: 3urobeat
 * 
 * Last Modified: 29.07.2023 20:10:22
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
    <div class="bingo-wrapper flex self-center justify-center items-center">
        <div class="bingo-header-wrapper">
            <a>{{ selectedName }}</a>
            <br />
            <a class="bingo-header-error text-red-500" v-if="showBingoHeaderError">Failed to load playfield!</a>
        </div>

        <div class="bingo-playfield-wrapper">
            <div class="bingo-playfield-card" @click="cardClick" v-for="thiscard in cards" :id="thiscard.id">
                <input type="text" v-if="editModeActive" @keyup.enter="cardInputUpdate" @keyup.esc="toggleEditMode" class="rounded-l" :id="thiscard.id" :value="thiscard.content"> <!-- Add keyup.esc to make desktop usage easier -->
                <a type="text" v-if="!editModeActive" class="rounded-l" :id="thiscard.id">{{ thiscard.content }}</a>
                <div class="absolute inset-0 w-full h-full flex items-center justify-center" v-if="thiscard.strike && !editModeActive">
                    <PhX size="700" fill="red"></PhX>
                </div>
            </div>
        </div>

        <div class="bingo-players-list-wrapper">
            <a>Active Players:</a>
            <ul id="bingo-players-list" class="bingo-players-list rounded-l outline outline-black outline-2">
                <li v-for="thisname in names" :key="thisname">{{thisname.name}}</li> <!-- This is filled automatically with data from useFetch() below -->
            </ul>
        </div>

        <div class="bingo-controls-wrapper">
            <button @click="resetContents" class="bingo-controls-reset-contents text-gray-400 bg-gradient-to-br from-gray-500 via-gray-600 to-gray-700 px-2 rounded-xl hover:from-gray-600 hover:via-gray-700 hover:to-gray-800 mr-3">Delete Content</button>
            <button @click="toggleEditMode" class="bingo-controls-toggle-edit text-gray-400 bg-gradient-to-br from-gray-500 via-gray-600 to-gray-700 py-1 px-2 rounded-xl hover:from-gray-600 hover:via-gray-700 hover:to-gray-800 outline outline-white outline-2 mt-2 mb-2">Toggle Edit Mode</button>
            <button @click="resetStrikes" class="bingo-controls-reset-strikes text-gray-400 bg-gradient-to-br from-gray-500 via-gray-600 to-gray-700 px-2 rounded-xl hover:from-gray-600 hover:via-gray-700 hover:to-gray-800 ml-3">Delete Strikes</button>
        </div>
    </div>
</template>


<script setup lang="ts">
    import { PhX } from "@phosphor-icons/vue";
    import { useFetch } from '@vueuse/core'

    // Get our playfield cards and their content
    const selectedName = ref("");
    const showBingoHeaderError = ref(false);
    const cards: Ref<any[]> = ref([]);
    const names: Ref<any[]> = ref([]);
    const editModeActive = ref(false);

    let eventStream: EventSource;


    // Load stuff on page load
    onBeforeMount(async () => {
        // Display the selected name at the top
        selectedName.value = window.localStorage.selectedName;


        // Start an interval to periodically update lastActivity. We are using a last update var as intervals can get imprecise over time
        let lastLastActivityUpdate = 0;

        setInterval(() => {
            if (Date.now() - lastLastActivityUpdate < 300000) return; // Ignore iteration if last update is less than 5 min ago.

            useFetch("/api/set-lastactivity", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name: selectedName.value
                })
            });
        }, 150000); // 2.5 min


        // Get playfield data stored for this user
        const playfieldData = await useFetch("/api/get-playfield", { // TODO: Stupid that this is a POST
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: selectedName.value
            })
        });

        if (!playfieldData || playfieldData.data.value == "false") return showBingoHeaderError.value = true;

        const playfield = JSON.parse(playfieldData.data.value).playfield;

        // Generate a playfield
        for (let i = 1; i <= 9; i++) {
            cards.value.push(playfield.find(e => e.id == i));
        }


        // Get an event stream to update the names list on change
        eventStream = new EventSource("/api/get-names");

        eventStream.addEventListener("message", (msg) => {
            // Get a list of all names we currently know
            const res = JSON.parse(msg.data.split(" ").pop());

            // Get only names which have been active in the last 30 minutes
            names.value = res.filter((e: {name: string, lastActivity: number}) => {
                return (Date.now() - e.lastActivity < 1.8e+6);
            });
        })

        // Clean up when the page is unmounted
        onUnmounted(() => {
            eventStream.close();
        })
    });


    /**
     * Function which gets called when the user clicks a card
     * @param event DOM Button Click event
     */
    function cardClick(event: Event) {
        if (editModeActive.value) return; // Ignore click if the edit mode is active

        console.log("User clicked card with id " + event.target.id);

        // Update card ref with negated strike property
        const el = cards.value.find(e => e.id == event.target.id);
        
        el.strike = !el.strike;
    }


    /**
     * Function which gets called when the user submits card input
     * @param event DOM Button Click event
     */
    async function cardInputUpdate(event: Event) {
        console.log("User updated card " + event.target.id + " with content " + event.target.value)

        // Update card ref with the new content
        cards.value.find(e => e.id == event.target.id).content = event.target.value;

        // Send updated playfield to the database
        await useFetch("/api/set-playfield", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: window.localStorage.selectedName,
                playfield: cards.value
            })
        });
    }


    /**
     * Function which gets called when the user clicks the "Delete Contents" button
     * @param event DOM Button Click event
     */
    function resetContents(event: Event) {
        if (confirm("Are you sure? This action cannot be undone!")) {
            console.log("Resetting contents");

            cards.value.forEach((e) => {
                e.content = "";
            });
        }
    }


    /**
     * Function which gets called when the user clicks the "Toggle Edit Mode" button
     * @param event DOM Button Click event
     */
    function toggleEditMode(event: Event) {
        console.log("Toggling edit mode");
        editModeActive.value = !editModeActive.value;
    }


    /**
     * Function which gets called when the user clicks the "Delete Strikes" button
     * @param event DOM Button Click event
     */
    function resetStrikes(event: Event) {
        if (confirm("Are you sure? This action cannot be undone!")) {
            console.log("Resetting strikes");

            cards.value.forEach((e) => {
                e.strike = false;
            });
        }
    }
</script>


<style>
    .bingo-wrapper {
        display: grid;
        grid-auto-flow: row;
        grid-template-columns: 1fr 1fr 1fr;
        grid-template-rows: 1fr 1fr 1fr 1fr;
        gap: 0px 0px;
        grid-auto-flow: row;
        grid-template-areas:
            ". bingo-header-wrapper ."
            ". bingo-playfield-wrapper bingo-players-list-wrapper"
            ". bingo-controls-wrapper ."
            ". . .";
    }

    .bingo-header-wrapper {
        grid-area: bingo-header-wrapper;
    }

    .bingo-playfield-wrapper {
        grid-area: bingo-playfield-wrapper;
        display: grid;
        grid-template-columns: auto auto auto;
        gap: 10px;
        padding: 10px;
    }

    .bingo-playfield-card {
        background-color: rgb(255, 255, 255);
        border: 1px solid rgba(0, 0, 0, 0.8);
        padding: 20px;
        text-align: center;
    }

    .bingo-players-list-wrapper {
        grid-area: bingo-players-list-wrapper;
    }

    .bingo-controls-wrapper {
        grid-area: bingo-controls-wrapper;
    }
</style>