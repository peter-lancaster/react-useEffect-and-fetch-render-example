import React, {useState, useEffect} from "react" 
import * as contentful from "contentful"

const Context = React.createContext()

function ContextProvider({children}) {

    console.log("ContextProvider")

    const [posts, setPosts] = useState([])

    console.log("this is posts at start of ContextProvider")
    console.log(posts)

    //PETE - THIS IS VERSION 1 OF "funcOne", WHICH AS YOU CAN SEE USES "fetch"
    //Sequence of events when we use version 1 of "funcOne" (and comment out version 2):
    // 1) ContextProvider component runs from beginning.
    // 2) App component runs
    // 3) useEffect is called 
    // 4) useEffect calls funcOne
    // 5) funcOne is called 
    // 6) funcOne runs to it's end, console.log(posts) at the end of funcOne shows empty array [].
    // 7) funcTwo is called 
    // 8) funcTwo runs only to the point where state is changed. 
    // 9) ContextProvider component run from beginning, console.log(posts) at the beginning of ContextProvider shows properly populated array.
    // 10) App component runs from beginning, console.log(posts) at the beginning of App shows properly populated array.
    // 11) funcTwo is picked up where it left off (state change) it runs to it's end, console.log(posts) at the end of funcTwo shows empty array [].

    function funcOne() {
             console.log("entering funcOne")
             console.log("this is posts at start of funcOne")
             console.log(posts)
    
             fetch("https://raw.githubusercontent.com/bobziroll/scrimba-react-bootcamp-images/master/images.json")
             .then(response => response.json())
            .then(data => {console.log("call to funcTwo after fetch")
                                funcTwo(data)})
            .catch(error => console.error(error))

            console.log("leaving funcOne")
            console.log("this is posts at end of funcOne")
            console.log(posts)
      }

    //PETE - THIS IS VERSION 2 OF "funcOne", WHICH AS YOU CAN SEE, DOES NOT USE "fetch"
    //Sequence of events when we use version 2 of "funcOne" (and comment out version 1):
    // 1) ContextProvider component runs from beginning.
    // 2) App component runs
    // 3) useEffect is called 
    // 4) useEffect calls funcOne
    // 5) funcOne is called 
    // 6) funcOne calls funcTwo
    // 7) funcTwo is called 
    // 8) funcTwo runs all the way through, console.log(posts) at the end of funcTwo shows empty array []. 
    // 9) return to funcOne after funcTwo has finished
    // 10) funcOne runs to it's end, console.log(posts) at the end of funcOne shows empty array [].
    // 11) ContextProvider component run from beginning, console.log(posts) at the beginning of ContextProvider shows properly populated array.
    // 12) App component runs from beginning, console.log(posts) at the beginning of App shows properly populated array.

    // function funcOne() {

    //         console.log("entering funcOne")
    //         console.log("this is posts at start of funcOne")
    //         console.log(posts)

    //         funcTwo([
    //                     {
    //                         "url": "https://github.com/bobziroll/scrimba-react-bootcamp-images/blob/master/pic1.jpg?raw=true",
    //                         "id": "1",
    //                         "isFavorite": false
    //                     },
    //                     {
    //                         "url": "https://github.com/bobziroll/scrimba-react-bootcamp-images/blob/master/pic2.jpg?raw=true",
    //                         "id": "2",
    //                         "isFavorite": false
    //                     }])

    //         console.log("leaving funcOne")
    //         console.log("this is posts at end of funcOne")
    //         console.log(posts)

    //  }

    function funcTwo(newArray) {
        console.log("start of funcTwo")
        console.log("this is posts at start of funcTwo")
        console.log(posts)

        let processedArray = [];

        processedArray = newArray.map(element => {return element})

        console.log("middle of funcTwo")
        setPosts(processedArray)

        console.log("end of funcTwo")
        console.log("this is posts at end of funcTwo")
        console.log(posts)
    }

    useEffect(() => {
        console.log("in useEffect")
        funcOne()} ,[])

    console.log("ContextProvider just before return")
    console.log("this is posts at end of ContextProvider")
    console.log(posts)


    return(
        <Context.Provider value={{posts}} >
            {children}
        </Context.Provider>
    )
}

export {Context, ContextProvider}

// ============================================================================================================

// Versions 1 and 2 above raise the following questions: 

// 1) In BOTH versions, console.log(posts) within funcOne AND funcTwo ALWAYS gives us empty Array. WHY IS THIS ??!! 
// I.E. WHY DO THE FUNCTIONS WITHIN THE CONTEXTPROVIDER COMPONENT NOT HAVE ACCESS TO THE useState variables? 

// Is this something to do with JavaScript Scope? Or is it to do with React.useState? 

// 2) If you DON'T use "fetch" to get the data to pass the funcTwo as a parameter, the normal program flow is:

//     useEffect calls funcOne
//     funcOne is called 
//     funcOne calls funcTwo
//     funcTwo is called 
//     funcTwo runs to it's end
//     return to funcOne after funcTwo has finished
//     funcOne runs to it's end
//     ContextProvider component run from beginning

//   If you DO  use "fetch" to get the data to pass the funcTwo as a parameter, the program flow is altered to:

//     useEffect calls funcOne
//     funcOne is called 
//     funcOne runs to it's end.
//     funcTwo is called 
//     funcTwo runs only to the point where state is changed
//     ContextProvider component (and rest of render tree) run from beginning
//     funcTwo is picked up where it left off and runs to it's end.

// WHAT IS THE EXPLANATION FOR THIS DIFFERENCE?