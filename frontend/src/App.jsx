import logo from './logo.svg';
import './App.css';




function App() {
  return (
    <div className="App">
      <form>
        <label>
          Field:
          <input type="text" name="field"/>
        </label>
        {/* <label>
          Select Operation:
          <select value={}
        </label> */}
        <input type="submit" value="submit"/>
      </form>
    </div>
  );
}

export default App;
