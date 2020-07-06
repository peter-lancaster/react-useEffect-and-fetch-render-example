import React, {useState, useEffect} from "react" 
import * as contentful from "contentful"

const Context = React.createContext()

function ContextProvider({children}) {

    console.log("ContextProvider")

    const [posts, setPosts] = useState([])

    console.log("this is posts at start of ContextProvider")
    console.log(posts)

    //PETE - BELOW IS VERSION 1 OF "funcOne", WHICH AS YOU CAN SEE USES "fetch"
    //Sequence of events when we use version 1 of "funcOne" (and comment out version 2):
    // 1) ContextProvider component runs from beginning.
    // 2) App component runs
    // 3) useEffect is called 
    // 4) useEffect calls funcOne
    // 5) funcOne is called 
    // 6) funcOne runs to it's end, console.log(posts) at the end of funcOne shows empty array [].
    // 7) useEffect completes it's run
    // 8) funcTwo is called 
    // 9) funcTwo runs only to the point where state is changed. 
    // 10) ContextProvider component run from beginning, console.log(posts) at the beginning of ContextProvider shows properly populated array.
    // 11) App component runs from beginning, console.log(posts) at the beginning of App shows properly populated array.
    // 12) funcTwo is picked up where it left off (state change) it runs to it's end, console.log(posts) at the end of funcTwo shows empty array [].

    function funcOne() {
             console.log("entering funcOne")
             console.log("this is posts at start of funcOne")
             console.log(posts)
    
             fetch("https://raw.githubusercontent.com/bobziroll/scrimba-react-bootcamp-images/master/images.json")
             .then(function(response)  {
                console.log("response.json")
                 return response.json()})
             .then(data => {console.log("call to funcTwo after fetch")
                                funcTwo(data)})
                .then(() => {console.log("last then of the fetch");
                        console.log("data")}
                        )
            .catch(error => console.error(error))

            console.log("leaving funcOne")
            console.log("this is posts at end of funcOne")
            console.log(posts)
      }

    //PETE - BELOW IS VERSION 2 OF "funcOne", WHICH AS YOU CAN SEE, DOES NOT USE "fetch"
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
    // 11) useEffect completes it's run
    // 12) ContextProvider component run from beginning, console.log(posts) at the beginning of ContextProvider shows properly populated array.
    // 13) App component runs from beginning, console.log(posts) at the beginning of App shows properly populated array.

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
        
        debugger
        console.log("middle of funcTwo")
        setPosts(processedArray)

        console.log("end of funcTwo")
        console.log("this is posts at end of funcTwo")
        console.log(posts)
    }

    useEffect(() => {
        console.log("in useEffect")
        funcOne()
        console.log("leaving useEffect")} ,[])

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

// Using versions 1 and 2 of "funcOne" above raise the following questions: 

//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

// Question 1) In BOTH versions, console.log(posts) within funcOne AND funcTwo ALWAYS gives us empty Array. WHY IS THIS ??!! 
// I.E. WHY DO THE CHILD FUNCTIONS WITHIN THE CONTEXTPROVIDER COMPONENT NOT HAVE ACCESS TO THE useState variables? 

// Is this something to do with JavaScript Scope? Or is it to do with React.useState? 

// Answer 1) I think the answer to the question above can be found in this blog post 
// https://www.freecodecamp.org/news/get-pro-with-react-setstate-in-10-minutes-d38251d1c781/

// " Neither parent nor child components can know if a certain component is stateful or stateless ...........
// ....That’s why state is often called local or encapsulated. It is not accessible to any component other 
// than the one that owns and sets it."

// To stress the critical point. THAT'S WHY STATE IS OFTEN CALLED 'LOCAL' OR 'ENCAPSULATED'. IT IS NOT ACCESSIBLE
// TO ANY COMPONENT OTHER THAN THE ONE THAT OWNS AND SETS IT".

// SO BE AWARE!! THE SCOPE RULES THAT APPLY TO STANDARD JAVASCRIPT VARIABLES DO NOT APPLY TO REACT STATE VARIABLES.

//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

// Question 2) If you DON'T use "fetch" to get the data to pass the funcTwo as a parameter, the normal program flow is:

//     useEffect calls funcOne
//     funcOne is called 
//     funcOne calls funcTwo
//     funcTwo is called 
//     funcTwo runs to it's end
//     return to funcOne after funcTwo has finished
//     funcOne runs to it's end
//     useEffect completes it's run
//     ContextProvider component run from beginning

//   If you DO use "fetch" to get the data to pass the funcTwo as a parameter, the program flow is altered to:

//     useEffect calls funcOne
//     funcOne is called 
//     funcOne runs to it's end.
//     useEffect completes it's run
//     funcTwo is called 
//     funcTwo runs only to the point where state is changed
//     ContextProvider component (and rest of render tree) run from beginning
//     funcTwo is picked up where it left off and runs to it's end.

// WHAT IS THE EXPLANATION FOR THESE DIFFERENCES IN PROGRAM FLOW?

//  Answer 2) 

//  i) Looking first at the case where we DON'T use "fetch()" within "funcOne" to get the data to pass to "funcTwo" as
//  a parameter, we see the behaviour that we would expect based on the standard JavaScript execution stack:

