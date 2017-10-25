from flask import Flask, render_template

app = Flask(__name__)
app.config.from_object('settings.Config')
app.debug = app.config['DEBUG']

@app.route('/')
def home():
	return render_template('index.html',
		v=app.config['VIDEO_BASE_URL'],
		a=app.config['AUDIO_BASE_URL'],
		p=app.config['PROXY_BASE_URL']
	)

if __name__ == '__main__':
	app.run(host=app.config['APP_HOST'], port=app.config['APP_PORT'])