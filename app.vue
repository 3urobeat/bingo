
<!--
/*
 * File: App.vue
 * Project: bingo
 * Created Date: 2023-07-27 12:48:01
 * Author: 3urobeat
 *
 * Last Modified: 2024-03-31 14:35:57
 * Modified By: 3urobeat
 *
 * Copyright (c) 2023 - 2024 3urobeat <https://github.com/3urobeat>
 *
 * This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
 * You should have received a copy of the GNU General Public License along with this program. If not, see <https://www.gnu.org/licenses/>.
 */
-->


<template>
    <div class="flex flex-col items-center justify-between h-screen w-screen overflow-auto bg-gradient-to-br from-gray-300 via-gray-400 to-gray-500">
        <nav class="flex justify-center pb-10">
            <div class="absolute pt-2 w-28">
                <img :src="logosrc" alt="Logo"/>
            </div>
            <hr class="absolute h-0.5 mt-16 w-full bg-black border-0">

            <select class="absolute scale-90 md:scale-100 right-2 md:right-4 top-4 px-2 py-1 rounded-xl text-gray-300 bg-gray-500 hover:bg-gray-600">
                <option value="lang-english">🇬🇧 English</option>
                <!-- <option value="lang-german">🇩🇪 Deutsch</option> -->
            </select>
        </nav>

        <NuxtPage></NuxtPage>

        <footer class="self-center flex flex-col items-center mb-2 mt-2 text-xs md:text-sm opacity-50 text-nowrap">
            Bingo v{{ packagejson.version }}

            <a class="flex w-fit items-center mt-0.5 -ml-1 rounded-full px-2 text-white bg-gray-700 hover:bg-gray-500 hover:transition-all bg-opacity-80" href="http://github.com/3urobeat/bingo" target="_blank">

                <!-- GitHub logo -->
                <svg class="mr-1" width="1em" height="1em" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 .333A9.911 9.911 0 0 0 6.866 19.65c.5.092.678-.215.678-.477 0-.237-.01-1.017-.014-1.845-2.757.6-3.338-1.169-3.338-1.169a2.627 2.627 0 0 0-1.1-1.451c-.9-.615.07-.6.07-.6a2.084 2.084 0 0 1 1.518 1.021 2.11 2.11 0 0 0 2.884.823c.044-.503.268-.973.63-1.325-2.2-.25-4.516-1.1-4.516-4.9A3.832 3.832 0 0 1 4.7 7.068a3.56 3.56 0 0 1 .095-2.623s.832-.266 2.726 1.016a9.409 9.409 0 0 1 4.962 0c1.89-1.282 2.717-1.016 2.717-1.016.366.83.402 1.768.1 2.623a3.827 3.827 0 0 1 1.02 2.659c0 3.807-2.319 4.644-4.525 4.889a2.366 2.366 0 0 1 .673 1.834c0 1.326-.012 2.394-.012 2.72 0 .263.18.572.681.475A9.911 9.911 0 0 0 10 .333Z" clip-rule="evenodd"/>
                </svg>

                <span class="text-gray-400 rounded-lg text-xm" href="https://github.com/3urobeat/bingo" target="_blank">Source Code</span>

            </a>

            <p>Licensed under <a class="underline hover:text-gray-600 rounded-lg" href="https://www.gnu.org/licenses/gpl-3.0.html" target="_blank">GPLv3</a></p>
            <p>Copyright (c) 2023-2024 <a class="underline hover:text-gray-600 rounded-lg" href="https://github.com/3urobeat" target="_blank">3urobeat</a></p>
        </footer>
    </div>
</template>


<script setup lang="ts">
    import logosrc from "./assets/logo.png";
    import packagejson from "./package.json";

    const router = useRouter();


    // Specify page information
    useSeoMeta({
        title: "Play Bingo!",
        ogTitle: "Play Bingo!",
        description: "Play Meme Bingo with your friends from any browser! A webgame made using Nuxt & Vue.js.",
        ogDescription: "Play Meme Bingo with your friends from any browser! A webgame made using Nuxt & Vue.js.",
        ogImage: "public/favicon.ico",
        themeColor: "#43B581",
    })


    /**
     * Executed on page load
     */
    onBeforeMount(() => {
        // Check if user has a active "login" and instantly hide greetings page
        const selectedName = localStorage.getItem("selectedName");
        const lastActivity = localStorage.getItem("lastActivity") || 0;

        if (selectedName && Date.now() - Number(lastActivity) < 1.8e+6) {
            console.log("User has an active login, instantly showing bingo page...");

            router.push({ path: "/game/" + selectedName });
        }
    });
</script>
