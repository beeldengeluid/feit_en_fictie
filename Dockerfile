FROM python:3.6

WORKDIR /feitfixie

COPY . .

RUN pip install pipenv

RUN pipenv install --system

CMD [ "pipenv", "run", "./run-production" ]