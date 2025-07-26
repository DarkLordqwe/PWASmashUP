import { initializeStages } from './modules/stages.module.js'

if ('serviceWorker' in navigator) {
	navigator.serviceWorker
		.register('service-worker.js')
		.then(() => console.log('✅ Service Worker зарегистрирован'))
		.catch(err => console.error('❌ Ошибка регистрации SW:', err))
}

document.addEventListener('DOMContentLoaded', initializeStages)
