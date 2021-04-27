import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import React, { useState, useEffect } from 'react';
import { Typeahead } from 'react-bootstrap-typeahead';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faVirusSlash, faVirus, faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { Navbar, Form, Table, Button, Modal } from "react-bootstrap";
import Axios from 'axios';

function App() {
  const [isHome, setIsHome] = useState(true); //using variable instead of router since only 2 pages
  const [location, setLocation] = useState("");
  const [locationId, setLocationId] = useState("");
  const [locationPicker, setLocationPicker] = useState("");
  const [locationList, setLocationList] = useState([]);
  const [showLogin, setShowLogin] = useState(false)
  const [showSignup, setShowSignup] = useState(false)
  const [showQuestion, setShowQuestion] = useState(false)
  const [showAsk, setShowAsk] = useState(false)
  const [showAnswer, setShowAnswer] = useState(false)
  const [showReview, setShowReview] = useState(false)
  const [showVisit, setShowVisit] = useState(false)

  const [categories, setCategories] = useState(["hello", "test2"]);
  const [longitude, setLongitude] = useState(0);
  const [latitude, setLatitude] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [dateSlider, setDateSlider] = useState(50);
  const [signedIn, setSignedIn] = useState(false);
  const [curQuestionId, setCurQuestionId] = useState(0);
  const [curQuestion, setCurQuestion] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleCloseLogin = () => {
    setShowLogin(false);
  }
  const handleCloseSignup = () => {
    setShowSignup(false);
  }
  const handleCloseQuestion = () => {
    setShowQuestion(false);
  }
  const handleCloseAsk = () => {
    setShowAsk(false);
  }
  const handleCloseAnswer = () => {
    setShowAnswer(false);
  }
  const handleCloseReview = () => {
    setShowReview(false);
  }
  const handleCloseShowVisit = () => {
    setShowVisit(false);
  }

  useEffect(() => {
    Axios.get('http://localhost:5000/getTableData', {
      params: {
        table: "Locations"
      }
    }).then((response) => {
      setLocationList(response.data.results.map(x => x.name))
      console.log("fetched locations")
      setIsHome(true)
    })
  }, []);

  useEffect(() => {
    Axios.get('http://localhost:5000/LocationID', {
      params: {
        name: location
      }
    }).then((response) => {
      if (response.data.results.length > 0)
        setLocationId(response.data.results[0].id)
    })
  }, [location]);

  useEffect(() => {
    Axios.get('http://localhost:5000/getLocationData', {
      params: {
        id: locationId
      }
    }).then((response) => {
      setLongitude(response.data.LocationResults[0].longitude)
      setLatitude(response.data.LocationResults[0].latitude)
      setQuestions(response.data.questionResults)
      setReviews(response.data.reviewResults)
    })
  }, [locationId])

  const updateDateRange = (e) => {
    setDateSlider(100-e.target.value)
  }

  const changeLocation = (locations) => {
    setLocationPicker(locations)
    if(locations.length != 0) {
      setIsHome(false)
      setLocation(locations[0])
    }
  }

  const login = (event) => {
    event.preventDefault();
    console.log(event.target.username.value)
    console.log(event.target.password.value)
    
    Axios.post('http://localhost:5000/login', {
      username: event.target.username.value,
      password: event.target.password.value
    }).then((response) => {
      setUsername(event.target.username.value)
      setPassword(event.target.password.value)
      setSignedIn(true)
      handleCloseLogin();
    })
  }

  const signup = (event) => {
    event.preventDefault();
    console.log(event.target.username.value)
    console.log(event.target.password.value)
    console.log(event.target.password.name)
    handleCloseSignup();

    // Axios.post('http://localhost:5000/signup', {
    //   username: event.target.username.value,
    //   password: event.target.password.value,
    //   name: event.target.name.value
    // }).then((response) => {
    //   setUsername(event.target.username.value)
    //   setPassword(event.target.password.value)
    //   setSignedIn(true)
    // })
  }

  const ask = (event) => {
    event.preventDefault();
    console.log(event.target.question.value)

    // Axios.post('http://localhost:5000/ask', {
    //   data: {
    //     username: username,
    //     password: password,
    //     location: location,
    //     question: event.target.question.value,
    //   }
    // }).then((response) => {
    //   handleCloseQuestion()
    //   update somehow
    // })
  }

  const answer = (event) => {
    event.preventDefault();
    console.log(event.target.answer.value)
    handleCloseQuestion();

    // Axios.post('http://localhost:5000/answer', {
    //   data: {
    //     username: username,
    //     password: password,
    //     location: location,
    //     questionId: curQuestionId,
    //     answer: event.target.answer.value
    //   }
    // }).then((response) => {
    //   handleCloseAnswer()
    // })
  }

  const review = (event) => {
    event.preventDefault();
    console.log(event.target.score.value)
    console.log(event.target.review.value)

    // Axios.post('http://localhost:5000/review', {
    //   data: {
    //     username: username,
    //     password: password,
    //     location: location,
    //     score: event.target.score.value,
    //     review: event.target.review.value
    //   }
    // }).then((response) => {
    //   handleCloseReview()
    //   update somehow
    // })
  }

  const visit = (event) => {
    event.preventDefault();
    console.log(event.target.date.value)
    console.log(event.target.hasCovid.value)

    // Axios.post('http://localhost:5000/visit', {
    //   data: {
    //     username: username,
    //     password: password,
    //     location: location,
    //     date: event.target.date.value,
    //     hasCovid: event.target.hasCovid.value
    //   }
    // }).then((response) => {
    //   handleCloseReview()
    //   update somehow
    // })
  }

  return (
    <React.Fragment>
      <Navbar>
        {!isHome &&
          <Navbar.Text onClick={() => setIsHome(true)}>
            <FontAwesomeIcon icon={faArrowLeft}/>
            </Navbar.Text>
        }
        <Navbar.Brand>Covid Tracker</Navbar.Brand>
        <Navbar.Collapse className="justify-content-end">
          {signedIn ?
            <Navbar.Text>
              Sign Out
            </Navbar.Text>
          :
            <React.Fragment>
              <Navbar.Text onClick={() => setShowSignup(true)}>
                Sign Up
              </Navbar.Text>
              <Navbar.Text onClick={() => setShowLogin(true)}>
                Sign In
              </Navbar.Text>
            </React.Fragment>
          }
        </Navbar.Collapse>
      </Navbar>
      {isHome ?
        <Typeahead
          id="locationPicker"
          labelKey="name"
          onChange={changeLocation}
          options={locationList}
          placeholder="Choose a Location..."
          selected={locationPicker}
        />
        :
        <React.Fragment>
          <h1>{ location }</h1>
          <p>Categories: {
            categories.map(x => x + " ")
          }</p>
          <p>{longitude}, {latitude}</p>
          <Form.Control type="range" onChange={updateDateRange}/>
          <p>Last { dateSlider } days</p>
          <Button variant="primary" onClick={() => setShowVisit(true)}>
            Add a Visit
          </Button>

        </React.Fragment>
      }

      {/* Log In */}
      <Modal show={showLogin} onHide={handleCloseLogin}>
        <Modal.Header closeButton>
          <Modal.Title>Login</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={login}>
            <Form.Group controlId="username">
              <Form.Label>Username</Form.Label>
              <Form.Control type="text" name="username" placeholder="username"/>
            </Form.Group>
            <Form.Group controlId="password">
              <Form.Label>Password</Form.Label>
              <Form.Control type="text" name="password" placeholder="password"/>
            </Form.Group>
            <Button variant="primary" type="submit">
              Submit
            </Button>
            <Button variant="secondary" onClick={handleCloseLogin}>
              Cancel
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Sign Up */}
      <Modal show={showSignup} onHide={handleCloseSignup}>
        <Modal.Header closeButton>
          <Modal.Title>Sign Up</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={signup}>
            <Form.Group controlId="username">
              <Form.Label>Username</Form.Label>
              <Form.Control type="text" name="username" placeholder="username"/>
            </Form.Group>
            <Form.Group controlId="name">
              <Form.Label>Name</Form.Label>
              <Form.Control type="text" name="name" placeholder="name"/>
            </Form.Group>
            <Form.Group controlId="password">
              <Form.Label>Password</Form.Label>
              <Form.Control type="text" name="password" placeholder="password"/>
            </Form.Group>
            <Button variant="primary" type="submit">
              Submit
            </Button>
            <Button variant="secondary" onClick={handleCloseLogin}>
              Cancel
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Ask a Question */}
      <Modal show={showAsk} onHide={handleCloseAsk}>
        <Modal.Header closeButton>
          <Modal.Title>Ask a Question</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={ask}>
            <Form.Group controlId="question">
              <Form.Label>Question</Form.Label>
              <Form.Control type="textarea" rows={3} name="question" placeholder="question"/>
            </Form.Group>
            <Button variant="primary" type="submit">
              Ask
            </Button>
            <Button variant="secondary" onClick={handleCloseAsk}>
              Cancel
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Question Modal */}
      <Modal show={showQuestion} onHide={handleCloseQuestion}>
        <Modal.Header closeButton>
          <Modal.Title>"Question Name"</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            Question Data
            <Button variant="primary">
              Answer
            </Button>
        </Modal.Body>
      </Modal>

      {/* Answer */}
      <Modal show={showAnswer} onHide={handleCloseAnswer}>
        <Modal.Header closeButton>
          <Modal.Title>"Question Name"</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={answer}>
            <Form.Group controlId="answer">
              <Form.Label>Answer</Form.Label>
              <Form.Control type="text" name="answer" placeholder="answer"/>
            </Form.Group>
            <Button variant="primary" type="submit">
              Submit
            </Button>
            <Button variant="secondary" onClick={handleCloseAnswer}>
              Cancel
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Review */}
      <Modal show={showReview} onHide={handleCloseReview}>
        <Modal.Header closeButton>
          <Modal.Title>Leave a Review</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={review}>
            <Form.Group controlId="score">
              <Form.Label>Score</Form.Label>
              <Form.Control type="text" name="score" placeholder="1-10"/>
            </Form.Group>
            <Form.Group controlId="review">
              <Form.Label>Review</Form.Label>
              <Form.Control type="textarea" rows={3} name="review" placeholder="review"/>
            </Form.Group>
            <Button variant="primary" type="submit">
              Submit
            </Button>
            <Button variant="secondary" onClick={handleCloseReview}>
              Cancel
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* I was Here */}
      <Modal show={showVisit} onHide={handleCloseShowVisit}>
        <Modal.Header closeButton>
          <Modal.Title>Login</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={visit}>
            <Form.Group controlId="date">
              <Form.Label>Date Visited</Form.Label>
              <Form.Control type="text" name="date" placeholder="2021-4-25"/>
            </Form.Group>
            <Form.Group controlId="hasCovid">
              <Form.Label>Did you have Covid</Form.Label>
              <Form.Control as="select">
                <option>Yes</option>
                <option>No</option>
              </Form.Control>
            </Form.Group>
            <Button variant="primary" type="submit">
              Submit
            </Button>
            <Button variant="secondary" onClick={handleCloseShowVisit}>
              Cancel
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </React.Fragment>
  );
}

export default App;
