from flask import Flask
from flask import render_template, redirect, url_for
from flask import Response, request, jsonify
import json
app = Flask(__name__)

#load pokedex data globally
dex = open('./static/pokedex.json', encoding="utf8")
data = json.load(dex)
dex.close()

# ROUTES
@app.route('/')
def render_welcome():
   return render_template('home.html')   

@app.route('/view/<id>', methods=['GET', 'POST'])
def render_view(id):
    global data
    r = "That ID does not exist"
    for d in data:
        if str(d['id']) == id:
            r = d
            break

    return render_template('view.html', id=id, result=r)  

@app.route('/get_featured', methods=['GET', 'POST'])
def get_featured():
    global data
    ids = request.get_json()

    # Ensure ids is a list, if not, convert it to a list
    if not isinstance(ids, list):
        ids = [ids]
    featured_pokemon = []

    str_ids = [str(id) for id in ids]

    for d in data:
        if str(d['id']) in str_ids:
            featured_pokemon.append(d)

    return jsonify(featured_pokemon)

# AJAX FUNCTIONS
@app.route('/search', methods=['GET', 'POST'])
def search():
    global data
    search_string = request.get_json().strip().lower()
    #if string is contained in the name of a pokemon, return that pokemon's ID and name in a list
    r = []
    for d in data:
        if search_string in str(d['id']):
            r.append(d)
        elif search_string in (d['name']['english'].lower()):
            r.append(d)
        elif search_string in (d['species'].lower()):
            r.append(d)
        else:
            for t in d['type']:
                if search_string in t.lower():
                    r.append(d)

    return jsonify(r)


@app.route('/add', methods=['GET', 'POST'])
def render_add():
    global data
    if request.method == 'POST':
        new_id = max([pokemon['id'] for pokemon in data], default=0) + 1
        new_pokemon = {
            'id': new_id,  # Automatically assign a new unique ID
            'name': {'english': request.form['nameEnglish']},
            'species': request.form['species'],
            'type': request.form['types'].split(', '),
            'description': request.form['description'],
            'image': {'hires': 'https://raw.githubusercontent.com/Purukitto/pokemon-data.json/master/images/pokedex/hires/001.png'},
            'profile': {
                'height': request.form['height'],
                'weight': request.form['weight'],
                'egg': request.form['eggGroups'].split(', '),
                'ability': [tuple(ability.strip().rsplit(' ', 1)) for ability in request.form['abilities'].split(', ')],
                'gender': request.form['genderRatio']
            }
        }

        data.append(new_pokemon)

        return jsonify({'id': new_id, 'message': 'New item successfully created.'})

    # method == 'GET'
    return render_template('add.html')
            

@app.route('/edit/<id>', methods=['GET', 'POST'])
def render_edit(id):
    global data
    if request.method == 'POST':
        for i, d in enumerate(data):
            if str(d['id']) == id:
                data[i]['name']['english'] = request.form['nameEnglish']
                data[i]['species'] = request.form['species']       
                data[i]['type'] = request.form['types'].split(', ') 
                data[i]['description'] = request.form['description']
                if 'profile' not in data[i]:
                    data[i]['profile'] = {}
                data[i]['profile']['height'] = request.form['height']
                data[i]['profile']['weight'] = request.form['weight']  
                data[i]['profile']['egg'] = request.form['eggGroups'].split(', ')
                abilities_raw = request.form['abilities'].split(', ')
                abilities_processed = [tuple(ability.strip().rsplit(' ', 1)) for ability in abilities_raw]  
                data[i]['profile']['ability'] = abilities_processed
                data[i]['profile']['gender'] = request.form['genderRatio']
                r = data[i]
                break

        # Redirect back to view the new data
        return redirect(url_for('render_view', id=id))

    # method == 'GET'
    pokemon_data = next((d for d in data if str(d['id']) == id), "That ID does not exist")
    return render_template('edit.html', id=id, result=pokemon_data)

if __name__ == '__main__':
   app.run(debug = True)




