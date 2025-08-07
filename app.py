from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_login import LoginManager, UserMixin, login_user, logout_user, login_required, current_user
from werkzeug.security import generate_password_hash, check_password_hash
from functools import wraps

app = Flask(__name__)
app.config['SECRET_KEY'] = 'your-secret-key-change-in-production'
app.config['CORS_HEADERS'] = 'Content-Type'
app.config['PORT'] = 5001
CORS(app, supports_credentials=True)

login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'

ROLES = {
    'admin': {
        'permissions': ['manage_users', 'view_all_data', 'configure_settings', 'create_content', 'edit_content', 'view_content']
    },
    'editor': {
        'permissions': ['create_content', 'edit_content', 'view_content']
    },
    'viewer': {
        'permissions': ['view_content']
    }
}

USERS = {
    'admin@example.com': {
        'password': generate_password_hash('admin123'),
        'role': 'admin',
        'name': 'Admin User'
    },
    'editor@example.com': {
        'password': generate_password_hash('editor123'),
        'role': 'editor',
        'name': 'Editor User'
    },
    'viewer@example.com': {
        'password': generate_password_hash('viewer123'),
        'role': 'viewer',
        'name': 'Viewer User'
    }
}

CONTENT = [
    {'id': 1, 'title': 'Public Article 1', 'content': 'This is public content', 'author': 'admin@example.com', 'is_public': True},
    {'id': 2, 'title': 'Protected Article 1', 'content': 'This is protected content', 'author': 'editor@example.com', 'is_public': False},
    {'id': 3, 'title': 'Admin Article', 'content': 'This is admin content', 'author': 'admin@example.com', 'is_public': False}
]

class User(UserMixin):
    def __init__(self, email, role, name):
        self.id = email
        self.email = email
        self.role = role
        self.name = name

    def has_permission(self, permission):
        return permission in ROLES.get(self.role, {}).get('permissions', [])

@login_manager.user_loader
def load_user(user_id):
    if user_id in USERS:
        user_data = USERS[user_id]
        return User(user_id, user_data['role'], user_data['name'])
    return None

def require_permission(permission):
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            if not current_user.is_authenticated:
                return jsonify({'error': 'Authentication required'}), 401
            if not current_user.has_permission(permission):
                return jsonify({'error': 'Permission denied'}), 403
            return f(*args, **kwargs)
        return decorated_function
    return decorator

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    
    if email in USERS and check_password_hash(USERS[email]['password'], password):
        user = User(email, USERS[email]['role'], USERS[email]['name'])
        login_user(user)
        return jsonify({
            'success': True,
            'user': {
                'email': user.email,
                'role': user.role,
                'name': user.name,
                'permissions': ROLES[user.role]['permissions']
            }
        })
    
    return jsonify({'error': 'Invalid credentials'}), 401

@app.route('/api/logout', methods=['POST'])
@login_required
def logout():
    logout_user()
    return jsonify({'success': True})

@app.route('/api/user', methods=['GET'])
def get_current_user():
    if current_user.is_authenticated:
        return jsonify({
            'email': current_user.email,
            'role': current_user.role,
            'name': current_user.name,
            'permissions': ROLES[current_user.role]['permissions']
        })
    return jsonify({'user': None})

@app.route('/api/content', methods=['GET'])
@login_required
def get_content():
    if current_user.has_permission('view_all_data'):
        return jsonify({'content': CONTENT})
    elif current_user.has_permission('view_content'):
        visible_content = [item for item in CONTENT if item['is_public'] or item['author'] == current_user.email]
        return jsonify({'content': visible_content})
    else:
        return jsonify({'content': []})

@app.route('/api/content', methods=['POST'])
@require_permission('create_content')
def create_content():
    data = request.get_json()
    new_content = {
        'id': len(CONTENT) + 1,
        'title': data.get('title'),
        'content': data.get('content'),
        'author': current_user.email,
        'is_public': data.get('is_public', False)
    }
    CONTENT.append(new_content)
    return jsonify({'success': True, 'content': new_content})

@app.route('/api/content/<int:content_id>', methods=['PUT'])
@require_permission('edit_content')
def update_content(content_id):
    data = request.get_json()
    content_item = next((item for item in CONTENT if item['id'] == content_id), None)
    
    if not content_item:
        return jsonify({'error': 'Content not found'}), 404
    
    if not current_user.has_permission('view_all_data') and content_item['author'] != current_user.email:
        return jsonify({'error': 'Permission denied'}), 403
    
    content_item['title'] = data.get('title', content_item['title'])
    content_item['content'] = data.get('content', content_item['content'])
    content_item['is_public'] = data.get('is_public', content_item['is_public'])
    
    return jsonify({'success': True, 'content': content_item})

@app.route('/api/users', methods=['GET'])
@require_permission('manage_users')
def get_users():
    users_list = []
    for email, user_data in USERS.items():
        users_list.append({
            'email': email,
            'name': user_data['name'],
            'role': user_data['role']
        })
    return jsonify({'users': users_list})

@app.route('/api/admin/stats', methods=['GET'])
@require_permission('view_all_data')
def get_admin_stats():
    return jsonify({
        'total_users': len(USERS),
        'total_content': len(CONTENT),
        'public_content': len([c for c in CONTENT if c['is_public']]),
        'private_content': len([c for c in CONTENT if not c['is_public']])
    })

@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Not found'}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({'error': 'Internal server error'}), 500

if __name__ == '__main__':
    app.run(debug=False, port=app.config['PORT'])
