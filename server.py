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

current_id = 1
quiz_component = 1
pages_visited = []

def get_data_by_id(id):
    global data
    for d in data:
        if str(d['id']) == id:
            return d
    return "That ID does not exist"

def log_activity(logtext, logtype=None):
    with open('log.txt', 'a') as log:
        if logtype == 'visit':
            global pages_visited
            if logtext not in pages_visited:
                log.write(f"{datetime.now()} {logtext} visited \n")
            pages_visited.append(logtext)
        elif logtype == 'quiz_result':
            log.write(f"\tQuiz result: {logtext} \n")
        else:
            log.write(f"{datetime.now()} {logtext}\n")


# ROUTES
@app.route('/')
def render_home():
   log_activity('Home', 'visit')
   return render_template('home.html')   

@app.route('/start')
def start_lesson():
   return redirect(url_for('render_lesson', id=1))

@app.route('/current_lesson')
def current_lesson():
   global current_id
   return redirect(url_for('render_lesson', id=current_id))

@app.route('/next_lesson')
def next_lesson():
   global current_id
   global quiz_component
   if current_id == 5:
        return redirect(url_for('render_play'))
   else:
        current_id += 1
        # reset quiz component for next lesson
        quiz_component = 1
        return redirect(url_for('render_lesson', id=current_id))

@app.route('/next_quiz_component')
def next_quiz_component():
   global current_id
   global quiz_component
   quiz_component += 1
   return redirect(url_for('render_quiz', id=current_id, component=quiz_component))

@app.route('/learn/<id>', methods=['GET', 'POST'])
def render_lesson(id):
    result = get_data_by_id(id)
    if current_id > 1:
        log_activity(f'Quiz {current_id-1} completed')
    log_activity(f'Learn/{id}', 'visit')
    return render_template('learn.html', result=result, id=id)  

@app.route('/quiz/<id>/<component>', methods=['GET', 'POST'])
def render_quiz(id, component):
    result = get_data_by_id(id)
    global quiz_component
    if quiz_component > 1:
        log_activity(f'Quiz {id} component {quiz_component} visit')
    else:
        log_activity(f'Quiz {id} started')
    return render_template('quiz.html', result=result, id=id, component=component)  

@app.route('/play', methods=['GET', 'POST'])
def render_play():
    log_activity(f'Play page', 'visit')
    return render_template('play.html')  

@app.route('/quiz_result', methods=['GET', 'POST'])
def log_quiz_result(request):
    if request.method == 'POST':
        log_string = request.get_json().strip().lower()
        print('QUIZ RESULT RECEIVED')
        print(log_string)
        log_activity(log_string, 'quiz_result')

if __name__ == '__main__':
   app.run(debug = True)




