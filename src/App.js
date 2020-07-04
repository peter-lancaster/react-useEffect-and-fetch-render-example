import React, {useContext} from 'react';
import './App.css';
import {Context} from "./ContextProvider"
import {Link} from "react-router-dom"


function App() {

  console.log("App")

  const {posts} = useContext(Context)

  console.log("this is posts in App")
  console.log(posts)
  // console.log("this is changeVariable2 in App")
  // console.log(changeVariable2)


  return (
    <div className="App">
      <p>Some text in there</p>

    </div>
  );
}

export default App;
