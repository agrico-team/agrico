from flask import Flask, render_template, url_for, redirect

from controllers.auth_controller import auth_bp
from controllers.product_controller import products_bp
from controllers.service_controller import services_bp
from controllers.order_controller import orders_bp
from controllers.reservation_controller import reservations_bp

app = Flask(__name__)

app.register_blueprint(auth_bp)
app.register_blueprint(products_bp)
app.register_blueprint(services_bp)
app.register_blueprint(orders_bp)
app.register_blueprint(reservations_bp)


@app.get('/home')
@app.get('/')
def home_page():
    return render_template('index.html', style=url_for('static', filename='style.css'))


@app.get('/<page>')
def other_page(page):
    if page not in ('/home', '/'):
        return render_template('other.html', style=url_for('static', filename='style.css'), dummy_page_name=page)
    return redirect(url_for('home_page'))


if __name__ == '__main__':
    app.run(debug=True)
