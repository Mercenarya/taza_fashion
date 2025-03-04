import flask
import os
from flask import Flask, url_for, redirect, render_template, request
import mysql.connector

app = flask.Flask(__name__)
app.secret_key = "thebois"



if __name__ == "__main__":
    app.run(debug=True)