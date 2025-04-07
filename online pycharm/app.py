import os
import subprocess
from flask import Flask, render_template, request, jsonify, send_from_directory, redirect, url_for
from werkzeug.utils import secure_filename

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = 'user_files/images'
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max upload
app.secret_key = 'your-secret-key-here'

# Ensure directories exist
os.makedirs('user_files/projects', exist_ok=True)
os.makedirs('user_files/images', exist_ok=True)


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/files')
def list_files():
    files = []
    for filename in os.listdir('user_files/projects'):
        if filename.endswith('.py'):
            filepath = os.path.join('user_files/projects', filename)
            with open(filepath, 'r') as f:
                content = f.read()
            files.append({
                'name': filename,
                'content': content,
                'size': os.path.getsize(filepath),
                'lines': len(content.split('\n')),
                'chars': len(content)
            })
    return jsonify(files)


@app.route('/save', methods=['POST'])
def save_file():
    data = request.json
    filename = secure_filename(data['filename'])
    if not filename.endswith('.py'):
        filename += '.py'

    filepath = os.path.join('user_files/projects', filename)

    with open(filepath, 'w') as f:
        f.write(data['content'])

    return jsonify({
        'status': 'success',
        'message': f'File {filename} saved successfully',
        'filename': filename
    })


@app.route('/delete/<filename>', methods=['DELETE'])
def delete_file(filename):
    filename = secure_filename(filename)
    filepath = os.path.join('user_files/projects', filename)

    if os.path.exists(filepath):
        os.remove(filepath)
        return jsonify({'status': 'success', 'message': f'File {filename} deleted'})
    return jsonify({'status': 'error', 'message': 'File not found'}), 404


@app.route('/run', methods=['POST'])
def run_code():
    data = request.json
    code = data['code']
    input_data = data.get('input', '')

    try:
        # Create a temporary file to run
        with open('temp_runner.py', 'w') as f:
            f.write(code)

        # Execute the code with input
        process = subprocess.Popen(
            ['python', 'temp_runner.py'],
            stdin=subprocess.PIPE,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True
        )

        stdout, stderr = process.communicate(input=input_data)

        # Clean up
        if os.path.exists('temp_runner.py'):
            os.remove('temp_runner.py')

        return jsonify({
            'output': stdout,
            'error': stderr,
            'status': 'success' if not stderr else 'error'
        })

    except Exception as e:
        return jsonify({
            'error': str(e),
            'status': 'error'
        })


@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'status': 'error', 'message': 'No file part'}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({'status': 'error', 'message': 'No selected file'}), 400

    if file:
        filename = secure_filename(file.filename)
        file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
        return jsonify({
            'status': 'success',
            'message': 'File uploaded successfully',
            'filename': filename
        })


@app.route('/images')
def list_images():
    images = []
    for filename in os.listdir(app.config['UPLOAD_FOLDER']):
        images.append({
            'name': filename,
            'url': url_for('uploaded_file', filename=filename)
        })
    return jsonify(images)


@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)


if __name__ == '__main__':
    app.run(debug=True)