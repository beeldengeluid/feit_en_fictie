from flask import Flask, render_template
import argparse

app = Flask(__name__)
app.config.from_object('settings.Config')

@app.route('/')
def home():
	return render_template('index.html',
	   VIDEO_BASE_URL = app.config['VIDEO_BASE_URL'],
	   AUDIO_BASE_URL = app.config['AUDIO_BASE_URL'],
	   PROXY_BASE_URL = app.config['PROXY_BASE_URL']
	)

def main():
    parser = argparse.ArgumentParser(description = "Feit en fictie server")

    parser.add_argument(
        '-e', '--env', default="production",
        help="Environment we're running in", choices=('production', 'development')
    )

    parser.add_argument(
        '-d', '--dev', action="store_true",
        help="Sets environment to development"
    )

    parser.add_argument('--host', default=app.config['APP_HOST'])
    parser.add_argument('--port', default=app.config['APP_PORT'])
    args = parser.parse_args()

    app.env = args.env

    # Setting environment to development implies running in debug mode
    if app.env == "development" or args.dev:
        app.debug = True

    app.run(
        host = args.host,
        port = args.port
    )

if __name__ == '__main__':
    main()