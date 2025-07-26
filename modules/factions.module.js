import { SMASHUP_FACTIONS_LENGTH } from '../constants.js'
import { pickBanStage, setNewStage } from './stages.module.js'
import { FACTION_TEMPLATE, FACTION_PREVIEW_TEMPLATE } from '../templates.js'
import { currentPlayer } from './players.module.js'
import { updateUI } from './game.module.js'

const setDraftsButton = document.getElementById('set-drafts')
const factionGridPlace = document.querySelector('.factions-grid')
const factionsContainer = document.querySelector('.factions-container')

const currentDraftLength = document.getElementById('current-draft-length')

fetch('factions.json')
	.then(res => res.json())
	.then(data => {
		factions = data
	})

let factions = []
let factionsInDraft = []

function addFactionToDraft(faction) {
	if (factionsInDraft.length + 1 > SMASHUP_FACTIONS_LENGTH) {
		alert('Вы уже выбрали максимальное количество фракций')
		return
	}
	factionsInDraft.push(faction)
	currentDraftLength.textContent = factionsInDraft.length
}

function removeFactionFromDraft(faction) {
	const index = factionsInDraft.findIndex(f => f.name === faction.name)

	if (index === -1) return false

	factionsInDraft.splice(index, 1)

	currentDraftLength.textContent = factionsInDraft.length

	return true
}
factionGridPlace.addEventListener('click', e => {
	const faction = e.target.closest('.faction-small')
	if (!faction) return

	const factionData = {
		text: faction.textContent.trim(),
	}
	const newFaction = factions.find(f => f.name === factionData.text)
	const existingFaction = factionsInDraft.find(f => f.name === newFaction.name)
	if (existingFaction) {
		removeFactionFromDraft(newFaction)
		faction.classList.remove('active')
	} else {
		addFactionToDraft(newFaction)
		faction.classList.add('active')
	}
})

setDraftsButton.addEventListener('click', () => {
	if (factionsInDraft.length < SMASHUP_FACTIONS_LENGTH) {
		alert('Вы должны выбрать все фракции')
		return
	}
	setNewStage(pickBanStage)
	renderFactions()
})

function renderFactions() {
	factionsContainer.innerHTML = ''
	let HTML = ''
	for (let i = 0; i < factionsInDraft.length; i++) {
		HTML += FACTION_TEMPLATE(factionsInDraft[i], currentPlayer().username)
	}

	factionsContainer.insertAdjacentHTML('beforeend', HTML)
	updateUI()
}
function renderFactionsGrid() {
	let gridHTML = ''
	for (let i = 0; i < factions.length; i++) {
		gridHTML += FACTION_PREVIEW_TEMPLATE(factions[i])
	}

	factionGridPlace.insertAdjacentHTML('beforeend', gridHTML)
}
export {
	factions,
	factionsInDraft,
	renderFactions,
	renderFactionsGrid,
	factionsContainer,
}
