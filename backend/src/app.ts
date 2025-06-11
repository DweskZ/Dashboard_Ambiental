import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "path";
import { AppDataSource } from "./data-source"; 
import authRoutes from "./routes/authRoutes";
import weatherRoutes from "./routes/weatherRoutes";


const app = express();
const PORT = process.env.PORT ?? 3000;

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/weather", weatherRoutes);

// Servir archivos estáticos del frontend compilado
app.use(express.static(path.join(__dirname, "public")));

// Ruta de fallback para aplicaciones SPA
app.get("*", (_req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// rutas (luego las importas aquí)
// app.use('/api/auth', authRoutes)

AppDataSource.initialize()
  .then(() => {
    console.log("📦 Base de datos conectada");
    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    });
  })
  .catch((error) => console.error("❌ Error al conectar DB", error));
