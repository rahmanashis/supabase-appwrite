# VPS Backend Hosting Lab with Coolify + React Control Panel

This is my **personal private playground repository** where I experiment with hosting backend applications on a VPS using **Coolify** and managing services through a **React application**.

> ⚠️ This repo is for learning, trying ideas, and exploration.  
> Setup may change frequently and may include unfinished or temporary code.

---

## 🚀 Project Goal

Build and manage a self-hosted backend environment that includes:

- VPS-hosted applications
- OS-level/server panel management via **Coolify**
- A **React dashboard/app** for monitoring and controlling services
- Integration and experiments with:
  - **Supabase**
  - **Appwrite** (assuming "apperite" = Appwrite)
  - **Reverse Proxy** (assuming "prevese porxy" = reverse proxy)
  - **PostgreSQL**
  - and other backend tools/services

---

## 🧪 What I’m Exploring

- Deploying containerized apps on a VPS
- Managing apps/services with Coolify
- Connecting frontend (React) with backend service health/status
- Authentication and access control for internal tooling
- Reverse proxy routing (domains/subdomains, SSL, traffic handling)
- Database setup and backups (PostgreSQL)
- Self-hosted alternatives for BaaS and internal platforms

---

## 🧱 Planned/Used Stack

- **Frontend:** React
- **Server/VPS:** Linux VPS (self-hosted)
- **Control Panel / PaaS Layer:** Coolify
- **Backend & Infra Services:**
  - Supabase
  - Appwrite
  - PostgreSQL
  - Reverse Proxy (Nginx/Traefik/Caddy depending on setup)
- **Containerization:** Docker / Docker Compose (as needed)

---

## 📁 Repository Nature

This is a **private personal lab** repo:
- Not production-ready
- No guaranteed stability
- Frequent refactors
- Experimental infrastructure and service integrations

---

## 🔐 Security Notes (Personal Checklist)

- Use strong SSH keys (disable password login if possible)
- Restrict open ports with firewall
- Keep Coolify and VPS packages updated
- Store secrets in environment variables (never hardcode)
- Enable automated backups for PostgreSQL and config files
- Use HTTPS/TLS for exposed services

---

## 🗺️ Roadmap (Draft)

- [ ] Initial VPS hardening and base setup
- [ ] Install and configure Coolify
- [ ] Deploy first backend service
- [ ] Add reverse proxy + domain routing
- [ ] Create React admin/monitoring UI
- [ ] Connect service metrics and health checks
- [ ] Add Supabase/Appwrite experiments
- [ ] Add automated backup/restore workflow
- [ ] Improve observability (logs, uptime, alerts)

---

## 📝 Notes

This project is intentionally flexible.  
I may break things, rebuild architecture, and compare different self-hosting approaches over time.

---

## 📌 License

Private repository — personal use and experimentation.
