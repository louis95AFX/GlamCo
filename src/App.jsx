import { useEffect, useRef, useState } from "react";
import "./App.css";

const courses = [
  {
    title: "Beauty therapy",
    category: "beauty",
    label: "Beauty foundations",
    description:
      "Build your foundation in beauty care with professional knowledge and practical learning.",
  },
  {
    title: "Microblading",
    category: "beauty",
    label: "Brows & detail",
    description:
      "Explore the artistry of brows and develop precise skills through theory and hands-on training.",
  },
  {
    title: "Skin tag removal",
    category: "aesthetics",
    label: "Specialised training",
    description:
      "Explore this specialised treatment area within our beauty and aesthetics training offering.",
  },
  {
    title: "Stretch mark treatments",
    category: "aesthetics",
    label: "Skin & confidence",
    description:
      "Develop your knowledge of targeted treatments and professional client care.",
  },
  {
    title: "Lipo injections",
    category: "aesthetics",
    label: "Aesthetic education",
    description:
      "Explore specialist aesthetic education with a focus on professional knowledge and responsible practice.",
  },
  {
    title: "Specialised beauty services",
    category: "aesthetics",
    label: "Keep growing",
    description:
      "Explore more opportunities to grow your knowledge and broaden your beauty skill set.",
  },
];

const faqs = [
  {
    question: "What can I study at Glam Co Academy?",
    answer:
      "Our training areas include beauty therapy, microblading, skin tag removal, stretch mark treatments, lipo injections, and other specialised beauty services.",
  },
  {
    question: "Will my training include practical learning?",
    answer:
      "Yes. Our courses combine professional theory with hands-on practical training, helping you build knowledge and confidence together.",
  },
  {
    question: "Can I use my skills to build a business?",
    answer:
      "Entrepreneurship is central to our mission. Many graduates establish their own beauty businesses. Your next steps depend on your training and the professional requirements for the services you plan to offer.",
  },
  {
    question: "How do I choose the right course?",
    answer:
      "Start with the skills you are most interested in and the clients you hope to serve. Confirm course content, entry requirements, fees, and dates with the academy before enrolling.",
  },
];

function Brand() {
  return (
    <a className="brand" href="#home" aria-label="Glam Co Academy home">
      <span>GLAM CO<span className="brand-dot">.</span></span>
      <small>ACADEMY</small>
    </a>
  );
}

