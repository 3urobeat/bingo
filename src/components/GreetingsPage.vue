<!--
/*
 * File: Greetings.vue
 * Project: bingo
 * Created Date: 27.07.2023 13:03:50
 * Author: 3urobeat
 * 
 * Last Modified: 27.07.2023 17:31:00
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
    }
</style>