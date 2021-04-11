import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState, useEffect } from 'react';
import { Form, Table } from "react-bootstrap";
import Axios from 'axios';

function App() {
  const [tables, setTables] = useState(["test1", "test2", "test3"])
  const [curTable, setCurTable] = useState("none")
  const [columns, setColumns] = useState(["col1", "col2", "col3"])
  const [data, setData] = useState(null)

  useEffect(() => {
    Axios.get('http://localhost:5000/')
  })

  function handleChangeTable(event) {
    setCurTable(event.target.value)
    console.log(event.target.value)
  }

  return (
    <div className="App">
      <Form.Control
        as="select"
        custom
        onChange={handleChangeTable}
      >
        {
          tables.map((item, i) => (
            <option value={item}>
              {item}
            </option>
          ))
        }
      </Form.Control>
      <Table striped bordered hover>
        <thead>
          {
            columns.map((item, i) => (
              <th>{item}</th>
            ))
          }
        </thead>
        <tbody>
          {
            
          }
        </tbody>
      </Table>



      {/* <form>
        <label>
          Field:
          <input type="text" name="field"/>
        </label>
        <label>
          Select Operation:
          <select value={}
        </label>
        <input type="submit" value="submit"/>
      </form> */}
    </div>
  );
}

export default App;
