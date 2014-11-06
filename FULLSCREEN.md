# How to auto start Chrome in Full Screen Mode (F11)

### To auto start Chrome in Full Screen Mode every time, follow the steps below:

1. Right click on any of your Google Chrome icon and select “Properties”
2. Copy the value in the “Target”, it should be something like this:
  * "C:\Users\techiecorner\AppData\Local\Google\Chrome\Application\chrome.exe" 
3. Now Create a shortcut in your Desktop. Right click on Desktop and choose “Create Shortcut”
4. Paste the value in the “Location of the item” and add “–kiosk http://www.google.com” behind the value. So it should end up like this:
  * "C:\Users\techiecorner\AppData\Local\Google\Chrome\Application\chrome.exe" --kiosk http://www.google.com 
5. And, click “Next” till finish
6. Now u can try to double click on the shortcut you just created and it should now auto start Chrome (Google.com) in Full Screen Mode

In order to start Chrome every time my PC start, i copy this shortcut and paste it into my “Startup” folder (Start -> Program -> Startup)

Restart your computer and you will see Chrome will auto start in Full Screen Mode