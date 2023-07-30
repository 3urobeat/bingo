<!--
/*
 * File: [room].vue
 * Project: bingo
 * Created Date: 27.07.2023 13:06:42
 * Author: 3urobeat
 * 
 * Last Modified: 30.07.2023 17:40:12
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
    <div class="absolute bingo-wrapper items-center w-screen gap-x-0 gap-y-10 md:gap-x-0 md:gap-y-16 mt-16"> <!-- mt-16 is a stupid fix to prevent it clipping into the navbar -->
        <div class="bingo-header-wrapper flex flex-col items-center">
            <ClientOnly><span class="text-2xl font-semibold">{{ selectedName }}</span></ClientOnly>
            <span class="bingo-header-error text-red-500 mt-5" v-if="showBingoHeaderError">Failed to load playfield!</span>
        </div>

        <div class="bingo-playfield-wrapper grid gap-2 p-2">
            <div class="bingo-playfield-card relative w-20 md:w-40 h-20 md:h-40 aspect-square flex items-center justify-center bg-white p-5 text-center border-[1px] border-solid border-black" @click.capture="cardClick(thiscard.id)" v-for="thiscard in cards" :id="thiscard.id">
                <div class="absolute inset-0 flex items-center justify-center" v-if="thiscard.strike && !editModeActive">
                    <PhX size="" fill="red"></PhX>
                </div>
                <input type="text" class="rounded-lg w-full bg-gray-200" v-if="editModeActive" @focusout="cardInputUpdate(thiscard)" v-model="thiscard.content"> <!-- Add keyup.esc to make desktop usage easier -->
                <span class="rounded-lg select-none" v-if="!editModeActive">{{ thiscard.content }}</span>
            </div>
        </div>

        <div class="bingo-players-list-wrapper ml-2">
            <span class="font-semibold">Active Players:</span>
            <ul id="bingo-players-list" class="bingo-players-list rounded-lg mt-1 max-w-xs outline outline-black outline-2">
                <li class="ml-4 clearfix" v-for="thisname in names" :key="thisname">
                    {{thisname.name}} <span class="relative float-right mr-4">{{ thisname.strikesCount }}/{{ thisname.cardsCount }}</span>
                </li>
            </ul>
        </div>

        <div class="bingo-controls-wrapper flex flex-col md:flex-row justify-center items-center gap-3">
            <button @click="resetContents" class="bingo-controls-reset-contents text-gray-400 bg-gradient-to-br from-gray-500 via-gray-600 to-gray-700 px-2 rounded-xl hover:from-gray-600 hover:via-gray-700 hover:to-gray-800">Delete Content</button>
            <button @click="toggleEditMode" class="bingo-controls-toggle-edit text-gray-400 bg-gradient-to-br from-gray-500 via-gray-600 to-gray-700 py-1 px-2 rounded-xl hover:from-gray-600 hover:via-gray-700 hover:to-gray-800 outline outline-white outline-2">Toggle Edit Mode</button>
            <button @click="resetStrikes" class="bingo-controls-reset-strikes text-gray-400 bg-gradient-to-br from-gray-500 via-gray-600 to-gray-700 px-2 rounded-xl hover:from-gray-600 hover:via-gray-700 hover:to-gray-800">Delete Strikes</button>
        </div>
    </div>
</template>


<script setup lang="ts">
    import { PhX } from "@phosphor-icons/vue";
    import { useFetch } from '@vueuse/core'

    const router   = useRouter();
    const roomName = useRoute().params.room;


    // Get our playfield cards and their content
    const selectedName = ref(roomName);
    const showBingoHeaderError = ref(false);
    const cards: Ref<any[]> = ref([]);
    const names: Ref<any[]> = ref([]);
    const editModeActive = ref(false);

    let eventStream: EventSource;
    let updateLastActivityInterval: NodeJS.Timer;


    // Load stuff on page load
    onBeforeMount(async () => {
        // Redirect user to their room if they try to visit another user's room
        if (roomName != window.localStorage.selectedName) {
            router.push({ path: "/game/" + window.localStorage.selectedName });
            return;
        }


        // Start an interval to periodically update lastActivity. We are using a last update var as intervals can get imprecise over time
        let lastLastActivityUpdate = 0;

        updateLastActivityInterval = setInterval(() => {
            if (Date.now() - lastLastActivityUpdate < 300000) return; // Ignore iteration if last update is less than 5 min ago.

            useFetch("/api/set-lastactivity", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name: selectedName.value
                })
            });

            lastLastActivityUpdate = Date.now();
        }, 150000); // 2.5 min


        // Get playfield data stored for this user
        const playfieldData = await useFetch("/api/get-playfield", { // TODO: Stupid that this is a POST
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: selectedName.value
            })
        });

        if (!playfieldData || playfieldData.data.value == "false") return showBingoHeaderError.value = true;

        const playfield: [{ id: number, content: string, strike: boolean }] = JSON.parse(playfieldData.data.value as string).playfield;

        // Either generate a new playfield or load an existing one
        if (Object.keys(playfield).length == 0) {
            console.log("Generating new playfield for this user");

            for (let i = 1; i <= 9; i++) {
                cards.value.push({ id: i, content: "", strike: false });
            }

        } else {

            console.log("Loading an existing playfield for this user");

            for (let i = 1; i <= Object.keys(playfield).length; i++) {
                cards.value.push(playfield.find((e: { id: number }) => e.id == i));
            }
        }


        // Get an event stream to update the names list on change
        eventStream = useEventStream("get-names");

        eventStream.addEventListener("message", (msg) => {
            // Get a list of all names we currently know
            const res = JSON.parse(msg.data.split(" ").pop());

            // Get only names which have been active in the last 30 minutes
            names.value = res.filter((e: {name: string, lastActivity: number}) => {
                return (Date.now() - e.lastActivity < 1.8e+6);
            });
        })
    });


    // Clean up when the page is unmounted
    onUnmounted(() => {
        clearInterval(updateLastActivityInterval);
    });


    /**
     * Function which gets called when the user clicks a card
     */
    function cardClick(id: number) {
        if (editModeActive.value) return; // Ignore click if the edit mode is active

        console.log("User clicked card with id " + id);

        // Update card ref with negated strike property
        const el = cards.value.find(e => e.id == id);
        
        el.strike = !el.strike;

        // Send updated playfield to the database
        useFetch("/api/set-playfield", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: selectedName.value,
                playfield: cards.value
            })
        });
    }


    /**
     * Function which gets called when the user submits card input
     */
    async function cardInputUpdate(thiscard: { id: number, content: string }) {
        console.log("User updated card " + thiscard.id + " with content " + thiscard.content)

        // Send updated playfield to the database
        useFetch("/api/set-playfield", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: selectedName.value,
                playfield: cards.value
            })
        });
    }


    /**
     * Function which gets called when the user clicks the "Delete Contents" button
     * @param event DOM Button Click event
     */
    function resetContents(event: Event) {
        if (confirm("Are you sure? This action cannot be undone!")) {
            console.log("Resetting contents");

            // Clear every card
            cards.value.forEach((e) => {
                e.content = "";
            });

            // Send updated playfield to the database
            useFetch("/api/set-playfield", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name: selectedName.value,
                    playfield: cards.value
                })
            });
        }
    }


    /**
     * Function which gets called when the user clicks the "Toggle Edit Mode" button
     */
    function toggleEditMode(thiscard: any) {
        console.log("Toggling edit mode");
        editModeActive.value = !editModeActive.value;
    }


    /**
     * Function which gets called when the user clicks the "Delete Strikes" button
     * @param event DOM Button Click event
     */
    function resetStrikes(event: Event) {
        if (confirm("Are you sure? This action cannot be undone!")) {
            console.log("Resetting strikes");

            // Set every card's strike property to false
            cards.value.forEach((e) => {
                e.strike = false;
            });

            // Send updated playfield to the database
            useFetch("/api/set-playfield", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name: selectedName.value,
                    playfield: cards.value
                })
            });
        }
    }
</script>


<style>
    .bingo-wrapper {
        display: grid;
        grid-auto-flow: row;
        grid-template-columns: 1fr 1fr 1fr;
        grid-auto-flow: row;
        grid-template-areas:
            ". . ."
            ". bingo-header-wrapper ."
            ". bingo-playfield-wrapper bingo-players-list-wrapper"
            ". bingo-controls-wrapper ."
            ". . .";
    }

    .bingo-header-wrapper {
        grid-area: bingo-header-wrapper;
    }

    .bingo-playfield-wrapper {
        grid-area: bingo-playfield-wrapper;
        grid-template-columns: auto auto auto;
    }

    .bingo-players-list-wrapper {
        grid-area: bingo-players-list-wrapper;
    }

    .bingo-controls-wrapper {
        grid-area: bingo-controls-wrapper;
    }
</style>