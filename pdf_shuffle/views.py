from flask import render_template, send_file, request
import os
import json
from urllib.parse import unquote

from . import app


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
    return send_file(os.path.abspath(unquote(request.args.get('filename'))))
