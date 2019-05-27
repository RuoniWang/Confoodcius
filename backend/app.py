from flask import Flask
from flask import request
from watson_developer_cloud import VisualRecognitionV3

import json

app = Flask(__name__)

@app.route('/')
def main():
    return 'Welcome to Confoodcious\' API'

@app.route('/upload', methods=['POST'])
def upload():
    if request.method == 'POST':
        print(request)
        data = request.data
        filename = json.loads(data)['food']
        print(filename)
        visual_recognition = VisualRecognitionV3(
            '2018-03-19',
            iam_apikey='PDH9x2MwWgNl0BJfIuDO5VuOfNaqNAxyawnvFNc_YFNr')

        with open(filename, 'rb') as images_file:
            classes = visual_recognition.classify(
                images_file,
                threshold='0.6',
        	classifier_ids='DefaultCustomModel_267056391').get_result()
        print(json.dumps(classes, indent=2))
        return (json.dumps(classes, indent=2))

    else:
        return("error")

if __name__ == '__main__':
    app.run(host='localhost', debug=True)