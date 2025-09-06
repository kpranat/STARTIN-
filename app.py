from flask import Flask
from flask import render_template
import requests
app=Flask(__name__,template_folder = 'templates',static_folder='static')

@app.route('/STARTUP',methods = ["POST","GET"])
def index():
    if requests.method == "GET" :
        return render_template('index_startup.html')
    elif requests.method == "POST":
        





if __name__== "__main__":
    app.run(debug = True )
