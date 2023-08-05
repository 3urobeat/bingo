<!--
/*
 * File: [room].vue
 * Project: bingo
 * Created Date: 27.07.2023 13:06:42
 * Author: 3urobeat
 * 
 * Last Modified: 05.08.2023 12:42:34
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
    <button>
        <PhSignOut class="absolute left-5 top-5" size="23px" @click="clickSignOutButton"></PhSignOut>
    </button>

    <div class="bingo-wrapper flex flex-col justify-evenly items-center h-full">
        <div class="bingo-header-wrapper flex flex-col gap-2 items-center">
            <ClientOnly><span class="text-2xl font-semibold">{{ selectedName }}</span></ClientOnly>
            
            <select class="px-2 py-1 rounded-xl bg-gray-600 hover:bg-gray-700" @change="selectPlayfieldSize" v-model="selectedSize">
                <option v-for="thissize in playfieldSizes" :value="thissize.amount" :selected="thissize.amount == selectedSize" class="bg-gray-600 hover:bg-gray-700">{{ thissize.str }}</option>
            </select>

            <span class="bingo-header-error text-red-500 mt-5" v-if="showBingoHeaderError">Failed to load playfield!</span>
        </div>
        
        <div class="bingo-win-popup-wrapper absolute flex items-center justify-center inset-0 bg-gray-800 bg-opacity-60 z-50" v-if="bingoWinnerPopup != ''">
            <transition name="bingo-win-popup-modal">
                <div class="bingo-win-popup-content flex flex-col items-center justify-center gap-10 border-2 border-black rounded-lg w-64 h-72 bg-gray-400 shadow-2xl shadow-black">
                    <div class="bingo-win-popup-title flex font-bold text-xl">
                        Bingo! <PhConfetti class="ml-1" size="30px"></PhConfetti>
                    </div>
                    
                    <div class="bingo-win-popup-text">
                        Player <span class="font-bold">{{ bingoWinnerPopup }}</span> won!
                    </div>
                    
                    <div class="bingo-win-popup-buttons flex flex-col items-center gap-2">
                        <button class="bingo-win-popup-buttons-continue flex border-black border-2 rounded-lg py-1 px-2 bg-gray-500 hover:bg-gray-400" @click="bingoWinnerPopup = ''">
                            <PhX class="self-center mr-1"></PhX> Continue
                        </button>
                        <button class="bingo-win-popup-buttons-vote border-black border-2 rounded-lg py-1 px-2 bg-playbtn hover:bg-green-500" @click="voteForRestart">
                            <span class="font-bold mr-1">({{ names.filter((e) => e.hasVotedForRestart).length }})</span> Vote Restart
                        </button>
                    </div>
                </div>
            </transition>
        </div>

        <div class="flex flex-col gap-4 md:flex-row items-center">
            <div class="bingo-playfield-wrapper grid gap-1 md:gap-2">
                <div class="bingo-playfield-card relative w-20 md:w-40 h-20 md:h-40 aspect-square bg-white text-center border-[1px] border-solid border-black rounded-lg shadow-2xl" @click.capture="cardClick(thiscard.id)" v-for="thiscard in cards" :id="thiscard.id.toString()">
                    <div class="absolute inset-0 flex items-center justify-center" v-if="thiscard.strike && !editModeActive">
                        <PhX class="h-full w-full" fill="red"></PhX>
                    </div>
                    <input type="text" class="rounded-lg w-full bg-gray-200" v-if="editModeActive" @focusout="cardInputUpdate()" v-model="thiscard.content">
                    <span class="rounded-lg select-none" v-if="!editModeActive">{{ thiscard.content }}</span>
                </div>
            </div>

            <div class="bingo-players-list-wrapper">
                <span class="font-semibold">Active Players:</span>
                <ul id="bingo-players-list" class="bingo-players-list rounded-lg mt-1 max-w-xs outline outline-black outline-2">
                    <div class="ml-4 mr-4 pt-1 pb-1">
                        <li class="clearfix" v-for="thisname in names" :key="thisname">
                            {{thisname.name}} 
                            <span class="relative float-right pl-4">
                                <PhTrophy size="20px" v-if="names.filter((e) => e.name == thisname.name && e.hasWon).length > 0" class="float-left mr-4 mt-[1px] text-yellow-500"></PhTrophy>
                                {{ thisname.strikesCount }}/{{ thisname.cardsCount }}
                            </span>
                        </li>
                    </div>

                    <div class="flex flex-col items-center px-2" v-if="names.some((e) => e.hasWon)">
                        <button class="bingo-players-list-buttons-vote border-black border-2 rounded-lg w-full py-1 mt-6 mb-2 bg-playbtn hover:bg-green-500" @click="voteForRestart">
                            <span class="font-bold mr-1">({{ names.filter((e) => e.hasVotedForRestart).length }})</span> Vote Restart
                            <PhCheck class="float-right -ml-10 mr-4 mt-[1px]" size="20px" v-if="names.find((e) => e.name == selectedName).hasVotedForRestart"></PhCheck>
                        </button>
                    </div>
                </ul>
            </div>
        </div>

        <div class="bingo-controls-wrapper flex flex-col md:flex-row justify-center items-center gap-3">
            <button @click="resetContents" class="bingo-controls-reset-contents text-gray-400 bg-gradient-to-br from-gray-500 via-gray-600 to-gray-700 px-2 rounded-xl hover:from-gray-600 hover:via-gray-700 hover:to-gray-800">Delete Content</button>
            <button @click="toggleEditMode" class="bingo-controls-toggle-edit text-gray-400 bg-gradient-to-br from-gray-500 via-gray-600 to-gray-700 py-1 px-2 rounded-xl hover:from-gray-600 hover:via-gray-700 hover:to-gray-800 outline outline-white outline-2">Toggle Edit Mode</button>
            <button @click="resetStrikes()" class="bingo-controls-reset-strikes text-gray-400 bg-gradient-to-br from-gray-500 via-gray-600 to-gray-700 px-2 rounded-xl hover:from-gray-600 hover:via-gray-700 hover:to-gray-800">Delete Strikes</button>
        </div>
    </div>
</template>


<script setup lang="ts">
    import { PhSignOut, PhCheck, PhConfetti, PhTrophy, PhX } from "@phosphor-icons/vue";
    import { useFetch } from '@vueuse/core'

    const router   = useRouter();
    const roomName = useRoute().params.room;

    // Get various refs
    const selectedName = ref(roomName);
    const playfieldSizes: Ref<{ amount: number, str: string }[]> = ref([{ amount: 9, str: "3x3" }, { amount: 16, str: "4x4" }, { amount: 25, str: "5x5" }, { amount: 36, str: "6x6" }]);
    const selectedSize: Ref<number> = ref(playfieldSizes.value[2].amount); // Use the 5x5 as default
    const showBingoHeaderError = ref(false);
    const bingoWinnerPopup: Ref<string> = ref(""); // String will contain the winner's name
    const cards: Ref<{ id: number, content: string, strike: boolean }[]> = ref([]);
    const names: Ref<any[]> = ref([]);
    const editModeActive = ref(false);

    const selectedSizeSqrt = computed(() => Math.sqrt(selectedSize.value)); // For CSS playfield-wrapper

    let eventStream: EventSource;
    let updateLastActivityInterval: NodeJS.Timer;


    // Load stuff on page load
    onBeforeMount(async () => {
        // Redirect user to their room if they try to visit another user's room
        if (roomName != window.localStorage.selectedName) {
            router.push({ path: "/game/" + window.localStorage.selectedName });
            return;
        }

        // Redirect user to index page if they have no name selected or lastActivity is > 30 min ago
        if (!window.localStorage.selectedName || Date.now() - window.localStorage.lastActivity > 1.8e+6) {
            router.push({ path: "/" });
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

            window.localStorage.lastActivity = Date.now();
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

            for (let i = 1; i <= selectedSize.value; i++) {
                cards.value.push({ id: i, content: "", strike: false });
            }

        } else {

            console.log("Loading an existing playfield for this user");

            for (let i = 1; i <= Object.keys(playfield).length; i++) {
                cards.value.push(playfield.find((e) => e.id == i)!);
            }
        }

        // Select the correct size in the dropdown
        selectedSize.value = cards.value.length;


        // Get an event stream to update the names list on change
        eventStream = useEventStream("get-names")!;

        eventStream.addEventListener("message", (msg) => {
            // Get a list of all names we currently know
            const res: any[] = JSON.parse(msg.data.split(" ").pop());

            // Get only names which have been active in the last 30 minutes
            const filtered = res.filter((e: { name: string, lastActivity: number }) => {
                return (Date.now() - e.lastActivity < 1.8e+6);
            });

            // Set win popup to name of newest winner. It is very unlikely that two players finish at the same time
            filtered.forEach((e) => {
                if (e.isNewWin) bingoWinnerPopup.value = e.name;
            });

            // Check if all active names have voted for a reset and reset strikes
            if (filtered.every((e) => e.hasVotedForRestart)) resetStrikes(true);

            // Update ref
            names.value = filtered;
        })
    });


    // Clean up when the page is unmounted
    onUnmounted(() => {
        clearInterval(updateLastActivityInterval);
    });


    /**
     * Function which gets called when the user selects a (different) playfield size
     */
    function selectPlayfieldSize(event: Event) { // size: { amount: number, str: string }

        // Display warning if the playfield size shrinks
        if (selectedSize.value < cards.value.length) {
            if (confirm("Shrinking your playfield will loose data! Are you sure?")) {
                cards.value.splice(selectedSize.value, cards.value.length - selectedSize.value); // Remove cards from the end to reach new size
            }
        } else {
            for (let i = cards.value.length + 1; i <= selectedSize.value; i++) {
                cards.value.push({ id: i, content: "", strike: false }); // Push new cards to the end to reach new size
            }
        }

        selectedSize.value = selectedSize.value;

        cardInputUpdate();

    }


    /**
     * Function which gets called when the user clicks a card
     */
    function cardClick(id: number) {
        if (editModeActive.value) return; // Ignore click if the edit mode is active

        console.log("User clicked card with id " + id);

        // Update card ref with negated strike property
        const el = cards.value.find(e => e.id == id) as any;
        
        el.strike = !el.strike;

        // Send updated playfield to the database
        cardInputUpdate();
    }


    /**
     * Function which gets called when the user submits card input
     */
    function cardInputUpdate() {
        console.log("User updated their playfield, updating database");

        // Send updated playfield to the database
        useFetch("/api/set-playfield", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: selectedName.value,
                playfield: cards.value,
                hasWon: checkPlayfieldForWin()
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
            cardInputUpdate();
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
     * @param bypassConfirmation Set to true if calling from the resetVote to bypass the confirmation popup
     */
    function resetStrikes(bypassConfirmation: boolean = false) {
        if (bypassConfirmation || confirm("Are you sure? This action cannot be undone!")) {
            console.log("Resetting strikes");

            // Set every card's strike property to false
            cards.value.forEach((e) => {
                e.strike = false;
            });

            // Send updated playfield to the database
            cardInputUpdate();
        }
    }


    /**
     * Function which gets called when the user clicks the "Vote Reset" button
     */
    function voteForRestart() {
        bingoWinnerPopup.value = ""; // Close popup if it is open

        // Send vote request to the database
        useFetch("/api/set-resetvote", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: selectedName.value,
                hasVotedForRestart: !names.value.find((e) => e.name == selectedName.value).hasVotedForRestart // Invert what is stored for this user
            })
        });
    }


    /**
     * Checks if this user has a Bingo (full row in x, y and xy direction) and notifies all other users
     * @returns Boolean if this user has won
     */
    function checkPlayfieldForWin() { // TODO: This code is probably inefficient and shit as fuck
        let hasWon = false;

        // Calculate the amount of rows and columns we have (playfield is square)
        let rowColAmount = Math.sqrt(selectedSize.value);


        // Check each row for win
        for (let row = 0; row < rowColAmount; row++) {
            const rowIdMin = rowColAmount * row;
            const rowIdMax = rowColAmount * (row + 1);

            // Get all cards inside the [rowIdMin, rowIdMax] interval
            const rowCards = cards.value.filter((e) => e.id > rowIdMin && e.id <= rowIdMax); // > and <= as our playfield starts at index 1 instead of 0

            // Check if every element is striked
            const rowWin = rowCards.every((e) => e.strike);

            // Only update hasWon if it is not already true to avoid resetting existing win
            if (!hasWon) hasWon = rowWin;
        }


        // Check each column for win
        for (let col = 0; col < rowColAmount; col++) {
            const colCards: any[] = [];

            // Get all cards inside this column
            for (let row = 0; row < rowColAmount; row++) {
                const cardId = (rowColAmount * row) + col + 1; // +1 because our playfield starts at index 1 instead of 0

                // Get this card and push it
                colCards.push(cards.value.find((e) => e.id == cardId));
            }

            // Check if every element is striked
            const colWin = colCards.every((e) => e.strike);

            // Only update hasWon if it is not already true to avoid resetting existing win
            if (!hasWon) hasWon = colWin;
        }


        // Check diagonale for win
        const diagTlBrCards: any[] = []; // Top left to bottom right

        for (let row = 0; row < rowColAmount; row++) { 
            const cardId = (rowColAmount * row) + (row + 1);

            diagTlBrCards.push(cards.value.find((e) => e.id == cardId));
        }

        const diagTrBlCards: any[] = []; // Top right to bottom left

        for (let row = 0; row < rowColAmount; row++) {
            const cardId = (rowColAmount * (row + 1)) - row;

            diagTrBlCards.push(cards.value.find((e) => e.id == cardId));
        }

        const diagWin = diagTlBrCards.every((e) => e.strike) || diagTrBlCards.every((e) => e.strike);

        if (!hasWon) hasWon = diagWin;


        // Return result
        return hasWon;
    }


    /**
     * Function which gets called when the user clicks the "Sign Out" button
     */
    function clickSignOutButton() {
        // Reset lastActivity
        useFetch("/api/set-lastactivity", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: selectedName.value,
                lastActivity: 0
            })
        });

        window.localStorage.selectedName = "";
        window.localStorage.lastActivity = 0;

        // Route user to index
        router.push({ path: "/" });
    }
</script>


<style>
    .bingo-playfield-wrapper {
        grid-template-columns: repeat(v-bind(selectedSizeSqrt), auto);
    }
</style>