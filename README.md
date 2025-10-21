# 🧑‍💼 Person Manager Backend

Person Manager CRUD app built with node js + typescript

---

### 🧩 Install Dependencies

```sh
# Using pnpm (recommended)
pnpm install

# Or using npm
npm install

```

### Configure Environment Variables

---

You must create a .env file before running the project. There is a **_.env.sample_** for reference. Create the .env file at the root of this project

### Run The App

```sh
npm run dev
```

---

## 🛠️ Building the Project

To create production builds, run:

```sh
npm run build

# Minify build (Optional)
npm run minify

```

---

## 🌐 Preview Project

After building, you can preview the production version locally:

```sh
npm run preview
```

### Deployment

To deploy the backend, navigate to the backend root directory and run it as a standard Node.js project.  
For example, using **PM2**:

```sh
pm2 start dist/plain-js/index.js --name person-backend
```

---

## 📦 Tech Stack

Node, Express.js + MongoDB + TypeScript

## 📄 License

This project is licensed under the **MIT License** — feel free to use and modify it for your own learning or projects.
