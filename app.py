from flask import Flask, render_template, request, session, redirect, url_for, jsonify
from Models import db, CompanyProfile, StudentProfile, JobListing, StudentListing, StudentAuth
from werkzeug.security import generate_password_hash, check_password_hash
import os
from werkzeug.utils import secure_filename

# Get the absolute path of the directory where this file is located
basedir = os.path.abspath(os.path.dirname(__file__))

app = Flask(__name__, template_folder='templates', static_folder='static')

# Allowed file extensions for resumes
ALLOWED_EXTENSIONS = {'pdf', 'doc', 'docx'}

# --- Configuration ---
# Set a strong, random secret key
app.config["SECRET_KEY"] = "replace-this-with-a-real-secret-key-please"

# Configure the database path to be in an 'instance' folder
instance_path = os.path.join(basedir, 'instance')
os.makedirs(instance_path, exist_ok=True)
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///" + os.path.join(instance_path, 'STARTIN_.db')
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

# Configure the upload folder for resumes
upload_folder_path = os.path.join(basedir, 'static', 'uploads', 'resumes')
os.makedirs(upload_folder_path, exist_ok=True)
app.config['UPLOAD_FOLDER'] = upload_folder_path

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

db.init_app(app)

# ==========================
# Company Dashboard
# ==========================
@app.route('/STARTUP', methods=["POST", "GET"])
def index():
    company_id = session.get('company_id')
    if not company_id:
        return redirect(url_for('login_company'))

    company = CompanyProfile.query.get(company_id)
    if not company:
        session.clear()
        return redirect(url_for('login_company'))

    if request.method == "GET":
        job_listings = JobListing.query.filter_by(company_id=company.id).all()

        # ✅ Get student applications for this company's jobs
        job_ids = [job.id for job in job_listings]
        applications = StudentListing.query.join(StudentProfile).filter(
            StudentListing.requirements.in_([job.title for job in job_listings])
        ).all()

        # Extract unique students
        student_ids = {app.student_id for app in applications}
        students = StudentProfile.query.filter(StudentProfile.id.in_(student_ids)).all()

        return render_template('index_startup.html', company=company, jobs=job_listings, students=students)

    elif request.method == "POST":
        title_ = request.form['jobType']
        stipend_ = request.form['stipend']
        describe = request.form['description']
        requirements_ = request.form['requirements']
        jobtype = request.form['jobtype']

        job = JobListing(
            title=title_,
            description=describe,
            stipend=stipend_,
            requirements=requirements_,
            job_type=jobtype,
            company_id=company.id,
            company_name=company.company_name
        )
        db.session.add(job)
        db.session.commit()

        return redirect(url_for('index'))


# ==========================
# Student Dashboard
# ==========================
@app.route('/STUDENT')
def index1():
    student_id = session.get('student_id')
    if not student_id:
        return redirect(url_for('login_student'))
    student = StudentAuth.query.get(student_id)
    job_listing = JobListing.query.all()
    return render_template('index_student.html', jobs=job_listing, student=student)

# ==========================
# API for Jobs
# ==========================
@app.route('/api/jobs')
def api_jobs():
    jobs = JobListing.query.all()
    jobs_data = [
        {
            "id": job.id,
            "title": job.title,
            "description": job.description,
            "stipend": job.stipend,
            "requirements": job.requirements,
            "job_type": job.job_type,
            "company_name":job.company_name
        }
        for job in jobs
    ]
    return jsonify(jobs_data)

# ==========================
# Student Profile
# ==========================
@app.route('/student/profile', methods=["GET", "POST"])
def profile():
    student_id = session.get('student_id')
    if not student_id:
        return redirect(url_for('login_student'))

    profile = StudentProfile.query.filter_by(student_id=student_id).first()

    if request.method == "POST":
        name_ = request.form['studentName']
        rollnumber_ = request.form['rollNumber']
        aboutme_ = request.form['aboutMe']
        skillset_ = request.form['skillset']
        github_ = request.form['github']
        linkedin_ = request.form['linkedin']
        portfolio_ = request.form['portfolio']

        # Handle resume file upload
        resume_file = request.files.get('resume')
        resume_path = profile.resume if profile else None  # keep existing if not uploading new
        if resume_file and allowed_file(resume_file.filename):
            filename = secure_filename(f"{student_id}_{resume_file.filename}")
            # The UPLOAD_FOLDER is already an absolute path, so we save directly to it
            resume_file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
            # Store a path that is relative to the 'static' directory for use with url_for
            resume_path = os.path.join('uploads', 'resumes', filename)

        if profile:
            profile.name = name_
            profile.college_roll = rollnumber_
            profile.about = aboutme_
            profile.skillset = skillset_
            profile.github = github_
            profile.linkedin = linkedin_
            profile.portfolio = portfolio_
            profile.resume = resume_path
        else:
            profile = StudentProfile(
                student_id=student_id,
                name=name_,
                college_roll=rollnumber_,
                about=aboutme_,
                skillset=skillset_,
                github=github_,
                linkedin=linkedin_,
                portfolio=portfolio_,
                resume=resume_path
            )
            db.session.add(profile)

        db.session.commit()
        return redirect(url_for('index1'))

    return render_template('profile_student.html', profile=profile)

