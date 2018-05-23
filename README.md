# Feit en Fictie

## Installation
* Check out this repository into a fresh directory
* Copy the `settings-example.py` file in `src` to `settings.py` and change the values
* Create a virtual environment to run it. We recommend you use [`pipenv`](https://docs.pipenv.org/):
```python
    pipenv install
```
This will create a new virtual environment using Python 3.6 and install the required packages.
* You need to install the frontend packages by using `npm`, simply do
```bash
    npm install
```
In the root of the project.
* There are two shell scripts you can use to run either a production or a dev server: `run-dev` and `run-production` in the root of this folder. To run those together with `pipenv` you can do two things, either:
```bash
    pipenv shell
    ./run-dev
```
Or
```bash
    pipenv run ./run-dev
```