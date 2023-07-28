
<!-- 
/*
 * File: App.vue
 * Project: bingo
 * Created Date: 27.07.2023 12:48:01
 * Author: 3urobeat
 * 
 * Last Modified: 27.07.2023 19:25:22
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
    <div class="wrapper container mx-auto flex flex-col">
        <Navbar class="min-h-[5vh]"></Navbar>

        <GreetingsPage class="h-full"></GreetingsPage>

        <BingoPage class="h-full"></BingoPage>
    </div>
</template>

<script setup lang="js">
    import GreetingsPage from "./components/GreetingsPage.vue";
    import Navbar from "./components/Navbar.vue";
    import BingoPage from "./components/BingoPage.vue";
</script>

<style scoped>
    .wrapper {
        height: 100vh;
        width: 100vw;
        overflow: hidden;
        background-color: white; /* rgb(25, 128, 0); */
    }
</style>