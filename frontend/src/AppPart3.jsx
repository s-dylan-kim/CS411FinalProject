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
  const [formData, setFormData] = useState({})

  const advancedQueries = ['locationCategory', 'locationsPositive', 'restaurantRatings', 'restaurantHoursVisited']

  const handleCloseInsert = () => {
    setFormData({})
    setShowInsert(false);
  }
  const handleShowInsert = () => {
    setFormData({})
    setShowInsert(true);
  }
  const handleCloseEditDelete = () => {
    setFormData({})
    setShowEditDelete(false);
  }
  const handleShowEditDelete = () => {
    setFormData({})
    setShowEditDelete(true);
  }

  useEffect(() => {
    Axios.get('http://localhost:5000/getTableNames').then((response) => {
      setTables(response.data.results.map(x => x.TableName))
      setCurTable(response.data.results[0].TableName)
      console.log("fetched table names")
    })
  }, [])

  useEffect(() => {
    if(tables.includes(curTable)) {
      setSearch("")
      Axios.get('http://localhost:5000/getTableColumns', {
        params: {
          table: curTable
        }
      }).then((response) => {
        setColumns(response.data.results.map(x => x.COLUMN_NAME))
        console.log("fetched column data from " + curTable)
      })
    } 
  }, [curTable])

  useEffect(() => {
    updateData()
  }, [curColumn, curTable, search])

  const handleChangeTable = (event) => {
    setCurTable(event.target.value)
  }

  const updateData = () => {
    if(tables.includes(curTable)) {
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
        Axios.get('http://localhost:5000/search', {
          params: {
            table: curTable,
            column: curColumn,
            keyword: search
          }
        }).then((response) => {
          setData(response.data.results)
          console.log("fetched search table data from " + curTable)
        })
      }
    } else {
      setSearch("")
      Axios.get('http://localhost:5000/' + curTable).then((response) => {
        var queryData = response.data.results
        var queryCols = []
        Object.keys(queryData[0]).map(key => queryCols.push(key))
        setColumns(queryCols)
        setData(queryData)
        console.log("fetched advanced query data for " + curTable)
      })
    }
  }
    
  const insertRow = (event) => {
    handleCloseInsert();
    event.preventDefault();
    Axios.post('http://localhost:5000/insert'+curTable, {
      data: {
        data: formData
      }
    }).then((response) => {
      console.log("inserted row in " + curTable)
      updateData()
    })
  }

  const updateRow = (event) => {
    handleCloseEditDelete();
    event.preventDefault();
    Axios.post('http://localhost:5000/update'+curTable, {
      data: {
        data: formData
      }
    }).then((response) => {
      console.log("updated row in " + curTable)
      updateData()
    })
  }

  const showEditDeleteModal = (item) => {
    setCurDataPoint(item)
    handleShowEditDelete()
  }

  const deleteRow = () => {
    handleCloseEditDelete();
    Axios.delete('http://localhost:5000/delete', {
      data: {
        data: curDataPoint,
        table: curTable
      }
    }).then((response) => {
      console.log("deleted row from " + curTable)
      updateData()
    })
  }

  const searchUpdate = (event) => {
    setCurColumn(event.target.name)
    setSearch(event.target.value)
  }

  const formUpdate = (event) => {
    setFormData({...formData, [event.target.name]: event.target.value})
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
        {
          advancedQueries.map((item,i) => (
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
          <tr>
            {
              columns.map((item, i) => (
                <th key={i}><Form.Control type="text" name={item} placeholder="search" onChange={searchUpdate}/></th>
              ))
            }
            <th/>
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
                  <Form.Control type="text" name={item} placeholder={curDataPoint[item]} onChange={formUpdate}/>
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
          <Form onSubmit={updateRow}>
            {
              columns.map((item, i) => (
                <Form.Group key={i} controlId={item}>
                  <Form.Label>{item}</Form.Label>
                  <Form.Control type="text" name={item} placeholder={curDataPoint[item]} onChange={formUpdate}/>
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
