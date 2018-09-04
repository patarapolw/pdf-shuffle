# pdf-shuffle

A PDF page/image randomizer, or flashcard quiz from a PDF.

## Installation

```
$ pip install pdf-shuffle
```

## Usage

pdf-shuffle comes with 2 CLI applications:

```
$ pdf-shuffle --help
Usage: pdf-shuffle [OPTIONS] FILENAME

Options:
  --start INTEGER
  --end TEXT
  --step INTEGER
  --random / --no-random
  --host TEXT
  --port INTEGER
  --help                  Show this message and exit.
$ pdf-shuffle test.pdf
```

And,

```
$ pdf-quiz --help
Usage: pdf-quiz [OPTIONS] FILENAME

Options:
  --start INTEGER
  --end TEXT
  --step INTEGER
  --random / --no-random
  --host TEXT
  --port INTEGER
  --help                  Show this message and exit.
$ pdf-quiz quiz.pdf
```

Of course, you can invoke the app from a Python script as well.

```python
from pdf_shuffle import init
init('test.pdf')
```

Or,

```python
from pdf_shuffle import init_quiz
init_quiz('quiz.pdf')
```

## Advanced usage

By default, `quiz.pdf` means, excluding the first slide, every first and second slides are front of the card and back of the card, respectively. You can change that, with:

```python
import os, json
os.environ['PAGE_RANDOM'] = json.dumps([2, 3, 5, 9, 12])
```

## Spaced-repetition system (SRS)

If you are looking into extending the app with SRS, you might try, [srs-sqlite](https://github.com/patarapolw/srs-sqlite), which I currently use.
