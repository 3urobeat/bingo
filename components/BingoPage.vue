<!--
/*
 * File: BingoPage.vue
 * Project: bingo
 * Created Date: 27.07.2023 13:06:42
 * Author: 3urobeat
 * 
 * Last Modified: 28.07.2023 15:35:45
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
    <div class="bingo-wrapper">
        <div class="bingo-header-wrapper">
            <a>Name</a>
            <br />
        </div>

        <div class="bingo-playfield-wrapper">
            <div class="bingo-playfield-card" @click="cardClick" v-for="thiscard in cards" :id="thiscard.id">
                <input type="text" @keyup.enter="cardInputUpdate" class="rounded-l" :id="thiscard.id" :value="thiscard.content">
            </div>
        </div>
    </div>
</template>


<script setup lang="ts">
    import { useFetch } from '@vueuse/core'

    // Get our playfield cards and their content
    const cards: Ref<any[]> = ref([]);

    for (let i = 1; i <= 9; i++) {
        cards.value.push({id: i, content: "testcontent"})
    }

    
    /**
     * Function which gets called when the user clicks a card
     * @param event DOM Button Click event
     */
    function cardClick(event: Event) {
        // Update the database
        console.log("User clicked card with id " + event.target.id)
    }


    /**
     * Function which gets called when the user submits card input
     * @param event DOM Button Click event
     */
    function cardInputUpdate(event: Event) {
        // Get content of the card and update the database
        console.log("User updated card " + event.target.id + " with content " + event.target.value)
    }

</script>


<style>
    .bingo-wrapper {
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
            ". bingo-header ."
            ". bingo-playfield-wrapper ."
            ". . ."
            ". . .";
    }

    .bingo-header-wrapper { grid-area: bingo-header; }

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

</style>