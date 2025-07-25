export const USERNAME_INPUT_TEMPLATE = number => {
	return `
					<div class="input-group">
						<label for="player-count">
							<i class="fas fa-user-friends"></i> Игрок ${number}:
						</label>
						<input type="text" class='username-input' value="player ${number}" data-player-index="${number}" />
					</div>
  `
}
export const FACTION_PREVIEW_TEMPLATE = faction => {
	return `
        	<div class="faction-small">
						<img
							src="${faction.icon}"
							alt="${faction.name}"
						/>
						<p>${faction.name}</p>
					</div>  `
}
export const FACTION_TEMPLATE = faction => {
	return `
    <div class="faction-item" data-item-id='${faction.name}'>
						<img
							src="${faction.icon}"
							alt="${faction.name}"
						/>
						<h3>${faction.name}</h3>
						<div class="actions">
							<button class='pick-btn'>Пик</button>
							<button class='ban-btn'>Бан</button>
						</div>
					</div>
  `
}
export const SELECTED_FACTION_TEMPLATE = faction => {
	return `
					<div class="selected-faction" data-item-id='${faction.name}'>
						<img
							src="${faction.icon}"
							alt="${faction.name}"
						/>
						<span>${faction.name}</span>
					</div>
  `
}
