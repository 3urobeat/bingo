<!--
/*
 * File: Greetings.vue
 * Project: bingo
 * Created Date: 27.07.2023 13:03:50
 * Author: 3urobeat
 * 
 * Last Modified: 28.07.2023 14:30:04
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
    <div class="greetings-wrapper">
        <div class="greetings-new-name">
            <a>Dein Name:</a>
            <br />
            <input type="text" @keyup.enter="play" v-model="nameinput" class="rounded-l">
            <br />
            <button @click="play" class="greetings-new-name-play rounded-xl px-3">Play!</button>
            <br />
            <div class="greetings-new-name-error" v-if="showError">Error!</div>
        </div>

        <div class="greetings-existing-name">
            <a>...oder wähle einen aus:</a>
            <br />
            <ul id="greetings-existing-names-list" class="greetings-existing-names-list rounded-l">
                <li v-for="thisname in names" :key="thisname">{{thisname.name}}</li> <!-- This is filled automatically with data from useFetch() below -->
            </ul>
        </div>
    </div>
</template>


<script setup lang="ts">
    import { useFetch } from '@vueuse/core'

    // Get our nameinput input
    const nameinput = ref("");
    const names: Ref<any[]> = ref([]);
    const showError = ref(false);

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

        // Check if the name was accepted and display error div if not
        showError.value = res.data.value == "false";
    }
</script>


<style>
    .greetings-wrapper {
        width: 100%;
        @apply bg-background;

        border-style: solid;
        border-width: 3px;
        border-top:   0; /* Navbar already renders a bottom border */
        border-color: black;

        display:         flex;
        justify-content: center;
        align-items:     center;

        display: grid;
        grid-auto-flow: row;
        grid-template-columns: 1fr 1fr 1fr;
        grid-template-rows: 1fr 1fr 1fr 1fr;
        gap: 0px 0px;
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