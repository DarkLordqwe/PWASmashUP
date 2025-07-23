let picked = []
let factions = []
let banned = []

const factionList = document.getElementById('faction-list')
const bannedList = document.getElementById('banned-list')

fetch('factions.json')
	.then(res => res.json())
	.then(data => {
		factions = data
		renderFactions()
		renderBanned()
		renderPicked()
	})

function renderFactions() {
	factionList.innerHTML = ''
	factions
		.filter(f => !banned.includes(f.name) && !picked.includes(f.name))
		.forEach(faction => {
			const li = document.createElement('li')

			const icon = document.createElement('img')
			icon.src = `icons/${faction.name.toLowerCase()}.png`
			icon.alt = faction.name
			icon.className = 'icon'

			const span = document.createElement('span')
			span.textContent = faction.name

			const banBtn = document.createElement('button')
			banBtn.textContent = 'Забанить'
			banBtn.onclick = () => {
				banned.push(faction.name)
				renderFactions()
				renderBanned()
			}

			const pickBtn = document.createElement('button')
			pickBtn.textContent = 'Пикнуть'
			pickBtn.onclick = () => {
				picked.push(faction.name)
				renderFactions()
				renderPicked()
			}

			li.appendChild(icon)
			li.appendChild(span)
			li.appendChild(banBtn)
			li.appendChild(pickBtn)
			factionList.appendChild(li)
		})
}
function renderBanned() {
	bannedList.innerHTML = ''
	banned.forEach(name => {
		const li = document.createElement('li')
		li.textContent = name

		const btn = document.createElement('button')
		btn.textContent = 'Разбанить'
		btn.onclick = () => {
			banned = banned.filter(n => n !== name)
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
	const pickedList = document.getElementById('picked-list')
	pickedList.innerHTML = ''
	picked.forEach(name => {
		const li = document.createElement('li')

		const icon = document.createElement('img')
		icon.src = `icons/${name.toLowerCase()}.png`
		icon.alt = name
		icon.className = 'icon'

		const span = document.createElement('span')
		span.textContent = name

		const removeBtn = document.createElement('button')
		removeBtn.textContent = 'Убрать'
		removeBtn.onclick = () => {
			picked = picked.filter(n => n !== name)
			renderFactions()
			renderPicked()
		}

		li.appendChild(icon)
		li.appendChild(span)
		li.appendChild(removeBtn)
		pickedList.appendChild(li)
	})
}

if ('serviceWorker' in navigator) {
	navigator.serviceWorker
		.register('service-worker.js')
		.then(() => console.log('Service Worker registered'))
}
