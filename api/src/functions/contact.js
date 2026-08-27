/*
 * POST /api/contact — send the site contact form as an email via SendGrid.
 *
 * Required app settings (Azure Static Web App → Configuration):
 *   SENDGRID_API_KEY   SendGrid API key with Mail Send permission
 *   CONTACT_TO_EMAIL   recipient inbox (defaults to saheedfaremi@gmail.com)
 *   CONTACT_FROM_EMAIL verified sender identity in SendGrid
 *
 * Behaviour contract:
 *   - honeypot field filled → 200 { ok: true } (bots think they won)
 *   - invalid payload       → 400
 *   - service not configured → 503 (frontend falls back to mailto)
 *   - SendGrid failure      → 502 (frontend falls back to mailto)
 */
import { app } from '@azure/functions';

const SENDGRID_ENDPOINT = 'https://api.sendgrid.com/v3/mail/send';
const MAX = { name: 120, email: 254, message: 5000 };
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function json(status, body) {
	return { status, jsonBody: body };
}

function clean(value, max) {
	if (typeof value !== 'string') return '';
	return value.trim().slice(0, max);
}

app.http('contact', {
	methods: ['POST'],
	authLevel: 'anonymous',
	handler: async (request) => {
		let body;
		try {
			body = await request.json();
		} catch {
			return json(400, { ok: false, error: 'Invalid request body.' });
		}

		// Honeypot: hidden field humans never fill.
		if (body?.website) return json(200, { ok: true });

		const name = clean(body?.name, MAX.name);
		const email = clean(body?.email, MAX.email);
		const message = clean(body?.message, MAX.message);

		if (!name || !EMAIL_RE.test(email) || message.length < 10) {
			return json(400, { ok: false, error: 'Name, a valid email, and a message are required.' });
		}

		const apiKey = process.env.SENDGRID_API_KEY;
		const to = process.env.CONTACT_TO_EMAIL || 'saheedfaremi@gmail.com';
		const from = process.env.CONTACT_FROM_EMAIL || to;
		if (!apiKey) {
			return json(503, { ok: false, error: 'Email service is not configured.' });
		}

		const res = await fetch(SENDGRID_ENDPOINT, {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${apiKey}`,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				personalizations: [{ to: [{ email: to }] }],
				from: { email: from, name: 'saheedfaremi.com contact form' },
				reply_to: { email, name },
				subject: `Site contact: ${name}`,
				content: [
					{
						type: 'text/plain',
						value: `From: ${name} <${email}>\n\n${message}`
					}
				]
			})
		});

		if (!res.ok) {
			return json(502, { ok: false, error: 'Email delivery failed.' });
		}
		return json(200, { ok: true });
	}
});
