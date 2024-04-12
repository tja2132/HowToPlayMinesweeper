from flask import Flask
from flask import render_template, redirect, url_for
from flask import Response, request, jsonify
import json
app = Flask(__name__)

#load lesson data globally
lessons = open('./static/lessons.json', encoding="utf8")
data = json.load(lessons)
lessons.close()

# ROUTES
@app.route('/')
def render_home():
   return render_template('home.html')   

@app.route('/learn/<id>', methods=['GET', 'POST'])
def render_lesson(id):
    global data
    r = "That ID does not exist"
    for d in data:
        if str(d['id']) == id:
            r = d
            print('rendering', r)
            break

    return render_template('learn.html', result=r, id=id)  

@app.route('/quiz/<id>', methods=['GET', 'POST'])
def render_quiz(id):
    global data
    r = "That ID does not exist"
    for d in data:
        if str(d['id']) == id:
            r = d
            break

    return render_template('quiz.html', result=r, id=id)  



if __name__ == '__main__':
   app.run(debug = True)




