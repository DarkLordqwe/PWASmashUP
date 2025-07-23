let factions = []

let currentPlayerIndex = 0
let totalPlayers = 6
let playerTurns = []

const factionList = document.getElementById('faction-list')
const bannedList = document.getElementById('banned-list')
const menu = document.getElementById('menu')
const game = document.getElementById('game')
const startBtn = document.getElementById('start-game')
const playerCountInput = document.getElementById('player-count')
const currentPlayerLabel = document.getElementById('current-player')
const setPlayersBtn = document.getElementById('set-players')
const playerNamesDiv = document.getElementById('player-names')
const playerInputsContainer = document.getElementById('player-inputs')

fetch('factions.json')
	.then(res => res.json())
	.then(data => {
		factions = data
		renderFactions()
		renderBanned()
		renderPicked()
	})
startBtn.onclick = () => {
	const inputs = playerInputsContainer.querySelectorAll('input')
	playerTurns = []
	inputs.forEach(input => {
		const name = input.value.trim()
		if (name) {
			playerTurns.push({ name, banned: [], picked: [] })
		}
	})
	if (playerTurns.length !== totalPlayers) {
		alert('Заполните имена всех игроков')
		return
	}
	menu.style.display = 'none'
	game.style.display = 'block'
	renderFactions()
	renderBanned()
	renderPicked()
	updatePlayerLabel()
}
setPlayersBtn.onclick = () => {
	totalPlayers = parseInt(playerCountInput.value)
	if (isNaN(totalPlayers) || totalPlayers < 2) {
		alert('Введите минимум 2 игрока')
		return
	}
	playerInputsContainer.innerHTML = ''
	for (let i = 0; i < totalPlayers; i++) {
		const input = document.createElement('input')
		input.placeholder = `Имя игрока ${i + 1}`
		input.required = true
		playerInputsContainer.appendChild(input)
		playerInputsContainer.appendChild(document.createElement('br'))
	}
	playerNamesDiv.style.display = 'block'
}
function renderFactions() {
	const player = playerTurns[currentPlayerIndex]
	const allPicked = getAllPicked()
	const allBanned = getAllBanned()

	factionList.innerHTML = ''

	factions
		.filter(f => !allPicked.includes(f.name) && !allBanned.includes(f.name))
		.forEach(faction => {
			const li = document.createElement('li')
			li.className = 'faction-item'

			const icon = document.createElement('img')
			icon.src = faction.icon
			icon.alt = faction.name
			icon.className = 'icon'

			const span = document.createElement('span')
			span.textContent = faction.name

			const banBtn = document.createElement('button')
			banBtn.textContent = 'Забанить'
			banBtn.onclick = () => {
				if (player.banned.length >= 2) {
					alert('Вы уже забанили 2 фракции.')
					return
				}
				player.banned.push(faction.name)
				renderFactions()
				renderBanned()
				checkPlayerReady()
			}

			const pickBtn = document.createElement('button')
			pickBtn.textContent = 'Пикнуть'
			pickBtn.onclick = () => {
				if (player.picked.length >= 2) {
					alert('Вы уже выбрали 2 фракции.')
					return
				}
				player.picked.push(faction.name)
				renderFactions()
				renderPicked()
				checkPlayerReady()
			}

			li.appendChild(icon)
			li.appendChild(span)
			li.appendChild(banBtn)
			li.appendChild(pickBtn)
			factionList.appendChild(li)
		})
}
function renderBanned() {
	const player = playerTurns[currentPlayerIndex]
	bannedList.innerHTML = ''
	player.banned.forEach(name => {
		const li = document.createElement('li')
		li.className = 'faction-item'
		const faction = factions.find(f => f.name === name)

		const icon = document.createElement('img')
		icon.src = faction ? faction.icon : ''
		icon.alt = name
		icon.className = 'icon'

		const span = document.createElement('span')
		span.textContent = name

		const btn = document.createElement('button')
		btn.textContent = 'Разбанить'
		btn.onclick = () => {
			player.banned = player.banned.filter(n => n !== name)
			renderFactions()
			renderBanned()
		}

		li.appendChild(icon)
		li.appendChild(span)
		li.appendChild(btn)
		bannedList.appendChild(li)
	})
}

function renderPicked() {
	const player = playerTurns[currentPlayerIndex]
	const pickedList = document.getElementById('picked-list')
	pickedList.innerHTML = ''
	player.picked.forEach(name => {
		const li = document.createElement('li')
		li.className = 'faction-item'
		const faction = factions.find(f => f.name === name)

		const icon = document.createElement('img')
		icon.src = faction ? faction.icon : ''
		icon.alt = name
		icon.className = 'icon'

		const span = document.createElement('span')
		span.textContent = name

		const removeBtn = document.createElement('button')
		removeBtn.textContent = 'Убрать'
		removeBtn.onclick = () => {
			player.picked = player.picked.filter(n => n !== name)
			renderFactions()
			renderPicked()
		}

		li.appendChild(icon)
		li.appendChild(span)
		li.appendChild(removeBtn)
		pickedList.appendChild(li)
	})
}
function nextPlayer() {
	currentPlayerIndex = (currentPlayerIndex + 1) % totalPlayers
	console.log(
		`➡️ Ход переходит к игроку: ${playerTurns[currentPlayerIndex].name}`
	)
	updatePlayerLabel()
	renderFactions()
	renderBanned()
	renderPicked()
}

function updatePlayerLabel() {
	const label = document.getElementById('current-player')
	if (label && playerTurns[currentPlayerIndex]) {
		label.textContent = `Ход игрока: ${playerTurns[currentPlayerIndex].name}`
	}
}
function checkAllPlayersReady() {
	const allReady = playerTurns.every(
		player => player.picked.length === 2 && player.banned.length === 2
	)

	if (allReady) {
		showResults()
	}
}
function checkPlayerReady() {
	const player = playerTurns[currentPlayerIndex]
	if (player.picked.length >= 2 && player.banned.length >= 2) {
		console.log(`✅ Игрок ${player.name} завершил ход`)
		nextPlayer()
		checkAllPlayersReady()
	}
}
function showResults() {
	const game = document.getElementById('game')
	const results = document.getElementById('results')
	const container = document.getElementById('results-container')

	game.style.display = 'none'
	results.style.display = 'block'

	container.innerHTML = '' // очищаем

	playerTurns.forEach(player => {
		const block = document.createElement('div')
		block.className = 'player-summary'

		const name = document.createElement('h3')
		name.textContent = player.name

		const pickedList = document.createElement('p')
		pickedList.textContent = `Пики: ${player.picked.join(', ')}`

		const bannedList = document.createElement('p')
		bannedList.textContent = `Баны: ${player.banned.join(', ')}`

		block.appendChild(name)
		block.appendChild(pickedList)
		block.appendChild(bannedList)

		container.appendChild(block)
	})
}
function getAllPicked() {
	return playerTurns.flatMap(player => player.picked)
}

function getAllBanned() {
	return playerTurns.flatMap(player => player.banned)
}

if ('serviceWorker' in navigator) {
	navigator.serviceWorker
		.register('service-worker.js')
		.then(() => console.log('Service Worker registered'))
}
