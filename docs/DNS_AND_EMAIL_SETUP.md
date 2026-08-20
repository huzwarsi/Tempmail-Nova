# DNS & Email Server Setup (MX, SPF, DKIM, DMARC)

To receive real incoming emails from Gmail, Yahoo, Outlook, and external mail servers, your domain's DNS records must point correctly to your TempMail server IP address.

---

## 1. Required DNS Records Table

| Type | Host | Points To / Value | Priority | TTL |
| font | --- | --- | --- | --- |
| **A** | `mail.yourdomain.com` | `YOUR_SERVER_PUBLIC_IP` | - | 3600 |
| **MX** | `@` | `mail.yourdomain.com` | 10 | 3600 |
| **TXT** | `@` | `v=spf1 mx ip4:YOUR_SERVER_PUBLIC_IP ~all` | - | 3600 |
| **TXT** | `_dmarc` | `v=DMARC1; p=none; rua=mailto:admin@yourdomain.com` | - | 3600 |

---

## 2. MX Record Explanation

The **MX Record** tells global DNS servers where to deliver emails sent to `@yourdomain.com`.
When someone mails `test@yourdomain.com`:
1. Global DNS checks the MX record for `yourdomain.com`.
2. It resolves `mail.yourdomain.com` -> `YOUR_SERVER_PUBLIC_IP`.
3. It connects to Port 25 on `YOUR_SERVER_PUBLIC_IP`, where your Node.js `smtp-server` intake engine is listening!

---

## 3. Testing SMTP Intake Locally or Remotely

You can test email ingestion by opening a telnet/nc terminal to port 2525 (dev) or 25 (prod):

```bash
nc localhost 2525
```
Send commands:
```smtp
HELO example.com
MAIL FROM:<sender@example.com>
RCPT TO:<tmp_12345@tempmail.local>
DATA
Subject: Hello Disposable Mail Test!

This is a test message.
.
QUIT
```

You will immediately see the email parsed, saved in MongoDB, and pushed live via Socket.io to your React web UI!
