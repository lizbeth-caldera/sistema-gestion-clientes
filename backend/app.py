from flask import Flask
from flask_cors import CORS
from controllers.cliente_controller import cliente_bp
from controllers.auth_controller import auth_bp, jwt
from datetime import timedelta

app = Flask(__name__)
app.config['JWT_SECRET_KEY'] = 'Cambia_Esto'  # reemplaza en producción
app.config["JWT_ACCESS_TOKEN_EXPIRES"]  = timedelta(minutes=15)
app.config["JWT_REFRESH_TOKEN_EXPIRES"] = timedelta(days=30)

CORS(app)
jwt.init_app(app)

app.register_blueprint(cliente_bp)
app.register_blueprint(auth_bp)

if __name__ == '__main__':
    app.run(debug=True)








