import { factionsContainer } from './factions.module.js'
import {
	currentPlayer,
	users,
	loopPlayer,
	resetPlayerIndex,
} from './players.module.js'
import { factions, factionsInDraft, renderFactions } from './factions.module.js'
import { SELECTED_FACTION_TEMPLATE } from '../templates.js'

const currentPlayerName = document.getElementById('current-username')
const pickedList = document.getElementById('picked-list')
const bannedList = document.getElementById('banned-list')
const next = document.getElementById('next')

const PHASES = {
	PICK_1: 1,
	PICK_2: 2,
	BAN_1: 3,
	BAN_2: 4,
	COMPLETED: 5,
}

let phase = PHASES.PICK_1
let lastSelectedFaction = null

next.addEventListener('click', () => {
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
	const factionItem = e.target.closest('[data-item-id]')
	if (!factionItem) return

	const factionName = factionItem.dataset.itemId || factionItem.dataset.id

	const faction = factions.find(f => f.name === factionName)
	if (faction) {
		if (faction.name === lastSelectedFaction.name) {
			backFaction(faction)
			const player = currentPlayer()
			const factionIndex = player.picks.findIndex(p => p.name === faction.name)

			if (factionIndex !== -1) {
				player.picks.splice(factionIndex, 1)
				renderSelectedPickedFactions()
			}
		}
	}
})

function pickFaction(faction) {
	if (!canPick()) return
	currentPlayer().picks.push(faction)
	lastSelectedFaction = faction
	removeFaction(faction)
	renderSelectedPickedFactions()
}

function banFaction(faction) {
	if (!canBan()) return
	if (users.every(user => user.picks.length !== 2)) {
		alert('Все игроки должны выбрать две фракции')
		return
	} else {
		currentPlayer().bans.push(faction)
		lastSelectedFaction = faction
	}
}

function canPick() {
	return phase === PHASES.PICK_1 || phase === PHASES.PICK_2
}

function canBan() {
	return phase === PHASES.BAN_2 || phase === PHASES.BAN_1
}
function checkUserMove() {
	if (!users.length) return false

	if (phase === PHASES.PICK_1) {
		return currentPlayer().picks?.length !== 1
	} else if (phase === PHASES.PICK_2) {
		return currentPlayer().picks?.length !== 2
	} else if (phase === PHASES.BAN_1) {
		return currentPlayer().bans?.length !== 1
	} else if (phase === PHASES.BAN_2) {
		return currentPlayer().bans?.length !== 2
	} else {
		return false
	}
}

function checkPhasesCompletion() {
	if (!users.length) return

	switch (phase) {
		case PHASES.PICK_1:
			if (users.every(user => user.picks?.length === 1)) {
				phase = PHASES.PICK_2
			}
			break

		case PHASES.PICK_2:
			if (users.every(user => user.picks?.length === 2)) {
				phase = PHASES.BAN_1
			}
			break

		case PHASES.BAN_1:
			if (users.every(user => user.bans?.length === 1)) {
				phase = PHASES.BAN_2
			}
			break

		case PHASES.BAN_2:
			if (users.every(user => user.bans?.length === 2)) {
				phase = PHASES.COMPLETED
			}
			break

		default:
			break
	}
}

function nextPlayer() {
	lastSelectedFaction = null
	loopPlayer()
	updateUI()
	checkPhasesCompletion()
	renderSelectedPickedFactions()
}

function resetPlayerTurn() {
	resetPlayerIndex()
	updateUI()
}

function updateUI() {
	currentPlayerName.textContent = currentPlayer().username
}

function renderSelectedPickedFactions() {
	pickedList.innerHTML = ''
	let HTML = ''
	for (let i = 0; i < currentPlayer().picks.length; i++) {
		HTML += SELECTED_FACTION_TEMPLATE(currentPlayer().picks[i])
	}

	pickedList.insertAdjacentHTML('beforeend', HTML)
}

function removeFaction(faction) {
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

	const player = currentPlayer()
	let removed = false

	const pickIndex = player.picks.findIndex(
		p => p.id === faction.id || p.name === faction.name
	)
	if (pickIndex !== -1) {
		player.picks.splice(pickIndex, 1)
		factionsInDraft.push(faction)
		removed = true
	}

	const banIndex = player.bans.findIndex(
		b => b.id === faction.id || b.name === faction.name
	)
	if (banIndex !== -1) {
		player.bans.splice(banIndex, 1)
		factionsInDraft.push(faction)
		removed = true
	}

	if (removed) {
		renderFactions()
		renderSelectedPickedFactions()
		// renderBannedFactions()
	}
	console.log(factionsInDraft)
}

export { updateUI, nextPlayer, resetPlayerTurn }
