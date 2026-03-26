# Secrets Management Guide

## 🔒 Overview

This project follows **zero-trust secrets management** - meaning NO secrets are ever committed to git. All sensitive information is managed through environment variables.

## ✅ Protected Files (in .gitignore)

These files are **automatically ignored** by git and will never be committed:

```
backend/.env                           # Backend environment variables
backend/src/main/resources/application-secrets.yml
frontend/.env                          # Frontend environment variables
```

### Current .gitignore Configuration
```gitignore
# Secrets
backend/.env
backend/src/main/resources/application-secrets.yml
frontend/.env
```

**Status**: ✅ **PROPERLY CONFIGURED**

---

## 📋 Setup Instructions

### Backend Setup

#### Step 1: Create .env File
```bash
cd backend
cp .env.example .env
```

#### Step 2: Edit .env with Real Values
```bash
# Edit backend/.env and add your actual secrets:

SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/smartcampus
SPRING_DATASOURCE_USERNAME=postgres
SPRING_DATASOURCE_PASSWORD=your_actual_secure_password

GOOGLE_CLIENT_ID=your_actual_google_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_actual_google_client_secret
GOOGLE_REDIRECT_URI=http://localhost:8080/login/oauth2/code/google

FRONTEND_URL=http://localhost:3000
```

#### Step 3: Verify .env is NOT tracked
```bash
git status
# .env should NOT appear in the output
```

### Frontend Setup

#### Step 1: Create .env File
```bash
cd frontend
cp .env.example .env
```

#### Step 2: Edit .env (Usually No Secrets Needed)
```bash
# Frontend .env typically only needs non-sensitive configuration:

VITE_FRONTEND_URL=http://localhost:3000
VITE_API_BASE_URL=http://localhost:8080
```

⚠️ **WARNING**: Never add API keys, secrets, or sensitive data to frontend .env files - they are exposed to the browser!

---

## 🚀 Running the Project

### Backend
```bash
cd backend
mvn spring-boot:run
```
Spring Boot loads variables from `.env` → `application.yml` → `application-secrets.yml`

### Frontend
```bash
cd frontend
npm run dev
```
Vite loads variables from `.env` with `VITE_` prefix

---

## 📝 Configuration Files (Safe to Commit)

These files **ARE** committed to git and contain NO secrets:

### ✅ application.yml
Uses environment variable placeholders:
```yaml
spring:
  datasource:
    url: ${SPRING_DATASOURCE_URL}
    username: ${SPRING_DATASOURCE_USERNAME}
    password: ${SPRING_DATASOURCE_PASSWORD}
  security:
    oauth2:
      client:
        registration:
          google:
            client-id: ${GOOGLE_CLIENT_ID}
            client-secret: ${GOOGLE_CLIENT_SECRET}
```

### ✅ .env.example Files
Template files showing what variables are needed:
- `backend/.env.example` - Backend template
- `frontend/.env.example` - Frontend template

**These are safe to commit** because they contain placeholder values, not real secrets.

---

## ⚠️ Important Rules

### DO ✅
- ✅ Create `.env` files locally
- ✅ Use environment variables in `.env` files
- ✅ Reference variables in `application.yml` using `${VAR_NAME}`
- ✅ Add `.env` to `.gitignore`
- ✅ Share `.env.example` templates with team
- ✅ Keep secrets in `.github/workflows/` secrets for CI/CD

### DON'T ❌
- ❌ Never commit `.env` files
- ❌ Never add real secrets to `.example` files
- ❌ Never hardcode secrets in code
- ❌ Never add credentials to `application.yml`
- ❌ Never expose secrets in comments (even commented-out)
- ❌ Never share `.env` files via email or Slack

---

## 🔍 Pre-Commit Verification

Before making a pull request, verify no secrets are leaked:

```bash
# Check what will be committed
git diff --cached

# Look for these patterns - they should NOT appear:
# - GOOGLE_CLIENT_SECRET=abc123
# - SPRING_DATASOURCE_PASSWORD=password
# - Any actual API keys or credentials

# If secrets are staged, unstage them:
git reset HEAD <file>
```

---

## 🚨 Emergency: Secrets Accidentally Committed?

If secrets are accidentally committed:

1. **Immediately rotate the secrets** (especially API keys)
2. **Force push to remove from history** (if on private repo):
```bash
git log --oneline  # Find commit with secrets
git rebase -i <commit-before-secret>  # Remove the commit
git push -f origin branch-name
```
3. **Open an issue to regenerate** all exposed credentials
4. **Re-commit without secrets** in a new commit

---

## 📦 Deployment Secrets (CI/CD)

For GitHub Actions or other CI/CD pipelines:

### GitHub Actions
1. Go to: **Settings → Secrets and variables → Actions**
2. Add secrets:
   - `SPRING_DATASOURCE_PASSWORD`
   - `GOOGLE_CLIENT_SECRET`
   - Other sensitive vars
3. Reference in workflow: `${{ secrets.GOOGLE_CLIENT_SECRET }}`

### Docker/Kubernetes
Use secret management tools:
- Docker: `docker run -e GOOGLE_CLIENT_SECRET=...`
- Kubernetes: `kubectl create secret generic app-secrets ...`
- HashiCorp Vault, AWS Secrets Manager, etc.

---

## ✨ Current Status

| Component | Status | Details |
|-----------|--------|---------|
| .gitignore | ✅ | backend/.env, frontend/.env properly ignored |
| application.yml | ✅ | Uses environment variables, no hard-coded secrets |
| .env files | ✅ | Never created/committed (as expected) |
| Examples | ✅ | .example files contain safe templates |
| application-secrets.yml | ✅ | Properly ignored, doesn't contain real data |

---

## 📚 References

- [Spring Boot External Configuration](https://spring.io/guides/gs/spring-boot-docker/)
- [12-Factor App: Environment Variables](https://12factor.net/config)
- [OWASP: Secrets Management](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html)
- [GitHub: Managing Sensitive Data](https://docs.github.com/en/actions/security-guides/using-secrets-in-github-actions)

---

**Last Updated**: March 22, 2026  
**Maintainer**: Smart Campus Team
