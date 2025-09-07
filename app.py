from flask import Flask
from flask import render_template
from flask import request
from flask import session
from flask import redirect, url_for
from Models import db, CompanyProfile, StudentProfile, JobListing, StudentListing, StudentAuth
from werkzeug.security import generate_password_hash, check_password_hash

from flask import jsonify
app=Flask(__name__,template_folder = 'templates',static_folder='static')

#databse setup
app.config["SECRET_KEY"] = "YOUR-SECRET-KEY"
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///STARTIN_.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

#link database with Flask app
db.init_app(app)

@app.route('/STARTUP', methods=["POST", "GET"])
def index():
    company_id = session.get('company_id')
    if not company_id:
        return redirect(url_for('login_company'))  # redirect to company login if not logged in

    company = CompanyProfile.query.get(company_id)
    if not company:
        session.clear()
        return redirect(url_for('login_company'))

    if request.method == "GET":
        # Fetch jobs only for this company
        job_listings = JobListing.query.filter_by(company_id=company.id).all()
        students = StudentProfile.query.all()
        return render_template('index_startup.html', company=company, jobs=job_listings, students=students)

    elif request.method == "POST":
        title_ = request.form['jobType']
        stipend_ = request.form['stipend']
        describe = request.form['description']
        requirements_ = request.form['requirements']
        jobtype = request.form['jobtype']

        # Make sure JobListing model has company_id column
        job = JobListing(
            title=title_,
            description=describe,
            stipend=stipend_,
            requirements=requirements_,
            job_type=jobtype,
            company_id=company.id
        )
        db.session.add(job)
        db.session.commit()

        job_listings = JobListing.query.filter_by(company_id=company.id).all()
        students = StudentProfile.query.all()
        return render_template('index_startup.html', company=company, jobs=job_listings, students=students)


@app.route('/STUDENT')
def index1():
    student_id = session.get('student_id')
    if not student_id:
        return redirect(url_for('login'))
    student = StudentAuth.query.get(student_id)
    job_listing = JobListing.query.all()

    return render_template('index_student.html',jobs=job_listing,student=student)



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
            "job_type": job.job_type
        }
        for job in jobs
    ]
    return jsonify(jobs_data)

@app.route('/student/profile', methods=["GET", "POST"])
def profile():
    student_id = session.get('student_id')
    if not student_id:
        return redirect(url_for('login'))

    profile = StudentProfile.query.filter_by(student_id=student_id).first()

    if request.method == "POST":
        name_ = request.form['studentName']
        rollnumber_ = request.form['rollNumber']
        aboutme_ = request.form['aboutMe']
        skillset_ = request.form['skillset']
        github_ = request.form['github']
        linkedin_ = request.form['linkedin']
        portfolio_ = request.form['portfolio']
        resume_ = request.form.get('resume')  # ⚠️ implement file upload later

        if profile:
            # Update existing profile
            profile.name = name_
            profile.college_roll = rollnumber_
            profile.about = aboutme_
            profile.skillset = skillset_
            profile.github = github_
            profile.linkedin = linkedin_
            profile.portfolio = portfolio_
            profile.resume = resume_
        else:
            # Create new profile
            profile = StudentProfile(
                student_id=student_id,
                name=name_,
                college_roll=rollnumber_,
                about=aboutme_,
                skillset=skillset_,
                github=github_,
                linkedin=linkedin_,
                portfolio=portfolio_,
                resume=resume_
            )
            db.session.add(profile)

        db.session.commit()
        return redirect(url_for('index1'))

    return render_template('profile_student.html', profile=profile)


@app.route('/')
def landing():
    return render_template('landing.html')



# ==========================
# Student Login/Registration
# ==========================
@app.route('/login/student', methods=['GET', 'POST'])
def login_student():
    if request.method == 'POST':
        email = request.form.get('email')
        password = request.form.get('password')

        if email and password:
            student = StudentAuth.query.filter_by(email=email).first()
            if student and student.password == password:
                session['student_id'] = student.id
                return redirect(url_for('index1'))  # Student dashboard
            else:
                return render_template('login_student.html', error="Invalid student credentials")
        else:
            return render_template('login_student.html', error="Please enter your login details")

    return render_template('login_student.html')


# ==========================
# Company Login/Registration
# ==========================
@app.route('/login/company', methods=['GET', 'POST'])
def login_company():
    if request.method == 'POST':
        company_name = request.form.get('companyName')
        company_password = request.form.get('companyPassword')
        company_description = request.form.get('companyDescription')
        company_website = request.form.get('companyWebsite')
        register_mode = request.form.get('register')  # "0" or "1"

        # Login mode
        if company_name and company_password and register_mode == "0":
            company = CompanyProfile.query.filter_by(company_name=company_name).first()
            if company and company.comp_password == company_password:
                session['company_id'] = company.id
                return redirect(url_for('index'))
            else:
                return render_template('login_company.html', error="Invalid company credentials")

        # Registration mode
        elif company_name and company_password and register_mode == "1":
            existing = CompanyProfile.query.filter_by(company_name=company_name).first()
            if existing:
                return render_template('login_company.html', error="Company already exists")

            new_company = CompanyProfile(
                company_name=company_name,
                comp_password=company_password,
                description=company_description,
                website=company_website
            )
            db.session.add(new_company)
            db.session.commit()
            session['company_id'] = new_company.id
            return redirect(url_for('index'))

    return render_template('login_company.html')






@app.route('/logout')
def logout():
    session.clear()
    return redirect(url_for('landing'))

if __name__== "__main__":
    with app.app_context():
        db.create_all()
        print("database created successfully")
    app.run(debug = True )
