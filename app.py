from flask import Flask
from flask import render_template
from flask import request
from flask import session
from flask import redirect, url_for
from Models import db, CompanyProfile, StudentProfile, JobListing, StudentListing, StudentAuth
from flask import jsonify
app=Flask(__name__,template_folder = 'templates',static_folder='static')

#databse setup
app.config["SECRET_KEY"] = "YOUR-SECRET-KEY"
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///STARTIN_.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

#link database with Flask app
db.init_app(app)

@app.route('/STARTUP',methods = ["POST","GET"])
def index():
    company_id = session.get('company_id')
    if not company_id:
        return redirect(url_for('login'))
    company = CompanyProfile.query.get(company_id)
    if request.method == "GET":
        # Fetch all job listings
        job_listings = JobListing.query.all()
        # Fetch all students
        students = StudentProfile.query.all()
        return render_template('index_startup.html', jobs=job_listings, students=students)
    #handles job_posting
    elif request.method == "POST":
        print("in db")
        title_ = request.form['jobType']
        stipend_ = request.form['stipend']
        describe = request.form['description']
        requirements_ = request.form['requirements']
        jobtype=request.form['jobtype']

        job = JobListing(
            title = title_,
            description = describe,
            stipend = stipend_,
            requirements = requirements_,
            job_type = jobtype
        )
        db.session.add(job)
        db.session.commit()
        print(job.title)
        return render_template('index_startup.html',company=company)

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


@app.route('/', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        # LOGIN
        if 'login-btn' in request.form:
            # Student login
            email = request.form.get('email')
            password = request.form.get('password')
            
            # Company login
            company_name = request.form.get('companyName')
            company_password = request.form.get('companyPassword')

            if email and password:
                student = StudentAuth.query.filter_by(email=email).first()
                if student and student.password == password:
                    session['student_id'] = student.id
                    return redirect(url_for('index1'))
                else:
                    return render_template('index_login.html', error="Invalid student credentials")

            if company_name and company_password:
                company = CompanyProfile.query.filter_by(company_name=company_name).first()
                if company and company.comp_password == company_password:
                    session['company_id'] = company.id
                    return redirect(url_for('/STARTUP'))
                else:
                    return render_template('index_login.html', error="Invalid company credentials")

            return render_template('index_login.html', error="Please enter login details")

        # REGISTRATION
        elif 'register-btn' in request.form:
            # Student registration
            email = request.form.get('email')
            password = request.form.get('password')
            
            # Company registration
            company_name = request.form.get('companyName')
            company_password = request.form.get('companyPassword')
            company_description = request.form.get('companyDescription')
            company_website = request.form.get('companyWebsite')

            if email and password:
                existing = StudentAuth.query.filter_by(email=email).first()
                if existing:
                    return render_template('index_login.html', error="Student already exists")
                
                new_student = StudentAuth(email=email, password=password)
                db.session.add(new_student)
                db.session.commit()
                session['student_id'] = new_student.id
                return redirect(url_for('index1'))

            elif company_name and company_password:
                existing = CompanyProfile.query.filter_by(company_name=company_name).first()
                if existing:
                    return render_template('index_login.html', error="Company already exists")
                
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

            return render_template('index_login.html', error="Please enter registration details")

    return render_template('index_login.html')




@app.route('/logout')
def logout():
    session.clear()
    return redirect(url_for('login'))

if __name__== "__main__":
    with app.app_context():
        db.create_all()
        print("database created successfully")
    app.run(debug = True )
