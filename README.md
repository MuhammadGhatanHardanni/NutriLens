# NutriSnap - Sistem Deteksi Gizi & Kalori Makanan

Aplikasi web untuk mendeteksi kandungan gizi makanan dari foto menggunakan Image Recognition API.

## 🧑‍💻 Tim Pengembang

| Role | Nama |
|---|---|
| Project Manager | Muhammad Rio Aprilianto |
| System Analyst | Daffansyah Arya Hakim |
| Frontend Developer | Muhammad Ghatan Hardanni |
| Backend & API Engineer | Radiva Galih Nofriyanto |
| Database Administrator | Zhidane Prabowo Guzlend |
| Quality Assurance | Muhammad Rayhan Ramadhan |

## 🛠️ Tech Stack

- **Frontend:** React.js + Vite + Tailwind CSS
- **Backend:** Node.js + Express.js
- **Database:** PostgreSQL + Prisma ORM
- **Image Recognition:** Logmeal API
- **Nutrition Data:** Edamam API

## 🚀 Cara Menjalankan

### Backend
```bash
cd backend
cp .env.example .env   # isi API keys
npm install
npm run db:migrate
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## 📁 Struktur Folder

```
Project_Manpro/
├── frontend/          # React.js app
│   └── src/
│       ├── components/
│       ├── pages/
│       └── services/
├── backend/           # Node.js + Express API
│   └── src/
│       ├── routes/
│       ├── controllers/
│       ├── services/
│       └── middleware/
└── README.md
```

