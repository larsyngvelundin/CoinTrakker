from flask import Flask, render_template, Response, request
import math
import random

app = Flask(__name__)

my_variable = "<span>0</span>"

@app.route('/set_test')
def set_test():
    global my_variable
    my_variable += f"<span>{random.randint(3,10)}</span>"
    print(f"Set the variable to {my_variable}")
    return "success"

@app.route('/get_test')
def get_test():
    return str(my_variable)

@app.route('/fps')
def fps():
    print ('we are calling')
    the_answer = random.randint(25, 60)
    return (str(the_answer))

@app.route('/')
def index():
    """Video streaming home page."""
    return render_template('./index.html')

if __name__ == '__main__':
    app.run(debug=True, port=4567)