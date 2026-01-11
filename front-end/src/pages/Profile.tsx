import "../Style/profile.css";
import "bootstrap/dist/css/bootstrap.min.css";
import NavBar from "../component/NavBar";
import profile from "../assets/profile.jpg";
import profileg from "../assets/profileGirl.jpg";
import { useState, useEffect, Fragment } from "react";
function Profile() {


  const [user, setUser] = useState({});

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        window.location.href = "/login";
        return;
      }

      try {
        const response = await fetch("http://localhost:3001/users/", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUser(data);
        } else {
          if (response.status === 401) {
            localStorage.removeItem("token");
          }
          window.location.href = "/login";
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        alert("An error occurred while fetching user data");
      }
    };

    fetchUserData();
  }, []);

  return (
    <Fragment>
      <NavBar />
      <div className="widt">
        <div className="row">
          <div className="col-lg-12">
            <div className="page-content">
              <div className="row">
                <div className="col-lg-12">
                  <div className="main-profile">
                    <div className="row">
                      <div className="col-lg-4">
                        {/* Render user profile image here */}
                        <img src={user.gender === "female" ? profileg : profile} alt="Profile Image" />
                      </div>
                      <div className="col-lg-4 align-self-center">
                        <div className="main-info header-text">
                          <h1 id="firstname">{user.firstName}</h1>
                          <h5 id="lastname">{user.lastName}</h5>
                          <p>"I'm {user.firstName}, a passionate gamer who loves exploring new worlds and conquering challenges. Let's conquer the gaming world together!"</p>
                          <div className="main-border-button">
                            <a href="#">Update</a>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-4 align-self-center">
                        <ul>
                          <li>
                            Email <span>{user.email}</span>
                          </li>
                          <li>
                            Age <span>{user.age}</span>
                          </li>
                          <li>
                            Phone Number <span>{user.phone}</span>
                          </li>
                          <li>
                            Clips <span>29</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                    {/* Rest of the JSX code */}
                    {/* ... */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
}
export default Profile;
