from flask import Flask, jsonify

app = Flask(__name__)

@app.route("/world")
def hello_world():
    return jsonify({"about":"<h1>Hello, Worlddd !</h1>"})

# we need this if we want to run the application via python command.
if __name__ == "__main__":
    app.run(debug=True)
