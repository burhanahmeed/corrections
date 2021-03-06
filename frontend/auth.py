from datetime import datetime, timedelta
from functools import wraps

from flask import Blueprint, make_response, redirect, request
from flask_awscognito import AWSCognitoAuthentication

from app import app

aws_auth = AWSCognitoAuthentication(app)

auth_blueprint = Blueprint('auth', __name__,
                           template_folder='templates')


def ensure_signin(view):
    @ wraps(view)
    def decorated(*args, **kwargs):
        access_token = request.cookies.get("access_token")
        if access_token == None:
            return redirect("/sign_in")

        return view(access_token, *args, **kwargs)

    return decorated


@auth_blueprint.route("/sign_in")
def sign_in():
    return redirect(aws_auth.get_sign_in_url())


@auth_blueprint.route("/logout")
def logout():
    response = make_response(redirect("/"))
    response.set_cookie("username", "", expires=0)
    response.set_cookie("access_token", "", expires=0)
    return response


@auth_blueprint.route("/aws_cognito_redirect")
def aws_cognito_redirect():
    access_token = aws_auth.get_access_token(request.args)
    aws_auth.token_service.verify(access_token)

    response = make_response(redirect("/"))
    expires = datetime.utcnow() + timedelta(minutes=10)
    response.set_cookie(
        "username",
        aws_auth.token_service.claims["username"],
        expires=expires,
        httponly=True,
    )
    response.set_cookie("access_token", access_token,
                        expires=expires, httponly=True)
    return response
