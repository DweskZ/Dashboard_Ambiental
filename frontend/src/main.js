import { createApp } from 'vue'
import App from './App.vue'
import './assets/main.css'

import { MotionPlugin } from '@vueuse/motion'

const app = createApp(App)     // Primero crea la app
app.use(MotionPlugin)          // Ahora puedes usar el plugin

app.mount('#app')              // Finalmente monta la app
