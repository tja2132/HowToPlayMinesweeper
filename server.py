from flask import Flask
from flask import render_template, redirect, url_for
from flask import Response, request, jsonify
from datetime import datetime
import json
app = Flask(__name__)

#load lesson data globally
lessons = open('./static/lessons.json', encoding="utf8")
data = json.load(lessons)
lessons.close()

def get_data_by_id(id):
    global data
    for d in data:
        if str(d['id']) == id:
            return d
    return "That ID does not exist"

def log_visit(route_name):
    with open('visit_log.txt', 'a') as log:
        log.write(f"{route_name} visited at {datetime.now()}\n")

# ROUTES
@app.route('/')
def render_home():
   log_visit('Home')
   return render_template('home.html')   

@app.route('/start')
def start_lesson():
   log_visit('Start')
   return redirect(url_for('render_lesson', id=1))

@app.route('/learn/<id>', methods=['GET', 'POST'])
def render_lesson(id):
    result = get_data_by_id(id)
    log_visit(f'Learn {id}')
    return render_template('learn.html', result=result, id=id)  

@app.route('/quiz/<id>', methods=['GET', 'POST'])
def render_quiz(id):
    result = get_data_by_id(id)
    log_visit(f'Quiz {id}')
    return render_template('quiz.html', result=result, id=id)  

@app.route('/play', methods=['GET', 'POST'])
def render_play():
    log_visit(f'Play')
    return render_template('play.html')  

if __name__ == '__main__':
   app.run(debug = True)




