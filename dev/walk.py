import os


def do_walk(mypath):
    for (dirpath, dirnames, filenames) in os.walk(mypath):
        for filename in filenames:
            if os.path.splitext(filename)[1].lower() == '.pdf':
                yield os.path.join(dirpath, filename)


if __name__ == '__main__':
    print(list(do_walk('/Users/patarapolw/Desktop')))
