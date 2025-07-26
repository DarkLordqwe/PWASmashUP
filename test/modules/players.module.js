import {
	SMASHUP_MIN_PLAYERS,
	SMASHUP_MAX_PLAYERS,
	setFactionDraftLength,
} from '../constants.js'

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

const maxDraftLength = document.getElementById('max-draft-length')

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
		setFactionDraftLength(users.length * 4)
		maxDraftLength.textContent = users.length * 4
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

function renderPlayers() {
	const playersContainer = document.getElementById('players-container')

	playersContainer.innerHTML = ''

	users.forEach(user => {
		const playerCard = document.createElement('div')
		playerCard.className = 'player-card'

		playerCard.innerHTML = `
      <div class="player-header">
        <h3>Игрок: <span class="player-name">${user.username}</span></h3>
      </div>
      <div class="player-factions">
        <div class="faction-group picked">
          <h4><i class="fas fa-check-circle"></i> Выбранные <br /> фракции</h4>
          <ul>
            ${renderFactionsList(user.picks)}
          </ul>
        </div>
        <div class="faction-group banned">
          <h4><i class="fas fa-ban"></i> Забаненные <br /> фракции</h4>
          <ul>
            ${renderFactionsList(user.bans)}
          </ul>
        </div>
      </div>
    `

		playersContainer.appendChild(playerCard)
	})
}

function renderFactionsList(factions) {
	if (!factions || factions.length === 0) {
		return '<li class="empty">Нет фракций</li>'
	}

	return factions
		.map(
			faction => `
    <li>
      <img src="${faction.icon || getDefaultIcon(faction.name)}" 
           class="faction-icon" 
           alt="${faction.name}" />
      <span>${faction.name}</span>
    </li>
  `
		)
		.join('')
}

function getDefaultIcon(name) {
	const firstLetter = name.charAt(0).toUpperCase()
	return `https://via.placeholder.com/40/random/ffffff?text=${firstLetter}`
}

export {
	users,
	currentPlayer,
	currentPlayerIndex,
	resetPlayerIndex,
	loopPlayer,
	renderPlayers,
}
