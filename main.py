from ascii_magic import AsciiArt    
import os
import google.generativeai as genai
from rich.markdown import Markdown
from rich.console import Console
import PIL.Image
import requests
from io import BytesIO
Api_Key = os.environ.get('GOOGLE_GENERATIVE_AI_API_KEY')
genai.configure(api_key=Api_Key)
model = genai.GenerativeModel('gemini-1.5-flash')
chat = model.start_chat()
console = Console()
def commands(inp):
    if inp == '> exit':
        exit()
    elif inp == '> clear':
        os.system('cls' if os.name == 'nt' else 'clear')
        return True
    elif inp.startswith('> image'):
        url = inp.split(' ')[2]
        query = ' '.join(inp.split(' ')[3:])
        response = requests.get(url) if url.startswith('http') else None
        img = PIL.Image.open(BytesIO(response.content)  if url.startswith('http') else url)
        imageAscii =   AsciiArt.from_pillow_image(img)
        imageAscii.to_terminal(columns=150)
        response = chat.send_message([query, img])
        console.print(Markdown(f"AI: {response.text}"))
        return True
    elif inp == '> help':
        print('Commands:')
        print('> exit: Exit the program')
        print('> clear: Clear the screen')
        print('> help: Show this message')
        print('> image <url> <query>: Generate text from an image')
        return True
    else:
        return False
while True:
    user_input = input('You: ')
    if commands(user_input):
        continue
    response = chat.send_message(user_input)
    console.print(Markdown(f"AI: {response.text}"))