import express from 'express';
import path from 'path';

const app = express();
const PORT = 3000;

// Раздаем статические файлы из папки delivery/client
app.use(express.static(path.join(process.cwd(), 'delivery', 'client')));

// Добавим тестовый маршрут
app.get('/api/test', (req, res) => {
    res.json({ message: 'API работает' });
});

app.listen(PORT, () => {
    console.log(`🚀 Сервер запущен на http://localhost:${PORT}`);
    console.log(`📁 Статика из: ${path.join(process.cwd(), 'delivery', 'client')}`);
});