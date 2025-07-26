import { SMASHUP_FACTIONS_LENGTH } from '../constants.js'
import { pickBanStage, setNewStage } from './stages.module.js'
import { FACTION_TEMPLATE, FACTION_PREVIEW_TEMPLATE } from '../templates.js'
import { currentPlayer } from './players.module.js'
import { updateUI } from './game.module.js'

const setDraftsButton = document.getElementById('set-drafts')
const factionGridPlace = document.querySelector('.factions-grid')
const factionsContainer = document.querySelector('.factions-container')

const currentDraftLength = document.getElementById('current-draft-length')

let factions = [
	{
		id: 1,
		name: 'Инопланетяне',
		icon: 'https://static.wikia.nocookie.net/smashup/images/5/50/Aliens.png',
	},
	{
		id: 2,
		name: 'Динозавры',
		icon: 'https://static.wikia.nocookie.net/smashup/images/6/68/Dinosaurs.png',
	},
	{
		id: 3,
		name: 'Ниндзя',
		icon: 'https://static.wikia.nocookie.net/smashup/images/3/35/Ninjas.png',
	},
	{
		id: 4,
		name: 'Пираты',
		icon: 'https://static.wikia.nocookie.net/smashup/images/f/fe/Pirates.png',
	},
	{
		id: 5,
		name: 'Роботы',
		icon: 'https://static.wikia.nocookie.net/smashup/images/e/e1/Robots.png',
	},
	{
		id: 6,
		name: 'Трюкачи',
		icon: 'https://static.wikia.nocookie.net/smashup/images/4/42/Tricksters.png',
	},
	{
		id: 7,
		name: 'Волшебники',
		icon: 'https://static.wikia.nocookie.net/smashup/images/2/2a/Wizards.png',
	},
	{
		id: 8,
		name: 'Зомби',
		icon: 'https://static.wikia.nocookie.net/smashup/images/4/44/Zombies.png',
	},
	{
		id: 9,
		name: 'Медведи-наездники',
		icon: 'https://static.wikia.nocookie.net/smashup/images/1/1e/Bear_Cavalry.png',
	},
	{
		id: 10,
		name: 'Призраки',
		icon: 'https://static.wikia.nocookie.net/smashup/images/7/7f/Ghosts.png',
	},
	{
		id: 11,
		name: 'Хищные растения',
		icon: 'https://static.wikia.nocookie.net/smashup/images/8/85/Killer_Plants.png',
	},
	{
		id: 12,
		name: 'Стилпанк',
		icon: 'https://static.wikia.nocookie.net/smashup/images/0/02/Steampunk.png',
	},
	{
		id: 13,
		name: 'Древние',
		icon: 'https://static.wikia.nocookie.net/smashup/images/6/62/Elder_Things.png',
	},
	{
		id: 14,
		name: 'Иннсмусские',
		icon: 'https://static.wikia.nocookie.net/smashup/images/b/be/Innsmouth.png',
	},
	{
		id: 15,
		name: 'Прислужники Ктулху',
		icon: 'https://static.wikia.nocookie.net/smashup/images/a/ae/Minions_of_Cthulhu.png',
	},
	{
		id: 16,
		name: 'Университет Мискатоник',
		icon: 'https://static.wikia.nocookie.net/smashup/images/0/02/Miskatonic_University-0.png',
	},
	{
		id: 17,
		name: 'Гигантские муравьи',
		icon: 'https://static.wikia.nocookie.net/smashup/images/c/c6/Giant_Ants-0.png',
	},
	{
		id: 18,
		name: 'Безумные ученые',
		icon: 'https://static.wikia.nocookie.net/smashup/images/6/65/Mad_Scientists.png',
	},
	{
		id: 19,
		name: 'Вампиры',
		icon: 'https://static.wikia.nocookie.net/smashup/images/f/fd/Vampires.png',
	},
	{
		id: 20,
		name: 'Оборотни',
		icon: 'https://static.wikia.nocookie.net/smashup/images/f/f7/Werewolves.png',
	},
	{
		id: 21,
		name: 'Феи',
		icon: 'https://static.wikia.nocookie.net/smashup/images/8/8e/Fairies.png',
	},
	{
		id: 22,
		name: 'Кошки',
		icon: 'https://static.wikia.nocookie.net/smashup/images/d/d1/Kitty_Cats.png',
	},
	{
		id: 23,
		name: 'Мифические лошади',
		icon: 'https://static.wikia.nocookie.net/smashup/images/d/dd/Mythic_Horses-0.png',
	},
	{
		id: 24,
		name: 'Принцессы',
		icon: 'https://static.wikia.nocookie.net/smashup/images/a/a6/Princesses.png',
	},
	{
		id: 25,
		name: 'Драконы',
		icon: 'https://static.wikia.nocookie.net/smashup/images/4/40/Dragons.png',
	},
	{
		id: 26,
		name: 'Мифические греки',
		icon: 'https://static.wikia.nocookie.net/smashup/images/7/77/Mythic_Greeks-0.png',
	},
	{
		id: 27,
		name: 'Акулы',
		icon: 'https://static.wikia.nocookie.net/smashup/images/4/4b/Sharks.png',
	},
	{
		id: 28,
		name: 'Супергерои',
		icon: 'https://static.wikia.nocookie.net/smashup/images/d/d6/Superheroes.png',
	},
	{
		id: 29,
		name: 'Торнадо',
		icon: 'https://static.wikia.nocookie.net/smashup/images/b/b6/Tornados-0.png',
	},
	{
		id: 30,
		name: 'Исследователи',
		icon: 'https://static.wikia.nocookie.net/smashup/images/1/17/Explorers.png',
	},
	{
		id: 31,
		name: 'Бабульки',
		icon: 'https://static.wikia.nocookie.net/smashup/images/6/6f/Grannies.png',
	},
	{
		id: 32,
		name: 'Рок-звёзды',
		icon: 'https://static.wikia.nocookie.net/smashup/images/8/81/Rock_Stars.png',
	},
	{
		id: 33,
		name: 'Плюшевые мишки',
		icon: 'https://static.wikia.nocookie.net/smashup/images/e/e5/Teddy_Bears.png',
	},
	{
		id: 34,
		name: 'Кайдзю',
		icon: 'https://static.wikia.nocookie.net/smashup/images/e/ef/Kaiju-0.png',
	},
	{
		id: 35,
		name: 'Покемоны',
		icon: 'https://static.wikia.nocookie.net/smashup/images/7/71/Itty_Critters.png',
	},
	{
		id: 36,
		name: 'Магические девушки',
		icon: 'https://static.wikia.nocookie.net/smashup/images/e/e1/Magical_Girls.png',
	},
	{
		id: 37,
		name: 'Мега-трупперы',
		icon: 'https://static.wikia.nocookie.net/smashup/images/f/ff/Mega_Troopers.png',
	},
	{
		id: 38,
		name: 'Русы',
		icon: 'https://hobbygames.ru/image/cache/hobbygames_beta/data/-new/hobby-world/zames/rusi-protiv-jashherov/rusi-protiv-yascherow-06-1000x416-wm.jpg',
	},
	{
		id: 39,
		name: 'Ящеры',
		icon: 'https://hobbygames.ru/image/cache/hobbygames_beta/data/-new/hobby-world/zames/rusi-protiv-jashherov/rusi-protiv-yascherow-07-1000x416-wm.jpg',
	},
	{
		id: 40,
		name: 'Скелеты',
		icon: 'https://static.wikia.nocookie.net/smashup/images/a/ad/Dig_em_Up.jpg',
	},
	{
		id: 41,
		name: 'Сирены/Русалки',
		icon: 'https://static.wikia.nocookie.net/smashup/images/0/0a/Siren.png',
	},
	{
		id: 42,
		name: 'Овцы',
		icon: 'https://static.wikia.nocookie.net/smashup/images/d/d8/Sheep_Icon.png',
	},
	{
		id: 43,
		name: 'Футболисты',
		icon: 'https://static.wikia.nocookie.net/smashup/images/7/70/Mummy.png',
	},
	{
		id: 44,
		name: 'Ацтеки',
		icon: 'https://static.wikia.nocookie.net/smashup/images/e/ef/Ancient_Incas_logo.png',
	},
	{
		id: 45,
		name: 'Братья Гримм',
		icon: 'https://static.wikia.nocookie.net/smashup/images/2/21/Grimm%27s_Fairy_Tales_logo.png',
	},
	{
		id: 46,
		name: 'Мауи',
		icon: 'https://static.wikia.nocookie.net/smashup/images/6/65/Polynesian_Voyagers_logo.png',
	},
	{
		id: 47,
		name: 'Пауки',
		icon: 'https://static.wikia.nocookie.net/smashup/images/9/97/Anansi_Tales_logo.png',
	},
	{
		id: 48,
		name: 'Русский фольклор',
		icon: 'https://static.wikia.nocookie.net/smashup/images/4/47/Russian_Fairy_Tales_logo.png',
	},
]

let factionsInDraft = []

function addFactionToDraft(faction) {
	if (factionsInDraft.length + 1 > SMASHUP_FACTIONS_LENGTH) {
		alert('Вы уже выбрали максимальное количество фракций')
		return
	}
	factionsInDraft.push(faction)
	faction.classList.add('active')

	currentDraftLength.textContent = factionsInDraft.length
}

function removeFactionFromDraft(faction) {
	const index = factionsInDraft.findIndex(f => f.name === faction.name)

	if (index === -1) return false

	factionsInDraft.splice(index, 1)

	currentDraftLength.textContent = factionsInDraft.length

	faction.classList.remove('active')
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
	} else {
		addFactionToDraft(newFaction)
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
