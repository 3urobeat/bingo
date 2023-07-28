<!--
/*
 * File: Navbar.vue
 * Project: bingo
 * Created Date: 27.07.2023 13:25:00
 * Author: 3urobeat
 * 
 * Last Modified: 27.07.2023 17:30:26
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
    <div class="nav-wrapper relative">

        <!-- Centered Image -->
        <div class="img-wrapper">
            <img :src="logosrc" alt="Logo"/>
        </div>

        <!-- Language Dropdown -->
        <div class="flex absolute inset-0 justify-end p-1.5">
            <select class="rounded-l px-1 mr-1 hover:bg-green-800 hover:text-green-600 hover:rounded-2xl transform"> <!-- TODO: Read dynamically from lang folder -->
                <option value="lang-english">🇬🇧 English</option>
                <option value="lang-german">🇩🇪 Deutsch</option>
            </select>
        </div>

    </div>
</template>


<script setup lang="js">
    import logosrc from "../assets/logo.svg";
</script>


<style scoped>
    .nav-wrapper { 
        height: 7lvh;
        width:  100%;
        @apply bg-background;

        border-style: solid;
        border-width: 3px;
        border-color: black;

        display:         flex;
        justify-content: center;
        align-items:     center;
    }
    
    .img-wrapper {
        width:  100%;
        height: 60%;
        @apply bg-background;

        display:         flex;
        justify-content: center;
    }
</style>