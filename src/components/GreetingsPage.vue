<!--
/*
 * File: Greetings.vue
 * Project: bingo
 * Created Date: 27.07.2023 13:03:50
 * Author: 3urobeat
 * 
 * Last Modified: 27.07.2023 18:29:45
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
            <input type="text" class="rounded-l">
            <button class="greetings-new-name-play rounded-xl px-3" id="greetings-new-name-play">Play!</button>
        </div>

        <div class="greetings-existing-name">
            <a>...oder wähle einen aus:</a>
            <ul class="greetings-existing-names-list rounded-l">
                <a class="name1" href="">test</a>
            </ul>
        </div>
    </div>
</template>

<script>
    export default {
        
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
            ". . ."
            ". name-input ."
            ". existing-names ."
            ". . .";
    }

    .greetings-new-name { grid-area: name-input; }

    .greetings-new-name-play {
        background-color: lime;
        margin-top: 10px;
    }
    
    .greetings-existing-name { grid-area: existing-names; }

    .greetings-existing-names-list {
        border-style: solid;
        border-width: 3px;
        border-color: black;
    }

    a.name1:before {
        width: 21px;
        /* height: 21px; */
        display: inline-block;
        content: " ";
    }

</style>