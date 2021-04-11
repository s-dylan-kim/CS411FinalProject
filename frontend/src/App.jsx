import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState, useEffect } from 'react';
import { Form, Table, Button, Modal } from "react-bootstrap";
import Axios from 'axios';

function App() {
  const [tables, setTables] = useState([])
  const [curTable, setCurTable] = useState("none")
  const [columns, setColumns] = useState([])
  const [data, setData] = useState([])
  const [showInsert, setShowInsert] = useState(false)
  const [showEditDelete, setShowEditDelete] = useState(false)
  const [curDataPoint, setCurDataPoint] = useState([])
  const [curColumn, setCurColumn] = useState("")
  const [search, setSearch] = useState("")

  const handleCloseInsert = () => setShowInsert(false);
  const handleShowInsert = () => setShowInsert(true);
  const handleCloseEditDelete = () => setShowEditDelete(false);
  const handleShowEditDelete = () => setShowEditDelete(true);

  useEffect(() => {
    Axios.get('http://localhost:5000/getTableNames').then((response) => {
      setTables(response.data.results.map(x => x.TableName))
      setCurTable(response.data.results[0].TableName)
      console.log("fetched table names")
    })
  }, [])

  useEffect(() => {

    Axios.get('http://localhost:5000/getTableColumns', {
      params: {
        table: curTable
      }
    }).then((response) => {
      setColumns(response.data.results.map(x => x.COLUMN_NAME))
      console.log("fetched column data from " + curTable)
    })
  }, [curTable])

  useEffect(() => {
    if(curColumn == "") {
      Axios.get('http://localhost:5000/getTableData', {
        params: {
          table: curTable
        }
      }).then((response) => {
        setData(response.data.results)
        console.log("fetched table data from " + curTable)
      })
    } else {
      //put search request here
    }
  }, [curColumn, curTable, search])

  function handleChangeTable(event) {
    setCurTable(event.target.value)
    console.log(event.target.value)
  }
    
  const insertRow = (event) => {
    event.preventDefault();
  }

  function showEditDeleteModal(item) {
    setCurDataPoint(item)
    handleShowEditDelete()
    console.log(item)
  }

  function deleteRow() {
    Axios.delete('http://localhost:5000/delete', {
      data: {
        data: curDataPoint,
        table: curTable
      }
    }).then((response) => {
      console.log("deleted row from " + curTable)
    })
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
            <option key={i} value={item}>
              {item}
            </option>
          ))
        }
      </Form.Control>
      <Table striped bordered hover>
        <thead>
          <tr>
            {
              columns.map((item, i) => (
                <th key={i}>{item}</th>
              ))
            }
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {
              data.map((item, i) => (
                <tr key={i}>
                  {
                    columns.map((col, j) => (
                      <td key={j}>{item[col]}</td>
                    ))
                  }
                  <td><Button variant="danger" onClick={() => showEditDeleteModal(item)}>Edit/Delete</Button></td>
                </tr>
              ))
          }
        </tbody>
      </Table>
      <Button onClick={handleShowInsert}>Insert</Button>

      <Modal show={showInsert} onHide={handleCloseInsert}>
        <Modal.Header closeButton>
          <Modal.Title>Insert Data Into {curTable}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={insertRow}>
            {
              columns.map((item, i) => (
                <Form.Group key={i} controlId={item}>
                  <Form.Label>{item}</Form.Label>
                  <Form.Control type="text" placeholder={item}/>
                </Form.Group>
              ))
            }
            <Button variant="primary" type="submit">
              Insert
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      <Modal show={showEditDelete} onHide={handleCloseEditDelete}>
        <Modal.Header closeButton>
          <Modal.Title>Edit/Delete From {curTable}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={insertRow}>
            {
              columns.map((item, i) => (
                <Form.Group key={i} controlId={item}>
                  <Form.Label>{item}</Form.Label>
                  <Form.Control type="text" placeholder={curDataPoint[item]}/>
                </Form.Group>
              ))
            }
            <Button variant="info" type="submit">
              Edit
            </Button>
            <Button variant="danger" onClick={deleteRow}>
              Delete
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default App;
