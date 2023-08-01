
<!-- 
/*
 * File: App.vue
 * Project: bingo
 * Created Date: 27.07.2023 12:48:01
 * Author: 3urobeat
 * 
 * Last Modified: 01.08.2023 19:55:22
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
    <div class="flex flex-col h-screen w-screen bg-gradient-to-br from-gray-400 via-gray-500 to-gray-600">
        <hr class="absolute h-0.5 mt-16 w-full bg-black border-0">
        <div class="absolute self-center top-1 w-21">
            <img :src="logosrc" alt="Logo"/>
        </div>

        <select class="absolute right-5 top-5 px-2 py-1 rounded-xl bg-gray-600 hover:bg-gray-700">
            <option value="lang-english" class="bg-gray-600 hover:bg-gray-700">🇬🇧 English</option>
            <option value="lang-german" class="bg-gray-600 hover:bg-gray-700">🇩🇪 Deutsch</option>
        </select>

        <div class="absolute bottom-2 self-center flex flex-col items-center text-sm text-black">
            Bingo v{{ packagejson.version }}

            <button type="button" @click="clickGithub" class="mt-1 rounded-full px-2 text-gray-400 bg-[#24292F] hover:bg-[#24292F]/90 focus:ring-4 focus:outline-none focus:ring-[#24292F]/50 text-center flex items-center dark:focus:ring-gray-500 dark:hover:bg-[#050708]/30">
                <svg class="mr-1" width="1em" height="1em" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 .333A9.911 9.911 0 0 0 6.866 19.65c.5.092.678-.215.678-.477 0-.237-.01-1.017-.014-1.845-2.757.6-3.338-1.169-3.338-1.169a2.627 2.627 0 0 0-1.1-1.451c-.9-.615.07-.6.07-.6a2.084 2.084 0 0 1 1.518 1.021 2.11 2.11 0 0 0 2.884.823c.044-.503.268-.973.63-1.325-2.2-.25-4.516-1.1-4.516-4.9A3.832 3.832 0 0 1 4.7 7.068a3.56 3.56 0 0 1 .095-2.623s.832-.266 2.726 1.016a9.409 9.409 0 0 1 4.962 0c1.89-1.282 2.717-1.016 2.717-1.016.366.83.402 1.768.1 2.623a3.827 3.827 0 0 1 1.02 2.659c0 3.807-2.319 4.644-4.525 4.889a2.366 2.366 0 0 1 .673 1.834c0 1.326-.012 2.394-.012 2.72 0 .263.18.572.681.475A9.911 9.911 0 0 0 10 .333Z" clip-rule="evenodd"/>
                </svg>
                <span class="text-gray-400 rounded-lg text-xm" href="https://github.com/3urobeat/bingo" target="_blank">Source Code</span>
            </button>

            <p>This application is licensed under the <a class="underline hover:text-gray-500 rounded-lg" href="https://www.gnu.org/licenses/" target="_blank">GPLv3 license</a></p>
            <p>Copyright (c) 2023 <a class="underline hover:text-gray-500 rounded-lg" href="https://github.com/3urobeat" target="_blank">3urobeat</a></p>
        </div>

        <NuxtPage></NuxtPage>
    </div>
</template>


<script setup lang="ts">
    import logosrc from "./assets/logo.png";
    import packagejson from "./package.json";

    const router = useRouter();


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

    
    /**
     * Executed when user clicks the footer's GitHub icon
     */
    function clickGithub(event: Event) {
        window.open('http://github.com/3urobeat/bingo', '_blank');
    }
</script>