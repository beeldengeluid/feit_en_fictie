# Feit en Fictie

## Installation
* Check out this repository into a fresh directory
* Copy the `settings-example.py` file in `src` to `settings.py` and change the values
* Create a virtual environment to run it. We recommend you use [`pipenv`](https://docs.pipenv.org/):
```python
    pipenv install -r requirements.txt --python 3.6
    pipenv shell
```
This will create a new virtual environment using Python 3.6, install the required packages and run a shell.
* There are two shell scripts you can use to run either a production or a dev server: `run-dev` and `run-production` in the root of this folder