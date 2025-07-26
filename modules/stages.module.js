export function show(element) {
	element.style.display = 'block'
}

export function hide(element) {
	element.style.display = 'none'
}

const playerCountStage = document.getElementById('player-count-stage')
const playerNamesStage = document.getElementById('player-names-stage')
const pickFactionsStage = document.getElementById('pick-factions-stage')
const pickBanStage = document.getElementById('pick-ban-stage')
const endgameStage = document.getElementById('endgame-stage')

const phases = document.querySelectorAll('.phase')

const pickMenu = document.getElementById('pick-menu')

const STAGES = [
	{ stage: playerCountStage, isActive: true, phase: phases[0] },
	{ stage: playerNamesStage, isActive: false, phase: phases[1] },
	{ stage: pickFactionsStage, isActive: false, phase: phases[2] },
	{ stage: pickBanStage, isActive: false, phase: phases[3] },
	{ stage: endgameStage, isActive: false, phase: phases[4] },
]
let activeStage = STAGES[0]

function updateActiveStage() {
	activeStage = STAGES.find(phase => phase.isActive)
}
function updateMenuVisibility() {
	if (activeStage && activeStage.stage === pickBanStage) {
		show(pickMenu)
	} else {
		hide(pickMenu)
	}
}

function updatePhaseClasses() {
	phases.forEach(p => {
		p.classList.toggle('active', p === activeStage?.phase)
	})
}

function setNewStage(stage) {
	STAGES.forEach(phase => {
		phase.isActive = phase.stage === stage
		phase.isActive ? show(phase.stage) : hide(phase.stage)
	})

	updateActiveStage()
	updatePhaseClasses()
	updateMenuVisibility()
}

function initializeStages() {
	STAGES.forEach(phase => {
		phase.isActive ? show(phase.stage) : hide(phase.stage)
	})

	updateActiveStage()
	updatePhaseClasses()
	updateMenuVisibility()
}

export {
	setNewStage,
	updateActiveStage,
	updatePhaseClasses,
	updateMenuVisibility,
	STAGES,
	activeStage,
	phases,
	pickMenu,
	playerCountStage,
	playerNamesStage,
	pickFactionsStage,
	pickBanStage,
	endgameStage,
	initializeStages,
}