function CourseDialog({ course, onClose }) {
  const dialogRef = useRef(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (course && !dialog.open) dialog.showModal();
    else if (!course && dialog.open) dialog.close();
  }, [course]);

  function handleBackdropClick(event) {
    if (event.target !== event.currentTarget) return;

    const bounds = event.currentTarget.getBoundingClientRect();

    if (
      event.clientX < bounds.left ||
      event.clientX > bounds.right ||
      event.clientY < bounds.top ||
      event.clientY > bounds.bottom
    ) {
      event.currentTarget.close();
    }
  }

  return (
    <dialog
      ref={dialogRef}
      className="course-dialog"
      aria-labelledby="course-dialog-title"
      onClose={onClose}
      onClick={handleBackdropClick}
    >
      <button
        className="dialog-close"
        aria-label="Close course details"
        onClick={() => dialogRef.current.close()}
      >
        ×
      </button>

      {course && (
        <>
          <p className="eyebrow">GLAM CO ACADEMY / TRAINING</p>
          <h2 id="course-dialog-title">{course.title}</h2>
          <p>{course.description}</p>

          <div className="dialog-details">
            <p>
              <strong>Our approach</strong><br />
              Professional theory and hands-on practical training in a
              supportive learning environment.
            </p>
            <p>
              <strong>Before you enrol</strong><br />
              Confirm course content, entry requirements, fees, dates, and
              professional scope with the academy.
            </p>
          </div>

          <button
            className="button button-dark"
            onClick={() => dialogRef.current.close()}
          >
            Continue exploring
          </button>
        </>
      )}
    </dialog>
  );
}

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [filter, setFilter] = useState("all");
  const [selectedCourse, setSelectedCourse] = useState(null);

  const visibleCourses = courses.filter(
    (course) => filter === "all" || course.category === filter
  );

  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>

      <header className="site-header" id="home">
        <Brand />
        <button
          className="menu-toggle"
          aria-expanded={menuOpen}
          aria-controls="main-navigation"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? "Close" : "Menu"}
        </button>

        <nav
          id="main-navigation"
          className={`navigation ${menuOpen ? "is-open" : ""}`}
          aria-label="Main navigation"
          onClick={(event) => {
            if (event.target.closest("a")) setMenuOpen(false);
          }}
        >
          <a href="#about">Our academy</a>
          <a href="#courses">Our courses</a>
          <a href="#mission">Our mission</a>
          <a href="#journey">Your journey</a>
          <a className="nav-button" href="#courses">Explore training</a>
        </nav>
      </header>

      <main id="main">
        <section className="hero">
          <div className="hero-copy">
            <p className="eyebrow">BEAUTY EDUCATION. REAL POSSIBILITIES.</p>
            <h1>
              Your passion.<br />
              Your skill.<br />
              <em>Your future.</em>
            </h1>
            <p className="hero-intro">
              Welcome to Glam Co Academy, where beauty meets skill,
              confidence, and opportunity.
            </p>
            <div className="hero-actions">
              <a className="button button-gold" href="#courses">
                Discover our courses
              </a>
              <a className="text-link" href="#about">Meet the academy</a>
            </div>
            <div className="hero-note">
              <span />
              <p>Professional theory.<br />Hands-on practical training.</p>
            </div>
          </div>

          <div className="hero-photo">
            <img
              src="/images/graduates.png"
              alt="Glam Co Academy graduates celebrating with their certificates"
              fetchPriority="high"
            />
            <div className="photo-caption">
              <span>A NEW CHAPTER STARTS HERE</span>
              <p>Learn. Grow. Become.</p>
            </div>
          </div>
        </section>

        <div className="values-strip">
          <span>Practical skills</span><span aria-hidden="true">✦</span>
          <span>Professional knowledge</span><span aria-hidden="true">✦</span>
          <span>Lasting confidence</span><span aria-hidden="true">✦</span>
          <span>Entrepreneurial spirit</span>
        </div>

        <section className="section about" id="about">
          <div>
            <p className="eyebrow">01 / OUR ACADEMY</p>
            <h2>More than a skill.<br /><em>A beginning.</em></h2>
          </div>
          <div className="body-copy">
            <p className="lead">
              Founded with a passion for beauty and a vision to empower individuals.
            </p>
            <p>
              Glam Co Academy is a professional beauty training academy dedicated
              to equipping aspiring beauty professionals with practical skills,
              knowledge, and confidence to build successful careers in the beauty industry.
            </p>
            <p>
              Our courses combine professional theory with hands-on practical
              training, ensuring that students leave the academy feeling
              confident and ready to serve their own clients.
            </p>
            <a className="text-link" href="#mission">Discover what drives us</a>
          </div>
        </section>

        <section className="section courses" id="courses">
          <div className="section-heading">
            <div>
              <p className="eyebrow">02 / EXPLORE YOUR POSSIBILITIES</p>
              <h2>Skills that open<br /><em>new doors.</em></h2>
            </div>
            <p>
              From beauty foundations to specialised treatments, discover a
              training area that speaks to your ambition.
            </p>
          </div>

          <div className="course-filters" role="group" aria-label="Filter training areas">
            {[
              ["all", "All training"],
              ["beauty", "Beauty & brows"],
              ["aesthetics", "Specialised aesthetics"],
            ].map(([value, label]) => (
              <button
                key={value}
                className={filter === value ? "active" : ""}
                aria-pressed={filter === value}
                onClick={() => setFilter(value)}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="course-grid">
            {visibleCourses.map((course) => (
              <article className="course-card" key={course.title}>
                <span className="course-number">
                  {String(courses.indexOf(course) + 1).padStart(2, "0")}
                </span>
                <p className="eyebrow">{course.label}</p>
                <h3>{course.title}</h3>
                <p className="course-description">{course.description}</p>
                <button
                  className="course-link"
                  aria-label={`View ${course.title} training details`}
                  onClick={() => setSelectedCourse(course)}
                >
                  View training area
                </button>
              </article>
            ))}
          </div>

          <p className="course-note">
            Course-specific entry requirements, fees, schedules, and professional
            scope are confirmed with the academy before enrolment.
          </p>
        </section>

        <section className="section mission" id="mission">
          <p className="eyebrow">03 / OUR MISSION</p>
          <h2>Transforming lives<br />through <em>beauty education.</em></h2>
          <div className="mission-content">
            <span className="mission-symbol" aria-hidden="true">✦</span>
            <div>
              <p className="lead">
                A beauty skill can be the beginning of financial independence,
                entrepreneurship, and a new chapter in life.
              </p>
              <p>
                We are committed to creating a supportive learning environment
                where every student has the opportunity to learn, grow, and
                discover their potential.
              </p>
            </div>
          </div>
        </section>

        <section className="section journey" id="journey">
          <div className="section-heading">
            <div>
              <p className="eyebrow">04 / YOUR NEXT CHAPTER</p>
              <h2>From aspiring artist<br />to <em>confident professional.</em></h2>
            </div>
            <p>
              Knowledge is the foundation. Practice builds confidence.
              Your ambition carries it further.
            </p>
          </div>
          <div className="journey-grid">
            {[
              {
                title: "Discover your direction",
                text: "Explore our training areas and choose a beauty skill that aligns with your interests and goals.",
              },
              {
                title: "Learn through practice",
                text: "Combine professional theory with hands-on practical training in a supportive learning environment.",
              },
              {
                title: "Build your future",
                text: "Take your knowledge and confidence into the beauty industry and explore your own entrepreneurial path.",
              },
            ].map((step, index) => (
              <article key={step.title}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="section impact">
          <div className="logo-panel">
            src={`${import.meta.env.BASE_URL}images/logo.png`} alt="Glam Co Academy logo" loading="lazy" />
          </div>
          <div className="body-copy">
            <p className="eyebrow">BEYOND THE CLASSROOM</p>
            <h2>Beauty skills.<br /><em>Real-life impact.</em></h2>
            <p>
              Many of our graduates go on to establish their own beauty businesses,
              create employment opportunities, support their families, and build
              better futures for themselves.
            </p>
            <p>
              Our goal is not only to teach beauty treatments, but to help create
              confident beauty professionals and successful entrepreneurs.
            </p>
            <a className="button button-dark" href="#courses">Find your training area</a>
          </div>
        </section>

        <section className="section faq">
          <div>
            <p className="eyebrow">A LITTLE MORE CLARITY</p>
            <h2>Your questions,<br /><em>answered.</em></h2>
          </div>
          <div className="faq-list">
            {faqs.map((faq) => (
              <details key={faq.question}>
                <summary>{faq.question}</summary>
                <p>{faq.answer}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="closing">
          <p className="eyebrow">YOUR FUTURE IS WORTH INVESTING IN</p>
          <h2>Let your next chapter<br />begin with <em>Glam Co.</em></h2>
          <a className="button button-gold" href="#courses">Explore our training</a>
        </section>
      </main>

      <footer className="site-footer">
        <Brand />
        <p>Beauty. Skill. Confidence. Opportunity.</p>
        <nav aria-label="Footer navigation">
          <a href="#about">Our academy</a>
          <a href="#courses">Courses</a>
          <a href="#mission">Our mission</a>
        </nav>
        <small className="copyright">
          © {new Date().getFullYear()} Glam Co Academy. All rights reserved.
        </small>
      </footer>

      <CourseDialog course={selectedCourse} onClose={() => setSelectedCourse(null)} />
    </>
  );
}
