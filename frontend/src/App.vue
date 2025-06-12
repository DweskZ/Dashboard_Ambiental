<template>
  <!-- Contenedor principal que ocupa toda la pantalla y da fondo azul -->
  <div class="weather-dashboard-bg">
    <!-- Si el usuario NO está autenticado, muestra el formulario de login/registro -->
    <AuthForm
      v-if="!user"
      :authMsg="authMsg"
      :authMsgType="authMsgType"
      @login="loginUser"
      @register="registerUser"
    />
    <!-- Si el usuario está autenticado, muestra el dashboard -->
    <div v-else class="dashboard-container">
      <!-- Barra superior con el nombre de la app y controles de usuario -->
      <HeaderBar :user="user" @logout="logout" />
      <!-- Área principal del dashboard -->
      <div class="main-content">
        <!-- Formulario para buscar clima de una ciudad -->
        <WeatherSearch @buscar="buscarClima" />
        <!-- Historial de búsquedas del usuario -->
        <WeatherHistory :historial="historial" />
      </div>
      <!-- Pie de página -->
      <footer class="footer">
        Desarrollado por Figueroa y Chile | Powered by OpenWeather & Vue 3
      </footer>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
// Importa los componentes modularizados
import AuthForm from './components/AuthForm.vue'
import HeaderBar from './components/HeaderBar.vue'
import WeatherSearch from './components/WeatherSearch.vue'
import WeatherHistory from './components/WeatherHistory.vue'

// Estado reactivo para usuario autenticado (persiste en localStorage)
const user = ref(JSON.parse(localStorage.getItem('user') || 'null'))
// Estado para mensajes de error de autenticación y su tipo (login o registro)
const authMsg = ref('')
const authMsgType = ref('')
// Estado para el historial de búsquedas
const historial = ref([])

/**
 * Función para login.
 * Recibe email y contraseña del formulario hijo,
 * hace la petición al backend y actualiza el estado global.
 */
async function loginUser(email, password) {
  authMsg.value = ""
  authMsgType.value = "login"
  const resp = await fetch('/api/auth/simple-login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  })

  if (resp.ok) {
    const data = await resp.json()
    user.value = data.user
    localStorage.setItem('user', JSON.stringify(data.user))
    obtenerHistorial() // Refresca el historial al loguear
    return
  }
  const errorData = await resp.json()
  authMsg.value = errorData.message || "Error al iniciar sesión"
}

/**
 * Función para registrar un usuario nuevo.
 * Recibe email y contraseña del formulario hijo,
 * hace la petición al backend y actualiza el estado global.
 */
async function registerUser(email, password) {
  authMsg.value = ""
  authMsgType.value = "register"
  const resp = await fetch('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  })
  if (resp.ok) {
    const data = await resp.json()
    user.value = data.user
    localStorage.setItem('user', JSON.stringify(data.user))
    obtenerHistorial()
    return
  }
  const err = await resp.json()
  authMsg.value = err.message || 'Error al registrar usuario'
}

/**
 * Función para cerrar sesión.
 * Limpia el usuario, historial y el almacenamiento local.
 */
function logout() {
  user.value = null
  localStorage.removeItem('user')
  historial.value = []
}

/**
 * Función para buscar clima de una ciudad.
 * Hace una petición al backend y luego actualiza el historial.
 */
async function buscarClima(ciudad) {
  if (!user.value || !ciudad) return
  await fetch('/api/weather/search', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: user.value.email, city: ciudad }),
  })
  obtenerHistorial()
}

/**
 * Función para obtener el historial de búsquedas del usuario.
 * Llama al backend y actualiza el estado `historial`.
 */
async function obtenerHistorial() {
  if (!user.value) return
  const resp = await fetch(`/api/weather/history/${user.value.email}`)
  if (resp.ok) {
    historial.value = await resp.json()
  }
}

// Al montar el componente principal, si ya hay usuario logueado, trae el historial.
onMounted(() => {
  if (user.value) obtenerHistorial()
})
</script>
