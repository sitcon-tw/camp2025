import pandas as pd
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from jinja2 import Template

# === Config ===
SMTP_SERVER = "smtp.gmail.com"
SMTP_PORT = 587
GMAIL_USERNAME = "elvismao.070512@gmail.com"
GMAIL_PASSWORD = ""
SENDER_NAME = "毛哥EM - SITCON Camp 資訊組組長"
REPLY_TO = "info@elvismao.com"
EMAIL_SUBJECT = "，準備好你在 SITCON Camp 的冒險了嗎？"

# === Load Template ===
with open("template.html", "r", encoding="utf-8") as f:
    template_str = f.read()
template = Template(template_str)

# === Load CSV ===
df = pd.read_csv("students.csv")

# === Send Emails ===
server = smtplib.SMTP(SMTP_SERVER, SMTP_PORT)
server.starttls()
server.login(GMAIL_USERNAME, GMAIL_PASSWORD)

for index, row in df.iterrows():
    name, email, code, team = row['name'], row['email'], row['id'], row['team']
    html_body = template.render(name=name, code=code, team=team)

    msg = MIMEMultipart()
    msg['From'] = f"{SENDER_NAME} <{REPLY_TO}>"
    msg['To'] = email
    msg['Subject'] = name + EMAIL_SUBJECT
    msg.add_header('Reply-To', REPLY_TO)

    msg.attach(MIMEText(html_body, 'html'))

    try:
        server.send_message(msg)
        print(f"✅ Sent to {name} <{email}>")
    except Exception as e:
        print(f"❌ Failed to send to {email}: {e}")

server.quit()
