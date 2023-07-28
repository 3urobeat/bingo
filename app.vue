
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
    <div class="flex flex-col h-screen w-screen bg-gray-400">
        <hr class="h-0.5 my-16 bg-black border-0">
        <div class="absolute self-center top-2 w-16">
          <img :src="logosrc" alt="Logo"/>
        </div>
        <select class="absolute right-5 top-5 rounded-md">
          <option value="lang-english">🇬🇧 English</option>
          <option value="lang-german">🇩🇪 Deutsch</option>
        </select>
        <div class="absolute bottom-0 self-center">
          <p class="absolute bottom-0 self-center bg-gray-400">V.0.00,001</p>
          <button type="button" @click="clickGithub" class="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-[#24292F] hover:bg-[#24292F]/90 focus:ring-4 focus:outline-none focus:ring-[#24292F]/50 text-center inline-flex items-center dark:focus:ring-gray-500 dark:hover:bg-[#050708]/30 mr-2 mb-2">
            <svg class="w-6 h-6" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 .333A9.911 9.911 0 0 0 6.866 19.65c.5.092.678-.215.678-.477 0-.237-.01-1.017-.014-1.845-2.757.6-3.338-1.169-3.338-1.169a2.627 2.627 0 0 0-1.1-1.451c-.9-.615.07-.6.07-.6a2.084 2.084 0 0 1 1.518 1.021 2.11 2.11 0 0 0 2.884.823c.044-.503.268-.973.63-1.325-2.2-.25-4.516-1.1-4.516-4.9A3.832 3.832 0 0 1 4.7 7.068a3.56 3.56 0 0 1 .095-2.623s.832-.266 2.726 1.016a9.409 9.409 0 0 1 4.962 0c1.89-1.282 2.717-1.016 2.717-1.016.366.83.402 1.768.1 2.623a3.827 3.827 0 0 1 1.02 2.659c0 3.807-2.319 4.644-4.525 4.889a2.366 2.366 0 0 1 .673 1.834c0 1.326-.012 2.394-.012 2.72 0 .263.18.572.681.475A9.911 9.911 0 0 0 10 .333Z" clip-rule="evenodd"/>
            </svg>
          </button>
        </div>
      <GreetingsPage></GreetingsPage>
    </div>
</template>

<script setup lang="js">
    import GreetingsPage from "./components/GreetingsPage.vue";
    import Navbar from "./components/Navbar.vue";

    import logosrc from "./assets/logo.svg";
    function clickGithub(event) {
      window.open('http://github.com/3urobeat/bingo', '_blank');
    }
</script>