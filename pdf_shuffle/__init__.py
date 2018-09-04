from flask import Flask
import os
import json

app = Flask(__name__)

from .views import index, send_pdf
from .util import open_browser_tab


def init(filename, start=1, end=None, step=1, random=True, host='localhost', port=5000):
    """

    :param filename:
    :param start:
    :param end:
    :param step:
    :param bool|list|tuple random:
    :param host:
    :param port:
    :return:
    """
    os.environ.update({
        'FILENAME': filename,
        'PAGE_START': str(start),
        'PAGE_END': json.dumps(end),
        'PAGE_STEP': str(step),
        'PAGE_RANDOM': json.dumps(random),
        'HOST': host,
        'PORT': str(port)
    })

    open_browser_tab('http://{}:{}/'.format(os.getenv('HOST'), os.getenv('PORT')))
    app.run(host=os.getenv('HOST'), port=os.getenv('PORT'))


def init_quiz(filename, start=2, end=None, step=2, random=True, host='localhost', port=5000):
    """

    :param filename:
    :param start:
    :param end:
    :param step:
    :param bool|list|tuple random:
    :param host:
    :param port:
    :return:
    """
    init(filename, start, end, step, random, host, port)
