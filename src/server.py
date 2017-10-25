from flask import Flask, render_template

app = Flask(__name__)
app.config.from_object('settings.Config')
app.debug = app.config['DEBUG']

@app.route('/')
def home():
	return render_template('index.html')

if __name__ == '__main__':
	app.run(host=app.config['APP_HOST'], port=app.config['APP_PORT'])