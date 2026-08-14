# VITMATE password reset setup

The reset flow is now:
email -> 6-digit code -> verify -> new password.

The backend uses Nodemailer SMTP. Copy `.env.example` to `.env` and configure:

- `EMAIL_HOST`
- `EMAIL_PORT`
- `EMAIL_SECURE`
- `EMAIL_USER`
- `EMAIL_PASS`
- `EMAIL_FROM`

Then run `npm install` in `backend/` so the new Nodemailer dependency is installed.

The verification code is stored only as a bcrypt hash, expires after 10 minutes, and is limited to five verification attempts per issued code.