//     useEffect calls our function --> this function goes to the top of the execution stack
//     useEffect calls funcOne --> funcOne now goes to the top of the execution stack, with the useEffect function beneath it
//     funcOne is called 
//     funcOne calls funcTwo
//     funcTwo is called --> funcTwo now goes to the top of the execution stack (funcOne is now beneath funcTwo in the stack)
//     funcTwo runs to it's end --> funcTwo pops off the execution stack (funcOne is now top of the stack)
//     return to funcOne after funcTwo has finished
//     funcOne runs to it's end --> funcOne pops off the execution stack (useEffect function is now top of the stack)
//     useEffect function completes --> execution stack is now empty
//     ContextProvider component run from beginning (because state was changed somewhere within the nest of functions 
//      starting with useEffect)

//  ii) Moving on to the case where we DO use "fetch()" within "funcOne" to get the data to pass to "funcTwo" as 
//  a parameter, we see the following behaviour that DOES NOT match what we would expect based on the standard JavaScript 
//  execution stack alone:

//     useEffect calls funcOne
//     funcOne is called 
//     funcOne runs to it's end.
//     useEffect completes it's run
//     response is received from "fetch()"
//     funcTwo is called 
//     funcTwo runs only to the point where state is changed
//     ContextProvider component (and rest of render tree) run from beginning
//     funcTwo is picked up where it left off and runs to it's end.
//     any further ".then()" clauses of the "fetch()" are completed
//     program run ends.

//  The reason for this sequence of events is related to the asynchronous nature of the JavaScript "fetch" API.
//  useful information can be found in here https://www.udemy.com/course/understand-javascript/  
//  (video name "What About Asynchronous Callbacks"), which you have written up here 
//  https://github.com/peter-lancaster/work-storage/blob/master/20200410%20JavaScript%20Understanding%20the%20Weird%20Parts
//  
//  To get a deeper understanding, you'll also need to read this 
//  https://levelup.gitconnected.com/javascript-and-asynchronous-magic-bee537edc2da (including the two responses)

// Here is the relevant bit from your write-up: 

    // ii) While it's true to say that the JavaScript Engine is single-threaded, and runs syncronously, the Browser runs 
    // other engines at the same time as the JavaScript engine (such as the rendering engine, which deals with rendering info
    // to the screen, and the HTTP request engine which deals with getting data from other sources). This means that 
    // although browsers run JavaScript synchronously, they can run other operations at the same time (I.E. asynchronously).
    // So a browser can run the rendering engine + a http request + the JavaScript engine all at the same time.

    // iii) Within the JavaScript Engine, in addition to the Execution Stack, there is another workstream called the "Event Queue". 
    // Any in-browser events that need to be handled (e.g. button clicks, hover over, data returned from API, etc) are added to the "Event
    // Queue". THE EVENT QUEUE IS TACKLED ONLY WHEN THE EXECUTION STACK, INCLUDING THE GLOBAL EXECUTION CONTEXT, IS EMPTY.

    // Once the Execution Stack is empty, then work starts on anything waiting to be actioned within the Event Queue. 

    // Each item in the Event Queue is tackled synchronously and in order of occurrence (thus the terminology is 
    // "Event Queue" and NOT "Event Stack").

    // If (for example) the "fetch()" method is called within our JavaScript, then this work will join the Event Queue,
    // and will be actioned when (AND ONLY WHEN) everything in the Execution Stack (including the Global Execution Context) 
    // has been executed (and the Execution Stack is empty).

//  Putting this information together with what we find in this blog 
//  https://levelup.gitconnected.com/javascript-and-asynchronous-magic-bee537edc2da
//  .. we can fild the following step-by-step of what occurs in the case where we DO use "fetch()" within "funcOne" to get 
//  the data to pass to "funcTwo" : 


//     useEffect calls our function --> this function goes to the top of the execution stack
//     useEffect calls funcOne --> funcOne now goes to the top of the execution stack, with the useEffect function beneath it
//     funcOne is called 
//     funcOne calls the "fetch()" method --> this is added to the event queue, to be executed when the Execution Stack is complete.
//     funcOne runs to it's end. --> funcOne pops off the execution stack (useEffect function is now top of the stack)
//     useEffect completes it's run --> execution stack is now empty
//
//     NOW THAT EXECUTION STACK IS EMPTY, THE JAVASCRIPT ENGINE EXAMINES THE EVENT QUEUE AND FINDS A FETCH() JOB WAITING THERE
//
//     "fetch()" job now has a context added to the execution stack --> this is the only item currently in the execution stack
//     response is received from "fetch()"
//     funcTwo is called --> funcTwo now goes to the top of the execution stack, with the fetch() chain beneath it
//     at the point in funcTwo where state is changed --> ContextProvider GOES TO THE TOP OF THE EXECUTION STACK AND IS 
//     EXECUTED IMMEDIATELY, I THINK THAT THIS IS BECAUSE 

//     "Non-async callback functions are placed at the top of the execution stack not into the Event queue when they 
//     are called within a function. 
//     (from comments on this blog https://levelup.gitconnected.com/javascript-and-asynchronous-magic-bee537edc2da)

//     ContextProvider component (and rest of render tree) run to completion --> ContextProvider popped off the execution stack
//     funcTwo is picked up where it left off and runs to it's end.
//     any further ".then()" clauses of the "fetch()" are completed
//     program run ends.
// 


//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++