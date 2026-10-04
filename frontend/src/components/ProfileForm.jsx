function ProfileForm({ profile, updateProfile }) {
  return (
    <section className="profile-section">
      <h1>👤 Your Student Profile</h1>

      <p className="subtitle">
        Tell InternScout about yourself to find better opportunities.
      </p>

      <div className="profile-grid">

        <div className="input-group">
          <label>Name</label>

          <input
            type="text"
            value={profile.name}
            onChange={(e) =>
              updateProfile("name", e.target.value)
            }
            placeholder="Your name"
          />
        </div>

        <div className="input-group">
          <label>Degree</label>

          <input
            type="text"
            value={profile.degree}
            onChange={(e) =>
              updateProfile("degree", e.target.value)
            }
            placeholder="B.Tech"
          />
        </div>

        <div className="input-group">
          <label>Branch</label>

          <input
            type="text"
            value={profile.branch}
            onChange={(e) =>
              updateProfile("branch", e.target.value)
            }
            placeholder="Computer Science"
          />
        </div>

        <div className="input-group">
          <label>Year</label>

          <select
            value={profile.year}
            onChange={(e) =>
              updateProfile("year", e.target.value)
            }
          >
            <option value="">Select year</option>
            <option value="1st Year">1st Year</option>
            <option value="2nd Year">2nd Year</option>
            <option value="3rd Year">3rd Year</option>
            <option value="4th Year">4th Year</option>
          </select>
        </div>

        <div className="input-group full-width">
          <label>Skills</label>

          <input
            type="text"
            value={profile.skills}
            onChange={(e) =>
              updateProfile("skills", e.target.value)
            }
            placeholder="Java, Python, React, SQL, HTML, CSS"
          />

          <small>
            Separate skills using commas.
          </small>
        </div>

        <div className="input-group">
          <label>Preferred Role</label>

          <input
            type="text"
            value={profile.preferredRole}
            onChange={(e) =>
              updateProfile(
                "preferredRole",
                e.target.value
              )
            }
            placeholder="Software Engineer Intern"
          />
        </div>

        <div className="input-group">
          <label>Preferred Location</label>

          <input
            type="text"
            value={profile.preferredLocation}
            onChange={(e) =>
              updateProfile(
                "preferredLocation",
                e.target.value
              )
            }
            placeholder="Bangalore"
          />
        </div>

      </div>
    </section>
  );
}

export default ProfileForm;