---
title: AI-assisted Farmer Call Center
domain: agriculture
status: published
featured: true
role: Team engineer, Eswatini representative
tech:
  - Python
  - Voice AI
  - Twilio
summary: Automated voice-response system letting farmers report issues via phone, SMS, or web and receive AI-routed answers.
highlights:
  - UNESCO India-Africa Hackathon 2022 winner of problem statement AGRI12
  - Team "Geeks_on_Fire", five countries, Eswatini representative
  - Gold medals and ₹3 lakh prize
tags:
  - voice-ai
  - agriculture
  - unesco-india-africa-2022
---

The problem statement asked for a voice-first interface so smallholder farmers
without smartphones or stable data could report issues (pest sightings, crop
disease, weather questions) by calling, texting, or visiting a simple web form.
The system replies in the farmer's language with appropriate guidance,
escalating to human experts when the model is uncertain.

Solution sketch:

- **Inbound layer.** Twilio (or local PSTN gateway) accepts calls and SMS; web form mirrored.
- **Speech-to-text.** Local-language ASR, fallback to English.
- **Reasoning layer.** Classification and retrieval over an agricultural-extension knowledge base.
- **Outbound layer.** TTS reply by phone; SMS or notification on web.

Outcome: AGRI12 winners. See the
[UNESCO India-Africa 2022 award](/awards/unesco-india-africa-2022) page for the
full team roster, prize details, and source citation.