# ==========================
# Landing Page
# ==========================
@app.route('/')
def landing():
    return render_template('landing.html')

# ==========================
# Student Registration/Login
# ==========================
@app.route('/login/student', methods=['GET', 'POST'])
def login_student():
    if request.method == 'POST':
        email = request.form.get('email')
        password = request.form.get('password')
        register_mode = request.form.get('register')  # "0" = login, "1" = register

        # Registration
        if register_mode == "1" and email and password:
            existing = StudentAuth.query.filter_by(email=email).first()
            if existing:
                return render_template('login_student.html', error="Student already exists")
            hashed_password = generate_password_hash(password)
            new_student = StudentAuth(email=email, password=hashed_password)
            db.session.add(new_student)
            db.session.commit()
            session['student_id'] = new_student.id
            return redirect(url_for('index1'))

        # Login
        elif register_mode == "0" and email and password:
            student = StudentAuth.query.filter_by(email=email).first()
            if student and check_password_hash(student.password, password):
                session['student_id'] = student.id
                return redirect(url_for('index1'))
            else:
                return render_template('login_student.html', error="Invalid credentials")
        else:
            return render_template('login_student.html', error="Enter all fields")

    return render_template('login_student.html')

# ==========================
# Company Registration/Login
# ==========================
@app.route('/login/company', methods=['GET', 'POST'])
def login_company():
    if request.method == 'POST':
        company_name = request.form.get('companyName')
        company_password = request.form.get('companyPassword')
        company_description = request.form.get('companyDescription')
        company_website = request.form.get('companyWebsite')
        register_mode = request.form.get('register')  # "0" = login, "1" = register

        # ----------------------
        # Registration
        # ----------------------
        if register_mode == "1" and company_name and company_password:
            existing = CompanyProfile.query.filter_by(company_name=company_name).first()
            if existing:
                return render_template('login_company.html', error="Company already exists")

            hashed_password = generate_password_hash(company_password)
            new_company = CompanyProfile(
                company_name=company_name,
                comp_password=hashed_password,
                description=company_description,
                website=company_website
            )

            # Add the company to DB
            db.session.add(new_company)
            db.session.commit()  # Commit to get new_company.id

            session['company_id'] = new_company.id
            return redirect(url_for('index'))

        # ----------------------
        # Login
        # ----------------------
        elif register_mode == "0" and company_name and company_password:
            company = CompanyProfile.query.filter_by(company_name=company_name).first()
            if company and check_password_hash(company.comp_password, company_password):
                session['company_id'] = company.id
                return redirect(url_for('index'))
            else:
                return render_template('login_company.html', error="Invalid credentials")

    return render_template('login_company.html')

# ==========================
# Logout (works for both)
# ==========================
@app.route('/logout')
def logout():
    session.clear()
    return redirect(url_for('landing'))

# ==========================
# Apply for Job (Student)
# ==========================
@app.route("/api/apply", methods=["POST"])
def apply_job():
    if "student_id" not in session:
        return jsonify({"success": False, "message": "Not logged in"}), 401

    data = request.get_json()
    job_id = data.get("job_id")

    # Fetch student ID from session
    student_id = session["student_id"]

    # Get the job being applied for
    job = JobListing.query.get(job_id)
    if not job:
        return jsonify({"success": False, "message": "Job not found"}), 404

    # ✅ Check if the student already applied for this job
    existing_application = StudentListing.query.filter_by(
        student_id=student_id, requirements=job.title
    ).first()

    if existing_application:
        return jsonify({"success": False, "message": "You already applied for this job."}), 400

    # Create a new application
    new_application = StudentListing(
        student_id=student_id,
        requirements=job.title   # storing job title as requirement
    )
    db.session.add(new_application)
    db.session.commit()

    return jsonify({"success": True, "message": f"Application submitted for {job.title}!"})




# ==========================
# Run App
# ==========================
if __name__ == "__main__":
    with app.app_context():
        db.create_all()
        print("Database created successfully")
    app.run(debug=True)
