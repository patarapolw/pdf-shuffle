import webbrowser
from threading import Thread
from time import sleep
import os


def open_browser_tab(url):
    def _open_tab():
        sleep(1)
        webbrowser.open_new_tab(url)

    thread = Thread(target=_open_tab)
    thread.daemon = True
    thread.start()


def list_pdf(path):
    for (dirpath, dirnames, filenames) in os.walk(path):
        for filename in filenames:
            if os.path.splitext(filename)[1].lower() == '.pdf' and filename[0] != '.':
                yield os.path.join(dirpath, filename)
