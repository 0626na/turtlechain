#!/usr/bin/env python3
import sys
import smtplib
from email.mime.text import MIMEText
from datetime import datetime, timezone, timedelta

env = sys.argv[1] if len(sys.argv) > 1 else "dev"
if env != "production":
    env = "dev"

now = datetime.now(timezone(timedelta(hours=9))).strftime("%Y-%m-%d %p %I:%M:%S (KST)")
dev_mails = ["engineering@turtleship.onmicrosoft.com"]
mail_from = "noreply@turtlechain.io"
subject = "백오피스 배포알림({})".format(env)
body = "백오피스({}) 배포되었습니다.\n현재시각 : {}".format(env, now)

msg = MIMEText(body)
msg['From'] = mail_from
msg['To'] = ",".join(dev_mails)
msg['Subject'] = subject

server = smtplib.SMTP_SSL()
server.connect('13.124.121.176', 587)
server.login('mailuser', 'Turtleship2017!')
server.set_debuglevel(1)

try:
  server.sendmail(mail_from, dev_mails, msg.as_string())
finally:
  server.quit()
