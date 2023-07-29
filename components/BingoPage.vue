<!--
/*
 * File: BingoPage.vue
 * Project: bingo
 * Created Date: 27.07.2023 13:06:42
 * Author: 3urobeat
 * 
 * Last Modified: 29.07.2023 12:40:56
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
        </div>

        <div class="bingo-playfield-wrapper">
            <div class="bingo-playfield-card" @click="cardClick" v-for="thiscard in cards" :id="thiscard.id">
                <img class="bingo-playfield-card-x" v-if="thiscard.strike" :src="xSrc" alt="X"/>
                <input type="text" v-if="editModeActive" @keyup.enter="cardInputUpdate" @keyup.esc="toggleEditMode" class="rounded-l" :id="thiscard.id" :value="thiscard.content"> <!-- Add keyup.esc to make desktop usage easier -->
                <a type="text" v-if="!editModeActive" class="rounded-l" :id="thiscard.id">{{ thiscard.content }}</a>
            </div>
        </div>

        <div class="bingo-controls-wrapper">
            <br />
            <button @click="resetContents" class="bingo-controls-reset-contents">Delete Content</button>
            <button @click="toggleEditMode" class="bingo-controls-toggle-edit">Toggle Edit Mode</button>
            <button @click="resetStrikes" class="bingo-controls-reset-strikes">Delete Strikes</button>
        </div>
    </div>
</template>


<script setup lang="ts">
    import xSrc from "../assets/X.png";
    import { useFetch } from '@vueuse/core'

    // Get our playfield cards and their content
    const selectedName = ref("");
    const cards: Ref<any[]> = ref([]);
    const editModeActive = ref(false);


    // Load stuff on page load
    onBeforeMount(() => {
        for (let i = 1; i <= 9; i++) {
            cards.value.push({id: i, content: "testcontent", strike: false})
        }

        selectedName.value = window.localStorage.selectedName;
    })


    /**
     * Function which gets called when the user clicks a card
     * @param event DOM Button Click event
     */
    function cardClick(event: Event) {
        console.log("User clicked card with id " + event.target.id);

        // Update card ref with negated strike property
        const el = cards.value.find(e => e.id == event.target.id);
        
        el.strike = !el.strike;
    }


    /**
     * Function which gets called when the user submits card input
     * @param event DOM Button Click event
     */
    function cardInputUpdate(event: Event) {
        console.log("User updated card " + event.target.id + " with content " + event.target.value)

        // Update card ref with the new content
        cards.value.find(e => e.id == event.target.id).content = event.target.value;

        // Send updated playfield to the database
    }


    /**
     * Function which gets called when the user clicks the "Delete Contents" button
     * @param event DOM Button Click event
     */
    function resetContents(event: Event) {
        if(confirm("Are you sure? This action cannot be undone!")) {
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
        if(confirm("Are you sure? This action cannot be undone!")) {
            console.log("Resetting strikes");

            cards.value.forEach((e) => {
                e.strike = false;
            })
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
            ". bingo-header ."
            ". bingo-playfield-wrapper ."
            ". bingo-controls-wrapper ."
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

    .bingo-controls-wrapper {
        grid-area: bingo-controls-wrapper;
    }
</style>