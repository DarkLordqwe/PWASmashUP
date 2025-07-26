import { factionsContainer } from './factions.module.js'
import {
	currentPlayer,
	users,
	loopPlayer,
	resetPlayerIndex,
	renderPlayers,
} from './players.module.js'
import { factions, factionsInDraft, renderFactions } from './factions.module.js'
import { SELECTED_FACTION_TEMPLATE } from '../templates.js'
import { endgameStage, setNewStage } from './stages.module.js'

const currentPlayerName = document.getElementById('current-username')
const pickedList = document.getElementById('picked-list')
const bannedList = document.getElementById('banned-list')
const next = document.getElementById('next')

const PHASES = {
	BAN_1: 1,
	BAN_2: 2,
	PICK_1: 3,
	PICK_2: 4,
	COMPLETED: 5,
}

let phase = PHASES.BAN_1
let lastSelectedFaction = null

next.addEventListener('click', () => {
	if (!lastSelectedFaction) return
	nextPlayer()
})

factionsContainer.addEventListener('click', e => {
	const factionItem = e.target.closest('[data-item-id]')
	if (!factionItem) return

	const factionName = factionItem.dataset.itemId || factionItem.dataset.id

	const faction = factions.find(f => f.name === factionName)
	const pickBtn = e.target.closest('.pick-btn')
	const banBtn = e.target.closest('.ban-btn')

	if (pickBtn) {
		e.stopPropagation()
		if (!canPick()) {
			alert('Сейчас не фаза пиков или лимит исчерпан')
		}

		if (checkUserMove()) {
			pickFaction(faction)
		}

		return
	}

	if (banBtn) {
		e.stopPropagation()
		if (!canBan()) {
			alert('Сейчас не фаза пиков или лимит исчерпан')
			return
		}
		if (checkUserMove()) {
			banFaction(faction)
		}
		return
	}
})
pickedList.addEventListener('click', e => {
	if (!lastSelectedFaction) return

	const factionItem = e.target.closest('[data-item-id], [data-id]')
	if (!factionItem) return

	const factionName = factionItem.dataset.itemId || factionItem.dataset.id
	if (!factionName) return

	const faction = factions.find(f => f.name === factionName)
	if (!faction) return

	if (!faction || faction.name !== lastSelectedFaction.name) return

	backFaction(faction)
})

bannedList.addEventListener('click', e => {
	if (!lastSelectedFaction) return

	const factionItem = e.target.closest('[data-item-id], [data-id]')
	if (!factionItem) return

	const factionName = factionItem.dataset.itemId || factionItem.dataset.id
	if (!factionName) return

	const faction = factions.find(f => f.name === factionName)
	if (!faction) return

	if (!faction || faction.name !== lastSelectedFaction.name) return

	backFaction(faction)
})

function pickFaction(faction) {
	if (!canPick()) return

	if (currentPlayer().picks.some(p => p.name === faction.name)) {
		alert('Эта фракция уже выбрана!')
		return
	}
	currentPlayer().picks.push(faction)
	lastSelectedFaction = faction
	removeFactionFromDraft(faction)
	renderUI()
}

function banFaction(faction) {
	if (!canBan()) return

	if (currentPlayer().bans.some(p => p.name === faction.name)) {
		alert('Эта фракция уже забанена!')
		return
	}
	currentPlayer().bans.push(faction)
	lastSelectedFaction = faction
	removeFactionFromDraft(faction)

	renderUI()
}

function canPick() {
	return phase === PHASES.PICK_1 || phase === PHASES.PICK_2
}

function canBan() {
	return phase === PHASES.BAN_2 || phase === PHASES.BAN_1
}

function nextPlayer() {
	lastSelectedFaction = null
	loopPlayer()
	updateUI()
	checkPhasesCompletion()
	renderUI()
}

function resetPlayerTurn() {
	resetPlayerIndex()
	updateUI()
}

function updateUI() {
	currentPlayerName.textContent = currentPlayer().username
}

function renderUI() {
	renderSelectedPickedFactions()
	renderSelectedBannedFactions()
	renderFactions()
}

function renderSelectedPickedFactions() {
	pickedList.innerHTML = ''
	let HTML = ''
	for (let i = 0; i < currentPlayer().picks.length; i++) {
		HTML += SELECTED_FACTION_TEMPLATE(currentPlayer().picks[i])
	}

	pickedList.insertAdjacentHTML('beforeend', HTML)
}
function renderSelectedBannedFactions() {
	bannedList.innerHTML = ''
	let HTML = ''
	for (let i = 0; i < currentPlayer().bans.length; i++) {
		HTML += SELECTED_FACTION_TEMPLATE(currentPlayer().bans[i])
	}

	bannedList.insertAdjacentHTML('beforeend', HTML)
}

function removeFactionFromDraft(faction) {
	if (!faction || !currentPlayer()) return

	const index = factionsInDraft.findIndex(p => p.name === faction.name)

	if (index !== -1) {
		factionsInDraft.splice(index, 1)
		renderFactions()
		renderSelectedPickedFactions()
	}
}

function backFaction(faction) {
	if (!faction || !currentPlayer()) return
	if (!lastSelectedFaction || faction.name !== lastSelectedFaction.name) return

	const player = currentPlayer()
	let removed = false

	const pickIndex = player.picks.findIndex(p => p.name === faction.name)
	if (pickIndex !== -1) {
		player.picks.splice(pickIndex, 1)
		if (!factionsInDraft.some(f => f.name === faction.name)) {
			factionsInDraft.push(faction)
		}
		removed = true
	}

	const banIndex = player.bans.findIndex(b => b.name === faction.name)
	if (banIndex !== -1) {
		player.bans.splice(banIndex, 1)
		if (!factionsInDraft.some(f => f.name === faction.name)) {
			factionsInDraft.push(faction)
		}
		removed = true
	}

	if (removed) {
		lastSelectedFaction = null
		renderUI()
	}
	console.log(factionsInDraft)
}

function checkUserMove() {
	if (!users.length) return false

	if (phase === PHASES.BAN_1) {
		return currentPlayer().bans?.length !== 1
	} else if (phase === PHASES.BAN_2) {
		return currentPlayer().bans?.length !== 2
	} else if (phase === PHASES.PICK_1) {
		return currentPlayer().picks?.length !== 1
	} else if (phase === PHASES.PICK_2) {
		return currentPlayer().pick?.length !== 2
	} else {
		return false
	}
}

function checkPhasesCompletion() {
	if (!users.length) return

	switch (phase) {
		case PHASES.BAN_1:
			if (users.every(user => user.bans?.length === 1)) {
				phase = PHASES.BAN_2
			}
			break

		case PHASES.BAN_2:
			if (users.every(user => user.bans?.length === 2)) {
				phase = PHASES.PICK_1
			}
			break

		case PHASES.PICK_1:
			if (users.every(user => user.picks?.length === 1)) {
				phase = PHASES.PICK_2
			}
			break

		case PHASES.PICK_2:
			if (users.every(user => user.picks?.length === 2)) {
				phase = PHASES.COMPLETED
				setNewStage(endgameStage)
				renderPlayers()
			}
			break

		default:
			break
	}
}

export { updateUI, nextPlayer, resetPlayerTurn, canPick, canBan }
