<!--
/*
 * File: Navbar.vue
 * Project: bingo
 * Created Date: 27.07.2023 13:25:00
 * Author: 3urobeat
 * 
 * Last Modified: 27.07.2023 16:47:19
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
    <div class="nav-wrapper">

        <!-- Centered Image -->
        <div class="img-wrapper">
            <img :src="logosrc" alt="Logo"/>
        </div>

        <!-- Language Dropdown -->
        <select class="lang-dropdown"> <!-- TODO: Read dynamically from lang folder -->
            <option value="lang-english">🇬🇧 English</option>
            <option value="lang-german">🇩🇪 Deutsch</option>
        </select>

    </div>
</template>


<script setup lang="js">
    import logosrc from "../assets/logo.svg";
</script>


<style scoped>
    .nav-wrapper { 
        height: 7lvh;
        width:  100%;
        background-color: rgb(155, 155, 155); /* rgb(25, 128, 0); */

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
        background-color: rgb(155, 155, 155); /* rgb(25, 128, 0); */

        display:         flex;
        justify-content: center;
    }

    .lang-dropdown { /* TODO: Fix dropdown un-centering logo */
        padding-right: 10px;
        margin-right: 5px;
    }
</style>