import { SMASHUP_MIN_PLAYERS, SMASHUP_MAX_PLAYERS } from '../constants.js'

import {
	pickFactionsStage,
	playerNamesStage,
	setNewStage,
} from './stages.module.js'

import { USERNAME_INPUT_TEMPLATE } from '../templates.js'
import { renderFactionsGrid } from './factions.module.js'

const playerCountInput = document.getElementById('player-count')

const setPlayersButton = document.getElementById('set-players')
const setUsernamesButton = document.getElementById('set-usernames')
const usersInputPlace = document.querySelector('.users-input-place')

let playersCount
let users = []
const currentPlayer = () => users[currentPlayerIndex]
let currentPlayerIndex = 0

const resetPlayerIndex = () => (currentPlayerIndex = 0)
const loopPlayer = () =>
	(currentPlayerIndex = (currentPlayerIndex + 1) % users.length)

function setUsers() {
	const usernameInputs = usersInputPlace.querySelectorAll('.username-input')
	const hasEmptyInput = Array.from(usernameInputs).some(
		input => !input.value.trim()
	)

	if (hasEmptyInput) {
		usernameInputs.forEach(input => {
			if (!input.value.trim()) {
				input.classList.add('error')
			}
		})
		alert('Все имена пользователей должны быть заполнены')
		return false
	}

	users = Array.from(usernameInputs).map(input => ({
		username: input.value.trim(),
		picks: [],
		bans: [],
	}))

	return true
}

setPlayersButton.addEventListener('click', () => {
	playersCount = parseInt(playerCountInput.value)
	if (
		playersCount >= SMASHUP_MIN_PLAYERS &&
		playersCount <= SMASHUP_MAX_PLAYERS
	) {
		setNewStage(playerNamesStage)
	} else {
		alert('Неверное количество игроков')
	}
	renderUsersInputPlace()
})
setUsernamesButton.addEventListener('click', () => {
	if (setUsers()) {
		setNewStage(pickFactionsStage)
		renderFactionsGrid()
	}
})

function renderUsersInputPlace() {
	let inputsHTML = ''
	for (let i = 1; i <= playersCount; i++) {
		inputsHTML += USERNAME_INPUT_TEMPLATE(i)
	}

	usersInputPlace.insertAdjacentHTML('beforeend', inputsHTML)
}

export {
	users,
	currentPlayer,
	currentPlayerIndex,
	resetPlayerIndex,
	loopPlayer,
}
