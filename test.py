import google.generativeai as genai
import os
from winpty import PtyProcess

# Configurar la API de Google Generative AI
Api_Key = os.environ.get('GOOGLE_GENERATIVE_AI_API_KEY')
genai.configure(api_key=Api_Key)
model = genai.GenerativeModel('gemini-1.5-flash', system_instruction='eres una pseudo terminal, tienes que interpretar lengua natural y transformarlo a comandos de sistema')

chat = model.start_chat()
proc = PtyProcess.spawn('cmd')
while True:
    user_input = input('You: ')
    response = chat.send_message(user_input)
    command = response.text.replace('```', '').strip()
    print(command)
    # proc.write(f'{command}\r\n')
    # print(proc.read())
