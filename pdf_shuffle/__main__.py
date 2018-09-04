import click
import os

from . import init


@click.command()
@click.argument('filename')
@click.option('--start', default=1, envvar='PAGE_START')
@click.option('--end', default=None, envvar='PAGE_END')
@click.option('--step', default=1, envvar='PAGE_STEP')
@click.option('--random/--no-random', default=True, envvar='PAGE_RANDOM')
@click.option('--host', default='localhost', envvar='HOST')
@click.option('--port', default=5000, envvar='PORT')
def pdf_shuffle(filename, start, end, step, random, host, port):
    init(filename, start, end, step, random, host, port)


def pdf_quiz():
    os.environ.update({
        'PAGE_START': '2',
        'PAGE_STEP': '2'
    })
    pdf_shuffle()
