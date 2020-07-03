import React, {useState, useEffect} from "react" 
import * as contentful from "contentful"

const Context = React.createContext()


function ContextProvider({children}) {

    const [posts, setPosts] = useState([])

    var client = contentful.createClient({
      space: '8h2joeckc394',
      accessToken: 'dIQ8tryIq-BA621gJKeUyecDfVRndSEjxsu_Cflzz08' })
  
    client.getEntries().then(entries => {
        entries.items.forEach(entry => {
            if(entry.fields) {
            console.log(entry.fields)
            }
        })
    })

    // fetchPosts = () => client.getEntries()


    // useEffect(() => {
    //     fetchPosts()
    //     .then(setPosts())
    // } ,[])
    

    return(
        <Context.Provider value="testvalue" >
            {children}
        </Context.Provider>
    )
}

export {Context, ContextProvider}