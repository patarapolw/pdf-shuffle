from flask import render_template, send_file, request
import os
import json
from urllib.parse import unquote
import random

from . import app
from .util import list_pdf


@app.route('/')
def index():
    return render_template('index.html', config={
        'filename': os.getenv('FILENAME'),
        'start': json.loads(os.getenv('PAGE_START', '1')),
        'end': json.loads(os.getenv('PAGE_END', 'null')),
        'step': json.loads(os.getenv('PAGE_STEP', '1')),
        'random': json.loads(os.getenv('PAGE_RANDOM', '1'))
    })


@app.route('/file')
def send_pdf():
    filename = os.path.abspath(unquote(request.args.get('filename')))
    cache_timeout = None
    if os.path.isdir(filename):
        filename = random.choice(tuple(list_pdf(filename)))
        print(filename)
        cache_timeout = 0

    return send_file(filename, cache_timeout=cache_timeout)
