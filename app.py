from flask import (Flask, 
                   render_template, 
                   url_for, 
                   redirect)

app = Flask(__name__)

@app.get('/home')
@app.get('/')
def home_page():
    with app.test_request_context():
        print('Home Page')
    return render_template('index.html', style=url_for('static', filename='style.css'))

@app.get('/<page>')
def other_page(page):
    with app.test_request_context():
        print('Other Page')
    if page not in ('/home', '/'):
        return render_template('other.html', style=url_for('static', filename='style.css'), dummy_page_name=page)
    return redirect(url_for('home_page'))