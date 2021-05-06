import firebase from "firebase/app";
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import React, { useState, useEffect } from 'react';
import { Typeahead } from 'react-bootstrap-typeahead';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { Jumbotron, ListGroup, Container, Row, Col, Navbar, Form, Button, Modal } from "react-bootstrap";
import Axios from 'axios';

const server_path = "https://cs411pleasegivea.uc.r.appspot.com"

function App() {
  const [isHome, setIsHome] = useState(true); //using variable instead of router since only 2 pages
  const [location, setLocation] = useState("");
  const [locationId, setLocationId] = useState("");
  const [locationPicker, setLocationPicker] = useState([]);
  const [locationList, setLocationList] = useState([]);
  const [showLogin, setShowLogin] = useState(false)
  const [showSignup, setShowSignup] = useState(false)
  const [showQuestion, setShowQuestion] = useState(false)
  const [showAsk, setShowAsk] = useState(false)
  const [showAnswer, setShowAnswer] = useState(false)
  const [showReview, setShowReview] = useState(false)
  const [showVisit, setShowVisit] = useState(false)
  const [showEdit, setShowEdit] = useState(false)
  const [editRating, setEditRating] = useState(0)

  const [mostVisited, setMostVisited] = useState("")
  const [mostVisitedNum, setMostVisitedNum] = useState(0)
  const [leastVisited, setLeastVisited] = useState("")
  const [leastVisitedNum, setLeastVisitedNum] = useState(0)
  const [bestReviewed, setBestReviewed] = useState("")
  const [bestReviewedScore, setBestReviewedScore] = useState(0)

  const [categories, setCategories] = useState([]);
  const [longitude, setLongitude] = useState(0);
  const [latitude, setLatitude] = useState(0);
  const [covidCount, setCovidCount] = useState(0);
  const [unCovidCount,setUnCovidCount] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [dateSlider, setDateSlider] = useState(50);
  const [signedIn, setSignedIn] = useState(false);
  const [curQuestionId, setCurQuestionId] = useState(0);
  const [curQuestion, setCurQuestion] = useState("");
  const [answers, setAnswers] = useState([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [userId, setUserId] = useState(0);
  const [isReview, setIsReview] = useState(false)
  const [editText, setEditText] = useState("")
  const [curId, setId] = useState(0)

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
  const handleCloseEdit = () => {
    setShowEdit(false);
  }

  useEffect(() => {
    Axios.get(server_path + '/getTableData', {
      params: {
        table: "Locations"
      }
    }).then((response) => {
      setLocationList(response.data.results.map(x => x.name))
      setIsHome(true)
    })

    Axios.get(server_path + '/getLocationStatistics').then((response) => {
      var mostVisit;
      var leastVisit;
      var review;
      
      var prevIndex = -1;

      for(var i = 0; i < response.data.results.length; i++) {
        if(response.data.results[i].highestRating != null) {
          review = i;
        } else {
          if (prevIndex == -1) {
            prevIndex = i; 
          } else {
            if (response.data.results[i].numInfectedVisited > response.data.results[prevIndex].numInfectedVisited) {
              mostVisit = i;
              leastVisit = prevIndex;
            } else {
              mostVisit = prevIndex;
              leastVisit = i;
            }
          }
        }
      }

      setLeastVisitedNum(response.data.results[leastVisit].numInfectedVisited)
      setLeastVisited(response.data.results[leastVisit].locationName)

      setMostVisitedNum(response.data.results[mostVisit].numInfectedVisited)
      setMostVisited(response.data.results[mostVisit].locationName)

      setBestReviewedScore(response.data.results[review].highestRating)
      setBestReviewed(response.data.results[review].locationName)
    })
  }, []);

  useEffect(() => {
    Axios.get(server_path + '/LocationID', {
      params: {
        name: location
      }
    }).then((response) => {
      if (response.data.results.length > 0)
        setLocationId(response.data.results[0].id)
    })
  }, [location]);

  useEffect(() => {
    if (locationId !== "")
      Axios.get(server_path + '/getLocationData', {
        params: {
          id: locationId
        }
      }).then((response) => {
        setLongitude(response.data.LocationResults[0].longitude)
        setLatitude(response.data.LocationResults[0].latitude)
        setQuestions(response.data.QuestionResults)
        setReviews(response.data.ReviewResults)
        setCategories(response.data.CategoryResults.map(i => i.name))
        updateCovidVisited()
      })
  }, [locationId])

  useEffect(() => {
    if (locationId !== "")
      updateCovidVisited()
  }, [dateSlider, locationId])

  const updateDateRange = (e) => {
    setDateSlider(100-e.target.value)
  }

  useEffect(() => {
    Axios.get(server_path + '/getAnswers', {
      params: {
        questionID: curQuestionId
      }
    }).then((response) => {
      setAnswers(response.data.results)
    })
  }, [curQuestionId])

  const updateCovidVisited = () => {
    Axios.get(server_path + '/UserVisitedRange', {
      params: {
        days: dateSlider,
        locationID: locationId
      }
    }).then((response) => {
      if (response.data.results[0].covid == null)
        setCovidCount(0)
      else
        setCovidCount(response.data.results[0].covid)
      
      if (response.data.results[0].notCovid == null)
        setUnCovidCount(0)
      else
        setUnCovidCount(response.data.results[0].notCovid)
    })
  }

  const changeLocation = (locations) => {
    setLocationPicker(locations)
    if(locations.length !== 0) {
      setIsHome(false)
      setLocation(locations[0])
    }
  }

  const login = (event) => {
    event.preventDefault();
    
    Axios.post(server_path + '/login', {
      username: event.target.username.value,
      password: event.target.password.value
    }).then((response) => {
      if (response.data.isSuccessful === 1) {
        setUserId(response.data.userId)
        setUsername(event.target.username.value)
        setPassword(event.target.password.value)
        setSignedIn(true)
        handleCloseLogin()
      }
    })
  }

  const signup = (event) => {
    event.preventDefault();
    handleCloseSignup();

    Axios.post(server_path + '/signup', {
      username: event.target.username.value,
      password: event.target.password.value,
      name: event.target.name.value
    }).then((response) => {
      if (response.data.isSuccessful === 1) {
        setUserId(response.data.userId)
        setUsername(event.target.username.value)
        setPassword(event.target.password.value)
        setSignedIn(true)
        handleCloseSignup()
      }
    })
  }

  const ask = (event) => {
    event.preventDefault();

    Axios.post(server_path + '/ask', {
      username: username,
      userId: userId,
      password: password,
      locationId: locationId,
      question: event.target.question.value,
    }).then((response) => {
      if (response.data.isSuccessful === 1) {
        handleCloseAsk()
        Axios.get(server_path + '/updateQuestions', {
          params: {
            id: locationId
          }
        }).then((response) => {
          setQuestions(response.data.QuestionResults)
        })
      }
    })
  }

  const answer = (event) => {
    event.preventDefault();

    Axios.post(server_path + '/answer', {
      username: username,
      password: password,
      userId: userId,
      questionId: curQuestionId,
      answer: event.target.answer.value
    }).then((response) => {
      if (response.data.isSuccessful === 1) {
        handleCloseAnswer()
        Axios.get(server_path + '/getAnswers', {
          params: {
            questionID: curQuestionId
          }
        }).then((response) => {
          setAnswers(response.data.results)
        })
      }
    })
  }

  const review = (event) => {
    event.preventDefault();

    Axios.post(server_path + '/review', {
      username: username,
      password: password,
      userId: userId,
      locationId: locationId,
      rating: event.target.score.value,
      review: event.target.review.value
    }).then((response) => {
      if (response.data.isSuccessful === 1) {
        handleCloseReview()
        Axios.get(server_path + '/updateReviews', {
          params: {
            id: locationId
          }
        }).then((response) => {
          setReviews(response.data.ReviewResults)
        })
      }
    })
  }

  const visit = (event) => {
    event.preventDefault();

    Axios.post(server_path + '/visit', {
      username: username,
      userId: userId,
      password: password,
      locationId: locationId,
      date: event.target.date.value,
      hasCovid: event.target.hasCovid.value
    }).then((response) => {
      if(response.data.isSuccessful === 1) {
        handleCloseShowVisit()
        updateCovidVisited()
      }
    })
  }

  const remove = () => {
    var table = isReview ? "Reviews" : "Answers"

    Axios.delete(server_path + '/delete', {
      data: {
        username: username,
        password: password,
        userId: userId,
        id: curId,
        table: table
      }
    }).then((response) => {
      handleCloseEdit()
      Axios.get(server_path + '/updateReviews', {
        params: {
          id: locationId
        }
      }).then((response) => {
        setReviews(response.data.ReviewResults)
        handleCloseEdit()
      })
      Axios.get(server_path + '/getAnswers', {
        params: {
          questionID: curQuestionId
        }
      }).then((response) => {
        setAnswers(response.data.results)
      })
    })
  }

  const edit = () => {
    var table = isReview ? "Reviews" : "Answers"

    Axios.post(server_path + '/update', {
      username: username,
      password: password,
      userId: userId,
      table: table,
      id: curId,
      text: editText,
      rating: editRating
    }).then((response) => {
      handleCloseEdit()
      Axios.get(server_path + '/updateReviews', {
        params: {
          id: locationId
        }
      }).then((response) => {
        setReviews(response.data.ReviewResults)
      })
      Axios.get(server_path + '/getAnswers', {
        params: {
          questionID: curQuestionId
        }
      }).then((response) => {
        setAnswers(response.data.results)
      })
    })
  }

  const chooseQuestion = (id, question) => {
    setCurQuestion(question)
    setCurQuestionId(id)
    setShowQuestion(true)
  }

  const showAnswerModal = () => {
    setShowQuestion(false)
    setShowAnswer(true)
  }

  const changeAnswer = (item) => {
    if(item.userId == userId) {
      handleCloseQuestion()
      setShowEdit(true)
      setId(item.id)
      setEditText(item.answer)
      setIsReview(false)
    }
  }

  const changeReview = (item) => {
    if(item.userID == userId) {
      setShowEdit(true)
      setEditRating(item.rating)
      setId(item.id)
      setEditText(item.review)
      setIsReview(true)
    }
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
            <Navbar.Text onClick={() => setSignedIn(false)}>
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
        <div>
          <div id="locationPickerWrapper">
            <Typeahead
              id="locationPicker"
              labelKey="name"
              onChange={changeLocation}
              options={locationList}
              placeholder="Choose a Location..."
              selected={locationPicker}
            />
          </div>
          <div id="jumbotronWrapper">
            <Jumbotron id = "statJumbotron">
              <h1 id="statsTitle">Locations at a Glance</h1>
              <p>
                <b>Most Visited with Covid:</b> {mostVisited}, {mostVisitedNum} visits
              </p>
              <p>
                <b>Least Visited with Covid:</b> {leastVisited}, {leastVisitedNum} visits
              </p>
              <p>
                <b>Best Reviewed:</b> {bestReviewed}, {bestReviewedScore}/10
              </p> 
            </Jumbotron>
          </div>
        </div>
        :
        <Container>
          <Row>
          <h1>{ location }</h1>
          </Row>
          <Row>
          <p>Categories: {
            categories.map(x => x + " ")
          }</p>
          </Row>
          <Row>
          <p>{longitude}, {latitude}</p>
          </Row>
          <Row>
          <Form.Control type="range" onChange={updateDateRange}/>
          </Row>
          <Row>
          <p>Last { dateSlider } days</p>
          </Row>
          <Row>
          <p>Positive Visits: { covidCount }, Negative Visits: { unCovidCount }</p>
          </Row>
          {signedIn &&
            <Row>
              <Button variant="primary" onClick={() => setShowVisit(true)}>
                Add a Visit
              </Button>
            </Row>
          }
          <Row>
            <Col>
              Questions
              <ListGroup>
                {
                  questions.map((item, i) => (
                    <ListGroup.Item key={i} onClick={() => chooseQuestion(item.id, item.question)} variant={item.userId==userId ? "primary" : ""}>{item.question}</ListGroup.Item>
                  ))
                }
                {signedIn &&
                  <Button onClick={() => setShowAsk(true)}>Leave a Question</Button>
                }
              </ListGroup>
            </Col>
            <Col>
              Reviews
              <ListGroup>
                {
                  reviews.map((item, i) => (
                    <ListGroup.Item key={i} onClick={() => changeReview(item)} variant={item.userID==userId ? "primary" : ""}>{item.rating}/10: {item.review}</ListGroup.Item>
                  ))
                }
                {signedIn &&
                  <Button onClick={() => setShowReview(true)}>Leave a Review</Button>
                }
              </ListGroup>
            </Col>
          </Row>
        </Container>
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
            <Button variant="primary" type="submit" className="submitForm">
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
            <Button variant="primary" type="submit" className="submitForm">
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
            <Button variant="primary" type="submit" className="submitForm">
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
          <Modal.Title>{curQuestion}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {
            answers.map((item, i) => (
              <ListGroup.Item key={i} onClick={() => changeAnswer(item)} variant={item.userId==userId ? "primary" : ""}>{item.answer}</ListGroup.Item>
            ))
          }
          {signedIn &&
            <Button variant="primary" onClick={showAnswerModal} className="submitForm">
              Leave an Answer
            </Button>
          }
          <Button variant="secondary" onClick={handleCloseQuestion}>
            Cancel
          </Button>
        </Modal.Body>
      </Modal>

      {/* Answer */}
      <Modal show={showAnswer} onHide={handleCloseAnswer}>
        <Modal.Header closeButton>
          <Modal.Title>{curQuestion}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={answer}>
            <Form.Group controlId="answer">
              <Form.Label>Answer</Form.Label>
              <Form.Control type="text" name="answer" placeholder="answer"/>
            </Form.Group>
            <Button variant="primary" type="submit" className="submitForm">
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
            <Button variant="primary" type="submit" className="submitForm">
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
          <Modal.Title>Add a Visit</Modal.Title>
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
            <Button variant="primary" type="submit" className="submitForm">
              Submit
            </Button>
            <Button variant="secondary" onClick={handleCloseShowVisit}>
              Cancel
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Edit/Delete a Review/Answer */}
      <Modal show={showEdit} onHide={handleCloseEdit}>
        <Modal.Header closeButton>
          <Modal.Title>Editing {isReview ? "Review" : "Answer"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            {isReview && 
              <Form.Group controlId="rating">
                <Form.Label>Rating</Form.Label>
                <Form.Control type="text" value={editRating} onChange={(e) => setEditRating(e.target.value)}/>
              </Form.Group>
            }
            <Form.Group controlId="body">
              <Form.Label>{isReview ? "Review" : "Answer"}</Form.Label>
              <Form.Control type="textarea" rows={3} value={editText} onChange={(e) => setEditText(e.target.value)}/>
            </Form.Group>
            <Button variant="primary" className="submitForm" onClick={edit}>
              Edit
            </Button>
            <Button variant="danger" onClick={remove}>
              Delete
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </React.Fragment>
  );
}

export default App;
